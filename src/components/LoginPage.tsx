import React, { useState } from 'react';
import { Eye, EyeOff, Shield, RefreshCw, Lock, User, Mail } from 'lucide-react';

interface LoginPageProps {
  onLogin: (credentials: { username: string; password: string }) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    captcha: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [captchaCode, setCaptchaCode] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Generate random captcha
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(result);
  };

  React.useEffect(() => {
    generateCaptcha();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.captcha) {
      newErrors.captcha = 'Captcha is required';
    } else if (formData.captcha !== captchaCode) {
      newErrors.captcha = 'Captcha is incorrect';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLogin({ username: formData.username, password: formData.password });
    }, 1500);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle forgot password logic here
    alert('Password reset link has been sent to your registered email address.');
    setShowForgotPassword(false);
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex items-center justify-center p-4 relative">
        {/* Watermark */}
        <div className="fixed inset-0 pointer-events-none z-0 opacity-5">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="transform rotate-45 text-6xl font-bold text-gray-400 select-none">
              SOOCHAK BHARAT
            </div>
          </div>
        </div>

        <div className="max-w-md w-full relative z-10">
          <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
              <div className="flex items-center justify-center mb-4">
                <img 
                  src="/logo.png" 
                  alt="Soochak Bharat Logo" 
                  className="h-12 w-auto object-contain"
                />
              </div>
              <h2 className="text-2xl font-bold text-white text-center">Reset Password</h2>
              <p className="text-blue-100 text-center mt-2"> File Management Software</p>
            </div>
            
            <form onSubmit={handleForgotPassword} className="p-8">
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
              >
                Send Reset Link
              </button>

              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="w-full mt-4 text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Back to Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex items-center justify-center p-4 relative">
      {/* Watermark */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-5">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="transform rotate-45 text-6xl font-bold text-gray-400 select-none">
            SOOCHAK BHARAT
          </div>
        </div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
            <div className="flex items-center justify-center mb-4">
              <img 
                src="logo.png" 
                alt="Soochak Bharat Logo" 
                className="h-12 w-auto object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-white text-center">Admin Portal</h1>
            <p className="text-blue-100 text-center mt-1"> File Management Software</p>
            <p className="text-blue-200 text-center text-sm mt-1">Soochak Bharat</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.username ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter your username"
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Captcha */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Security Verification
              </label>
              <div className="flex items-center space-x-3 mb-3">
                <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 font-mono text-lg font-bold text-gray-700 tracking-wider select-none">
                  {captchaCode}
                </div>
                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  title="Refresh Captcha"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
              <input
                type="text"
                value={formData.captcha}
                onChange={(e) => setFormData({ ...formData, captcha: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.captcha ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter the code above"
              />
              {errors.captcha && (
                <p className="text-red-500 text-sm mt-1">{errors.captcha}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              <span className="font-semibold text-blue-600">Soochak Bharat</span> • Secure File Management Solution
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
