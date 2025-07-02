import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  BookOpen, 
  HelpCircle, 
  Lightbulb,
  Tag,
  BarChart3,
  Sparkles
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Flashcard } from '../types';

interface CreateFlashcardProps {
  onBack: () => void;
}

export const CreateFlashcard: React.FC<CreateFlashcardProps> = ({ onBack }) => {
  const { dispatch } = useApp();
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'General',
    difficulty: 'medium' as Flashcard['difficulty'],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.question.trim()) {
      newErrors.question = 'Question is required';
    }

    if (!formData.answer.trim()) {
      newErrors.answer = 'Answer is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const newFlashcard: Flashcard = {
      id: Date.now().toString(),
      question: formData.question,
      answer: formData.answer,
      category: formData.category,
      difficulty: formData.difficulty,
      correctCount: 0,
      totalAttempts: 0,
    };

    dispatch({ type: 'ADD_FLASHCARD', payload: newFlashcard });
    onBack();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const difficultyOptions = [
    { value: 'easy', label: 'Easy', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/20', description: 'Basic concepts and simple recall' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/20', description: 'Moderate complexity requiring understanding' },
    { value: 'hard', label: 'Hard', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/20', description: 'Complex concepts requiring deep knowledge' },
  ];

  const categoryOptions = [
    'General', 'Software Architecture', 'SOLID Principles', 'Database Design', 'Programming', 
    'Mathematics', 'Science', 'History', 'Languages', 'Business', 'Personal Development'
  ];

  const questionSuggestions = [
    "What is the primary benefit of microservices architecture?",
    "Define the single responsibility principle",
    "What are the ACID properties in database transactions?",
    "Explain the difference between REST and GraphQL",
    "What is the purpose of dependency injection?"
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
            Create New Flashcard
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
            {/* Question */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <HelpCircle size={16} />
                <span>Question *</span>
              </label>
              <textarea
                value={formData.question}
                onChange={(e) => handleInputChange('question', e.target.value)}
                rows={3}
                className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                  errors.question ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                }`}
                placeholder="Enter your question here... (e.g., What is the primary benefit of microservices architecture?)"
              />
              {errors.question && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.question}</p>
              )}
            </div>

            {/* Answer */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <Lightbulb size={16} />
                <span>Answer *</span>
              </label>
              <textarea
                value={formData.answer}
                onChange={(e) => handleInputChange('answer', e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                  errors.answer ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                }`}
                placeholder="Enter the answer here... Be clear and concise for better learning."
              />
              {errors.answer && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.answer}</p>
              )}
            </div>

            {/* Category and Difficulty Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              {/* Difficulty */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  <BarChart3 size={16} />
                  <span>Difficulty Level</span>
                </label>
                <div className="space-y-2">
                  {difficultyOptions.map((option) => (
                    <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="difficulty"
                        value={option.value}
                        checked={formData.difficulty === option.value}
                        onChange={(e) => handleInputChange('difficulty', e.target.value)}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500 mt-1"
                      />
                      <div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${option.bg} ${option.color}`}>
                          {option.label}
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {option.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
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
                <span>Create Flashcard</span>
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Question Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Question Suggestions
            </h3>
          </div>
          <div className="space-y-2">
            {questionSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleInputChange('question', suggestion)}
                className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-300"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Flashcard Creation Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Keep questions clear and specific for better recall</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Write concise answers that capture the key concept</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Use categories to organize related flashcards</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-secondary-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Set appropriate difficulty for spaced repetition</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};