// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // State for form data - holds all form field values
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: ''
  });

  // State for tracking form submission status
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for showing success/error messages to user
  const [submitStatus, setSubmitStatus] = useState(null);

  // State for field-specific validation errors
  const [errors, setErrors] = useState({});

  // State for theme management
  const [theme, setTheme] = useState('light');

  // Initialize theme on component mount
  useEffect(() => {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;

    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e) => {
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Handle input changes for all form fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data with new value
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form data before submission
  const validateForm = () => {
    const newErrors = {};

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (at least 10 digits)';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    // Update errors state
    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Validate form before submitting
    if (!validateForm()) {
      return;
    }

    // Set loading state
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Make API call to backend
      const response = await fetch('http://localhost:3001/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          submittedAt: new Date().toISOString() // Add timestamp
        }),
      });

      // Check if request was successful
      if (response.ok) {
        const result = await response.json();

        // Show success message
        setSubmitStatus({
          type: 'success',
          message: result.message || 'Form submitted successfully!'
        });

        // Reset form data
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          message: ''
        });

        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });

      } else {
        // Handle HTTP errors
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit form');
      }

    } catch (error) {
      console.error('Form submission error:', error);

      // Show error message to user
      setSubmitStatus({
        type: 'error',
        message: error.message || 'Failed to submit form. Please try again.'
      });
    } finally {
      // Always reset loading state
      setIsSubmitting(false);
    }
  };

  // Reset form function (optional)
  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      message: ''
    });
    setErrors({});
    setSubmitStatus(null);
  };

  return (
    <div className="App">
      {/* Theme Toggle Button */}
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        <span className="theme-icon">
          {theme === 'light' ? '🔆' : '🌙'}
        </span>
      </button>

      <div className="form-container">
        {/* Header Section */}
        <div className="form-header">
          <h1>Contact Us</h1>
          <p className="form-description">
            We'd love to hear from you! Please fill out the form below and we'll get back to you as soon as possible.
          </p>
        </div>

        {/* Status Message */}
        {submitStatus && (
          <div className={`status-message ${submitStatus.type}`}>
            <div className="status-content">
              <span className="status-icon">
                {submitStatus.type === 'success' ? '✅' : '❌'}
              </span>
              <span className="status-text">{submitStatus.message}</span>
            </div>
            {submitStatus.type === 'success' && (
              <button
                type="button"
                className="status-close"
                onClick={() => setSubmitStatus(null)}
              >
                ×
              </button>
            )}
          </div>
        )}

        {/* Main Form */}
        <form
          onSubmit={handleSubmit}
          className="contact-form"
          noValidate
          aria-label="Contact form"
          role="form"
        >

          {/* Full Name Field */}
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">
              Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`form-input ${errors.fullName ? 'error' : ''}`}
              placeholder="Enter your full name"
              disabled={isSubmitting}
              autoComplete="name"
              aria-describedby={errors.fullName ? "fullName-error" : undefined}
              aria-invalid={errors.fullName ? "true" : "false"}
              required
            />
            {errors.fullName && (
              <span
                id="fullName-error"
                className="error-message"
                role="alert"
                aria-live="polite"
              >
                {errors.fullName}
              </span>
            )}
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="Enter your email address"
              disabled={isSubmitting}
              autoComplete="email"
              aria-describedby={errors.email ? "email-error" : undefined}
              aria-invalid={errors.email ? "true" : "false"}
              required
            />
            {errors.email && (
              <span
                id="email-error"
                className="error-message"
                role="alert"
                aria-live="polite"
              >
                {errors.email}
              </span>
            )}
          </div>

          {/* Phone Field */}
          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`form-input ${errors.phone ? 'error' : ''}`}
              placeholder="Enter your phone number"
              disabled={isSubmitting}
              autoComplete="tel"
              aria-describedby={errors.phone ? "phone-error" : undefined}
              aria-invalid={errors.phone ? "true" : "false"}
              required
            />
            {errors.phone && (
              <span
                id="phone-error"
                className="error-message"
                role="alert"
                aria-live="polite"
              >
                {errors.phone}
              </span>
            )}
          </div>

          {/* Message Field */}
          <div className="form-group">
            <label htmlFor="message" className="form-label">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className={`form-input form-textarea ${errors.message ? 'error' : ''}`}
              placeholder="Enter your message (minimum 10 characters)"
              disabled={isSubmitting}
              rows="5"
              maxLength="1000"
              aria-describedby={errors.message ? "message-error" : "message-info"}
              aria-invalid={errors.message ? "true" : "false"}
              required
            />
            <div className="textarea-info">
              <span
                id="message-info"
                className={`char-count ${formData.message.length > 900 ? 'warning' : ''}`}
                aria-live="polite"
              >
                {formData.message.length}/1000 characters
              </span>
            </div>
            {errors.message && (
              <span
                id="message-error"
                className="error-message"
                role="alert"
                aria-live="polite"
              >
                {errors.message}
              </span>
            )}
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-button"
              aria-describedby="submit-help"
            >
              {isSubmitting ? (
                <>
                  <span className="loading-spinner" aria-hidden="true"></span>
                  <span aria-live="polite">Submitting...</span>
                </>
              ) : (
                'Submit Form'
              )}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="reset-button"
              disabled={isSubmitting}
              aria-label="Reset form to clear all fields"
            >
              Reset Form
            </button>
          </div>

          {/* Hidden help text for screen readers */}
          <div id="submit-help" className="sr-only">
            Press Enter or click to submit the form. All fields are required.
          </div>
        </form>

        {/* Form Footer */}
        <div className="form-footer">
          <p>* Required fields</p>
          <p className="privacy-note">
            Your information is secure and will not be shared with third parties.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;