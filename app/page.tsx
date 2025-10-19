// Landing Page - Public Marketing Page
'use client'
import Link from 'next/link'
import { CheckCircle2, AlertTriangle, DollarSign, FileCheck, Clock, Shield, TrendingUp, FileText, ChevronRight, ArrowRight, Zap, Target, Users } from 'lucide-react'
import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs'
import { Suspense } from 'react'

// Force dynamic rendering for Clerk components
export const dynamic = 'force-dynamic'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-50 via-cyan-50 to-teal-50 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div>
              <div className="inline-block mb-6">
                <span className="px-5 py-2.5 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold tracking-wide">
                  Proactive AI Risk Reduction Platform for Construction
                </span>
              </div>
              
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="px-4 py-2 bg-cyan-100 text-cyan-700 rounded-full text-sm font-semibold">
                  🚀 Early Access
                </span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 mb-8 tracking-tight leading-tight">
                Don't Sign a Contract Until You Know the Risks
              </h1>
              
              <p className="text-xl lg:text-2xl text-slate-600 mb-10 leading-relaxed font-normal">
                AI-powered contract analysis helps identify hidden risks, compliance gaps, and financial exposure in minutes—not weeks.
              </p>
              
              {/* Value Props */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <span className="text-slate-700">Catch risks that could cost you </span>
                    <span className="font-bold text-slate-900 text-lg">hundreds of thousands</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                  <div>
                    <span className="text-slate-700">Get analysis in </span>
                    <span className="font-bold text-slate-900 text-lg">minutes</span>
                    <span className="text-slate-600"> instead of hours of manual review</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-1" />
                  <div>
                    <span className="text-slate-700">Identify </span>
                    <span className="font-bold text-slate-900 text-lg">multiple compliance gaps</span>
                    <span className="text-slate-600"> against Australian Standards</span>
                  </div>
                </div>
              </div>
              
              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-5 mb-8">
                <Suspense fallback={<div className="px-10 py-4 bg-gray-200 animate-pulse rounded-xl"></div>}>
                  <SignedOut>
                    <SignInButton mode="modal">
                      <button className="px-10 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 group text-lg">
                        Analyze a Contract Free
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </SignInButton>
                  </SignedOut>
                </Suspense>
                <Suspense fallback={<div className="px-10 py-4 bg-gray-200 animate-pulse rounded-xl"></div>}>
                  <SignedIn>
                    <Link href="/upload" className="px-10 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 group text-lg">
                      Analyze a Contract Free
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
                  </SignedIn>
                </Suspense>
                <button 
                  onClick={() => {
                    const element = document.getElementById('how-it-works')
                    if (element) {
                      element.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                      })
                    }
                  }}
                  className="px-10 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all border-2 border-blue-600 flex items-center justify-center gap-3 text-lg hover:scale-105 transform"
                >
                  See how it works
                </button>
              </div>
              
              <p className="text-base text-slate-500 font-medium">
                ✨ Join construction professionals validating their contracts with AI
              </p>
              
            </div>
            
            {/* Right Column - Risk Dashboard Preview */}
            <div className="relative">
              
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">40-50 Arncliffe St - D&C Agreement</h3>
                    <p className="text-sm text-slate-500">Analysis completed 2 minutes ago</p>
                  </div>
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                    2 CRITICAL
                  </span>
        </div>
        
                {/* Critical Risks */}
                <div className="space-y-4 mb-6">
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-red-900">Unlimited Liability</h4>
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <p className="text-sm text-red-700 mb-2">
                      <span className="font-semibold">Location:</span> Section 8.3, Page 12
                    </p>
                    <p className="text-sm text-red-700 mb-2">
                      <span className="font-semibold">Potential exposure:</span> Unlimited
                    </p>
                    <p className="text-sm text-red-900 font-semibold">
                      💡 Recommendation: Cap at $2M
          </p>
        </div>
        
                  <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-orange-900">Liquidated Damages: $15k/day</h4>
                      <DollarSign className="w-5 h-5 text-orange-600" />
                    </div>
                    <p className="text-sm text-orange-700 mb-1">
                      <span className="font-semibold">Location:</span> Section 10.1, Page 18
                    </p>
                    <p className="text-sm text-orange-700 mb-2">
                      3x industry standard ($5k/day) • 30-day delay: <span className="font-bold">$450k</span>
                    </p>
                    <p className="text-sm text-orange-900 font-semibold">
                      💡 Recommendation: Reduce to $8k/day max
                    </p>
                  </div>
                </div>
                
                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">5</div>
                    <div className="text-xs text-slate-600">HIGH RISKS</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">8</div>
                    <div className="text-xs text-slate-600">MEDIUM</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-600">34</div>
                    <div className="text-xs text-slate-600">COMPLIANT</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Agitation Section */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl lg:text-6xl font-extrabold text-center text-slate-900 mb-20 tracking-tight">
            The Clause You Miss Will Cost You
          </h2>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-8">
                <span className="text-4xl">❌</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">The Mistake</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  Manual contract review takes 6+ hours
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  Easy to miss critical clauses
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  No way to benchmark against standards
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-8">
                <span className="text-4xl">💰</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">The Cost</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  Missed liquidated damages can cost hundreds of thousands
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  Unlimited liability clauses expose you to millions in risk
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  Many contracts contain non-compliant terms
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow">
              <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mb-8">
                <span className="text-4xl">😰</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">The Consequence</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                  Projects go over budget
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                  Disputes eat into profit margins
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                  Non-compliance risks legal penalties
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Security Message */}
      <section className="py-12 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-200">
            <div className="flex items-center justify-center gap-4 text-slate-700">
              <Shield className="w-8 h-8 text-green-600" />
              <div className="text-center">
                <p className="text-lg font-semibold text-slate-900">
                  We save your data securely, you can delete it anytime you want
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Process */}
      <section id="how-it-works" className="py-24 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Tenddr: Your AI Expert Team
            </h2>
            <p className="text-xl lg:text-2xl text-slate-600 font-normal">
              Upload your contract. Get a comprehensive risk analysis in minutes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            <div className="text-center relative">
              <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                <FileText className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Upload PDF</h3>
              <p className="text-lg text-slate-600">
                Drag & drop your contract or select from your files
              </p>
              {/* Connector Arrow */}
              <div className="hidden md:block absolute top-10 -right-4 text-blue-400">
                <ChevronRight className="w-8 h-8" />
              </div>
            </div>
            
            <div className="text-center relative">
              <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                <Zap className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">AI Analysis</h3>
              <p className="text-lg text-slate-600">
                AI analyzes multiple risk factors and compliance items
              </p>
              {/* Connector Arrow */}
              <div className="hidden md:block absolute top-10 -right-4 text-cyan-400">
                <ChevronRight className="w-8 h-8" />
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                <TrendingUp className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Risk Report</h3>
              <p className="text-lg text-slate-600">
                Critical risks, compliance gaps, financial impact + actionable recommendations
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <Suspense fallback={<div className="px-10 py-4 bg-gray-200 animate-pulse rounded-xl mx-auto w-32"></div>}>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="px-10 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all text-lg">
                    Try It Free
                  </button>
                </SignInButton>
              </SignedOut>
            </Suspense>
            <Suspense fallback={<div className="px-10 py-4 bg-gray-200 animate-pulse rounded-xl mx-auto w-32"></div>}>
              <SignedIn>
                <Link href="/upload" className="inline-block px-10 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all text-lg">
                  Try It Free
                </Link>
              </SignedIn>
            </Suspense>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-24 bg-gradient-to-r from-blue-50 via-cyan-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl lg:text-6xl font-extrabold text-center text-slate-900 mb-6 tracking-tight">
            Why Construction Teams Choose Us Over ChatGPT
          </h2>
          <p className="text-xl lg:text-2xl text-slate-600 text-center mb-20 max-w-4xl mx-auto font-normal">
            Effortlessly identify risks, ensure compliance, and make informed decisions with precision and clarity.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mb-8">
                <AlertTriangle className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                We Find Risks Proactively
              </h3>
              <p className="text-slate-600 mb-4">
                Proactive analysis of key risk factors—from liquidated damages to unlimited liability. No need to know what to ask.
              </p>
              <div className="text-sm font-semibold text-blue-600">
                Identifies multiple risks per contract automatically
              </div>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-8">
                <TrendingUp className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Know What's Normal vs Unusual
              </h3>
              <p className="text-slate-600 mb-4">
                Compare your contract terms against Australian Standards (AS 2124/4000) and industry benchmarks.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r text-sm">
                <div className="text-slate-700">Your contract: $15k/day LD</div>
                <div className="text-slate-700">Industry standard: $5-8k/day</div>
                <div className="font-bold text-blue-700">⚠️ 3x higher than normal</div>
              </div>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-cyan-100 rounded-2xl flex items-center justify-center mb-8">
                <DollarSign className="w-7 h-7 text-cyan-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Translate Legal Terms Into Dollars
              </h3>
              <p className="text-slate-600 mb-4">
                See the real cost of each clause—from cash flow impact to penalty exposure.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">30-day delay at $15k/day</span>
                  <span className="font-bold text-slate-900">$450k</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">5% retention on $2M</span>
                  <span className="font-bold text-slate-900">$100k held</span>
                </div>
              </div>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center mb-8">
                <CheckCircle2 className="w-7 h-7 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Check Australian Standards Compliance
              </h3>
              <p className="text-slate-600 mb-4">
                Helps verify compliance with AS 2124, AS 4000, Security of Payment Act, and WHS regulations.
              </p>
              <div className="text-sm font-semibold text-blue-600">
                Identifies potential compliance gaps automatically
              </div>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-8">
                <FileCheck className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Every Answer Has a Source
              </h3>
              <p className="text-slate-600 mb-4">
                Click any risk to see the exact clause, page number, and section reference.
              </p>
              <div className="bg-slate-50 p-3 rounded text-xs font-mono">
                <div>Risk: Unlimited Liability</div>
                <div>Source: Section 8.3, Page 12</div>
              </div>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-cyan-100 rounded-2xl flex items-center justify-center mb-8">
                <Target className="w-7 h-7 text-cyan-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Get Actionable Recommendations
              </h3>
              <p className="text-slate-600 mb-4">
                Not just 'what's wrong'—we tell you exactly what to negotiate and how.
              </p>
              <div className="bg-blue-50 p-3 rounded text-sm">
                <div className="font-semibold text-blue-900">💡 Recommendation:</div>
                <div className="text-blue-700">Negotiate cap at $8k/day maximum</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl lg:text-6xl font-extrabold text-center text-slate-900 mb-20 tracking-tight">
            How We Compare
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-2xl shadow-xl overflow-hidden">
              <thead>
                <tr className="border-b-2 border-slate-100">
                  <th className="text-left p-6 font-bold text-slate-900 text-lg">Feature</th>
                  <th className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 font-bold text-blue-900 text-lg">Tenddr</th>
                  <th className="text-center p-6 font-semibold text-slate-700 text-lg">ChatGPT/Claude</th>
                  <th className="text-center p-6 font-semibold text-slate-700 text-lg">Manual Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-6 font-semibold text-slate-900 text-base">Ease of Use</td>
                  <td className="p-6 text-center bg-gradient-to-br from-blue-50 to-cyan-50">
                    <div className="flex items-center justify-center gap-2">
                      <Zap className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold text-blue-900">No prompts required</span>
                    </div>
                  </td>
                  <td className="p-4 text-center text-slate-600">
                    Multiple prompts needed
                  </td>
                  <td className="p-4 text-center text-slate-600">
                    Manual keyword searching
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-900">Proactive Risk Detection</td>
                  <td className="p-4 text-center bg-blue-50">
                    <span className="text-green-600 font-bold">✅ Automatic checks</span>
                  </td>
                  <td className="p-4 text-center text-red-600">❌ Must know what to ask</td>
                  <td className="p-4 text-center text-yellow-600">⚠️ Depends on expertise</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-900">Industry Benchmarking</td>
                  <td className="p-4 text-center bg-blue-50">
                    <span className="text-green-600 font-bold">✅ AS standards + market data</span>
                  </td>
                  <td className="p-4 text-center text-red-600">❌ Generic knowledge</td>
                  <td className="p-4 text-center text-yellow-600">⚠️ If you have data</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-900">Financial Impact</td>
                  <td className="p-4 text-center bg-blue-50">
                    <span className="text-green-600 font-bold">✅ Dollar calculations</span>
                  </td>
                  <td className="p-4 text-center text-red-600">❌ Qualitative only</td>
                  <td className="p-4 text-center text-yellow-600">⚠️ Manual spreadsheets</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-900">Cost</td>
                  <td className="p-4 text-center bg-blue-50">
                    <span className="font-bold text-blue-900">Early access pricing</span>
                  </td>
                  <td className="p-4 text-center text-slate-600">$20/month</td>
                  <td className="p-4 text-center text-slate-600">Thousands per review</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="text-center mt-16">
            <Suspense fallback={<div className="px-10 py-4 bg-gray-200 animate-pulse rounded-xl mx-auto w-48"></div>}>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="px-10 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all text-lg">
                    See The Difference Yourself
                  </button>
                </SignInButton>
              </SignedOut>
            </Suspense>
            <Suspense fallback={<div className="px-10 py-4 bg-gray-200 animate-pulse rounded-xl mx-auto w-48"></div>}>
              <SignedIn>
                <Link href="/upload" className="inline-block px-10 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all text-lg">
                  See The Difference Yourself
                </Link>
              </SignedIn>
            </Suspense>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-20 bg-gradient-to-r from-blue-50 via-cyan-50 to-teal-50 text-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-4 text-slate-900">Built for Construction Professionals</h2>
            <p className="text-xl text-slate-700">Early access program - help us build the future of contract analysis</p>
          </div>
          <div className="grid md:grid-cols-4 gap-10 text-center">
            <div>
              <div className="text-6xl font-bold mb-4">⚡</div>
              <div className="text-slate-900 font-bold text-xl mb-2">Fast Analysis</div>
              <div className="text-base text-slate-600">Minutes, not hours</div>
            </div>
            <div>
              <div className="text-6xl font-bold mb-4">🎯</div>
              <div className="text-slate-900 font-bold text-xl mb-2">Targeted Insights</div>
              <div className="text-base text-slate-600">Construction-specific</div>
            </div>
            <div>
              <div className="text-6xl font-bold mb-4">🛡️</div>
              <div className="text-slate-900 font-bold text-xl mb-2">Risk Protection</div>
              <div className="text-base text-slate-600">Catch costly issues</div>
            </div>
            <div>
              <div className="text-6xl font-bold mb-4">📋</div>
              <div className="text-slate-900 font-bold text-xl mb-2">AU Standards</div>
              <div className="text-base text-slate-600">AS 2124 & AS 4000</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 bg-gradient-to-r from-blue-50 via-cyan-50 to-teal-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl lg:text-7xl font-extrabold text-slate-900 mb-8 tracking-tight">
            Don't Sign Another Risky Contract
          </h2>
          <p className="text-xl lg:text-2xl text-slate-600 mb-12 font-normal">
            Try our early access program—see what hidden risks are in your next contract. No credit card required.
          </p>
          
          <Suspense fallback={<div className="px-12 py-5 bg-gray-200 animate-pulse rounded-xl mb-12 mx-auto w-64"></div>}>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-12 py-5 bg-blue-600 text-white text-xl font-bold rounded-xl hover:bg-blue-700 transition-all mb-12 inline-flex items-center gap-3">
                  Analyze Your Contract Free
                  <ArrowRight className="w-6 h-6" />
                </button>
              </SignInButton>
            </SignedOut>
          </Suspense>
          <Suspense fallback={<div className="px-12 py-5 bg-gray-200 animate-pulse rounded-xl mb-12 mx-auto w-64"></div>}>
            <SignedIn>
              <Link href="/upload" className="inline-flex items-center gap-3 px-12 py-5 bg-blue-600 text-white text-xl font-bold rounded-xl hover:bg-blue-700 transition-all mb-12">
                Analyze Your Contract Free
                <ArrowRight className="w-6 h-6" />
              </Link>
            </SignedIn>
          </Suspense>
          
          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-base text-slate-600 font-medium">
            <div className="flex items-center justify-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Zap className="w-6 h-6 text-blue-600" />
              <span>Fast comprehensive analysis</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Shield className="w-6 h-6 text-cyan-600" />
              <span>Australian-based company</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Shield className="w-6 h-6 text-teal-600" />
              <span>Data encrypted & secure</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
