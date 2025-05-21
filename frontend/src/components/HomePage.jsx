import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  
  const handleNavigation = (path) => {
    console.log(`Navigating to: ${path}`);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">Study Assistant</h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Solve from Image - Functional */}
          <div 
            onClick={() => handleNavigation('/solve')}
            className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-2xl font-semibold mb-2">Solve from Image</h2>
            <p className="text-gray-600 text-center">Upload an image of a problem and get a step-by-step solution</p>
          </div>
          
          {/* Study Materials - Placeholder */}
          <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center justify-center opacity-70">
            <div className="text-5xl mb-4">📚</div>
            <h2 className="text-2xl font-semibold mb-2">Study Materials</h2>
            <p className="text-gray-600 text-center">Access study guides and materials (Coming soon)</p>
          </div>
          
          {/* Learn - Placeholder */}
          <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center justify-center opacity-70">
            <div className="text-5xl mb-4">🧠</div>
            <h2 className="text-2xl font-semibold mb-2">Learn</h2>
            <p className="text-gray-600 text-center">Interactive learning experiences (Coming soon)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;