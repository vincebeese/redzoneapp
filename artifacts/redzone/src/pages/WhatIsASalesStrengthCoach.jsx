import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';

export default function WhatIsASalesStrengthCoach() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-[#F9F6F0] pt-16 pb-14">
        <div className="container mx-auto px-6 max-w-3xl">
          <span className="text-[#C62828] font-bold tracking-widest text-xs uppercase mb-4 block">The Methodology</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl lg:text-5xl font-bold leading-tight mb-6 text-[#1A1A1A]">
            What is a Sales Strength Coach?
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            A Sales Strength Coach is a practitioner-led sales coach who works at the deal level — not just the skills level. The term was coined by Vince Beese, creator of Red Zone Selling™, to describe a coaching methodology built on the premise that sales strength is developed through real deal work, situational pattern recognition, and mental fortitude — not generic training programs.
          </p>
        </div>
      </section>

      {/* How It's Different */}
      <section className="bg-white py-14">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold mb-6 text-[#1A1A1A]">
            How Sales Strength Coaching Is Different
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Most sales coaching falls into one of two buckets: skills-based training (how to handle objections, how to run discovery) or pipeline management (deal reviews, forecast calls). Both have value. Neither is enough.
          </p>
          <p className="text-gray-700 leading-relaxed mb-8">
            Sales Strength Coaching operates at the intersection of both — applied to live deals, real stakeholders, and actual outcomes. It is coaching that produces results you can measure in your pipeline this quarter, not just competencies you might apply someday.
          </p>

          <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-bold mb-4 text-[#1A1A1A]">
            Sales Strength Coaching focuses on four things:
          </h3>
          <ul className="space-y-4">
            {[
              { label: 'Deal-level diagnosis', body: 'identifying exactly why a specific deal is at risk and what to do about it' },
              { label: 'Situational selling', body: 'developing the pattern recognition to read a deal and call the right play' },
              { label: 'Closing confidence', body: 'building the mental framework and tactical toolkit to execute in high-pressure moments' },
              { label: 'Pipeline discipline', body: 'establishing the qualification standards and deal-stage hygiene that separate great sellers from average ones' },
            ].map(item => (
              <li key={item.label} className="flex items-start gap-3 text-gray-700">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#C62828] flex-shrink-0" />
                <span><span className="font-semibold text-[#1A1A1A]">{item.label}</span> — {item.body}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Who Needs It */}
      <section className="bg-gray-50 py-14">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold mb-4 text-[#1A1A1A]">
            Who Needs a Sales Strength Coach?
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Sales Strength Coaching is designed for enterprise sellers, sales leaders, and founders who are serious about closing. It is not a program for SDRs learning to prospect or onboarding reps learning the basics. It is for growth sellers and leaders who want to win more of the deals they should be winning — and understand exactly why they're losing the ones they're not.
          </p>
        </div>
      </section>

      {/* RZS Approach */}
      <section className="bg-white py-14">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold mb-4 text-[#1A1A1A]">
            The Red Zone Selling™ Approach to Sales Strength Coaching
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Vince Beese delivers Sales Strength Coaching through the Red Zone Selling™ framework — a three-zone system (Yellow Zone, Green Zone, Red Zone) that maps every stage of the enterprise sales process from qualification to close. Coaching sessions are structured around live deal review, zone-specific play execution, and the Own the Close™ Scorecard.
          </p>
          <p className="text-gray-700 leading-relaxed mb-8">
            Sales Strength Coaching is available 1:1 with Vince, through the RZS AI Coach (an AI-powered coaching platform), and through team coaching engagements. Learn more at{' '}
            <Link to="/services" className="text-[#C62828] hover:underline font-medium">
              redzoneselling.co/services
            </Link>
            .
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center bg-[#C62828] hover:bg-[#A93226] text-white text-sm h-10 px-5 rounded font-medium transition-colors"
            >
              Try the RZS AI Coach Free →
            </Link>
            <Link
              to="/#contact"
              className="inline-flex items-center justify-center border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm h-10 px-5 rounded font-medium transition-colors"
            >
              Book 1:1 with Vince →
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
