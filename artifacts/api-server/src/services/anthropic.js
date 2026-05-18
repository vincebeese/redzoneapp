import Anthropic from '@anthropic-ai/sdk';
import { query } from '../db/index.js';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const COACHING_MODEL = 'claude-sonnet-4-6';
export const COMPRESSION_MODEL = 'claude-haiku-4-5-20251001';

const PRICING = {
  [COACHING_MODEL]:    { input: 3.00,  output: 15.00 },
  [COMPRESSION_MODEL]: { input: 0.25,  output: 1.25  },
};

function estimateCost(model, tokensIn, tokensOut) {
  const p = PRICING[model] || { input: 3.00, output: 15.00 };
  return (tokensIn / 1_000_000) * p.input + (tokensOut / 1_000_000) * p.output;
}

function logSpend({ model, tokensIn, tokensOut, userId, modeSlug }) {
  const estCost = estimateCost(model, tokensIn, tokensOut);
  query(
    `INSERT INTO api_spend_log (model, tokens_in, tokens_out, est_cost, user_id, mode_slug)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [model, tokensIn, tokensOut, estCost, userId || null, modeSlug || null]
  ).catch((err) => console.error('Spend log error:', err));
}

export async function streamChat({ systemPrompt, messages, maxTokens = 1200, onChunk, userId, modeSlug, tools }) {
  const params = {
    model: COACHING_MODEL,
    max_tokens: maxTokens,
    system: [{ type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } }],
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  };

  if (tools && tools.length > 0) {
    params.tools = tools;
  }

  const stream = await anthropic.messages.stream(params);

  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      onChunk(event.delta.text);
    }
  }

  const final = await stream.finalMessage();
  logSpend({
    model: COACHING_MODEL,
    tokensIn: final.usage?.input_tokens || 0,
    tokensOut: final.usage?.output_tokens || 0,
    userId,
    modeSlug,
  });
  return final;
}

export async function chat({ systemPrompt, messages, maxTokens = 600, model = COMPRESSION_MODEL, userId, modeSlug }) {
  const response = await anthropic.messages.create({
    model,
    max_tokens: maxTokens,
    system: [{ type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } }],
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  logSpend({
    model,
    tokensIn: response.usage?.input_tokens || 0,
    tokensOut: response.usage?.output_tokens || 0,
    userId,
    modeSlug,
  });

  return response.content[0].text;
}

export default anthropic;
