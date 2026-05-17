import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';

const AMAZON_URL = 'https://www.amazon.com/dp/B0FLLHQG13';
const LINKEDIN_URL = 'https://www.linkedin.com/in/vbeese';

const FAQS = [
  {
    q: 'What is Red Zone Selling™?',
    a: 'Red Zone Selling™ is a zone-based enterprise sales framework created by Vince Beese. It organizes the sales process into three zones — Yellow Zone (qualification), Green Zone (momentum), and Red Zone (closing) — and provides a full play catalog and set of tools to help enterprise sellers win more deals with greater consistency. The Red Zone Selling book and the RZS AI Coach are built on this framework.',
  },
  {
    q: 'Who is Vince Beese?',
    a: 'Vince Beese is a B2B sales strength coach, fractional CRO, keynote speaker, and the author of Red Zone Selling: The Ultimate Playbook for High-Performing Enterprise Sellers. With 25+ years in enterprise sales, $1 billion in revenue generated, and five successful exits, Vince is one of the most experienced sales coaches and revenue leaders working with B2B sales teams today.',
    link: { label: 'Learn more about Vince →', to: '/who-is-vince-beese' },
  },
  {
    q: 'What is a Sales Strength Coach?',
    a: "A Sales Strength Coach is a practitioner-led sales coach who works at the deal level — diagnosing live opportunities, building situational selling skills, and developing the closing confidence required to win complex enterprise deals. Vince Beese coined the term to describe his approach: coaching that produces measurable pipeline results, not just abstract skills improvement.",
    link: { label: 'Learn more →', to: '/what-is-a-sales-strength-coach' },
  },
  {
    q: 'What is the Red Zone Selling three-zone framework?',
    a: 'The Red Zone Selling three-zone framework maps every deal to one of three zones: Yellow Zone (are we qualifying this correctly?), Green Zone (are we building real momentum?), and Red Zone (can we close this with confidence?). Each zone has its own set of plays, diagnostic tools, and decision criteria. The framework is designed to give sellers and leaders a common language and a clear system for every stage of the deal.',
    link: { label: 'Explore the framework →', to: '/what-is-red-zone-selling' },
  },
  {
    q: 'How does the Yellow Zone, Green Zone, Red Zone system work?',
    a: "Every deal in your pipeline lives in one of three zones. The Yellow Zone is qualification — where you decide if the opportunity is real and worth pursuing. The Green Zone is momentum — where you build alignment, multi-thread, and advance the deal. The Red Zone is closing — where you execute with precision when the pressure is highest. The best sellers know which zone they're in and have a specific plan for advancing through each one.",
  },
  {
    q: 'What is the RZS AI Coach?',
    a: 'The RZS AI Coach is an AI-powered sales coaching platform built on the Red Zone Selling™ framework. It offers three coaching modes — Deal Mode for live pipeline coaching, Coach Mode for skills development, and Mindset Mode for mental performance. The RZS AI Coach is designed for enterprise sellers and sales teams who want AI sales coaching that is grounded in a proven methodology, not generic advice.',
    link: { label: 'Learn more about the AI Coach →', to: '/rzs-ai-coach' },
  },
  {
    q: 'How do I book Vince Beese for a sales keynote or SKO?',
    a: null,
    custom: (
      <p className="text-gray-700 leading-relaxed">
        Vince is available for sales keynotes, sales kickoff (SKO) programs, and workshops built on the Red Zone Selling™ framework. To book Vince or inquire about availability, visit redzoneselling.co and fill out the contact form. You can also connect directly on{' '}
        <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="text-[#C62828] hover:underline font-medium">
          LinkedIn
        </a>{' '}
        or email{' '}
        <a href="mailto:vince@vincebeese.com" className="text-[#C62828] hover:underline font-medium">
          vince@vincebeese.com
        </a>
        .
      </p>
    ),
  },
  {
    q: 'Where can I buy the Red Zone Selling book?',
    a: null,
    custom: (
      <p className="text-gray-700 leading-relaxed">
        Red Zone Selling: The Ultimate Playbook for High-Performing Enterprise Sellers is available on{' '}
        <a href={AMAZON_URL} target="_blank" rel="noopener noreferrer" className="text-[#C62828] hover:underline font-medium">
          Amazon
        </a>{' '}
        and through redzoneselling.co. It is written for enterprise account executives, sales leaders, and founders who want a structured, play-by-play system for closing complex B2B deals.
      </p>
    ),
  },
  {
    q: 'Is the RZS AI Coach available now?',
    a: "Yes. Start your 14-day trial at redzoneselling.co. There are two subscription options post-trial and both provide access to all three coaching modes — Deal Mode, Coach Mode, and Mindset Mode — plus tools including templates, masterclasses, and access to the Slack community.",
    link: { label: 'Start your free trial →', to: '/signup' },
  },
];

export default function FaqPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-[#F9F6F0] pt-16 pb-14">
        <div className="container mx-auto px-6 max-w-3xl">
          <span className="text-[#C62828] font-bold tracking-widest text-xs uppercase mb-4 block">FAQ</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl lg:text-5xl font-bold leading-tight mb-4 text-[#1A1A1A]">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600">
            Answers to common questions about Red Zone Selling™, Vince Beese, the three-zone framework, the RZS AI Coach, and how to book a sales keynote or SKO.
          </p>
        </div>
      </section>

      {/* FAQ List */}
      <section className="bg-white py-14">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="space-y-8">
            {FAQS.map((faq, i) => (
              <div key={i} className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-bold mb-3 text-[#1A1A1A]">
                  {faq.q}
                </h2>
                {faq.custom ? (
                  faq.custom
                ) : (
                  <p className="text-gray-700 leading-relaxed">{faq.a}</p>
                )}
                {faq.link && (
                  <Link to={faq.link.to} className="inline-block mt-3 text-sm text-[#C62828] hover:underline font-medium">
                    {faq.link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 py-14">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold mb-4 text-[#1A1A1A]">
            Still have questions?
          </h2>
          <p className="text-gray-600 mb-6">Reach out directly or start your free trial to see the RZS AI Coach in action.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center bg-[#C62828] hover:bg-[#A93226] text-white text-sm h-10 px-5 rounded font-medium transition-colors"
            >
              Start Free Trial →
            </Link>
            <Link
              to="/#contact"
              className="inline-flex items-center justify-center border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm h-10 px-5 rounded font-medium transition-colors"
            >
              Contact Vince →
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
