import React, { useState } from "react";
import {
  Sparkles,
  Zap,
  Image,
  Download,
  TrendingUp,
  Clock,
  Palette,
  ArrowRight,
  Check,
  Star,
  Upload,
  Wand2,
} from "lucide-react";
import { useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import { useNavigate } from "react-router-dom";
import logoImg from "../assets/visura-logo.png";
import thumbnail1 from "../assets/thumbnail1.png";
import thumbnail2 from "../assets/thumbnail2.png";
import thumbnail3 from "../assets/thumbnail3.png";
import thumbnail4 from "../assets/thumbnail4.png";

export default function LandingPage() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredStyle, setHoveredStyle] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigateTo = useNavigate();

  const [thumbnails, setThumbnails] = useState([
    // Sample thumbnails for display purposes
    { id: 1, url: thumbnail1 },
    { id: 2, url: thumbnail2 },
    { id: 3, url: thumbnail3 },
    { id: 4, url: thumbnail4 },

  ])
  

  //to check if the token is present in the local storage by calling backend api
  useEffect(() => {
    async function checkLoginStatus() {
      try {
        const { data } = await axios.get(API_ENDPOINTS.CHECK_LOGIN, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });

        setIsLoggedIn(data.loggedIn);
        setUserData(data.user || null);
      } catch (error) {
        return;
      }
    }

    checkLoginStatus();
  }, []);

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-[#0D1117]/80 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            <img
              src={logoImg}
              alt="Visura Logo"
              className="h-6 sm:h-7"
            />
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <a
              href="#features"
              className="text-gray-400 hover:text-white transition text-sm lg:text-base"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-gray-400 hover:text-white transition text-sm lg:text-base"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="text-gray-400 hover:text-white transition text-sm lg:text-base"
            >
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              className={` ${
                isLoggedIn ? "hidden" : "hidden sm:block"
              } text-gray-400 hover:text-white transition text-sm lg:text-base`}
              onClick={() => navigateTo('/signup')}
            >
              Sign Up
            </button>
            <button
              onClick={() => {
                isLoggedIn
                  ? navigateTo("/thumbnail-generation" , {state: {userData}})
                  : navigateTo("/login");
              }}
              className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-sm sm:text-base font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Text */}
            <div className="space-y-6 sm:space-y-8">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#161B22] rounded-full border border-purple-500/30">
                <Sparkles className="w-3 sm:w-4 h-3 sm:h-4 text-purple-400" />
                <span className="text-xs sm:text-sm text-gray-300">
                  AI-Powered Design Tool
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                Create Click-Worthy
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  {" "}
                  Thumbnails{" "}
                </span>
                in Seconds
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-gray-400 leading-relaxed">
                No Photoshop. No design skills. Just describe what you want and
                get professional, high-CTR thumbnails powered by AI.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={() => {
                    isLoggedIn
                      ? navigateTo("/thumbnail-generation" , {state: {userData}})
                      : navigateTo("/login");
                  }}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-bold text-base sm:text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition flex items-center justify-center gap-2"
                >
                  Start Creating Free
                  <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 lg:gap-8 pt-2 sm:pt-4">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-white">50K+</div>
                  <div className="text-xs sm:text-sm text-gray-400">
                    Thumbnails Created
                  </div>
                </div>
                <div className="w-px h-10 sm:h-12 bg-gray-700"></div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-white">4.9/5</div>
                  <div className="text-xs sm:text-sm text-gray-400 flex items-center gap-1">
                    <Star className="w-3 sm:w-4 h-3 sm:h-4 fill-yellow-400 text-yellow-400" />
                    Rating
                  </div>
                </div>
                <div className="w-px h-10 sm:h-12 bg-gray-700"></div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-white">10x</div>
                  <div className="text-xs sm:text-sm text-gray-400">Faster Creation</div>
                </div>
              </div>
            </div>

            {/* Right: Example Thumbnails */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {thumbnails.map((item) => (
                  <div
                    key={item.id}
                    className="aspect-video bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-2xl backdrop-blur-sm hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300"
                    style={{
                      transform:
                        hoveredCard === item
                          ? "translateY(-8px)"
                          : "translateY(0)",
                    }}
                    onMouseEnter={() => setHoveredCard(item)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <img className="w-full h-full flex items-center rounded-md justify-center text-gray-600" src={item.url} alt="Thumbnail example" />
                      
                  </div>
                ))}
              </div>

              {/* Floating Glow Effects */}
              <div className="absolute -z-10 top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
              <div className="absolute -z-10 bottom-1/4 right-1/4 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-[#161B22]/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
              How It Works
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-400">
              Three simple steps to perfect thumbnails
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                step: "01",
                icon: <Upload className="w-8 h-8" />,
                title: "Upload Your Assets",
                description:
                  "Add your face, logo, or brand elements once. We'll blend them perfectly into every thumbnail.",
              },
              {
                step: "02",
                icon: <Wand2 className="w-8 h-8" />,
                title: "Describe & Enhance",
                description:
                  "Type what you want or pick a style. Our AI enhances your prompt for maximum impact.",
              },
              {
                step: "03",
                icon: <Download className="w-8 h-8" />,
                title: "Generate & Download",
                description:
                  "Get thumbnail instantly. Choose and export in the perfect size.",
              },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="bg-[#161B22] rounded-3xl p-8 border border-gray-800 hover:border-purple-500/50 transition-all duration-300 h-full">
                  <div className="text-6xl font-bold text-gray-800 mb-4">
                    {item.step}
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-purple-500 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
              Everything You Need
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-400">
              Powerful features designed for creators
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Lightning Fast",
                description:
                  "Generate professional thumbnails in seconds, not hours",
              },
              {
                icon: <Palette className="w-6 h-6" />,
                title: "AI-Powered Design",
                description:
                  "No design skills needed. Just describe what you want",
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: "CTR Optimized",
                description:
                  "Built for clicks with high-contrast, eye-catching visuals",
              },
              {
                icon: <Image className="w-6 h-6" />,
                title: "Brand Consistency",
                description: "Upload your face, logo, and brand assets once",
              },
              {
                icon: <Download className="w-6 h-6" />,
                title: "Multi-Format Export",
                description: "Perfect sizes for YouTube, Shorts, and Reels",
              },
              {
                icon: <Clock className="w-6 h-6" />,
                title: "Save Hours Weekly",
                description:
                  "Stop wrestling with Photoshop and Canva templates",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-[#161B22] rounded-2xl p-8 border border-gray-800 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mb-6 text-purple-400">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Style Presets Preview */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-[#161B22]/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
              One-Click Style Presets
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-400">
              Choose from professionally designed templates
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {[
              { name: "Gaming Rage", color: "from-red-500 to-orange-500" },
              { name: "Minimal Doc", color: "from-gray-500 to-gray-700" },
              { name: "Tech Review", color: "from-blue-500 to-cyan-500" },
              { name: "Reaction", color: "from-yellow-500 to-pink-500" },
              { name: "Lifestyle", color: "from-green-500 to-teal-500" },
            ].map((style, idx) => (
              <div
                key={idx}
                className="relative group cursor-pointer"
                onMouseEnter={() => setHoveredStyle(idx)}
                onMouseLeave={() => setHoveredStyle(null)}
              >
                <div
                  className={`aspect-video bg-gradient-to-br ${
                    style.color
                  } rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-bold text-xs sm:text-sm lg:text-base transition-all duration-300 ${
                    hoveredStyle === idx ? "scale-105 shadow-2xl" : ""
                  }`}
                >
                  {style.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
              Loved by Creators
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-400">
              See what our users are saying
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                name: "Alex Rivera",
                role: "Gaming YouTuber",
                content:
                  "My CTR went from 4% to 12% after switching to these thumbnails. Absolute game changer!",
                avatar: "AR",
              },
              {
                name: "Sarah Chen",
                role: "Tech Reviewer",
                content:
                  "I was spending 2 hours per thumbnail. Now it takes me 2 minutes. The AI understands exactly what works.",
                avatar: "SC",
              },
              {
                name: "Mike Johnson",
                role: "Lifestyle Vlogger",
                content:
                  "Finally, a tool that gets my brand aesthetic right every single time. No more design headaches.",
                avatar: "MJ",
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-[#161B22] rounded-2xl p-8 border border-gray-800"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-400">
              Choose the plan that fits your needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <div className="bg-[#161B22] rounded-2xl p-8 border border-gray-800 hover:border-gray-700 transition-all">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <p className="text-gray-400 text-sm">Perfect for trying out</p>
              </div>
              <div className="mb-6">
                <div className="text-4xl font-bold mb-1">$0</div>
                <div className="text-gray-400 text-sm">Forever free</div>
              </div>
              <button className="w-full px-6 py-3 bg-[#0D1117] border border-gray-800 rounded-xl font-semibold hover:bg-[#1c2128] transition">
                Get Started
              </button>
              <ul className="mt-8 space-y-4">
                {[
                  "1 thumbnail per month",
                  "Basic style presets",
                  "Standard quality export"
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-2xl p-8 border-2 border-purple-500 relative overflow-hidden">
              <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-bold">
                POPULAR
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <p className="text-gray-400 text-sm">For serious creators</p>
              </div>
              <div className="mb-6">
                <div className="text-4xl font-bold mb-1">$19</div>
                <div className="text-gray-400 text-sm">per month</div>
              </div>
              <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold hover:shadow-xl hover:shadow-purple-500/50 transition">
                Start Free Trial
              </button>
              <ul className="mt-8 space-y-4">
                {[
                  "100 thumbnails per month",
                  "All style presets",
                  "High quality export",
                  "Face/logo upload",
                  "Prompt enhancement",
                  "Priority support",
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Business Plan */}
            <div className="bg-[#161B22] rounded-2xl p-8 border border-gray-800 hover:border-gray-700 transition-all">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Business</h3>
                <p className="text-gray-400 text-sm">For teams & agencies</p>
              </div>
              <div className="mb-6">
                <div className="text-4xl font-bold mb-1">$49</div>
                <div className="text-gray-400 text-sm">per month</div>
              </div>
              <button className="w-full px-6 py-3 bg-[#0D1117] border border-gray-800 rounded-xl font-semibold hover:bg-[#1c2128] transition">
                Contact Sales
              </button>
              <ul className="mt-8 space-y-4">
                {[
                  "Unlimited thumbnails",
                  "Custom brand kit",
                  "Team collaboration",
                  "API access",
                  "Dedicated support",
                  "Custom integrations",
                  "SLA guarantee",
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* FAQ Note */}
          <div className="text-center mt-12">
            <p className="text-gray-400">
              Need a custom plan?{" "}
              <a
                href="#"
                className="text-purple-400 hover:text-purple-300 transition font-semibold"
              >
                Contact us
              </a>{" "}
              for enterprise solutions
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 border border-purple-500/30 text-center backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                Ready to 10x Your Thumbnail Game?
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8">
                Join thousands of creators who are getting more clicks with
                AI-powered thumbnails
              </p>
              <button className="px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-bold text-lg sm:text-xl hover:shadow-2xl hover:shadow-purple-500/50 transition inline-flex items-center gap-2 sm:gap-3">
                Start Creating for Free
                <ArrowRight className="w-5 sm:w-6 h-5 sm:h-6" />
              </button>
              <p className="text-xs sm:text-sm text-gray-400 mt-3 sm:mt-4">
                No credit card required • 1 free thumbnail
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img
              src={logoImg}
              alt="Visura Logo"
              className="h-6 sm:h-7"
            />
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered thumbnail generation for modern creators.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Templates
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 Visura.io . All rights reserved.
            </p>
            <div className="flex gap-6 text-gray-400">
              <a href="#" className="hover:text-white transition">
                Twitter
              </a>
              <a href="#" className="hover:text-white transition">
                Instagram
              </a>
              <a href="#" className="hover:text-white transition">
                YouTube
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
