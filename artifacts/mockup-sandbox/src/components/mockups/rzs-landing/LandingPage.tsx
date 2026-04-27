import React from 'react';
import { ArrowRight, CheckCircle2, MessageSquare, Shield, Target, Trophy, Users, Zap, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

const WAITLIST_URL = 'https://oe8gn.share.hsforms.com/2pzn1m9yJS9uYej-9kaZvBA';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-['Inter'] text-[#1A1A1A] selection:bg-[#C0392B] selection:text-white">

      {/* Beta Status Bar */}
      <div className="bg-[#1A1A1A] text-white py-2 px-4 text-sm flex justify-center items-center gap-4 relative z-50">
        <p>RZS AI Coach Beta is live and locked. Join the waitlist for the next cohort →</p>
        <a href={WAITLIST_URL} target="_blank" rel="noopener noreferrer" className="text-[#C0392B] font-semibold hover:underline flex items-center whitespace-nowrap">
          Join Waitlist <ArrowRight className="ml-1 w-3 h-3" />
        </a>
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <span>RZS</span>
            <div className="w-2 h-2 rounded-full bg-[#C0392B]"></div>
          </div>
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-600">
            <a href="#coaching" className="hover:text-[#1A1A1A] transition-colors">Coaching</a>
            <a href="#ai-coach" className="hover:text-[#1A1A1A] transition-colors">AI Coach</a>
            <a href="#book" className="hover:text-[#1A1A1A] transition-colors">Book</a>
            <a href="#about" className="hover:text-[#1A1A1A] transition-colors">About</a>
            <a href="#contact" className="hover:text-[#1A1A1A] transition-colors">Contact</a>
          </nav>
          <div>
            <Button size="sm" className="bg-[#C0392B] hover:bg-[#A93226] text-white">Go to App</Button>
          </div>
        </div>
      </header>

      {/* Section 1 — Hero */}
      <section className="bg-[#F9F6F0] pt-16 pb-16 overflow-hidden relative">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="max-w-2xl">
              <h1 className="font-['Playfair_Display'] text-5xl lg:text-6xl font-bold leading-tight mb-3 text-[#1A1A1A]">
                Sellers with structured coaching programs win <span className="text-[#C0392B]">28% more deals.</span>
              </h1>
              <p className="text-sm text-gray-500 mb-5 italic">Most sellers get none. Source: CSO Insights</p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Red Zone Selling changes that. A complete coaching system for sellers and sales leaders — built by someone who's been in the deal, closed it, and coached hundreds of others to do the same.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <Button size="lg" className="bg-[#C0392B] hover:bg-[#A93226] text-white text-base h-12 px-7">
                  See how it works ↓
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-4 font-medium border-t border-gray-200 pt-4">
                One system. Six ways to work together. Built for sellers who want to win more and leaders who want to build teams that do.
              </p>
            </div>

            <div className="relative lg:ml-auto w-full max-w-md">
              <Card className="bg-[#1A1A1A] text-white border-gray-800 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#C0392B] to-orange-500"></div>
                <CardHeader className="border-b border-gray-800 pb-3 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#C0392B] to-red-900 flex items-center justify-center">
                      <span className="font-bold text-[10px]">RZS</span>
                    </div>
                    <div>
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        RZS AI Coach
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C0392B]"></span>
                        </span>
                      </CardTitle>
                      <p className="text-gray-400 text-xs">Active now</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 pb-4 space-y-4">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-gray-800 flex-shrink-0 mt-1 flex items-center justify-center text-[10px]">RZS</div>
                    <div className="bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-200">
                      Walk me through your last deal that stalled. What happened at the presentation stage?
                    </div>
                  </div>
                  <div className="flex gap-3 flex-row-reverse">
                    <div className="w-6 h-6 rounded-full bg-[#C0392B] flex-shrink-0 mt-1 flex items-center justify-center text-[10px]">You</div>
                    <div className="bg-[#C0392B]/20 border border-[#C0392B]/30 rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-white">
                      They loved the demo but went quiet after I sent the proposal...
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-gray-800 flex-shrink-0 mt-1 flex items-center justify-center text-[10px]">RZS</div>
                    <div className="bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-200 border border-gray-700">
                      Classic Red Zone stall. Let's run a deal autopsy — I'll show you exactly where and why it stalled.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 — Vince & The Problem */}
      <section className="bg-gray-50 py-14" id="about">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
            <div>
              <h2 className="font-['Playfair_Display'] text-3xl font-bold mb-5 leading-snug">
                Most sellers don't lose deals because they can't sell.
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-5">
                They lose because they don't know where they are in the deal, or what to do next.
              </p>
              <p className="text-gray-600 leading-relaxed">
                That's the gap Vince Beese spent 25 years solving. First as a rep, then as a CRO, now as a Sales Strength Coach. He's not a LinkedIn influencer recycling someone else's advice. He built his career closing real deals, leading real teams, and doing the hard work before he ever started teaching it. Then he wrote the book — Red Zone Selling.
              </p>
            </div>
            <div>
              <div className="grid grid-cols-2 gap-5 mb-8">
                <div className="bg-white rounded-xl p-5 border border-gray-100">
                  <div className="text-3xl font-bold text-[#1A1A1A] mb-1">25+ Years</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider">in Sales</div>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-100">
                  <div className="text-3xl font-bold text-[#1A1A1A] mb-1">Five Exits</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider">Companies Scaled</div>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-100">
                  <div className="text-3xl font-bold text-[#1A1A1A] mb-1">$1B+</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider">Revenue Generated</div>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-100">
                  <div className="text-sm font-semibold text-[#1A1A1A] mb-1">Coach · Speaker · Author</div>
                  <a href="#" className="text-xs text-[#C0392B] hover:underline font-medium">Red Zone Selling on Amazon →</a>
                </div>
              </div>
              <blockquote className="border-l-4 border-[#C0392B] pl-5">
                <p className="text-lg font-['Playfair_Display'] italic text-[#1A1A1A] mb-2">
                  "Most sellers aren't struggling because they don't work hard enough. They're struggling because nobody ever showed them a system."
                </p>
                <footer className="text-sm font-medium text-gray-500">Vince Beese</footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 — The System */}
      <section className="bg-white py-14">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <span className="text-[#C0392B] font-bold tracking-widest text-xs uppercase mb-3 block">The System</span>
            <h2 className="font-['Playfair_Display'] text-4xl font-bold mb-3">Every deal lives in one of three zones.</h2>
            <p className="text-gray-600">Most sellers don't know which one they're in.</p>
            <p className="text-sm text-gray-500 mt-2">Three zones. 69 plays. Built for sellers who want to qualify harder, build momentum faster, and close with confidence.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
            {/* Yellow Zone */}
            <Card className="bg-white border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400"></div>
              <CardHeader className="pb-2 pt-5">
                <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 border border-yellow-200 w-fit mb-2 text-xs">Top of Funnel</Badge>
                <CardTitle className="text-lg">Yellow Zone: Qualify</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">Is this real? Is it worth your time? Qualify hard, disqualify fast, and protect your pipeline.</p>
              </CardContent>
            </Card>

            {/* Green Zone */}
            <Card className="bg-white border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
              <CardHeader className="pb-2 pt-5">
                <Badge variant="secondary" className="bg-green-50 text-green-700 border border-green-200 w-fit mb-2 text-xs">Mid Funnel</Badge>
                <CardTitle className="text-lg">Green Zone: Momentum</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">The deal is alive. Multi-thread, build a business case, and prevent ghosting and stalls.</p>
              </CardContent>
            </Card>

            {/* Red Zone */}
            <Card className="bg-white border-2 border-[#C0392B] shadow-md relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#C0392B]"></div>
              <CardHeader className="pb-2 pt-5">
                <Badge className="bg-[#C0392B] text-white w-fit mb-2 text-xs">Bottom of Funnel</Badge>
                <CardTitle className="text-lg text-[#C0392B]">Red Zone: Close</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">Final stretch. Flush friction, activate your champion, close with confidence, not desperation.</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <blockquote className="text-gray-700 italic mb-1 text-sm whitespace-nowrap">
              "The zone tells you where you are. The play tells you what to do. That's the whole system."
            </blockquote>
            <p className="text-sm text-gray-500 mb-4">Vince Beese</p>
            <p className="text-sm text-gray-600">Want the full system? It's all in the book. <a href="#" className="text-[#C0392B] font-medium hover:underline">Get Red Zone Selling on Amazon →</a></p>
          </div>
        </div>
      </section>

      {/* Section 4 — Ways to Work Together */}
      <section className="bg-gray-50 py-14" id="coaching">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[#C0392B] font-bold tracking-widest text-xs uppercase mb-3 block">Ways to Work Together</span>
            <h2 className="font-['Playfair_Display'] text-3xl font-bold mb-2">One system. Every format. Find the right fit for where you are.</h2>
            <p className="text-gray-600 text-base">Whether you're an individual seller, a sales leader, or building a team from the ground up, there's a way to work together.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto mb-6">
            {/* Card 1 — AI Coach */}
            <Card className="border-2 border-[#C0392B] shadow-md relative overflow-hidden">
              <div className="absolute top-3 right-3">
                <Badge className="bg-[#C0392B] text-white text-xs">Always on · Beta</Badge>
              </div>
              <CardHeader className="pb-2 pt-5">
                <CardTitle className="text-lg">RZS AI Coach</CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-gray-600 text-sm mb-4">24/7 on-demand coaching. Three modes: Deal, Coach, and Mindset. Available the moment you need it.</p>
                <a href={WAITLIST_URL} target="_blank" rel="noopener noreferrer" className="text-[#C0392B] font-semibold text-sm hover:underline flex items-center gap-1">
                  Join Waitlist <ArrowRight className="w-3 h-3" />
                </a>
              </CardContent>
            </Card>

            {/* Card 2 — 1:1 Coaching */}
            <Card className="border border-gray-200 shadow-sm">
              <div className="absolute top-3 right-3">
                <Badge variant="outline" className="text-xs text-gray-500 border-gray-300">Live</Badge>
              </div>
              <CardHeader className="pb-2 pt-5">
                <CardTitle className="text-lg">1:1 Coaching</CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-gray-600 text-sm mb-4">Private coaching with Vince. For sellers working live deals and leaders who want to elevate close rates.</p>
                <a href="#contact" className="text-[#1A1A1A] font-semibold text-sm hover:underline flex items-center gap-1">
                  Work With Vince <ArrowRight className="w-3 h-3" />
                </a>
              </CardContent>
            </Card>

            {/* Card 3 — Team Coaching */}
            <Card className="border border-gray-200 shadow-sm relative">
              <div className="absolute top-3 right-3">
                <Badge variant="outline" className="text-xs text-gray-500 border-gray-300">Live · Teams</Badge>
              </div>
              <CardHeader className="pb-2 pt-5">
                <CardTitle className="text-lg">Team Coaching</CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-gray-600 text-sm mb-4">Red Zone Selling coaching for your entire team. Reps and leaders together. Compounds over time.</p>
                <a href="#contact" className="text-[#1A1A1A] font-semibold text-sm hover:underline flex items-center gap-1">
                  Start a Conversation <ArrowRight className="w-3 h-3" />
                </a>
              </CardContent>
            </Card>

            {/* Card 4 — Workshops */}
            <Card className="border border-gray-200 shadow-sm relative">
              <div className="absolute top-3 right-3">
                <Badge variant="outline" className="text-xs text-gray-500 border-gray-300">Live · Events</Badge>
              </div>
              <CardHeader className="pb-2 pt-5">
                <CardTitle className="text-lg">Workshops & Speaking</CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-gray-600 text-sm mb-4">SKOs, QBRs, offsites, keynotes. A working session your team uses Monday morning.</p>
                <a href="#contact" className="text-[#1A1A1A] font-semibold text-sm hover:underline flex items-center gap-1">
                  Book a Workshop <ArrowRight className="w-3 h-3" />
                </a>
              </CardContent>
            </Card>

            {/* Card 5 — GTM */}
            <Card className="border border-gray-200 shadow-sm relative">
              <div className="absolute top-3 right-3">
                <Badge variant="outline" className="text-xs text-gray-500 border-gray-300">Live · Orgs</Badge>
              </div>
              <CardHeader className="pb-2 pt-5">
                <CardTitle className="text-lg">GTM & Sales System</CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-gray-600 text-sm mb-4">Fractional CRO or system architect. Pipeline, process, and Red Zone plays installed across your org.</p>
                <a href="#contact" className="text-[#1A1A1A] font-semibold text-sm hover:underline flex items-center gap-1">
                  Start a Conversation <ArrowRight className="w-3 h-3" />
                </a>
              </CardContent>
            </Card>

            {/* Card 6 — The Book */}
            <Card className="border border-gray-200 shadow-sm bg-[#1A1A1A] text-white">
              <CardHeader className="pb-2 pt-5">
                <CardTitle className="text-lg text-white">The Book</CardTitle>
                <p className="text-gray-400 text-sm font-medium">Red Zone Selling</p>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-gray-300 text-sm mb-4">Three zones, 69 plays. The foundation of the system. Live on Amazon.</p>
                <a href="#" className="text-[#C0392B] font-semibold text-sm hover:underline flex items-center gap-1">
                  Get the Book <ArrowRight className="w-3 h-3" />
                </a>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-sm text-gray-500 max-w-xl mx-auto">
            Many clients use both. The RZS AI Coach and 1:1 coaching are the most common combination: always-on coaching between live sessions with Vince.
          </p>
        </div>
      </section>

      {/* Section 5 — AI Coach Modes */}
      <section className="bg-[#1A1A1A] text-white py-14" id="ai-coach">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[#C0392B] font-bold tracking-widest text-xs uppercase mb-3 block">RZS AI Coach Modes</span>
            <h2 className="font-['Playfair_Display'] text-3xl lg:text-4xl font-bold mb-3">Three modes. Every selling situation covered.</h2>
            <p className="text-gray-400 text-base">Each mode is built for a different moment. Use one, use all three. The coach is ready when you are. Start a session, step away, and pick up right where you left off.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto mb-10">
            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader className="pb-2 pt-5">
                <Badge className="bg-[#C0392B] text-white w-fit mb-2 text-xs">Deal Mode</Badge>
                <CardTitle className="text-base font-semibold">You're stuck on a deal</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-gray-300 text-sm mb-3">Drop in the situation. Get a Red Zone diagnosis — which zone you're in, what's at risk, and the exact play to run next.</p>
                <p className="text-gray-400 text-xs italic">You leave with a named play and a time-bound next action.</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader className="pb-2 pt-5">
                <Badge className="bg-[#C0392B] text-white w-fit mb-2 text-xs">Coach Mode</Badge>
                <CardTitle className="text-base font-semibold">You need strategic guidance</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-gray-300 text-sm mb-3">Ask anything about your pipeline, your process, or how to handle a specific selling scenario. Direct answers grounded in the system.</p>
                <p className="text-gray-400 text-xs italic">You leave with clarity and a concrete next step.</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader className="pb-2 pt-5">
                <Badge className="bg-[#C0392B] text-white w-fit mb-2 text-xs">Mindset Mode</Badge>
                <CardTitle className="text-base font-semibold">The pressure is real</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-gray-300 text-sm mb-3">You lost a deal. You're in a slump. You're walking into the biggest close of the quarter. Get your head right before the moment arrives.</p>
                <p className="text-gray-400 text-xs italic">You leave grounded, refocused, and ready to compete.</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center text-sm text-gray-400 mb-6">
            One session = one message in, one coach response out. &nbsp;|&nbsp; 14 days or 100 sessions — full access to all three modes. No credit card required.
          </div>

          <div className="text-center">
            <a href={WAITLIST_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-[#C0392B] hover:bg-[#A93226] text-white px-8">Join the Waitlist</Button>
            </a>
          </div>
        </div>
      </section>

      {/* Section 6 — Pricing */}
      <section className="bg-[#F9F6F0] py-14" id="pricing">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8 max-w-xl mx-auto">
            <h2 className="font-['Playfair_Display'] text-3xl font-bold mb-2">RZS AI Coach — Simple Pricing. No Surprises.</h2>
            <p className="text-gray-600 text-sm">Every new RZS AI Coach user starts with a free trial — 14 days or 100 sessions, whichever comes first. Full access to all three modes. No credit card required.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-6">
            {/* Founding Member */}
            <Card className="relative overflow-hidden border-2 border-[#C0392B] shadow-lg">
              <div className="bg-[#C0392B] text-white text-center py-1.5 text-xs font-bold tracking-wider">FOUNDING MEMBER · 50 SPOTS ONLY</div>
              <CardHeader className="text-center pb-5 border-b border-gray-100">
                <CardTitle className="text-xl mb-1">Founding Member</CardTitle>
                <div className="flex justify-center items-end gap-1">
                  <span className="text-5xl font-bold text-[#1A1A1A]">$39</span>
                  <span className="text-gray-500 mb-1">/mo</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Locked in for life at this rate</p>
              </CardHeader>
              <CardContent className="pt-5">
                <ul className="space-y-3 mb-6 text-sm">
                  <li className="flex items-center gap-2 text-gray-700"><CheckCircle2 className="w-4 h-4 text-[#C0392B] flex-shrink-0" /> 100 sessions/month</li>
                  <li className="flex items-center gap-2 text-gray-700"><CheckCircle2 className="w-4 h-4 text-[#C0392B] flex-shrink-0" /> All three coaching modes</li>
                  <li className="flex items-center gap-2 text-gray-700"><CheckCircle2 className="w-4 h-4 text-[#C0392B] flex-shrink-0" /> Founding Member badge</li>
                  <li className="flex items-center gap-2 text-gray-700"><CheckCircle2 className="w-4 h-4 text-[#C0392B] flex-shrink-0" /> Priority access to new features</li>
                  <li className="flex items-center gap-2 text-gray-700"><CheckCircle2 className="w-4 h-4 text-[#C0392B] flex-shrink-0" /> Direct feedback line to Vince</li>
                </ul>
                <a href={WAITLIST_URL} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-[#C0392B] hover:bg-[#A93226] text-white">Join the Waitlist</Button>
                </a>
                <p className="text-center text-xs text-gray-400 mt-3">Reserved for beta users and waitlist members. Capped at 50 total.</p>
              </CardContent>
            </Card>

            {/* Pro */}
            <Card className="border border-gray-200 shadow-sm">
              <div className="bg-gray-100 text-gray-600 text-center py-1.5 text-xs font-bold tracking-wider">ALWAYS AVAILABLE</div>
              <CardHeader className="text-center pb-5 border-b border-gray-100">
                <CardTitle className="text-xl mb-1">Pro</CardTitle>
                <div className="flex justify-center items-end gap-1">
                  <span className="text-5xl font-bold text-[#1A1A1A]">$79</span>
                  <span className="text-gray-500 mb-1">/mo</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Full access, room to run</p>
              </CardHeader>
              <CardContent className="pt-5">
                <ul className="space-y-3 mb-6 text-sm">
                  <li className="flex items-center gap-2 text-gray-700"><CheckCircle2 className="w-4 h-4 text-gray-400 flex-shrink-0" /> 200 sessions/month</li>
                  <li className="flex items-center gap-2 text-gray-700"><CheckCircle2 className="w-4 h-4 text-gray-400 flex-shrink-0" /> All three coaching modes</li>
                  <li className="flex items-center gap-2 text-gray-700"><CheckCircle2 className="w-4 h-4 text-gray-400 flex-shrink-0" /> New features as they ship</li>
                </ul>
                <Button variant="outline" className="w-full">Get Started</Button>
                <p className="text-center text-xs text-gray-400 mt-3">One session = one message in, one coach response out. Cancel anytime. No contracts.</p>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-sm text-gray-500">
            Need team access? Team pricing available for sales orgs.{' '}
            <a href="#contact" className="text-[#C0392B] font-medium hover:underline">Start a Conversation →</a>
          </p>
        </div>
      </section>

      {/* Section 7 — Closing CTA */}
      <section className="bg-white py-14">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8 max-w-2xl mx-auto">
            <h2 className="font-['Playfair_Display'] text-3xl font-bold mb-2">Whatever you're working on — there's a way in.</h2>
            <p className="text-gray-600 text-base">Whether you're a seller trying to close a deal, a leader building a team that wins consistently, or an org that needs a system — Red Zone Selling has a starting point for you.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto mb-10">
            <Card className="bg-[#F9F6F0] border-none shadow-sm text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Start on your own</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-gray-600 text-sm mb-4">The book and RZS AI Coach are your fastest entry points. Learn the system, apply it immediately.</p>
              </CardContent>
              <CardFooter className="justify-center pb-6 flex-col gap-2">
                <a href="#" className="text-sm text-[#1A1A1A] font-medium hover:underline flex items-center gap-1">Get the Book <ArrowRight className="w-3 h-3" /></a>
                <a href={WAITLIST_URL} target="_blank" rel="noopener noreferrer" className="text-sm text-[#C0392B] font-medium hover:underline flex items-center gap-1">Join the AI Coach Waitlist <ArrowRight className="w-3 h-3" /></a>
              </CardFooter>
            </Card>

            <Card className="bg-[#F9F6F0] border-none shadow-sm text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Work with Vince</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-gray-600 text-sm mb-4">1:1 coaching, workshops, speaking, and fractional CRO engagements. Built around your situation.</p>
              </CardContent>
              <CardFooter className="justify-center pb-6">
                <a href="#contact" className="text-sm text-[#1A1A1A] font-medium hover:underline flex items-center gap-1">Start a Conversation <ArrowRight className="w-3 h-3" /></a>
              </CardFooter>
            </Card>

            <Card className="bg-[#F9F6F0] border-none shadow-sm text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Build your team</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-gray-600 text-sm mb-4">Coaching, workshops, system installation, and team AI access. Red Zone Selling across your whole org.</p>
              </CardContent>
              <CardFooter className="justify-center pb-6">
                <a href="#contact" className="text-sm text-[#1A1A1A] font-medium hover:underline flex items-center gap-1">Start a Conversation <ArrowRight className="w-3 h-3" /></a>
              </CardFooter>
            </Card>
          </div>

          <blockquote className="max-w-2xl mx-auto text-center border-t border-gray-100 pt-8">
            <p className="font-['Playfair_Display'] italic text-lg text-gray-700 mb-2">
              "There's no magic close. There's no secret script. There's just knowing where you are, what play to run, and having the discipline to execute it. That's what we build here."
            </p>
            <footer className="text-sm font-medium text-gray-500">Vince Beese, Sales Strength Coach</footer>
          </blockquote>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gray-50 py-14 border-t border-gray-200" id="contact">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="font-['Playfair_Display'] text-3xl font-bold mb-4">Get In Touch</h2>
              <p className="text-gray-600 mb-8">
                Whether you're ready to start or just have questions, reach out and we'll point you in the right direction.
              </p>
              <div className="space-y-5">
                <div className="flex items-center gap-4 text-gray-700">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100">
                    <Mail className="w-4 h-4 text-[#C0392B]" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Email</p>
                    <a href="mailto:vince@vincebeese.com" className="text-sm text-gray-600 hover:text-[#C0392B] transition-colors">vince@vincebeese.com</a>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-gray-700">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100">
                    <MessageSquare className="w-4 h-4 text-[#C0392B]" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Response Time</p>
                    <p className="text-sm text-gray-600">We typically respond within 24 hours.</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-sm">Name</Label>
                      <Input id="name" placeholder="John Doe" className="bg-gray-50 border-gray-200 text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="company" className="text-sm">Company</Label>
                      <Input id="company" placeholder="Acme Inc." className="bg-gray-50 border-gray-200 text-sm" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-sm">Email</Label>
                    <Input id="email" type="email" placeholder="john@company.com" className="bg-gray-50 border-gray-200 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="message" className="text-sm">Message</Label>
                    <Textarea id="message" placeholder="How can we help?" className="min-h-[100px] bg-gray-50 border-gray-200 text-sm" />
                  </div>
                  <Button className="w-full bg-[#C0392B] hover:bg-[#A93226]">Send Message</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dark Footer */}
      <footer className="bg-[#1A1A1A] text-white py-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6 border-b border-gray-800 pb-8">
            <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
              <span>RZS</span>
              <div className="w-2 h-2 rounded-full bg-[#C0392B]"></div>
            </div>
            <nav className="flex flex-wrap justify-center gap-6 text-sm font-medium text-gray-400">
              <a href="#coaching" className="hover:text-white transition-colors">Coaching</a>
              <a href="#ai-coach" className="hover:text-white transition-colors">AI Coach</a>
              <a href="#book" className="hover:text-white transition-colors">Book</a>
              <a href="#about" className="hover:text-white transition-colors">About</a>
              <a href="#contact" className="hover:text-white transition-colors">Contact</a>
            </nav>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-gray-500">
            <p>© 2026 Red Zone Selling™ | Built by Vince Beese | redzoneselling.co</p>
            <div className="flex gap-5">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
