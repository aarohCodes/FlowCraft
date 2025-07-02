import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Calendar, 
  Flag, 
  Tag, 
  FileText,
  Clock
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Task } from '../types';

interface AddTaskProps {
  onBack: () => void;
}

export const AddTask: React.FC<AddTaskProps> = ({ onBack }) => {
  const { dispatch } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    category: 'General',
    startDate: '',
    finishDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }

    if (formData.startDate && formData.finishDate) {
      const start = new Date(formData.startDate);
      const finish = new Date(formData.finishDate);
      if (start > finish) {
        newErrors.finishDate = 'Finish date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      completed: false,
      priority: formData.priority,
      category: formData.category,
      startDate: formData.startDate ? new Date(formData.startDate) : undefined,
      dueDate: formData.finishDate ? new Date(formData.finishDate) : undefined,
      createdAt: new Date(),
    };

    dispatch({ type: 'ADD_TASK', payload: newTask });
    onBack();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const priorityOptions = [
    { value: 'low', label: 'Low Priority', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/20' },
    { value: 'medium', label: 'Medium Priority', color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/20' },
    { value: 'high', label: 'High Priority', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/20' },
  ];

  const categoryOptions = [
    'General', 'Work', 'Personal', 'Development', 'Health', 'Learning', 'Finance', 'Travel'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Add New Task
          </h1>
          <div className="w-32"></div> {/* Spacer for centering */}
        </motion.div>

        {/* Main Form Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Task Title */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <FileText size={16} />
                <span>Task Title *</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                  errors.title ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                }`}
                placeholder="Enter a clear, descriptive task title"
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
              )}
            </div>

            {/* Task Description */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <FileText size={16} />
                <span>Description</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Add any additional details, notes, or requirements for this task"
              />
            </div>

            {/* Priority and Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Priority */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  <Flag size={16} />
                  <span>Priority Level</span>
                </label>
                <div className="space-y-2">
                  {priorityOptions.map((option) => (
                    <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="priority"
                        value={option.value}
                        checked={formData.priority === option.value}
                        onChange={(e) => handleInputChange('priority', e.target.value)}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                      />
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${option.bg} ${option.color}`}>
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  <Tag size={16} />
                  <span>Category</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Date */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  <Calendar size={16} />
                  <span>Start Date</span>
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Finish Date */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  <Clock size={16} />
                  <span>Finish Date</span>
                </label>
                <input
                  type="date"
                  value={formData.finishDate}
                  onChange={(e) => handleInputChange('finishDate', e.target.value)}
                  className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.finishDate ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                  }`}
                />
                {errors.finishDate && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.finishDate}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 font-semibold shadow-lg"
              >
                <Save size={20} />
                <span>Create Task</span>
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Task Creation Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Use clear, action-oriented titles (e.g., "Review Q4 budget proposal")</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Set realistic start and finish dates to maintain momentum</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Choose appropriate priority levels to focus on what matters most</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-secondary-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Use categories to organize tasks by project or life area</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};