import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Settings } from 'lucide-react';
import { useApp, UserRole } from '../../contexts/AppContext';

export const RoleSelector: React.FC = () => {
  const { state, dispatch } = useApp();

  const roles = [
    {
      id: 'professional' as UserRole,
      name: 'Professional',
      description: 'Focus on productivity, meetings, and business tasks',
      icon: Briefcase,
      color: 'from-blue-500 to-blue-600',
      features: ['Meeting Scheduler', 'Email Assistant', 'Task Management', 'Analytics']
    },
    {
      id: 'student' as UserRole,
      name: 'Student',
      description: 'Optimize for learning, studying, and academic work',
      icon: GraduationCap,
      color: 'from-green-500 to-green-600',
      features: ['Quiz Generator', 'Flashcard Creator', 'Research Assistant', 'Study Analytics']
    }
  ];

  const handleRoleChange = (role: UserRole) => {
    dispatch({ type: 'SET_USER_ROLE', payload: role });
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="flex items-center space-x-2 mb-4">
        <Settings size={20} className="text-primary-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Dashboard Mode
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = state.userRole === role.id;
          
          return (
            <motion.button
              key={role.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleRoleChange(role.id)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                isSelected
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 bg-gradient-to-r ${role.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold mb-1 ${
                    isSelected ? 'text-primary-700 dark:text-primary-400' : 'text-gray-900 dark:text-white'
                  }`}>
                    {role.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {role.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {role.features.slice(0, 2).map((feature, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isSelected
                            ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                        }`}
                      >
                        {feature}
                      </span>
                    ))}
                    {role.features.length > 2 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        +{role.features.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {isSelected && (
                <div className="mt-3 flex items-center space-x-1 text-primary-600 dark:text-primary-400">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span className="text-xs font-medium">Active Mode</span>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};