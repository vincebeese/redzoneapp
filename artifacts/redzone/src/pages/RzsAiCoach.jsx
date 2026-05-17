import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';

export default function RzsAiCoach() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-[#F9F6F0] pt-16 pb-14">
        <div className="container mx-auto px-6 max-w-3xl">
          <span className="text-[#C62828] font-bold tracking-widest text-xs uppercase mb-4 block">AI Sales Coaching</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl lg:text-5xl font-bold leading-tight mb-6 text-[#1A1A1A]">
            Red Zone Selling AI Coach
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            The Red Zone Selling AI Coach — also known as the RZS AI Coach — is an AI-powered sales coaching platform built on the Red Zone Selling™ framework. It is the first AI sales coach designed specifically for enterprise B2B sellers, giving individual reps, sales leaders, and teams access to deal-level coaching, situational guidance, and closing strategy on demand.
          </p>
          <div className="mt-6">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center bg-[#C62828] hover:bg-[#A93226] text-white text-base h-11 px-6 rounded font-medium transition-colors"
            >
              Start Your 14-Day Free Trial →
            </Link>
          </div>
        </div>
      </section>

      {/* What It Does */}
      <section className="bg-white py-14">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold mb-4 text-[#1A1A1A]">
            What the RZS AI Coach Does
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            The RZS AI Coach is not a generic AI chatbot. It is a purpose-built AI sales coaching system trained on the Red Zone Selling™ methodology — including the full play catalog, zone-based diagnostics, the Own the Close™ Scorecard, and the situational selling frameworks from the Red Zone Selling book.
          </p>
          <p className="text-gray-700 leading-relaxed">
            When you bring a live deal to the RZS AI Coach, it does what a great sales coach does: it asks the right diagnostic questions, identifies the zone your deal is in, surfaces the plays most likely to advance or close it, and gives you a clear next action.
          </p>
        </div>
      </section>

      {/* Three Modes */}
      <section className="bg-gray-50 py-14">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold mb-8 text-[#1A1A1A]">
            Three Coaching Modes
          </h2>

          <div className="space-y-8">
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-bold mb-3 text-[#1A1A1A]">
                Deal Mode
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Deal Mode is AI sales coaching applied to your live pipeline. Bring the RZS AI Coach a deal — tell it where you are, who's involved, what's stalling — and it will diagnose the situation, identify the right zone, and recommend the specific plays to run. Deal Mode is designed for sellers who want a coach in their corner every time they touch a complex opportunity.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-bold mb-3 text-[#1A1A1A]">
                Coach Mode
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Coach Mode is skills-based AI sales coaching for enterprise sellers who want to develop faster. Whether you need to sharpen your discovery questions, improve your objection handling, or prepare for a critical call, Coach Mode delivers targeted development in the context of your actual deals and customer situations.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-bold mb-3 text-[#1A1A1A]">
                Mindset Mode
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Mindset Mode is AI coaching for the mental side of selling — the resilience, confidence, and focus required to perform under pressure. Elite sellers know that the Red Zone is as much mental as tactical. Mindset Mode gives sellers the tools to reset, refocus, and compete at their best.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="bg-white py-14">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold mb-6 text-[#1A1A1A]">
            Who the RZS AI Coach Is For
          </h2>
          <ul className="space-y-3 mb-10">
            {[
              'Enterprise account executives who carry complex quota and need deal-level support',
              'Sales leaders who want every rep to have access to high-quality AI sales coaching',
              'Founders and business owners closing their own deals without a sales team',
              'Sales teams preparing for SKOs, competitive situations, or pipeline reviews',
            ].map(item => (
              <li key={item} className="flex items-start gap-3 text-gray-700">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#C62828] flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold mb-4 text-[#1A1A1A]">
            AI Sales Coaching, Available on Demand
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            The RZS AI Coach makes AI sales coaching accessible at every stage of the deal — from first qualification call to final negotiation. It is available as a standalone subscription and is included at no additional cost for retainer coaching clients of Vince Beese.
          </p>
          <p className="text-gray-700 leading-relaxed mb-8">
            The RZS AI Coach is built on the Anthropic Claude AI platform and is hosted at redzoneselling.co. Start your 14-day free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center bg-[#C62828] hover:bg-[#A93226] text-white text-sm h-10 px-5 rounded font-medium transition-colors"
            >
              Start 14-Day Free Trial →
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center justify-center border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm h-10 px-5 rounded font-medium transition-colors"
            >
              See All Coaching Options →
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
