import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';

const AMAZON_URL = 'https://www.amazon.com/dp/B0FLLHQG13';

export default function WhatIsRedZoneSelling() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-[#F9F6F0] pt-16 pb-14">
        <div className="container mx-auto px-6 max-w-3xl">
          <span className="text-[#C62828] font-bold tracking-widest text-xs uppercase mb-4 block">The Framework</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl lg:text-5xl font-bold leading-tight mb-6 text-[#1A1A1A]">
            What is Red Zone Selling™?
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            Red Zone Selling™ is a zone-based enterprise sales framework developed by Vince Beese, B2B sales strength coach, fractional CRO, and author. Built on more than 25 years of enterprise sales experience and over $1 billion in revenue generated, the Red Zone Selling system gives sales professionals, founders, and revenue leaders a clear, structured approach to qualifying deals, building momentum, and closing with confidence.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mt-4">
            The framework is built around a simple but powerful insight: every deal in your pipeline is in one of three zones. The best sellers always know which zone they're in — and they know exactly which play to run.
          </p>
        </div>
      </section>

      {/* Three-Zone Framework */}
      <section className="bg-white py-14">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold mb-8 text-[#1A1A1A]">
            The Three-Zone Framework
          </h2>
          <p className="text-gray-700 leading-relaxed mb-10">
            Red Zone Selling organizes the entire sales process into three zones, each with its own set of plays, tools, and decision criteria.
          </p>

          <div className="space-y-8">
            {/* Yellow Zone */}
            <div className="border-l-4 border-yellow-400 pl-6">
              <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-bold mb-3 text-[#1A1A1A]">
                Yellow Zone — Qualification
              </h3>
              <p className="text-gray-700 leading-relaxed">
                The Yellow Zone is where deals begin — and where most of them should end. Yellow Zone selling is about qualification: Is this a real opportunity or just noise? The Yellow Zone requires sellers to apply the 4F Filter (Fit, Friction, Funding, Forecast), map key stakeholders, diagnose real business pain, and disqualify fast when the deal doesn't meet the bar. Weak Yellow Zone discipline leads to a pipeline full of bad deals that waste time, distort forecasts, and drain momentum.
              </p>
            </div>

            {/* Green Zone */}
            <div className="border-l-4 border-green-500 pl-6">
              <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-bold mb-3 text-[#1A1A1A]">
                Green Zone — Momentum
              </h3>
              <p className="text-gray-700 leading-relaxed">
                A deal that passes the Yellow Zone enters the Green Zone. Green Zone selling is about building and maintaining momentum through multi-threading, mutual action plans, micro-commitments, and champion activation. The Green Zone is where most deals stall — not because the buyer said no, but because the seller stopped driving. Green Zone mastery means you're never waiting on the buyer. You're always advancing the deal.
              </p>
            </div>

            {/* Red Zone */}
            <div className="border-l-4 border-[#C62828] pl-6">
              <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-bold mb-3 text-[#1A1A1A]">
                Red Zone — Closing
              </h3>
              <p className="text-gray-700 leading-relaxed">
                The Red Zone is the final stretch — negotiations, procurement, signatures, and final decisions. Red Zone selling is about finishing strong when the pressure is highest. Elite sellers use the Own the Close™ Scorecard, 72-hour action plans, and precision objection handling to cross the finish line. The Red Zone is not the time to hope. It's the time to execute.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Book */}
      <section className="bg-gray-50 py-14">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold mb-4 text-[#1A1A1A]">
            The Red Zone Selling Book
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            <a href={AMAZON_URL} target="_blank" rel="noopener noreferrer" className="text-[#C62828] hover:underline font-medium">
              Red Zone Selling: The Ultimate Playbook for High-Performing Enterprise Sellers
            </a>{' '}
            is the definitive guide to the framework. Written by Vince Beese and published in 2025, the book covers every zone, every play, and every tool a high-performing enterprise seller needs. It is available on Amazon and through redzoneselling.co.
          </p>
        </div>
      </section>

      {/* The System */}
      <section className="bg-white py-14">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold mb-4 text-[#1A1A1A]">
            The Red Zone Selling System
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            The Red Zone Selling system is used by founders, sales leaders, enterprise account executives, and revenue teams who want to sell with structure, close with confidence, and forecast with accuracy. It is delivered through the book, the RZS AI Coach, workshops, sales kickoff programs, and 1:1 coaching engagements.
          </p>
          <p className="text-gray-700 leading-relaxed mb-8">
            To learn more, visit{' '}
            <Link to="/services" className="text-[#C62828] hover:underline font-medium">
              redzoneselling.co/services
            </Link>
            .
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={AMAZON_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-[#C62828] hover:bg-[#A93226] text-white text-sm h-10 px-5 rounded font-medium transition-colors"
            >
              Get the Book on Amazon →
            </a>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm h-10 px-5 rounded font-medium transition-colors"
            >
              Try the RZS AI Coach Free →
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
