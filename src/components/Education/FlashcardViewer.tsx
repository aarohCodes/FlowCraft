import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export const FlashcardViewer: React.FC = () => {
  const { state } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const flashcards = state.flashcards;
  const currentCard = flashcards[currentIndex];

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    setIsFlipped(false);
    setShowAnswer(false);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    setIsFlipped(false);
    setShowAnswer(false);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setShowAnswer(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (!currentCard) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg text-center">
        <p className="text-gray-600 dark:text-gray-400">No flashcards available. Create some to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Flashcard Study
        </h3>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {currentIndex + 1} of {flashcards.length}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentCard.difficulty)}`}>
            {currentCard.difficulty}
          </span>
        </div>
      </div>

      <div className="relative h-64 mb-6">
        <motion.div
          key={currentIndex}
          initial={{ rotateY: 0 }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="w-full h-full cursor-pointer"
          style={{ transformStyle: 'preserve-3d' }}
          onClick={handleFlip}
        >
          {/* Front of card */}
          <div 
            className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg border-2 border-dashed border-primary-300 dark:border-primary-700 flex items-center justify-center p-6"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {currentCard.question}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Click to reveal answer
              </p>
            </div>
          </div>

          {/* Back of card */}
          <div 
            className="absolute inset-0 w-full h-full bg-gradient-to-br from-accent-50 to-green-50 dark:from-accent-900/20 dark:to-green-900/20 rounded-lg border-2 border-accent-300 dark:border-accent-700 flex items-center justify-center p-6"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {currentCard.answer}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Card Info */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Category: {currentCard.category}</span>
          <span className="text-gray-600 dark:text-gray-400">
            Success Rate: {currentCard.totalAttempts > 0 ? Math.round((currentCard.correctCount / currentCard.totalAttempts) * 100) : 0}%
          </span>
        </div>
      </div>

      {/* Answer Feedback */}
      <AnimatePresence>
        {showAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 text-center">
              How well did you know this?
            </p>
            <div className="flex items-center justify-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
              >
                <XCircle size={16} />
                <span>Didn't Know</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
              >
                <CheckCircle size={16} />
                <span>Knew It</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={prevCard}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <ChevronLeft size={16} />
          <span>Previous</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setIsFlipped(false);
            setShowAnswer(false);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/30 transition-colors"
        >
          <RotateCcw size={16} />
          <span>Reset</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={nextCard}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <span>Next</span>
          <ChevronRight size={16} />
        </motion.button>
      </div>
    </div>
  );
};