import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const products = [
  {
    name: 'RZS Coaching — Starter',
    description: 'Live 1:1 coaching with Vince Beese — Red Zone Selling framework',
    metadata: { category: 'professional_services' },
    prices: [
      { amount: 10000, interval: 'month', nickname: null },
      { amount: 100000, interval: 'year', nickname: null },
    ],
  },
  {
    name: 'RZS Coaching — Playmaker',
    description: 'Live 1:1 coaching with Vince Beese — Red Zone Selling framework',
    metadata: { category: 'professional_services' },
    prices: [
      { amount: 50000, interval: 'month', nickname: null },
      { amount: 480000, interval: 'year', nickname: null },
    ],
  },
  {
    name: 'RZS Coaching — MVP',
    description: 'Live 1:1 coaching with Vince Beese — Red Zone Selling framework',
    metadata: { category: 'professional_services' },
    prices: [
      { amount: 125000, interval: 'month', nickname: null },
      { amount: 1200000, interval: 'year', nickname: null },
    ],
  },
  {
    name: 'RZS Coaching — Leader',
    description: 'Live coaching for sales leaders, founders, and CEOs managing a team or org — Red Zone Selling framework',
    metadata: { category: 'professional_services' },
    prices: [
      { amount: 250000, interval: 'month', nickname: null },
      { amount: 2750000, interval: 'year', nickname: null },
    ],
  },
  {
    name: 'RZS Coaching — Team',
    description: 'Live team coaching with Vince Beese — Red Zone Selling framework',
    metadata: { category: 'professional_services' },
    prices: [
      { amount: 500000,   interval: 'month', nickname: 'Team Small (up to 10 reps)' },
      { amount: 5500000,  interval: 'year',  nickname: 'Team Small (up to 10 reps) Annual' },
      { amount: 1000000,  interval: 'month', nickname: 'Team Large (up to 25 reps)' },
      { amount: 11000000, interval: 'year',  nickname: 'Team Large (up to 25 reps) Annual' },
    ],
  },
];

async function run() {
  const mode = process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_') ? 'LIVE' : 'TEST';
  console.log(`\n⚡ Running in ${mode} mode\n`);

  for (const def of products) {
    const product = await stripe.products.create({
      name: def.name,
      description: def.description,
      metadata: def.metadata,
    });
    console.log(`✅ Product: ${product.name}`);
    console.log(`   Product ID: ${product.id}`);

    for (const p of def.prices) {
      const priceParams = {
        product: product.id,
        unit_amount: p.amount,
        currency: 'usd',
        recurring: { interval: p.interval },
      };
      if (p.nickname) priceParams.nickname = p.nickname;

      const price = await stripe.prices.create(priceParams);
      const label = p.nickname || `$${(p.amount / 100).toLocaleString()} / ${p.interval}`;
      console.log(`   💲 Price: ${label}`);
      console.log(`      Price ID: ${price.id}`);
    }

    console.log('');
  }

  console.log('🎉 Done. Save the IDs above for your records.\n');
}

run().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
