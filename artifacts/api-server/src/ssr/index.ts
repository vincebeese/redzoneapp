import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { RequestHandler } from "express";
import { logger } from "../lib/logger.js";

const BASE_URL = "https://redzoneselling.co";

interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  jsonLd: object;
}

const PAGE_META = {
  "/about": {
    title: "About Vince Beese — B2B Sales Coach, Keynote Speaker & Author",
    description:
      "25+ years in B2B sales. Five exits. $1B+ in revenue generated. Vince Beese is a Sales Strength Coach, keynote speaker, and creator of the Red Zone Selling system.",
    canonical: `${BASE_URL}/about`,
    ogTitle: "About Vince Beese — B2B Sales Coach & Author | Red Zone Selling",
    ogDescription:
      "25+ years. Five exits. $1B+ in revenue. Vince Beese built the Red Zone Selling system from closing real deals and leading real teams. Learn his story.",
    ogUrl: `${BASE_URL}/about`,
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": `${BASE_URL}/#organization`,
          name: "Red Zone Selling",
          url: `${BASE_URL}/`,
          logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.png` },
        },
        {
          "@type": "Person",
          "@id": `${BASE_URL}/#vince-beese`,
          name: "Vince Beese",
          jobTitle: "Sales Coach, Keynote Speaker & Author",
          description:
            "B2B sales leader with 25+ years of experience, five successful exits, and $1B+ in revenue generated. Creator of the Red Zone Selling system.",
          url: `${BASE_URL}/about`,
          image: `${BASE_URL}/vince-headshot.jpg`,
          sameAs: [
            "https://www.vincebeese.com/",
            "https://vbeese.substack.com/",
            "https://www.amazon.com/dp/B0FLLHQG13",
          ],
          worksFor: { "@id": `${BASE_URL}/#organization` },
          knowsAbout: [
            "B2B Sales",
            "Enterprise Sales",
            "Sales Coaching",
            "Revenue Leadership",
            "Sales Methodology",
          ],
          hasOccupation: {
            "@type": "Occupation",
            name: "Sales Coach and Keynote Speaker",
            description:
              "Sales Strength Coach specializing in B2B enterprise sales, deal coaching, team programs, and keynote speaking for sales organizations.",
          },
        },
        {
          "@type": "WebPage",
          "@id": `${BASE_URL}/about#webpage`,
          url: `${BASE_URL}/about`,
          name: "About Vince Beese — B2B Sales Coach, Keynote Speaker & Author",
          description:
            "25+ years in B2B sales. Five exits. $1B+ in revenue generated. Vince Beese is a Sales Strength Coach, keynote speaker, and creator of the Red Zone Selling system.",
          isPartOf: { "@id": `${BASE_URL}/#website` },
          about: { "@id": `${BASE_URL}/#vince-beese` },
        },
      ],
    },
  },

  "/services": {
    title: "B2B Sales Coaching Services — 1:1, Team Programs & AI Coach | Red Zone Selling",
    description:
      "AI sales coaching, 1:1 coaching with Vince Beese, team programs, SKO workshops, and fractional CRO services. One system. Every format. Built for B2B sellers and sales leaders.",
    canonical: `${BASE_URL}/services`,
    ogTitle: "Sales Coaching Services — AI Coach, 1:1, Workshops | Red Zone Selling",
    ogDescription:
      "Always-on AI sales coaching, live 1:1 sessions with Vince Beese, team programs, SKO workshops, and GTM system design. Start your 14-day free trial.",
    ogUrl: `${BASE_URL}/services`,
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": `${BASE_URL}/#organization`,
          name: "Red Zone Selling",
          url: `${BASE_URL}/`,
          logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.png` },
        },
        {
          "@type": "Service",
          "@id": `${BASE_URL}/#ai-coach`,
          name: "RZS AI Coach",
          description:
            "AI-powered sales coaching available 24/7. Three modes: Deal Mode for live deal diagnosis, Coach Mode for strategic guidance, and Mindset Mode for mental performance coaching.",
          provider: { "@id": `${BASE_URL}/#organization` },
          url: `${BASE_URL}/services`,
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            description: "14-day free trial, no credit card required",
          },
        },
        {
          "@type": "Service",
          "@id": `${BASE_URL}/#one-on-one-coaching`,
          name: "1:1 Sales Coaching with Vince Beese",
          description:
            "Private coaching with Vince Beese. Live deal coaching, pipeline reviews, and methodology installation for individual sellers and sales leaders.",
          provider: { "@id": `${BASE_URL}/#organization` },
          url: `${BASE_URL}/services`,
        },
        {
          "@type": "Service",
          "@id": `${BASE_URL}/#team-coaching`,
          name: "Team Sales Coaching Programs",
          description:
            "Red Zone Selling coaching for entire revenue teams. Shared system, live deal reviews, leader track, and ongoing cadence for compounding results.",
          provider: { "@id": `${BASE_URL}/#organization` },
          url: `${BASE_URL}/services`,
        },
        {
          "@type": "Service",
          "@id": `${BASE_URL}/#workshops`,
          name: "Sales Workshops & Keynote Speaking",
          description:
            "High-energy working sessions for SKOs, QBRs, offsites, and keynotes. Practical Red Zone Selling content your team uses Monday morning.",
          provider: { "@id": `${BASE_URL}/#organization` },
          url: `${BASE_URL}/services`,
        },
        {
          "@type": "WebPage",
          "@id": `${BASE_URL}/services#webpage`,
          url: `${BASE_URL}/services`,
          name: "B2B Sales Coaching Services — 1:1, Team Programs & AI Coach",
          description:
            "AI sales coaching, 1:1 coaching, team programs, SKO workshops, and fractional CRO services. One system. Every format.",
          isPartOf: { "@id": `${BASE_URL}/#website` },
        },
      ],
    },
  },

  "/what-is-red-zone-selling": {
    title: "What is Red Zone Selling™? | Zone-Based Enterprise Sales Framework",
    description:
      "Red Zone Selling™ is a zone-based enterprise sales framework by Vince Beese. Learn how the Yellow Zone, Green Zone, and Red Zone system helps B2B sellers close more deals.",
    canonical: `${BASE_URL}/what-is-red-zone-selling`,
    ogTitle: "What is Red Zone Selling™? | Zone-Based Enterprise Sales Framework",
    ogDescription:
      "Red Zone Selling™ is a zone-based enterprise sales framework by Vince Beese. Learn how the Yellow Zone, Green Zone, and Red Zone system helps B2B sellers close more deals.",
    ogUrl: `${BASE_URL}/what-is-red-zone-selling`,
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": `${BASE_URL}/#organization`,
          name: "Red Zone Selling",
          url: `${BASE_URL}/`,
          logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.png` },
        },
        {
          "@type": "Article",
          "@id": `${BASE_URL}/what-is-red-zone-selling#article`,
          headline: "What is Red Zone Selling™?",
          description:
            "Red Zone Selling™ is a zone-based enterprise sales framework by Vince Beese. It organizes the sales process into three zones: Yellow Zone (qualification), Green Zone (momentum), and Red Zone (closing).",
          url: `${BASE_URL}/what-is-red-zone-selling`,
          author: { "@id": `${BASE_URL}/#vince-beese` },
          publisher: { "@id": `${BASE_URL}/#organization` },
        },
        {
          "@type": "Person",
          "@id": `${BASE_URL}/#vince-beese`,
          name: "Vince Beese",
          url: `${BASE_URL}/about`,
        },
        {
          "@type": "WebPage",
          "@id": `${BASE_URL}/what-is-red-zone-selling#webpage`,
          url: `${BASE_URL}/what-is-red-zone-selling`,
          name: "What is Red Zone Selling™? | Zone-Based Enterprise Sales Framework",
          description:
            "Red Zone Selling™ is a zone-based enterprise sales framework by Vince Beese. Learn how the Yellow Zone, Green Zone, and Red Zone system helps B2B sellers close more deals.",
          isPartOf: { "@id": `${BASE_URL}/#website` },
        },
      ],
    },
  },

  "/who-is-vince-beese": {
    title: "Who is Vince Beese? | B2B Sales Strength Coach & Author",
    description:
      "Vince Beese is a B2B sales strength coach, fractional CRO, keynote speaker, and author of Red Zone Selling. 25+ years, $1B in revenue, five exits.",
    canonical: `${BASE_URL}/who-is-vince-beese`,
    ogTitle: "Who is Vince Beese? | B2B Sales Strength Coach & Author",
    ogDescription:
      "Vince Beese is a B2B sales strength coach, fractional CRO, keynote speaker, and author of Red Zone Selling. 25+ years, $1B in revenue, five exits.",
    ogUrl: `${BASE_URL}/who-is-vince-beese`,
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": `${BASE_URL}/#organization`,
          name: "Red Zone Selling",
          url: `${BASE_URL}/`,
          logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.png` },
        },
        {
          "@type": "Person",
          "@id": `${BASE_URL}/#vince-beese`,
          name: "Vince Beese",
          jobTitle: "B2B Sales Strength Coach, Fractional CRO & Author",
          description:
            "B2B sales strength coach, fractional CRO, keynote speaker, and author of Red Zone Selling. 25+ years in enterprise sales, $1B+ in revenue generated, five successful exits.",
          url: `${BASE_URL}/who-is-vince-beese`,
          image: `${BASE_URL}/vince-headshot.jpg`,
          sameAs: [
            "https://www.vincebeese.com/",
            "https://vbeese.substack.com/",
            "https://www.amazon.com/dp/B0FLLHQG13",
            "https://www.linkedin.com/in/vbeese",
          ],
          worksFor: { "@id": `${BASE_URL}/#organization` },
          knowsAbout: [
            "B2B Sales",
            "Enterprise Sales",
            "Sales Coaching",
            "Revenue Leadership",
            "Sales Methodology",
            "Fractional CRO",
          ],
        },
        {
          "@type": "WebPage",
          "@id": `${BASE_URL}/who-is-vince-beese#webpage`,
          url: `${BASE_URL}/who-is-vince-beese`,
          name: "Who is Vince Beese? | B2B Sales Strength Coach & Author",
          description:
            "Vince Beese is a B2B sales strength coach, fractional CRO, keynote speaker, and author of Red Zone Selling. 25+ years, $1B in revenue, five exits.",
          isPartOf: { "@id": `${BASE_URL}/#website` },
          about: { "@id": `${BASE_URL}/#vince-beese` },
        },
      ],
    },
  },

  "/what-is-a-sales-strength-coach": {
    title: "What is a Sales Strength Coach? | Vince Beese",
    description:
      "A Sales Strength Coach works at the deal level — not just skills. Learn how Vince Beese's Sales Strength Coaching methodology helps enterprise sellers win more deals.",
    canonical: `${BASE_URL}/what-is-a-sales-strength-coach`,
    ogTitle: "What is a Sales Strength Coach? | Vince Beese",
    ogDescription:
      "A Sales Strength Coach works at the deal level — not just skills. Learn how Vince Beese's Sales Strength Coaching methodology helps enterprise sellers win more deals.",
    ogUrl: `${BASE_URL}/what-is-a-sales-strength-coach`,
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": `${BASE_URL}/#organization`,
          name: "Red Zone Selling",
          url: `${BASE_URL}/`,
          logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.png` },
        },
        {
          "@type": "Article",
          "@id": `${BASE_URL}/what-is-a-sales-strength-coach#article`,
          headline: "What is a Sales Strength Coach?",
          description:
            "A Sales Strength Coach is a practitioner-led sales coach who works at the deal level — diagnosing live opportunities, building situational selling skills, and developing closing confidence.",
          url: `${BASE_URL}/what-is-a-sales-strength-coach`,
          author: { "@id": `${BASE_URL}/#vince-beese` },
          publisher: { "@id": `${BASE_URL}/#organization` },
        },
        {
          "@type": "Person",
          "@id": `${BASE_URL}/#vince-beese`,
          name: "Vince Beese",
          url: `${BASE_URL}/about`,
        },
        {
          "@type": "WebPage",
          "@id": `${BASE_URL}/what-is-a-sales-strength-coach#webpage`,
          url: `${BASE_URL}/what-is-a-sales-strength-coach`,
          name: "What is a Sales Strength Coach? | Vince Beese",
          description:
            "A Sales Strength Coach works at the deal level — not just skills. Learn how Vince Beese's Sales Strength Coaching methodology helps enterprise sellers win more deals.",
          isPartOf: { "@id": `${BASE_URL}/#website` },
        },
      ],
    },
  },

  "/rzs-ai-coach": {
    title: "Red Zone Selling AI Coach | AI Sales Coaching for Enterprise Sellers",
    description:
      "The RZS AI Coach is an AI-powered sales coaching platform built on Red Zone Selling™. Deal Mode, Coach Mode, and Mindset Mode. Start your 14-day free trial.",
    canonical: `${BASE_URL}/rzs-ai-coach`,
    ogTitle: "Red Zone Selling AI Coach | AI Sales Coaching for Enterprise Sellers",
    ogDescription:
      "The RZS AI Coach is an AI-powered sales coaching platform built on Red Zone Selling™. Deal Mode, Coach Mode, and Mindset Mode. Start your 14-day free trial.",
    ogUrl: `${BASE_URL}/rzs-ai-coach`,
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": `${BASE_URL}/#organization`,
          name: "Red Zone Selling",
          url: `${BASE_URL}/`,
          logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.png` },
        },
        {
          "@type": "SoftwareApplication",
          "@id": `${BASE_URL}/#rzs-ai-coach`,
          name: "RZS AI Coach",
          description:
            "AI-powered sales coaching platform built on the Red Zone Selling™ framework. Includes Deal Mode, Coach Mode, and Mindset Mode for enterprise B2B sellers.",
          applicationCategory: "BusinessApplication",
          url: `${BASE_URL}/rzs-ai-coach`,
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            description: "14-day free trial",
          },
          provider: { "@id": `${BASE_URL}/#organization` },
        },
        {
          "@type": "WebPage",
          "@id": `${BASE_URL}/rzs-ai-coach#webpage`,
          url: `${BASE_URL}/rzs-ai-coach`,
          name: "Red Zone Selling AI Coach | AI Sales Coaching for Enterprise Sellers",
          description:
            "The RZS AI Coach is an AI-powered sales coaching platform built on Red Zone Selling™. Deal Mode, Coach Mode, and Mindset Mode. Start your 14-day free trial.",
          isPartOf: { "@id": `${BASE_URL}/#website` },
        },
      ],
    },
  },

  "/faq": {
    title: "FAQ | Red Zone Selling™ & Vince Beese",
    description:
      "Answers to common questions about Red Zone Selling™, Vince Beese, the three-zone framework, the RZS AI Coach, and how to book a sales keynote or SKO.",
    canonical: `${BASE_URL}/faq`,
    ogTitle: "FAQ | Red Zone Selling™ & Vince Beese",
    ogDescription:
      "Answers to common questions about Red Zone Selling™, Vince Beese, the three-zone framework, the RZS AI Coach, and how to book a sales keynote or SKO.",
    ogUrl: `${BASE_URL}/faq`,
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": `${BASE_URL}/#organization`,
          name: "Red Zone Selling",
          url: `${BASE_URL}/`,
          logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.png` },
        },
        {
          "@type": "FAQPage",
          "@id": `${BASE_URL}/faq#faqpage`,
          url: `${BASE_URL}/faq`,
          name: "FAQ | Red Zone Selling™ & Vince Beese",
          mainEntity: [
            {
              "@type": "Question",
              name: "What is Red Zone Selling™?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Red Zone Selling™ is a zone-based enterprise sales framework created by Vince Beese. It organizes the sales process into three zones — Yellow Zone (qualification), Green Zone (momentum), and Red Zone (closing) — and provides a full play catalog and set of tools to help enterprise sellers win more deals with greater consistency.",
              },
            },
            {
              "@type": "Question",
              name: "Who is Vince Beese?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Vince Beese is a B2B sales strength coach, fractional CRO, keynote speaker, and the author of Red Zone Selling: The Ultimate Playbook for High-Performing Enterprise Sellers. With 25+ years in enterprise sales, $1 billion in revenue generated, and five successful exits, Vince is one of the most experienced sales coaches and revenue leaders working with B2B sales teams today.",
              },
            },
            {
              "@type": "Question",
              name: "What is the RZS AI Coach?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "The RZS AI Coach is an AI-powered sales coaching platform built on the Red Zone Selling™ framework. It offers three coaching modes — Deal Mode for live pipeline coaching, Coach Mode for skills development, and Mindset Mode for mental performance. Available at redzoneselling.co with a 14-day free trial.",
              },
            },
            {
              "@type": "Question",
              name: "How do I book Vince Beese for a sales keynote or SKO?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Vince is available for sales keynotes, sales kickoff (SKO) programs, and workshops. Contact him at vince@vincebeese.com, connect on LinkedIn at linkedin.com/in/vbeese, or fill out the contact form at redzoneselling.co.",
              },
            },
            {
              "@type": "Question",
              name: "Where can I buy the Red Zone Selling book?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Red Zone Selling: The Ultimate Playbook for High-Performing Enterprise Sellers is available on Amazon at https://www.amazon.com/dp/B0FLLHQG13 and through redzoneselling.co.",
              },
            },
          ],
        },
        {
          "@type": "WebPage",
          "@id": `${BASE_URL}/faq#webpage`,
          url: `${BASE_URL}/faq`,
          name: "FAQ | Red Zone Selling™ & Vince Beese",
          description:
            "Answers to common questions about Red Zone Selling™, Vince Beese, the three-zone framework, the RZS AI Coach, and how to book a sales keynote or SKO.",
          isPartOf: { "@id": `${BASE_URL}/#website` },
        },
      ],
    },
  },

  "/blog": {
    title: "B2B Sales Blog — Deal Strategy, Pipeline & Mental Game | Red Zone Selling",
    description:
      "Practical perspectives on B2B sales, pipeline discipline, deal strategy, and the mental game from Vince Beese. Published on Substack.",
    canonical: `${BASE_URL}/blog`,
    ogTitle: "Sales Blog — Deal Strategy, Pipeline & Mental Game | Red Zone Selling",
    ogDescription:
      "Sales thinking from the field. Practical insights on B2B deals, pipeline discipline, objection handling, and the mental game from Vince Beese.",
    ogUrl: `${BASE_URL}/blog`,
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": `${BASE_URL}/#organization`,
          name: "Red Zone Selling",
          url: `${BASE_URL}/`,
          logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.png` },
        },
        {
          "@type": "Blog",
          "@id": `${BASE_URL}/blog#blog`,
          name: "Red Zone Selling Blog",
          description:
            "Practical perspectives on B2B sales, pipeline discipline, deal strategy, and the mental game from Vince Beese.",
          url: `${BASE_URL}/blog`,
          author: { "@id": `${BASE_URL}/#vince-beese` },
          publisher: { "@id": `${BASE_URL}/#organization` },
          sameAs: "https://vbeese.substack.com/",
        },
        {
          "@type": "ItemList",
          "@id": `${BASE_URL}/blog#posts`,
          name: "Red Zone Selling Blog Posts",
          url: `${BASE_URL}/blog`,
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              item: {
                "@type": "BlogPosting",
                name: "Sales thinking from the field",
                description:
                  "Practical perspectives on B2B sales, pipeline discipline, deal strategy, and the mental game.",
                author: { "@id": `${BASE_URL}/#vince-beese` },
                publisher: { "@id": `${BASE_URL}/#organization` },
                url: "https://vbeese.substack.com/",
              },
            },
          ],
        },
        {
          "@type": "Person",
          "@id": `${BASE_URL}/#vince-beese`,
          name: "Vince Beese",
          url: `${BASE_URL}/about`,
          sameAs: ["https://www.vincebeese.com/", "https://vbeese.substack.com/"],
        },
        {
          "@type": "WebPage",
          "@id": `${BASE_URL}/blog#webpage`,
          url: `${BASE_URL}/blog`,
          name: "B2B Sales Blog — Deal Strategy, Pipeline & Mental Game",
          description:
            "Practical perspectives on B2B sales, pipeline discipline, deal strategy, and the mental game from Vince Beese.",
          isPartOf: { "@id": `${BASE_URL}/#website` },
        },
      ],
    },
  },
};

