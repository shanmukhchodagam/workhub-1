import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageCircle, Users, Shield, Clock, CheckCircle, AlertTriangle, BarChart3 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <div className="space-y-6 max-w-4xl">
          <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl text-blue-900">
            WorkHub Automation Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your frontline operations with AI-powered workflow automation. 
            Connect field workers with management through intelligent chat that automatically 
            handles tasks, incidents, permissions, and attendance tracking.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto gap-2 h-16 text-lg bg-blue-600 hover:bg-blue-700">
                Start Free Trial - Manager Account
                <ArrowRight size={16} />
              </Button>
            </Link>
            
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 h-16 text-lg border-blue-600 text-blue-600 hover:bg-blue-50">
                Sign In
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            ✨ No credit card required • Set up in 5 minutes • Free for teams under 10 workers
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How WorkHub Transforms Your Operations
            </h2>
            <p className="text-xl text-gray-600">
              Stop juggling spreadsheets, emails, and phone calls. Let AI handle the paperwork.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Natural Chat Interface</h3>
              <p className="text-gray-600">Workers simply type or speak naturally. "I need vacation days" or "There's a safety issue" - AI understands and acts.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Automated Task Management</h3>
              <p className="text-gray-600">Tasks are created, assigned, and tracked automatically. Workers report completion via chat, managers see real-time updates.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Instant Incident Reporting</h3>
              <p className="text-gray-600">Safety issues, equipment problems, or concerns are captured immediately with location and details automatically logged.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Smart Analytics Dashboard</h3>
              <p className="text-gray-600">Get insights on team performance, attendance patterns, and operational efficiency with automatically generated reports.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Problem/Solution Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Stop Playing Phone Tag with Your Team
              </h2>
              <div className="space-y-4 text-gray-600">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Workers avoid paperwork, leading to incomplete records</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Managers spend hours chasing status updates</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Critical incidents get delayed or forgotten</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Attendance tracking is manual and error-prone</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-blue-900 mb-6">
                WorkHub Makes It Effortless
              </h3>
              <div className="space-y-4 text-gray-600">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Workers chat naturally - no forms, no training needed</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>AI automatically creates records and updates status</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Incidents are logged instantly with full context</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Attendance tracked automatically via check-in messages</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              See WorkHub in Action
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to transform your team operations
            </p>
          </div>

          <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <h3 className="text-xl font-bold">Manager Sets Up Team</h3>
                </div>
                <p className="text-gray-600">Create your team, add workers with their email addresses. Each worker gets secure access to their personalized chat interface.</p>
              </div>
              <div className="flex-1 bg-gray-100 rounded-lg p-6">
                <div className="bg-white rounded p-4 border">
                  <div className="text-sm font-medium text-gray-500">Manager Dashboard</div>
                  <div className="mt-2 text-xs text-gray-400">✓ Added: John, Sarah, Mike</div>
                  <div className="text-xs text-gray-400">✓ Invites sent automatically</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <h3 className="text-xl font-bold">Workers Chat Naturally</h3>
                </div>
                <p className="text-gray-600">Workers use simple chat messages like "I'm starting my shift" or "Equipment needs repair" - AI understands intent and creates the right records.</p>
              </div>
              <div className="flex-1 bg-gray-100 rounded-lg p-6">
                <div className="bg-white rounded p-4 border space-y-2">
                  <div className="bg-blue-500 text-white p-2 rounded text-sm ml-8">I'm checking in for my shift</div>
                  <div className="bg-gray-200 p-2 rounded text-sm mr-8">✓ Attendance recorded for today</div>
                  <div className="bg-blue-500 text-white p-2 rounded text-sm ml-8">The forklift has a hydraulic leak</div>
                  <div className="bg-gray-200 p-2 rounded text-sm mr-8">📝 Incident #1247 created and assigned to maintenance</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <h3 className="text-xl font-bold">Managers Get Live Updates</h3>
                </div>
                <p className="text-gray-600">See real-time dashboard with all team activities, approve permissions, assign tasks, and track progress - all automated and organized.</p>
              </div>
              <div className="flex-1 bg-gray-100 rounded-lg p-6">
                <div className="bg-white rounded p-4 border">
                  <div className="text-sm font-medium text-gray-500">Live Dashboard</div>
                  <div className="mt-2 space-y-1 text-xs">
                    <div className="text-green-600">🟢 8/10 workers checked in</div>
                    <div className="text-orange-600">🟡 3 pending permissions</div>
                    <div className="text-red-600">🔴 1 new safety incident</div>
                    <div className="text-blue-600">📋 5 tasks completed today</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Simple, Transparent Pricing
          </h2>
          
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <div className="text-4xl font-bold text-blue-600 mb-4">Free</div>
            <p className="text-gray-600 mb-6">For teams with up to 10 workers</p>
            
            <ul className="text-left space-y-3 text-gray-600 mb-8">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Unlimited chat interactions</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Task management & tracking</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Incident reporting & management</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Attendance tracking</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Permission request workflows</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Real-time dashboard</span>
              </li>
            </ul>

            <Link href="/register">
              <Button size="lg" className="w-full gap-2 h-12 bg-blue-600 hover:bg-blue-700">
                Start Your Free Account
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>

          <p className="text-gray-500 mt-6 text-sm">
            Need more than 10 workers? <a href="mailto:contact@workhub.com" className="text-blue-600 hover:underline">Contact us</a> for enterprise pricing.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Team Operations?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join forward-thinking managers who've eliminated paperwork and improved team communication with WorkHub's AI automation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto gap-2 h-16 text-lg bg-white text-blue-600 hover:bg-gray-100">
                Create Manager Account - Free
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
          
          <p className="text-blue-200 mt-4 text-sm">
            ⚡ Setup takes 5 minutes • No credit card required • Cancel anytime
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="py-8 bg-gray-900 text-gray-400">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p>&copy; 2024 WorkHub. Built for frontline teams.</p>
        </div>
      </div>
    </div>
  );
}
