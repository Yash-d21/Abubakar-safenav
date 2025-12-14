'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { ShieldCheck, Map, Users, AlertTriangle, RadioTower, MessageSquareHeart } from 'lucide-react';

const features = [
  {
    icon: <Map className="w-8 h-8" />,
    name: 'Intelligent Safety Routing',
    description: 'Generates the safest routes by analyzing real-time crime data and avoiding high-risk zones.',
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    name: 'SOS Mode & Live Feed',
    description: 'Activate SOS to instantly share your live location, video, and audio with guardians and authorities.',
  },
  {
    icon: <AlertTriangle className="w-8 h-8" />,
    name: 'Hands-Free Distress Detection',
    description: 'AI passively monitors for distress sounds and sudden impacts, automatically triggering alerts when you can\'t.',
  },
  {
    icon: <RadioTower className="w-8 h-8" />,
    name: 'Proactive Hazard Alerts',
    description: 'Get real-time warnings about environmental hazards like extreme weather or public events on your route.',
  },
   {
    icon: <Users className="w-8 h-8" />,
    name: 'Guardian Network',
    description: 'Build a network of trusted contacts who are automatically notified in an emergency.',
  },
  {
    icon: <MessageSquareHeart className="w-8 h-8" />,
    name: 'Community Safety Feed',
    description: 'Stay informed with real-time, user-submitted safety updates from your local community.',
  },
];

export default function LandingPage() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <header className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <Logo className="w-8 h-8 text-white" />
           <span className="text-xl font-bold">SafeNav</span>
        </div>
        <nav>
          <Link href="/login">
            <Button variant="outline" className="text-white border-white hover:bg-gray-800 hover:text-white">
              Login
            </Button>
          </Link>
        </nav>
      </header>

      <main className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold font-headline leading-tight">
          Navigate Your World with <span className="text-primary">Confidence</span>.
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
          SafeNav is your personal safety co-pilot, using AI to provide intelligent routing, proactive alerts, and an instant connection to help when you need it most.
        </p>
        <div className="mt-8">
          <Link href="/signup">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </main>

      <section id="features" className="bg-gray-950/50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">A New Standard in Personal Safety</h2>
            <p className="mt-2 text-gray-400">Powered by cutting-edge AI and real-time data.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-800/50 rounded-lg p-6 flex flex-col items-start text-left hover:bg-gray-800 transition-colors duration-300">
                <div className="bg-primary/10 text-primary p-3 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.name}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
       <footer className="container mx-auto px-6 py-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} SafeNav. All rights reserved.</p>
       </footer>
    </div>
  );
}
