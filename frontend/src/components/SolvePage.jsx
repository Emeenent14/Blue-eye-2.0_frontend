import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MAX_ATTEMPTS = 5;
const ATTEMPTS_KEY = 'solve_attempts';
const ATTEMPTS_RESET_KEY = 'solve_attempts_reset';

const SolvePage = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [solution, setSolution] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);

  // Initialize and load attempts counter from localStorage
  useEffect(() => {
    // Check if we need to reset the attempts counter (daily reset)
    const resetTimestamp = localStorage.getItem(ATTEMPTS_RESET_KEY);
    const now = new Date().getTime();
    
    if (!resetTimestamp || now > parseInt(resetTimestamp)) {
      // Reset counter if it's a new day
      localStorage.setItem(ATTEMPTS_KEY, '0');
      // Set next reset time to tomorrow
      const tomorrow = new Date();
      tomorrow.setHours(0, 0, 0, 0);
      tomorrow.setDate(tomorrow.getDate() + 1);
      localStorage.setItem(ATTEMPTS_RESET_KEY, tomorrow.getTime().toString());
    }
    
    const usedAttempts = parseInt(localStorage.getItem(ATTEMPTS_KEY) || '0');
    setAttemptsLeft(MAX_ATTEMPTS - usedAttempts);
    
    console.log(`Attempts left: ${MAX_ATTEMPTS - usedAttempts}`);
  }, []);

  const incrementAttempts = () => {
    const usedAttempts = parseInt(localStorage.getItem(ATTEMPTS_KEY) || '0') + 1;
    localStorage.setItem(ATTEMPTS_KEY, usedAttempts.toString());
    setAttemptsLeft(MAX_ATTEMPTS - usedAttempts);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    console.log('File selected:', file.name);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    // Clear previous results
    setSolution('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }
    
    if (attemptsLeft <= 0) {
      setError('You have reached your daily limit. Please try again tomorrow.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSolution('');
    
    const formData = new FormData();
    formData.append('image', selectedFile);
    
    try {
      console.log('Submitting image for processing...');
      // API endpoint will be set up in the Django backend
      const response = await axios.post('/api/solve/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Response received:', response.data);
      
      if (response.data.solution) {
        setSolution(response.data.solution);
        incrementAttempts();
      } else {
        setError(response.data.error || 'An unknown error occurred');
      }
    } catch (err) {
      console.error('Error during image processing:', err);
      setError(err.response?.data?.error || 'Failed to process image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <button 
          onClick={() => navigate('/')}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
        >
          <span className="mr-2">←</span> Back to Home
        </button>
        
        <h1 className="text-3xl font-bold mb-8">Solve from Image</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-1">
              Attempts remaining today: <span className="font-semibold">{attemptsLeft}/{MAX_ATTEMPTS}</span>
            </p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium">
                Upload an image of your problem
              </label>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-lg file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100"
              />
            </div>
            
            {previewUrl && (
              <div className="mb-6">
                <p className="block mb-2 text-sm font-medium">Preview:</p>
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="max-h-64 rounded border border-gray-200" 
                />
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading || !selectedFile || attemptsLeft <= 0}
              className={`w-full py-2 px-4 rounded-lg font-medium ${
                loading || !selectedFile || attemptsLeft <= 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {loading ? 'Processing...' : 'Solve Problem'}
            </button>
          </form>
        </div>
        
        {loading && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="ml-4 text-gray-600">Processing image and solving problem...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h3 className="text-red-800 font-medium mb-2">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {solution && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Solution</h2>
            <div className="whitespace-pre-wrap font-mono bg-gray-50 p-4 rounded border border-gray-200">
              {solution}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SolvePage;