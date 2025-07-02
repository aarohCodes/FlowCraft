import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Zap, 
  BookOpen, 
  Mail, 
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Crown,
  Video,
  Users,
  Calendar,
  CheckSquare,
  Search,
  Briefcase,
  GraduationCap,
  Sparkles,
  FileText
} from 'lucide-react';
import { PaywallModal } from '../Paywall/PaywallModal';
import { useApp, UserRole } from '../../contexts/AppContext';
import { Typography } from '../UI/Typography';
import { IconWrapper } from '../UI/IconWrapper';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileMenuOpen: boolean;
}

const professionalMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, isPremium: false },
  { id: 'tools', label: 'AI Tools', icon: Zap, isPremium: true, featureName: 'AI Tools' },
  { id: 'email', label: 'Email Assistant', icon: Mail, isPremium: true, featureName: 'Email Management' },
  { id: 'zoom', label: 'Video Meetings', icon: Video, isPremium: false },
  { id: 'transcripts', label: 'Meeting Transcripts', icon: FileText, isPremium: false },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, isPremium: false },
  { id: 'settings', label: 'Settings', icon: Settings, isPremium: false },
];

const studentMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, isPremium: false },
  { id: 'education', label: 'Education', icon: BookOpen, isPremium: false },
  { id: 'tools', label: 'AI Tools', icon: Zap, isPremium: true, featureName: 'AI Tools' },
  { id: 'zoom', label: 'Study Groups', icon: Users, isPremium: false },
  { id: 'transcripts', label: 'Meeting Transcripts', icon: FileText, isPremium: false },
  { id: 'analytics', label: 'Progress', icon: BarChart3, isPremium: false },
  { id: 'settings', label: 'Settings', icon: Settings, isPremium: false },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  setActiveSection,
  isCollapsed,
  setIsCollapsed,
  isMobileMenuOpen,
}) => {
  const { state, dispatch } = useApp();
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState('');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const isFeatureUnlocked = (featureName: string) => {
    return state.isPremiumUser || state.unlockedFeatures.includes(featureName);
  };

  const handleMenuClick = (item: typeof professionalMenuItems[0]) => {
    if (item.isPremium && item.featureName) {
      if (isFeatureUnlocked(item.featureName)) {
        setActiveSection(item.id);
      } else {
        setSelectedFeature(item.featureName);
        setPaywallOpen(true);
      }
    } else {
      setActiveSection(item.id);
    }
  };

  const handleRoleToggle = () => {
    const newRole: UserRole = state.userRole === 'professional' ? 'student' : 'professional';
    dispatch({ type: 'SET_USER_ROLE', payload: newRole });
    
    // Reset to dashboard when switching roles
    setActiveSection('dashboard');
  };

  const menuItems = state.userRole === 'professional' ? professionalMenuItems : studentMenuItems;

  const roleConfig = {
    professional: {
      icon: Briefcase,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-700 dark:text-blue-400'
    },
    student: {
      icon: GraduationCap,
      color: 'from-emerald-500 to-green-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      textColor: 'text-emerald-700 dark:text-emerald-400'
    }
  };

  const currentRoleConfig = roleConfig[state.userRole];

  return (
    <>
      {/* Mobile Overlay with Enhanced Blur */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-30 lg:hidden"
            onClick={() => {}}
          />
        )}
      </AnimatePresence>

      {/* Sidebar with Enhanced Transitions */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? '5rem' : '18rem',
        }}
        transition={{ 
          duration: 0.3, 
          ease: "easeInOut",
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        className={`
          h-[calc(100vh-4rem)] flex-shrink-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md 
          border-r border-gray-200/50 dark:border-gray-700/50 flex flex-col shadow-soft
          fixed top-16 left-0 z-40 overflow-y-auto scrollbar-thin
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-transform duration-300 ease-in-out
        `}
        style={{ width: isCollapsed ? '5rem' : '18rem' }}
      >
        {/* Role Toggle Section with Enhanced Animation */}
        <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 flex-shrink-0">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-4"
              >
                <Typography 
                  variant="overline" 
                  className="text-gray-500 dark:text-gray-400 mb-3 text-center block"
                >
                  Dashboard Mode
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRoleToggle}
            className={`w-full p-4 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              ${!isCollapsed ? `border-2 border-dashed ${currentRoleConfig.bgColor} border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500` : ''}`}
          >
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
              <motion.div 
                className={`w-10 h-10 bg-gradient-to-r ${currentRoleConfig.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                whileHover={{ rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <currentRoleConfig.icon size={20} className="text-white" />
              </motion.div>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 text-center overflow-hidden"
                  >
                    <Typography 
                      variant="body1" 
                      weight="semibold" 
                      className={`${currentRoleConfig.textColor} capitalize`}
                    >
                      {state.userRole} Mode
                    </Typography>
                    <Typography 
                      variant="caption" 
                      className="text-gray-600 dark:text-gray-400"
                    >
                      Click to switch mode
                    </Typography>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.button>
        </div>

        {/* Collapse Toggle with Enhanced Animation */}
        <div className={`hidden lg:flex ${isCollapsed ? 'justify-center' : 'justify-end'} p-4 flex-shrink-0`}>
          <motion.button
            whileHover={{ scale: 1.1, rotate: isCollapsed ? -180 : 0 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-soft focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </motion.button>
        </div>

        {/* Navigation with Enhanced Animations */}
        <nav className="flex-1 px-4 pb-4 overflow-y-auto scrollbar-thin">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-4"
              >
                <Typography 
                  variant="overline" 
                  className="text-gray-500 dark:text-gray-400 px-3"
                >
                  Navigation
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>

          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id && (!item.isPremium || (item.featureName && isFeatureUnlocked(item.featureName)));
              const isUnlocked = !item.isPremium || (item.featureName && isFeatureUnlocked(item.featureName));
              const isHovered = hoveredItem === item.id;

              return (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                >
                  <motion.button
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onHoverStart={() => setHoveredItem(item.id)}
                    onHoverEnd={() => setHoveredItem(null)}
                    onClick={() => handleMenuClick(item)}
                    className={`
                      w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-4'} px-4 py-3 rounded-xl text-left transition-all duration-300 relative group
                      ${isActive
                        ? `bg-gradient-to-r ${currentRoleConfig.color} text-white shadow-medium`
                        : item.isPremium && !isUnlocked
                        ? 'text-gray-500 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                      }
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                    `}
                  >
                    {/* Icon with Micro-animations */}
                    <motion.div
                      animate={{ 
                        rotate: isHovered ? [0, -5, 5, 0] : 0,
                        scale: isHovered ? 1.1 : 1
                      }}
                      transition={{ 
                        duration: 0.4,
                        type: "spring",
                        stiffness: 300
                      }}
                      className="flex-shrink-0"
                    >
                      <Icon size={20} />
                    </motion.div>
                    
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.div
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex-1 flex items-center justify-between overflow-hidden"
                        >
                          <Typography 
                            variant="body2" 
                            weight="semibold" 
                            className="whitespace-nowrap"
                          >
                            {item.label}
                          </Typography>
                          
                          {/* Enhanced Premium/Unlocked Indicators */}
                          <div className="flex items-center space-x-2 ml-2">
                            {item.isPremium && (
                              <div className="flex-shrink-0">
                                {isUnlocked ? (
                                  <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ 
                                      type: "spring",
                                      stiffness: 300,
                                      damping: 15
                                    }}
                                    className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center"
                                  >
                                    <Sparkles size={12} className="text-white" />
                                  </motion.div>
                                ) : (
                                  <motion.div
                                    whileHover={{ rotate: [0, -10, 10, 0] }}
                                    transition={{ duration: 0.5 }}
                                  >
                                    <Crown size={14} className="text-amber-500" />
                                  </motion.div>
                                )}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Enhanced Tooltip for Collapsed State */}
                    {isCollapsed && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-full ml-4 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg shadow-large pointer-events-none whitespace-nowrap z-50"
                      >
                        <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45" />
                        <div className="flex items-center space-x-2">
                          <span>{item.label}</span>
                          {item.isPremium && !isUnlocked && (
                            <Crown size={12} className="text-amber-400" />
                          )}
                        </div>
                      </motion.div>
                    )}
                  </motion.button>
                </motion.li>
              );
            })}
          </ul>
        </nav>

        {/* Footer with Enhanced Animations */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 flex-shrink-0"
            >
              <motion.div 
                whileHover={{ y: -2 }}
                className={`${currentRoleConfig.bgColor} rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <motion.div 
                    className={`w-2 h-2 rounded-full ${state.isZoomConnected ? 'bg-emerald-500' : 'bg-rose-500'}`}
                    animate={{ scale: state.isZoomConnected ? [1, 1.2, 1] : 1 }}
                    transition={{ duration: 1.5, repeat: state.isZoomConnected ? Infinity : 0 }}
                  />
                  <Typography variant="body2" weight="semibold" className="text-gray-900 dark:text-white">
                    Video Platforms
                  </Typography>
                </div>
                <Typography variant="caption" className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {state.isZoomConnected 
                    ? 'Connected and monitoring meetings across all platforms' 
                    : 'Connect your video platforms for AI insights'
                  }
                </Typography>
                {state.isZoomConnected && (
                  <div className="flex items-center space-x-1 mt-3">
                    {['🔵', '🟢', '🟣', '🟦'].map((emoji, index) => (
                      <motion.span 
                        key={index} 
                        className="text-xs"
                        initial={{ y: 0 }}
                        animate={{ y: [0, -3, 0] }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity, 
                          delay: index * 0.2,
                          ease: "easeInOut"
                        }}
                      >
                        {emoji}
                      </motion.span>
                    ))}
                    <Typography variant="caption" className="text-gray-500 dark:text-gray-400 ml-1">
                      All platforms
                    </Typography>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        feature={selectedFeature}
      />
    </>
  );
};