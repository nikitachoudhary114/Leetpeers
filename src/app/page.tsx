'use client';

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CHARACTER_AVATARS } from "@/components/CharacterAvatars";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Stats counter animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] overflow-hidden transition-colors duration-300">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 transition-opacity duration-500">
        <div className="absolute inset-0 bg-[var(--color-bg-primary)]" />
        <div
          className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
          style={{ transform: `translateY(${-scrollY * 0.15}px)` }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"
          style={{ transform: `translate(-50%, -50%) translateY(${scrollY * 0.05}px)` }}
        />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-4 bg-[var(--color-bg-primary)]/80 backdrop-blur-xl border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-all group-hover:scale-105">
              <span className="text-[var(--color-text-primary)] font-bold text-lg">L</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Leet<span className="text-indigo-400">Peers</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors text-sm font-medium">
              Features
            </Link>
            <Link href="#how-it-works" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors text-sm font-medium">
              How it Works
            </Link>
            <Link href="/auth/signin" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors text-sm font-medium">
              Sign In
            </Link>

            {/* Theme Toggle */}
            <ThemeToggle />

            <Link
              href="/auth/signup"
              className="bg-indigo-500 text-[var(--color-text-primary)] px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-indigo-600 transition-all hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-105"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Theme Toggle */}
          <div className="flex items-center gap-4 md:hidden">
            <ThemeToggle />
            <button className="p-2 text-[var(--color-text-muted)]">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 lg:px-12 pt-32 lg:pt-40 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl">
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-full px-4 py-2 mb-8 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
              </span>
              <span className="text-sm text-[var(--color-text-muted)]">Join 10,000+ developers leveling up</span>
            </div>

            {/* Headline with typing effect */}
            <h1
              className={`text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight mb-8 transition-all duration-700 delay-100 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <span className="text-[var(--color-text-primary)]">Master</span>
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                LeetCode
              </span>
              <br />
              <span className="text-[var(--color-text-primary)]">Together.</span>
            </h1>

            {/* Subheadline */}
            <p
              className={`text-xl md:text-2xl text-[var(--color-text-muted)] max-w-2xl mb-12 leading-relaxed transition-all duration-700 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Join elite study rooms, track your daily progress, and compete with peers.
              The social coding platform built for ambitious developers.
            </p>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <Link
                href="/auth/signup"
                className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-[var(--color-text-primary)] px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-indigo-500/30 transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10">Start Free Today</span>
                <svg className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] text-[var(--color-text-primary)] px-8 py-4 rounded-full font-semibold text-lg hover:bg-[var(--color-bg-hover)] transition-all hover:scale-105"
              >
                <PlayIcon className="w-5 h-5" />
                See How It Works
              </Link>
            </div>

            {/* Floating Avatars */}
            <div
              className={`flex items-center gap-4 mt-12 transition-all duration-700 delay-400 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex -space-x-3">
                {CHARACTER_AVATARS.slice(0, 5).map((avatar, i) => (
                  <div
                    key={avatar.id}
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatar.bgGradient} flex items-center justify-center text-lg ring-2 ring-[var(--color-bg-primary)] animate-float`}
                    style={{ animationDelay: `${i * 0.2}s` }}
                  >
                    {avatar.emoji}
                  </div>
                ))}
              </div>
              <div className="text-sm text-[var(--color-text-muted)]">
                <span className="text-[var(--color-text-primary)] font-semibold">500+</span> developers joined this week
              </div>
            </div>

            {/* Stats */}
            <div
              ref={statsRef}
              className={`flex flex-wrap gap-8 mt-16 pt-8 border-t border-[var(--color-border)] transition-all duration-700 delay-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <AnimatedStat value={50000} suffix="+" label="Problems Solved" visible={statsVisible} />
              <AnimatedStat value={1200} suffix="+" label="Active Rooms" visible={statsVisible} delay={100} />
              <AnimatedStat value={98} suffix="%" label="Success Rate" visible={statsVisible} delay={200} />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-[var(--color-border)] flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-[var(--color-text-muted)] rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 lg:px-12 py-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[var(--color-text-primary)]">
              Everything you need to
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"> level up</span>
            </h2>
            <p className="text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto">
              Powerful features designed to keep you consistent, motivated, and always improving.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<FireIcon />}
              iconGradient="from-orange-500 to-red-600"
              shadowColor="shadow-orange-500/25"
              title="Daily Streaks"
              description="Build unstoppable momentum with daily coding streaks. Never break the chain and watch your skills compound."
              delay={0}
            />
            <FeatureCard
              icon={<UsersIcon />}
              iconGradient="from-indigo-500 to-blue-600"
              shadowColor="shadow-indigo-500/25"
              title="Study Rooms"
              description="Create or join private rooms with friends. Set daily targets and hold each other accountable."
              delay={100}
            />
            <FeatureCard
              icon={<CheckIcon />}
              iconGradient="from-green-500 to-emerald-600"
              shadowColor="shadow-green-500/25"
              title="LeetCode Sync"
              description="Connect your LeetCode account and automatically track problems solved, contests, and rankings."
              delay={200}
            />
            <FeatureCard
              icon={<ChartIcon />}
              iconGradient="from-purple-500 to-pink-600"
              shadowColor="shadow-purple-500/25"
              title="Progress Analytics"
              description="Visualize your journey with detailed stats, graphs, and insights into your problem-solving patterns."
              delay={300}
            />
            <FeatureCard
              icon={<CodeIcon />}
              iconGradient="from-cyan-500 to-blue-600"
              shadowColor="shadow-cyan-500/25"
              title="Live Code Execution"
              description="Run and test your code directly in the browser with support for multiple programming languages."
              delay={400}
            />
            <FeatureCard
              icon={<VideoIcon />}
              iconGradient="from-amber-500 to-orange-600"
              shadowColor="shadow-amber-500/25"
              title="Video Calls"
              description="Collaborate in real-time with video calls, screen sharing, and voice chat in your study rooms."
              delay={500}
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="relative z-10 px-6 lg:px-12 py-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[var(--color-text-primary)]">
              Get started in
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"> 3 simple steps</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard number={1} title="Create Account" description="Sign up for free in seconds with your email or Google account." />
            <StepCard number={2} title="Link LeetCode" description="Connect your LeetCode profile to automatically sync your progress." />
            <StepCard number={3} title="Join a Room" description="Create or join a study room and start crushing problems together." />
          </div>
        </div>
      </section>

      {/* Character Avatars Showcase */}
      <section className="relative z-10 px-6 lg:px-12 py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">Express Yourself</h3>
          <p className="text-[var(--color-text-muted)]">Choose from 10 unique character avatars</p>
        </div>
        <div className="flex justify-center gap-6 flex-wrap">
          {CHARACTER_AVATARS.map((avatar, i) => (
            <div
              key={avatar.id}
              className={`w-16 h-16 rounded-full bg-gradient-to-br ${avatar.bgGradient} flex items-center justify-center text-2xl ring-4 ring-[var(--color-bg-primary)] hover:scale-110 transition-transform cursor-pointer animate-float`}
              style={{ animationDelay: `${i * 0.15}s` }}
              title={avatar.name}
            >
              {avatar.emoji}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 lg:px-12 py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-purple-700 shadow-2xl shadow-indigo-500/30 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-float" />
              <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-6 relative">
              Ready to level up?
            </h2>
            <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto relative">
              Join thousands of developers who are already crushing their coding goals with LeetPeers.
            </p>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 bg-white text-indigo-600 px-10 py-5 rounded-full font-bold text-lg hover:shadow-xl hover:shadow-white/20 transition-all duration-300 hover:scale-105 relative"
            >
              Get Started — It&apos;s Free
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 lg:px-12 py-12 border-t border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-[var(--color-text-primary)] font-bold text-sm">L</span>
            </div>
            <span className="font-bold text-[var(--color-text-primary)]">LeetPeers</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-[var(--color-text-muted)]">
            <Link href="/auth/signin" className="hover:text-[var(--color-text-primary)] transition-colors">Sign In</Link>
            <Link href="/auth/signup" className="hover:text-[var(--color-text-primary)] transition-colors">Sign Up</Link>
            <Link href="/dashboard" className="hover:text-[var(--color-text-primary)] transition-colors">Dashboard</Link>
            <Link href="/rooms" className="hover:text-[var(--color-text-primary)] transition-colors">Rooms</Link>
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">
            © 2026 LeetPeers. All rights reserved.
          </p>
        </div>
      </footer>

      {/* CSS for gradient animation */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// Animated stat component
function AnimatedStat({ value, suffix, label, visible, delay = 0 }: {
  value: number;
  suffix: string;
  label: string;
  visible: boolean;
  delay?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const counter = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(counter);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(counter);
    }, delay);

    return () => clearTimeout(timer);
  }, [visible, value, delay]);

  return (
    <div>
      <div className="text-4xl font-bold text-[var(--color-text-primary)]">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-[var(--color-text-muted)] mt-1">{label}</div>
    </div>
  );
}

// Feature card component
function FeatureCard({ icon, iconGradient, shadowColor, title, description, delay }: {
  icon: React.ReactNode;
  iconGradient: string;
  shadowColor: string;
  title: string;
  description: string;
  delay: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`group p-8 rounded-3xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] hover:border-indigo-500/50 transition-all duration-500 hover:-translate-y-2 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className={`w-14 h-14 bg-gradient-to-br ${iconGradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg ${shadowColor} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">{title}</h3>
      <p className="text-[var(--color-text-muted)] leading-relaxed">{description}</p>
    </div>
  );
}

// Step card component
function StepCard({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="text-center group">
      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/25 group-hover:scale-110 transition-transform">
        <span className="text-3xl font-bold text-[var(--color-text-primary)]">{number}</span>
      </div>
      <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">{title}</h3>
      <p className="text-[var(--color-text-muted)]">{description}</p>
    </div>
  );
}

// Icons
function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function FireIcon() {
  return (
    <svg className="w-7 h-7 text-[var(--color-text-primary)]" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="w-7 h-7 text-[var(--color-text-primary)]" fill="currentColor" viewBox="0 0 20 20">
      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-7 h-7 text-[var(--color-text-primary)]" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg className="w-7 h-7 text-[var(--color-text-primary)]" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg className="w-7 h-7 text-[var(--color-text-primary)]" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg className="w-7 h-7 text-[var(--color-text-primary)]" fill="currentColor" viewBox="0 0 20 20">
      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
    </svg>
  );
}
