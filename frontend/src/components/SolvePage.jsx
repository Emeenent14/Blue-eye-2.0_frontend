import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SolvePage.css';

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
  const [dragOver, setDragOver] = useState(false);

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

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setSolution('');
        setError('');
      }
    }
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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(solution);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="solve-page">
      <div className="solve-container">
        <button 
          onClick={() => navigate('/')}
          className="back-button"
        >
          <span className="back-button-icon">←</span> 
          Back to Home
        </button>
        
        <h1 className="solve-title">Solve from Image</h1>
        
        <div className="upload-card">
          <div className="attempts-display">
            <span className="attempts-icon">⚡</span>
            <span className="attempts-text">Attempts remaining today:</span>
            <span className="attempts-count">{attemptsLeft}/{MAX_ATTEMPTS}</span>
          </div>
          
          <form onSubmit={handleSubmit} className="upload-form">
            <div className="form-group">
              <label className="form-label">
                Upload an image of your problem
              </label>
              <div 
                className={`file-upload-area ${dragOver ? 'drag-over' : ''} ${selectedFile ? 'file-selected' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="file-input-hidden"
                />
                <div className="upload-icon">
                  {selectedFile ? '✅' : '📷'}
                </div>
                <div className="upload-text">
                  {selectedFile ? `Selected: ${selectedFile.name}` : 'Click to upload or drag and drop'}
                </div>
                <div className="upload-subtext">
                  {selectedFile ? 'Click to change file' : 'PNG, JPG, JPEG up to 10MB'}
                </div>
              </div>
            </div>
            
            {previewUrl && (
              <div className="preview-section">
                <span className="preview-label">Preview:</span>
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="preview-image"
                />
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading || !selectedFile || attemptsLeft <= 0}
              className={`submit-button ${loading || !selectedFile || attemptsLeft <= 0 ? 'disabled' : 'enabled'}`}
            >
              {loading ? (
                <>
                  <span className="spinner" style={{marginRight: '0.5rem', width: '1rem', height: '1rem'}}></span>
                  Processing...
                </>
              ) : (
                'Solve Problem'
              )}
            </button>
          </form>
        </div>
        
        {loading && (
          <div className="loading-card">
            <div className="loading-content">
              <div className="loading-spinner"></div>
              <div className="loading-text">Processing your image...</div>
              <div className="loading-subtext">
                Our AI is analyzing the problem and generating a step-by-step solution for you.
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="error-alert">
            <div className="error-title">
              <span className="error-icon">⚠️</span>
              Error
            </div>
            <div className="error-message">{error}</div>
          </div>
        )}
        
        {solution && (
          <div className="solution-card animate-in">
            <div className="solution-header">
              <span className="solution-icon">✨</span>
              <h2 className="solution-title">Solution</h2>
            </div>
            <div className="solution-content">
              <button 
                className="copy-button"
                onClick={copyToClipboard}
                title="Copy to clipboard"
              >
                📋 Copy
              </button>
              {solution}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SolvePage;