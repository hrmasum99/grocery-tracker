import React, { useState } from 'react';
import { ShoppingCart, TrendingUp, Users, Shield, Eye, EyeOff, Loader2 } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const HomePage = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-md fixed w-full z-50 animate-slideInLeft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="text-green-600" size={32} />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Grocery Tracker
              </h1>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsLogin(true);
                  setShowAuthModal(true);
                }}
              >
                Login
              </Button>
              <Button
                onClick={() => {
                  setIsLogin(false);
                  setShowAuthModal(true);
                }}
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="animate-slideInLeft">
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Track Your
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  {' '}Grocery Expenses
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Smart expense management for your household. Track, analyze, and optimize your grocery spending with ease.
              </p>
              <div className="flex space-x-4">
                <Button
                  size="lg"
                  onClick={() => {
                    setIsLogin(false);
                    setShowAuthModal(true);
                  }}
                >
                  Get Started Free
                </Button>
                <Button variant="ghost" size="lg">
                  Learn More
                </Button>
              </div>
            </div>

            {/* Right Image/Animation */}
            <div className="animate-slideInRight">
              <div className="relative animate-float">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=600&fit=crop"
                  alt="Grocery Shopping"
                  className="rounded-3xl shadow-2xl w-full object-cover"
                />
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 animate-pulse-slow">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-3 rounded-full">
                      <TrendingUp className="text-green-600" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Monthly Savings</p>
                      <p className="text-2xl font-bold text-gray-900">$245</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fadeIn">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Grocery Tracker?
            </h3>
            <p className="text-xl text-gray-600">
              Everything you need to manage your grocery expenses efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fadeIn"
                style={{ animationDelay: `${idx * 0.2}s` }}
              >
                <div className="bg-gradient-to-br from-green-100 to-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            {stats.map((stat, idx) => (
              <div key={idx} className="animate-fadeIn" style={{ animationDelay: `${idx * 0.2}s` }}>
                <p className="text-5xl font-bold mb-2">{stat.value}</p>
                <p className="text-xl opacity-90">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center animate-fadeIn">
          <h3 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Take Control of Your Expenses?
          </h3>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of users who are already saving money with Grocery Tracker
          </p>
          <Button
            size="lg"
            onClick={() => {
              setIsLogin(false);
              setShowAuthModal(true);
            }}
          >
            Start Tracking Now
          </Button>
        </div>
      </section>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          isLogin={isLogin}
          setIsLogin={setIsLogin}
        />
      )}
    </div>
  );
};

const AuthModal = ({ isOpen, onClose, isLogin, setIsLogin }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordsMatch = formData.password === formData.confirmPassword;
  const showPasswordError = !isLogin && formData.confirmPassword && !passwordsMatch;

  const handleSubmit = async () => {
    if (!isLogin && !passwordsMatch) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const result = isLogin
        ? await api.auth.login({ email: formData.email, password: formData.password })
        : await api.auth.register(formData);
      login(result.token, result);
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden grid md:grid-cols-2">
        {/* Left Side - Form */}
        <div className="p-8 md:p-12 animate-slideInLeft">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {!isLogin && (
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
              />
            )}
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@example.com"
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {!isLogin && (
              <div className="relative">
                <Input
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {showPasswordError && (
                  <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
                )}
              </div>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading || (!isLogin && showPasswordError)}
            className="w-full mt-6"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                {isLogin ? 'Logging in...' : 'Creating account...'}
              </>
            ) : (
              <>{isLogin ? 'Login' : 'Sign Up'}</>
            )}
          </Button>

          <p className="text-center text-gray-600 mt-6">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-green-600 font-semibold hover:text-green-700"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>

        {/* Right Side - Branding */}
        <div className="bg-gradient-to-br from-green-600 to-blue-600 p-8 md:p-12 flex flex-col items-center justify-center text-white animate-slideInRight">
          <ShoppingCart size={80} className="mb-6 animate-float" />
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Grocery Tracker
          </h1>
          <p className="text-center text-lg opacity-90">
            Your Smart Expense Management Solution
          </p>
        </div>
      </div>
    </div>
  );
};

const features = [
  {
    icon: <ShoppingCart className="text-green-600" size={32} />,
    title: 'Easy Tracking',
    description: 'Add and manage your grocery expenses with just a few clicks. Simple and intuitive interface.',
  },
  {
    icon: <TrendingUp className="text-blue-600" size={32} />,
    title: 'Insights & Analytics',
    description: 'Get detailed reports and insights on your spending patterns. Make informed decisions.',
  },
  {
    icon: <Users className="text-purple-600" size={32} />,
    title: 'Family Sharing',
    description: 'Share expenses with family members. Track who bought what and when.',
  },
];

const stats = [
  { value: '10K+', label: 'Active Users' },
  { value: '$2M+', label: 'Money Tracked' },
  { value: '50K+', label: 'Expenses Logged' },
];

export default HomePage;