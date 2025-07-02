import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Video, 
  BookOpen, 
  Zap, 
  Users, 
  TrendingUp, 
  ArrowRight,
  Play,
  CheckCircle,
  Star,
  MessageCircle,
  Calendar,
  Target,
  Award,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Loader2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

interface LandingProps {
  onLogin: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onLogin }) => {
  const { signUp, signIn } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await signUp(formData.email, formData.password, formData.name);
        if (error) {
          toast.error(error.message);
        } else {
          // Show email confirmation screen instead of trying to log in
          setShowEmailConfirmation(true);
          toast.success('Account created! Please check your email to verify your account.');
        }
      } else {
        const { data, error } = await signIn(formData.email, formData.password);
        if (error) {
          if (error.message.includes('Email not confirmed')) {
            toast.error('Please check your email and click the confirmation link before signing in.');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Welcome back!');
          setShowLoginModal(false);
          onLogin();
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setShowLoginModal(false);
    setShowEmailConfirmation(false);
    setFormData({ name: '', email: '', password: '' });
    setLoading(false);
  };

  const features = [
    {
      icon: Video,
      title: 'Real-time Meeting Monitoring',
      description: 'Connect to Zoom, Google Meet, Discord, and Teams for live insights',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: BookOpen,
      title: 'AI-Generated Flashcards',
      description: 'Automatically create study materials from meeting transcripts',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Zap,
      title: 'Smart Task Management',
      description: 'Extract action items and create tasks with AI assistance',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: TrendingUp,
      title: 'Meeting Analytics',
      description: 'Track productivity, sentiment, and key insights across all meetings',
      color: 'from-green-500 to-green-600'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Product Manager',
      company: 'TechCorp',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
      content: 'FlowCraft transformed how our team handles meetings. The AI-generated flashcards help us retain key information effortlessly.',
      rating: 5
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Engineering Lead',
      company: 'StartupXYZ',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
      content: 'The real-time monitoring and automatic task creation saves us hours every week. Game-changer for remote teams.',
      rating: 5
    },
    {
      name: 'Emily Watson',
      role: 'Operations Director',
      company: 'GrowthCo',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
      content: 'Finally, a tool that makes our meetings productive. The insights and analytics help us improve continuously.',
      rating: 5
    }
  ];

  const stats = [
    { number: '150+', label: 'Active Users' },
    { number: '1,000+', label: 'Meetings Processed' },
    { number: '750+', label: 'Flashcards Generated' },
    { number: '99.9%', label: 'Uptime' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Custom Bolt.new Badge */}
      <style>
        {`
          .bolt-badge {
            transition: all 0.3s ease;
          }
          @keyframes badgeIntro {
            0% { transform: rotateY(-90deg); opacity: 0; }
            100% { transform: rotateY(0deg); opacity: 1; }
          }
          .bolt-badge-intro {
            animation: badgeIntro 0.8s ease-out 1s both;
          }
          .bolt-badge-intro.animated {
            animation: none;
          }
          @keyframes badgeHover {
            0% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.1) rotate(22deg); }
            100% { transform: scale(1) rotate(0deg); }
          }
          .bolt-badge:hover {
            animation: badgeHover 0.6s ease-in-out;
          }
        `}
      </style>
      <div className="fixed top-16 right-4 z-50">
        <a href="https://bolt.new/?rid=os72mi" target="_blank" rel="noopener noreferrer" 
           className="block transition-all duration-300 hover:shadow-2xl">
          <img src="https://storage.bolt.army/black_circle_360x360.png" 
               alt="Built with Bolt.new badge" 
               className="w-20 h-20 md:w-28 md:h-28 rounded-full shadow-lg bolt-badge bolt-badge-intro"
               onAnimationEnd={() => {
                 const element = document.querySelector('.bolt-badge-intro');
                 if (element) element.classList.add('animated');
               }} />
        </a>
      </div>

      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg">
                <img 
                  src="/image.png" 
                  alt="FlowCraft Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  FlowCraft
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 -mt-1">
                  AI Productivity Suite
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setIsSignUp(false);
                  setShowLoginModal(true);
                }}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Log in
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsSignUp(true);
                  setShowLoginModal(true);
                }}
                className="px-6 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 font-semibold"
              >
                Sign up
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-center overflow-hidden min-h-[70vh]">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 dark:bg-primary-900/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-secondary-200 dark:bg-secondary-900/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent-200 dark:bg-accent-900/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 flex flex-col justify-center">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-full border border-primary-200 dark:border-primary-800 mb-8">
                <Sparkles size={16} className="text-primary-600 dark:text-primary-400" />
                <span className="text-primary-700 dark:text-primary-300 text-sm font-medium">
                  AI-Powered Meeting Intelligence
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-10 leading-tight">
                Turn Meetings Into
                <span className="block text-orange-500 mt-2">
                  Magic
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Transform your video meetings into actionable insights, study materials, and productivity gold with AI-powered real-time processing across all platforms.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 1.00 }}
                onClick={() => {
                  setIsSignUp(true);
                  setShowLoginModal(true);
                }}
                className="px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 font-semibold text-lg shadow-lg flex items-center space-x-2"
              >
                <span>Start Free Trial</span>
                <ArrowRight size={20} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                
              >
                <Play size={0} />
                <span></span>
              </motion.button>
            </motion.div>

            {/* Hero Image/Illustration */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative"
            >
              <div className="relative mx-auto max-w-4xl">
                <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
                  {/* Mock Dashboard Preview */}
                  <div className="p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="ml-4 text-gray-400 text-sm">FlowCraft Dashboard</div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-500/30">
                          <div className="flex items-center space-x-2 mb-2">
                            <Video size={16} className="text-blue-400" />
                            <span className="text-blue-400 text-sm font-medium">Live Meeting</span>
                          </div>
                          <div className="text-white text-sm">Team Standup - 5 participants</div>
                          <div className="text-gray-400 text-xs mt-1">Processing real-time insights...</div>
                        </div>
                        
                        <div className="bg-orange-500/20 rounded-lg p-4 border border-orange-500/30">
                          <div className="flex items-center space-x-2 mb-2">
                            <BookOpen size={16} className="text-orange-400" />
                            <span className="text-orange-400 text-sm font-medium">Generated</span>
                          </div>
                          <div className="text-white text-sm">12 flashcards created</div>
                          <div className="text-gray-400 text-xs mt-1">From last meeting transcript</div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-purple-500/20 rounded-lg p-4 border border-purple-500/30">
                          <div className="flex items-center space-x-2 mb-2">
                            <Zap size={16} className="text-purple-400" />
                            <span className="text-purple-400 text-sm font-medium">AI Tasks</span>
                          </div>
                          <div className="text-white text-sm">8 action items extracted</div>
                          <div className="text-gray-400 text-xs mt-1">Auto-assigned to team members</div>
                        </div>
                        
                        <div className="bg-green-500/20 rounded-lg p-4 border border-green-500/30">
                          <div className="flex items-center space-x-2 mb-2">
                            <TrendingUp size={16} className="text-green-400" />
                            <span className="text-green-400 text-sm font-medium">Analytics</span>
                          </div>
                          <div className="text-white text-sm">94% productivity score</div>
                          <div className="text-gray-400 text-xs mt-1">+12% from last week</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -right-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full p-3 shadow-lg"
                >
                  <Sparkles size={24} className="text-white" />
                </motion.div>
                
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -bottom-4 -left-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full p-3 shadow-lg"
                >
                  <Zap size={24} className="text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Powerful Features for
              <span className="block bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Modern Teams
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Everything you need to transform your meetings into actionable insights and learning materials
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                    <Icon size={32} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Loved by Teams Worldwide
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              See how FlowCraft is transforming the way teams collaborate and learn
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center space-x-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-3xl p-12 text-white"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Meetings?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of teams already using FlowCraft to turn their meetings into magic
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsSignUp(true);
                  setShowLoginModal(true);
                }}
                className="px-8 py-4 bg-white text-primary-600 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold text-lg shadow-lg"
              >
                Start Your Free Trial
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white w-full mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg">
                <img 
                  src="/image.png" 
                  alt="FlowCraft Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">FlowCraft</h3>
                <p className="text-gray-400 text-sm">AI Productivity Suite</p>
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 FlowCraft. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Login/Signup Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetModal}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8"
            >
              {showEmailConfirmation ? (
                // Email Confirmation Screen
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Mail size={32} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Check Your Email
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    We've sent a confirmation link to <strong>{formData.email}</strong>. 
                    Please click the link in your email to verify your account.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle size={20} className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div className="text-left">
                          <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                            What's next?
                          </p>
                          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                            1. Check your email inbox (and spam folder)<br/>
                            2. Click the confirmation link<br/>
                            3. Return here to sign in
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        setShowEmailConfirmation(false);
                        setIsSignUp(false);
                      }}
                      className="w-full py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 font-semibold"
                    >
                      I've Confirmed My Email - Sign In
                    </button>
                    
                    <button
                      onClick={resetModal}
                      className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 font-semibold"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                // Login/Signup Form
                <>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Sparkles size={32} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {isSignUp ? 'Create Account' : 'Welcome Back'}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {isSignUp ? 'Start your journey with FlowCraft' : 'Sign in to your account'}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {isSignUp && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Enter your full name"
                            required={isSignUp}
                            disabled={loading}
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Enter your email"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Enter your password"
                          required
                          disabled={loading}
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          disabled={loading}
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: loading ? 1 : 1.02 }}
                      whileTap={{ scale: loading ? 1 : 0.98 }}
                      disabled={loading}
                      className="w-full py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          <span>{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
                        </>
                      ) : (
                        <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                      )}
                    </motion.button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                      {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                      <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="ml-1 text-primary-600 dark:text-primary-400 hover:underline font-medium"
                        disabled={loading}
                      >
                        {isSignUp ? 'Sign in' : 'Sign up'}
                      </button>
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};