import React, { useState } from 'react';

const HomePage = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleNavigation = (path) => {
    console.log(`Navigating to: ${path}`);
    // Navigation logic would go here in a real app
  };

  const features = [
    {
      id: 'solve',
      path: '/solve',
      icon: '🔍',
      title: 'Solve from Image',
      description: 'Upload an image of a problem and get a step-by-step solution',
      gradient: 'from-violet-600 via-purple-600 to-blue-600',
      shadowColor: 'shadow-violet-500/25',
      available: true
    },
    {
      id: 'materials',
      path: '/materials',
      icon: '📚',
      title: 'Study Materials',
      description: 'Access curated study guides and comprehensive materials',
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      shadowColor: 'shadow-emerald-500/25',
      available: false
    },
    {
      id: 'learn',
      path: '/learn',
      icon: '🧠',
      title: 'Interactive Learning',
      description: 'Immersive learning experiences with AI-powered assistance',
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      shadowColor: 'shadow-orange-500/25',
      available: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header section */}
        <div className="text-center mb-20">
          <div className="inline-block">
            <h1 className="text-7xl md:text-8xl font-black bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-6 tracking-tight">
              Study Assistant
            </h1>
            <div className="h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full"></div>
          </div>
          <p className="text-xl text-purple-200 mt-8 max-w-2xl mx-auto leading-relaxed">
            Unlock your learning potential with AI-powered tools designed for the modern student
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              onClick={() => feature.available && handleNavigation(feature.path)}
              onMouseEnter={() => setHoveredCard(feature.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`group relative overflow-hidden rounded-2xl transition-all duration-500 transform hover:scale-105 ${
                feature.available 
                  ? 'cursor-pointer' 
                  : 'cursor-not-allowed opacity-75'
              }`}
              style={{
                animation: `slideUp 0.8s ease-out ${index * 0.2}s both`
              }}
            >
              {/* Card background with gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-90`}></div>
              
              {/* Glass morphism overlay */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              
              {/* Hover effect overlay */}
              <div className={`absolute inset-0 bg-white/5 transition-opacity duration-300 ${
                hoveredCard === feature.id ? 'opacity-100' : 'opacity-0'
              }`}></div>

              {/* Content */}
              <div className="relative z-10 p-8 h-64 flex flex-col items-center justify-center text-center">
                {/* Icon with animation */}
                <div className={`text-6xl mb-6 transition-transform duration-300 ${
                  hoveredCard === feature.id ? 'scale-110 rotate-12' : 'scale-100'
                }`}>
                  {feature.icon}
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-yellow-200 transition-colors duration-300">
                  {feature.title}
                </h2>

                {/* Description */}
                <p className="text-white/90 text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Coming soon badge */}
                {!feature.available && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                    Soon
                  </div>
                )}

                {/* Shine effect */}
                <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 transition-transform duration-1000 ${
                  hoveredCard === feature.id ? 'translate-x-full' : '-translate-x-full'
                }`}></div>
              </div>

              {/* Border glow effect */}
              <div className={`absolute inset-0 rounded-2xl border border-white/20 ${feature.shadowColor} shadow-2xl`}></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA section */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white/80 text-sm">AI-Powered • Instant Results • Always Learning</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;