function escapeForAttr(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

type ReplacementSpec = { pattern: RegExp; replacement: string; label: string };

function applyReplacement(html: string, spec: ReplacementSpec): string {
  const count = (html.match(spec.pattern) ?? []).length;
  if (count !== 1) {
    logger.warn(
      { label: spec.label, count },
      "SSR template drift: expected exactly 1 match for pattern — meta injection may be incomplete",
    );
  }
  return html.replace(spec.pattern, spec.replacement);
}

function buildSsrShell(baseHtml: string, meta: PageMeta): string {
  const specs: ReplacementSpec[] = [
    {
      label: "title",
      pattern: /<title>[^<]*<\/title>/,
      replacement: `<title>${meta.title}</title>`,
    },
    {
      label: "meta[description]",
      pattern: /<meta name="description" content="[^"]*"\s*\/>/,
      replacement: `<meta name="description" content="${escapeForAttr(meta.description)}" />`,
    },
    {
      label: "link[canonical]",
      pattern: /<link rel="canonical" href="[^"]*"\s*\/>/,
      replacement: `<link rel="canonical" href="${escapeForAttr(meta.canonical)}" />`,
    },
    {
      label: "og:url",
      pattern: /<meta property="og:url" content="[^"]*"\s*\/>/,
      replacement: `<meta property="og:url" content="${escapeForAttr(meta.ogUrl)}" />`,
    },
    {
      label: "og:title",
      pattern: /<meta property="og:title" content="[^"]*"\s*\/>/,
      replacement: `<meta property="og:title" content="${escapeForAttr(meta.ogTitle)}" />`,
    },
    {
      label: "og:description",
      pattern: /<meta property="og:description" content="[^"]*"\s*\/>/,
      replacement: `<meta property="og:description" content="${escapeForAttr(meta.ogDescription)}" />`,
    },
    {
      label: "twitter:title",
      pattern: /<meta name="twitter:title" content="[^"]*"\s*\/>/,
      replacement: `<meta name="twitter:title" content="${escapeForAttr(meta.ogTitle)}" />`,
    },
    {
      label: "twitter:description",
      pattern: /<meta name="twitter:description" content="[^"]*"\s*\/>/,
      replacement: `<meta name="twitter:description" content="${escapeForAttr(meta.ogDescription)}" />`,
    },
    {
      label: "ld+json",
      pattern: /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
      replacement: `<script type="application/ld+json">\n    ${JSON.stringify(meta.jsonLd, null, 2)}\n    </script>`,
    },
  ];

  return specs.reduce((html, spec) => applyReplacement(html, spec), baseHtml);
}

