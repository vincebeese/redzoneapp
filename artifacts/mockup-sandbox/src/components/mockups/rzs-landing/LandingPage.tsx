import React from 'react';
import { ArrowRight, CheckCircle2, ChevronRight, MessageSquare, Play, Shield, Target, Trophy, Users, Zap, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F9F6F0] font-['Inter'] text-[#1A1A1A] selection:bg-[#C0392B] selection:text-white">
      {/* 2. Beta Status Bar */}
      <div className="bg-[#1A1A1A] text-white py-2 px-4 text-sm flex justify-center items-center gap-4 relative z-50">
        <p>🚀 Red Zone Selling Coach is in active beta — limited spots available.</p>
        <a href="#pricing" className="text-[#C0392B] font-medium hover:underline flex items-center">
          Join Waitlist <ArrowRight className="ml-1 w-3 h-3" />
        </a>
      </div>

      {/* 1. Sticky Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <span>RZS</span>
            <div className="w-2 h-2 rounded-full bg-[#C0392B]"></div>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#coaching" className="hover:text-[#1A1A1A] transition-colors">Coaching</a>
            <a href="#ai-coach" className="hover:text-[#1A1A1A] transition-colors">AI Coach</a>
            <a href="#book" className="hover:text-[#1A1A1A] transition-colors">Book</a>
            <a href="#about" className="hover:text-[#1A1A1A] transition-colors">About</a>
            <a href="#contact" className="hover:text-[#1A1A1A] transition-colors">Contact</a>
          </nav>
          <div>
            <Button className="bg-[#C0392B] hover:bg-[#A93226] text-white">Go to App</Button>
          </div>
        </div>
      </header>

      {/* 3. Hero Section */}
      <section className="bg-[#F9F6F0] pt-20 pb-24 lg:pt-32 lg:pb-40 overflow-hidden relative">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <Badge variant="outline" className="text-[#C0392B] border-[#C0392B] mb-6 font-semibold tracking-wider text-xs">
                BETA — FOUNDING MEMBER PRICING
              </Badge>
              <h1 className="font-['Playfair_Display'] text-5xl lg:text-6xl font-bold leading-tight mb-6 text-[#1A1A1A]">
                Sellers with structured coaching programs win <span className="text-[#C0392B]">28% more deals.</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Red Zone Selling Coach gives you the system, the AI, and the expert guidance top performers use to crush quota.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <Button size="lg" className="bg-[#C0392B] hover:bg-[#A93226] text-white text-base h-14 px-8">
                  Try the AI Coach Free
                </Button>
                <Button size="lg" variant="outline" className="border-gray-300 hover:bg-gray-100 text-[#1A1A1A] text-base h-14 px-8">
                  See Pricing
                </Button>
              </div>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Shield className="w-4 h-4" /> No credit card required · Cancel anytime
              </p>
            </div>
            
            <div className="relative lg:ml-auto w-full max-w-lg">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#C0392B]/20 to-transparent blur-3xl rounded-full"></div>
              <Card className="bg-[#1A1A1A] text-white border-gray-800 shadow-2xl relative z-10 overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#C0392B] to-orange-500"></div>
                <CardHeader className="border-b border-gray-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C0392B] to-red-900 flex items-center justify-center">
                      <span className="font-bold text-xs">RZS</span>
                    </div>
                    <div>
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        RZS AI Coach
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C0392B]"></span>
                        </span>
                      </CardTitle>
                      <CardDescription className="text-gray-400 text-xs">Active now</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-gray-800 flex-shrink-0 mt-1 flex items-center justify-center text-[10px]">RZS</div>
                    <div className="bg-gray-800 rounded-2xl rounded-tl-sm p-4 text-sm text-gray-200">
                      Walk me through your last deal that stalled. What happened at the 'presentation' stage?
                    </div>
                  </div>
                  <div className="flex gap-4 flex-row-reverse">
                    <div className="w-6 h-6 rounded-full bg-[#C0392B] flex-shrink-0 mt-1 flex items-center justify-center text-[10px]">You</div>
                    <div className="bg-[#C0392B]/20 border border-[#C0392B]/30 rounded-2xl rounded-tr-sm p-4 text-sm text-white">
                      They loved the demo but went quiet after I sent the proposal...
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-gray-800 flex-shrink-0 mt-1 flex items-center justify-center text-[10px]">RZS</div>
                    <div className="bg-gray-800 rounded-2xl rounded-tl-sm p-4 text-sm text-gray-200 border border-gray-700">
                      Classic Red Zone stall. Let's run a deal autopsy — I'll show you exactly where and why it stalled.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Vince & The Problem Section */}
      <section className="bg-white py-24" id="about">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-['Playfair_Display'] text-4xl font-bold mb-6">Most Sellers Are Left to Figure It Out Alone</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              "No consistent framework. Sporadic coaching. Gut-feel decisions on deals that should be won. I've seen it over 20 years of sales leadership — and I built Red Zone Selling Coach to change that."
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-gray-100 mb-16">
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-[#1A1A1A]">20+ Years</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Sales Leadership</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-[#1A1A1A]">$50M+</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Revenue Led</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-[#1A1A1A]">Top 1%</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Consistent Performer</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-[#1A1A1A]">500+</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Sellers Coached</div>
            </div>
          </div>

          <blockquote className="max-w-4xl mx-auto bg-[#F9F6F0] p-10 rounded-2xl border-l-4 border-[#C0392B] relative">
            <div className="absolute top-4 left-4 text-6xl text-[#C0392B]/10 font-serif leading-none">"</div>
            <p className="text-2xl font-['Playfair_Display'] italic text-[#1A1A1A] mb-6 relative z-10">
              You don't need more leads. You need a system that turns the leads you have into closed deals.
            </p>
            <footer className="font-medium text-gray-600 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                {/* Fallback avatar */}
                <div className="w-full h-full bg-[#1A1A1A] flex items-center justify-center text-white text-xs">VD</div>
              </div>
              — Vince DeCrow, Founder
            </footer>
          </blockquote>
        </div>
      </section>

      {/* 5. The System — Three Zones */}
      <section className="bg-[#F9F6F0] py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-[#C0392B] font-bold tracking-widest text-sm uppercase mb-4 block">The System</span>
            <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl font-bold">Every sale lives in one of three zones.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {/* Yellow Zone */}
            <Card className="bg-white border-none shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400"></div>
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                    <Target className="w-6 h-6" />
                  </div>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-600">Top of Funnel</Badge>
                </div>
                <CardTitle className="text-xl">Yellow Zone</CardTitle>
                <CardDescription className="font-medium text-[#1A1A1A]">Prospect & Pipeline</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Building the pipeline you need to hit your number. Targeting, outreach, and opportunity creation.</p>
              </CardContent>
            </Card>

            {/* Green Zone */}
            <Card className="bg-white border-none shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-600">Mid Funnel</Badge>
                </div>
                <CardTitle className="text-xl">Green Zone</CardTitle>
                <CardDescription className="font-medium text-[#1A1A1A]">Advance & Qualify</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Moving deals forward with precision. Discovery, qualification, and deal strategy.</p>
              </CardContent>
            </Card>

            {/* Red Zone */}
            <Card className="bg-white border-2 border-[#C0392B]/20 shadow-xl relative overflow-hidden group scale-105 z-10">
              <div className="absolute top-0 left-0 w-full h-2 bg-[#C0392B]"></div>
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#C0392B]/10 flex items-center justify-center text-[#C0392B]">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <Badge className="bg-[#C0392B] hover:bg-[#A93226] text-white">Bottom of Funnel</Badge>
                </div>
                <CardTitle className="text-xl">Red Zone</CardTitle>
                <CardDescription className="font-medium text-[#C0392B]">Close & Win</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">The final push. Negotiation, objection handling, and winning the deal.</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-xl font-medium inline-block relative">
              The RZS AI Coach helps you in all three.
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-[#C0392B] rounded-full opacity-50"></span>
            </p>
          </div>
        </div>
      </section>

      {/* 6. Ways to Work Together */}
      <section className="bg-white py-24" id="coaching">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-['Playfair_Display'] text-4xl font-bold mb-4">Ways to Work Together</h2>
            <p className="text-xl text-gray-600">Every path leads to the same result: more closed deals.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Card 1 */}
            <Card className="border-[#C0392B] shadow-md relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge className="bg-[#C0392B] hover:bg-[#C0392B]">Most Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">RZS AI Coach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">Your 24/7 AI sales coach. Real talk coaching, deal reviews, call analysis, and rep development — always on.</p>
                <Button className="w-full bg-[#C0392B] hover:bg-[#A93226]">Try Free</Button>
              </CardContent>
            </Card>

            {/* Card 2 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">1:1 Executive Coaching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">Private coaching with Vince. Strategic guidance for sales leaders and AEs closing complex deals.</p>
                <Button variant="outline" className="w-full">Book a Call</Button>
              </CardContent>
            </Card>

            {/* Card 3 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Deal Review Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">Bring your real deals. Get real feedback. 60-min working sessions on your active pipeline.</p>
                <Button variant="outline" className="w-full">Learn More</Button>
              </CardContent>
            </Card>

            {/* Card 4 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Sales Team Workshops</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">Half-day and full-day workshops for sales teams — process, mindset, and the Red Zone system.</p>
                <Button variant="outline" className="w-full">Learn More</Button>
              </CardContent>
            </Card>

            {/* Card 5 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Team Coaching Programs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">Ongoing coaching programs for sales teams. Weekly sessions, deal reviews, and rep development.</p>
                <Button variant="outline" className="w-full">Learn More</Button>
              </CardContent>
            </Card>

            {/* Card 6 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Keynotes & Speaking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">High-energy keynotes for sales kickoffs, conferences, and leadership summits.</p>
                <Button variant="outline" className="w-full">Learn More</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 7. RZS AI Coach — Three Modes */}
      <section className="bg-[#1A1A1A] text-white py-24 relative overflow-hidden" id="ai-coach">
        {/* Background texture via image */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img src="/__mockup/images/rzs-hero-bg.png" alt="" className="w-full h-full object-cover" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl font-bold mb-6">The AI Coach That Coaches Like Vince</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
            <Card className="bg-white/5 border-white/10 text-white backdrop-blur-sm hover:bg-white/10 transition-colors">
              <CardHeader>
                <Zap className="w-8 h-8 text-[#C0392B] mb-4" />
                <CardTitle className="text-xl">Real Talk Mode</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Straight-up, no-BS feedback on your deals, your pipeline, and your performance.</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 text-white backdrop-blur-sm hover:bg-white/10 transition-colors">
              <CardHeader>
                <Target className="w-8 h-8 text-[#C0392B] mb-4" />
                <CardTitle className="text-xl">Deal Autopsy Mode</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Break down why deals stall or die. Identify the moment everything went sideways.</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 text-white backdrop-blur-sm hover:bg-white/10 transition-colors">
              <CardHeader>
                <Trophy className="w-8 h-8 text-[#C0392B] mb-4" />
                <CardTitle className="text-xl">Rep Development Mode</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Track your patterns, build better habits, and level up your close rate over time.</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center bg-white/5 border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto backdrop-blur-md">
            <p className="text-xl mb-6">Start with the AI Coach — <span className="font-bold text-[#C0392B]">Founding Member $39/mo</span></p>
            <Button size="lg" className="bg-[#C0392B] hover:bg-[#A93226] text-white px-8">Get Started</Button>
          </div>
        </div>
      </section>

      {/* 8. Pricing */}
      <section className="bg-[#F9F6F0] py-24" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-['Playfair_Display'] text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
            {/* Founding Member */}
            <Card className="relative overflow-hidden border-2 border-[#C0392B] shadow-xl">
              <div className="absolute top-0 right-0 bg-[#C0392B] text-white text-xs font-bold px-3 py-1 rounded-bl-lg">BETA PRICING</div>
              <CardHeader className="text-center pb-8 border-b border-gray-100">
                <CardTitle className="text-2xl mb-2">Founding Member</CardTitle>
                <div className="flex justify-center items-end gap-2">
                  <span className="text-5xl font-bold text-[#1A1A1A]">$39</span>
                  <span className="text-gray-500 mb-1">/mo</span>
                </div>
                <p className="text-sm text-gray-500 line-through mt-1">was $79</p>
              </CardHeader>
              <CardContent className="pt-8">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-gray-600"><CheckCircle2 className="w-5 h-5 text-[#C0392B]" /> Full AI Coach access</li>
                  <li className="flex items-center gap-3 text-gray-600"><CheckCircle2 className="w-5 h-5 text-[#C0392B]" /> Unlimited deal reviews</li>
                  <li className="flex items-center gap-3 text-gray-600"><CheckCircle2 className="w-5 h-5 text-[#C0392B]" /> All 3 coaching modes</li>
                  <li className="flex items-center gap-3 text-gray-600"><CheckCircle2 className="w-5 h-5 text-[#C0392B]" /> Priority beta support</li>
                </ul>
                <Button className="w-full bg-[#C0392B] hover:bg-[#A93226] text-white py-6 text-lg">Start Free Trial</Button>
                <p className="text-center text-sm text-gray-500 mt-4 font-medium">Lock in this rate forever.</p>
              </CardContent>
            </Card>

            {/* Pro */}
            <Card className="mt-4 md:mt-0 opacity-80 hover:opacity-100 transition-opacity">
              <CardHeader className="text-center pb-8 border-b border-gray-100">
                <CardTitle className="text-2xl mb-2">Pro</CardTitle>
                <div className="flex justify-center items-end gap-2">
                  <span className="text-5xl font-bold text-[#1A1A1A]">$79</span>
                  <span className="text-gray-500 mb-1">/mo</span>
                </div>
              </CardHeader>
              <CardContent className="pt-8">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-gray-600"><CheckCircle2 className="w-5 h-5 text-gray-400" /> Everything in Founding</li>
                  <li className="flex items-center gap-3 text-gray-600"><CheckCircle2 className="w-5 h-5 text-gray-400" /> 1 group coaching session/mo</li>
                  <li className="flex items-center gap-3 text-gray-600"><CheckCircle2 className="w-5 h-5 text-gray-400" /> Advanced analytics</li>
                  <li className="flex items-center gap-3 text-gray-600"><CheckCircle2 className="w-5 h-5 text-gray-400" /> Early access to new features</li>
                </ul>
                <Button variant="outline" className="w-full py-6 text-lg">Get Started</Button>
              </CardContent>
            </Card>
          </div>
          
          <p className="text-center text-gray-500 font-medium">All plans include a 7-day free trial. No credit card required.</p>
        </div>
      </section>

      {/* 9. Closing CTA */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-['Playfair_Display'] text-4xl font-bold">Ready to Close More Deals?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="text-center flex flex-col h-full bg-[#F9F6F0] border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Try the AI Coach</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-gray-600">Start your free 7-day trial. No credit card required.</p>
              </CardContent>
              <CardFooter className="justify-center pb-8">
                <Button className="bg-[#C0392B] hover:bg-[#A93226]">Start Free <ArrowRight className="ml-2 w-4 h-4" /></Button>
              </CardFooter>
            </Card>

            <Card className="text-center flex flex-col h-full bg-[#F9F6F0] border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Work with Vince</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-gray-600">Book a private coaching session or team workshop.</p>
              </CardContent>
              <CardFooter className="justify-center pb-8">
                <Button variant="outline" className="bg-white">Book a Call <ArrowRight className="ml-2 w-4 h-4" /></Button>
              </CardFooter>
            </Card>

            <Card className="text-center flex flex-col h-full bg-[#F9F6F0] border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Talk to a Human</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-gray-600">Questions? We'll get you pointed in the right direction.</p>
              </CardContent>
              <CardFooter className="justify-center pb-8">
                <Button variant="outline" className="bg-white">Contact Us <ArrowRight className="ml-2 w-4 h-4" /></Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* 10. Contact Section */}
      <section className="bg-[#F9F6F0] py-24 border-t border-gray-200" id="contact">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="font-['Playfair_Display'] text-4xl font-bold mb-6">Get In Touch</h2>
              <p className="text-xl text-gray-600 mb-10">
                Whether you're ready to start or just have questions, reach out and we'll point you in the right direction.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-gray-700">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <Mail className="w-5 h-5 text-[#C0392B]" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <a href="mailto:vince@redzoneselling.com" className="hover:text-[#C0392B] transition-colors">vince@redzoneselling.com</a>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-gray-700">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <MessageSquare className="w-5 h-5 text-[#C0392B]" />
                  </div>
                  <div>
                    <p className="font-medium">Response Time</p>
                    <p className="text-sm">We typically respond within 24 hours.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Card className="bg-white border-none shadow-lg">
              <CardContent className="p-8">
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="John Doe" className="bg-gray-50 border-gray-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@company.com" className="bg-gray-50 border-gray-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="How can we help?" className="min-h-[120px] bg-gray-50 border-gray-200" />
                  </div>
                  <Button className="w-full bg-[#C0392B] hover:bg-[#A93226]">Send Message</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 11. Dark Footer */}
      <footer className="bg-[#1A1A1A] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8 border-b border-gray-800 pb-12">
            <div className="flex items-center gap-2 font-bold text-2xl tracking-tight">
              <span>RZS</span>
              <div className="w-2 h-2 rounded-full bg-[#C0392B]"></div>
            </div>
            
            <nav className="flex flex-wrap justify-center gap-8 text-sm font-medium text-gray-400">
              <a href="#coaching" className="hover:text-white transition-colors">Coaching</a>
              <a href="#ai-coach" className="hover:text-white transition-colors">AI Coach</a>
              <a href="#book" className="hover:text-white transition-colors">Book</a>
              <a href="#about" className="hover:text-white transition-colors">About</a>
              <a href="#contact" className="hover:text-white transition-colors">Contact</a>
            </nav>
            
            <Button className="bg-[#C0392B] hover:bg-[#A93226] text-white border-none">Go to App</Button>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© 2025 Red Zone Selling Coach. All rights reserved.</p>
            <p className="font-['Playfair_Display'] italic text-gray-400 text-lg">"Built for sellers who are serious about closing."</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
