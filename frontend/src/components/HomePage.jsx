import React, { useState, useEffect } from 'react';
import './HomePage.css';

const HomePage = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [particles, setParticles] = useState([]);

  // Generate random particles on component mount
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 15; i++) {
        newParticles.push({
          id: i,
          left: Math.random() * 100,
          animationDelay: Math.random() * 8,
          size: Math.random() * 2 + 2
        });
      }
      setParticles(newParticles);
    };
    
    generateParticles();
  }, []);

  const handleNavigation = (path) => {
    console.log(`Navigating to: ${path}`);
    // Navigation logic would go here in a real app
    // For now, just simulate navigation
    if (path === '/solve') {
      window.location.href = '/solve'; // or use React Router
    }
  };

  const features = [
    {
      id: 'solve',
      path: '/solve',
      icon: '🔍',
      title: 'Solve from Image',
      description: 'Upload an image of a problem and get a step-by-step solution instantly',
      className: 'solve',
      available: true
    },
    {
      id: 'materials',
      path: '/materials',
      icon: '📚',
      title: 'Study Materials',
      description: 'Access curated study guides and comprehensive learning materials',
      className: 'materials',
      available: false
    },
    {
      id: 'learn',
      path: '/learn',
      icon: '🧠',
      title: 'Interactive Learning',
      description: 'Immersive learning experiences with AI-powered personalized assistance',
      className: 'learn',
      available: false
    }
  ];

  return (
    <div className="homepage">
      {/* Animated background elements */}
      <div className="bg-elements">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
        <div className="bg-orb bg-orb-3"></div>
      </div>

      {/* Floating particles */}
      <div className="particles">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.left}%`,
              animationDelay: `${particle.animationDelay}s`,
              width: `${particle.size}px`,
              height: `${particle.size}px`
            }}
          ></div>
        ))}
      </div>

      <div className="homepage-content container">
        {/* Header section */}
        <div className="homepage-header">
          <h1 className="homepage-title">Study Assistant</h1>
          <p className="homepage-subtitle">
            Unlock your learning potential with AI-powered tools designed for the modern student. 
            Transform how you study, learn, and grow with cutting-edge technology.
          </p>
        </div>

        {/* Feature cards */}
        <div className="features-grid">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`feature-card ${feature.className} ${!feature.available ? 'disabled' : ''}`}
              onClick={() => feature.available && handleNavigation(feature.path)}
              onMouseEnter={() => setHoveredCard(feature.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Background gradient */}
              <div className="card-bg"></div>
              
              {/* Glass morphism overlay */}
              <div className="card-glass"></div>
              
              {/* Hover effect overlay */}
              <div className="card-hover-overlay"></div>

              {/* Content */}
              <div className="card-content">
                {/* Icon with animation */}
                <div className="card-icon">{feature.icon}</div>

                {/* Title */}
                <h2 className="card-title">{feature.title}</h2>

                {/* Description */}
                <p className="card-description">{feature.description}</p>

                {/* Coming soon badge */}
                {!feature.available && (
                  <div className="coming-soon-badge">Coming Soon</div>
                )}

                {/* Shine effect */}
                <div className="card-shine"></div>
              </div>

              {/* Border glow effect */}
              <div className="card-border"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA section */}
        <div className="homepage-cta">
          <div className="status-badge">
            <div className="status-indicator"></div>
            <span>AI-Powered • Instant Results • Always Learning</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;