function loadBaseHtml(): string | null {
  // Use import.meta.url so the path resolves correctly regardless of cwd.
  // In dev and production the compiled bundle sits at:
  //   artifacts/api-server/dist/index.mjs
  // Three levels up from that dir reaches the workspace root.
  const bundleDir = path.dirname(fileURLToPath(import.meta.url));
  const workspaceRoot = path.resolve(bundleDir, "../../..");
  const htmlPath = path.join(workspaceRoot, "artifacts/redzone/dist/public/index.html");
  try {
    return readFileSync(htmlPath, "utf-8");
  } catch {
    logger.warn({ htmlPath }, "SSR: redzone dist/public/index.html not found — SSR routes will return 503");
    return null;
  }
}

let _baseHtml: string | null | undefined = undefined;

function getBaseHtml(): string | null {
  if (_baseHtml === undefined) {
    _baseHtml = loadBaseHtml();
  }
  return _baseHtml;
}

export function createSsrHandler(routePath: keyof typeof PAGE_META): RequestHandler {
  const meta = PAGE_META[routePath];
  return (_req, res) => {
    const baseHtml = getBaseHtml();
    if (!baseHtml) {
      res.status(503).send("Service temporarily unavailable");
      return;
    }
    const html = buildSsrShell(baseHtml, meta);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.send(html);
  };
}

