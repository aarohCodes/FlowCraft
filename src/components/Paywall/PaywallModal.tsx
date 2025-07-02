import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Crown, 
  Check, 
  Zap,
  Mail,
  Star,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import toast from 'react-hot-toast';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({ isOpen, onClose, feature }) => {
  const { dispatch } = useApp();

  const premiumFeatures = [
    {
      icon: HelpCircle,
      title: 'AI Quiz Generator',
      description: 'Generate intelligent quizzes and practice questions from any content'
    },
    {
      icon: Mail,
      title: 'AI Email Assistant',
      description: 'Generate professional emails from meeting content with approval workflow'
    },
    {
      icon: Zap,
      title: 'Advanced AI Assistant',
      description: 'Get intelligent insights, automated workflows, and smart recommendations'
    },
    {
      icon: Sparkles,
      title: 'Priority Support',
      description: '24/7 premium support with faster response times'
    },
    {
      icon: Star,
      title: 'Advanced Analytics',
      description: 'Detailed insights and performance metrics for all your activities'
    }
  ];

  const plans = [
    {
      name: 'Monthly',
      price: '$9.99',
      period: '/month',
      popular: false,
      savings: null
    },
    {
      name: 'Annual',
      price: '$79.99',
      period: '/year',
      popular: true,
      savings: 'Save 33%'
    }
  ];

  const handleStartFreeTrial = () => {
    // Store the feature they wanted to access
    localStorage.setItem('requestedFeature', feature);
    
    // Redirect to Stripe payment link
    window.open('https://buy.stripe.com/test_bJe3cx6Xt7LKfgscp38IU00', '_blank');
    
    // Close the modal
    onClose();
  };

  // Listen for when user returns from Stripe (this would typically be handled by a webhook in production)
  React.useEffect(() => {
    const handleStripeReturn = () => {
      const requestedFeature = localStorage.getItem('requestedFeature');
      
      // Activate premium trial
      dispatch({ type: 'ACTIVATE_PREMIUM_TRIAL' });
      
      // Show success message
      toast.success('🎉 Premium trial activated! All features unlocked for 7 days.');
      
      // Navigate to the appropriate page based on the feature
      setTimeout(() => {
        if (requestedFeature === 'Email Management') {
          const event = new CustomEvent('navigate-to-email');
          window.dispatchEvent(event);
        } else if (requestedFeature === 'Quiz Generator') {
          const event = new CustomEvent('navigate-to-education');
          window.dispatchEvent(event);
        } else if (requestedFeature === 'AI Assistant' || requestedFeature === 'AI Tools') {
          const event = new CustomEvent('navigate-to-tools');
          window.dispatchEvent(event);
        }
        
        // Clear the stored feature
        localStorage.removeItem('requestedFeature');
      }, 1000);
    };

    // Check if user just returned from payment (you might want to use URL params or other methods)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment_success') === 'true') {
      handleStripeReturn();
    }

    // Listen for focus event (when user returns to tab)
    const handleFocus = () => {
      const requestedFeature = localStorage.getItem('requestedFeature');
      if (requestedFeature) {
        // Simulate successful payment for demo purposes
        setTimeout(() => {
          handleStripeReturn();
        }, 2000);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [dispatch]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-primary-500 to-secondary-500 p-8 text-white flex-shrink-0">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown size={32} className="text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Unlock Premium Features</h2>
                <p className="text-primary-100 text-lg">
                  {feature} is a premium feature. Start your free trial to access this and more!
                </p>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-8">
                {/* Features Grid */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
                    What's included in FlowCraft Pro
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {premiumFeatures.map((feature, index) => {
                      const IconComponent = feature.icon;
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                        >
                          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <IconComponent size={20} className="text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {feature.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {feature.description}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Pricing Plans */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
                    Choose Your Plan
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    {plans.map((plan, index) => (
                      <motion.div
                        key={plan.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className={`relative p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                          plan.popular
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                        }`}
                      >
                        {plan.popular && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                              Most Popular
                            </span>
                          </div>
                        )}
                        
                        <div className="text-center">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {plan.name}
                          </h4>
                          <div className="mb-4">
                            <span className="text-3xl font-bold text-gray-900 dark:text-white">
                              {plan.price}
                            </span>
                            <span className="text-gray-600 dark:text-gray-400">
                              {plan.period}
                            </span>
                          </div>
                          {plan.savings && (
                            <div className="mb-4">
                              <span className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 px-2 py-1 rounded-full text-sm font-medium">
                                {plan.savings}
                              </span>
                            </div>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleStartFreeTrial}
                            className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                              plan.popular
                                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600 shadow-lg'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            Start Free Trial
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Benefits List */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4 text-center">
                    All plans include:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      '7-day free trial',
                      'Cancel anytime',
                      'All premium features',
                      'Priority customer support',
                      'Regular feature updates',
                      'Data export capabilities'
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check size={16} className="text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    By subscribing, you agree to our Terms of Service and Privacy Policy.
                    Your subscription will auto-renew unless cancelled.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};