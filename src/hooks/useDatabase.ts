import { useState } from 'react'
import { useApp } from '../contexts/AppContext'
import { Task, Flashcard } from '../types'

// Mock database storage
const mockDatabase = {
  tasks: [] as Task[],
  flashcards: [] as Flashcard[]
};

export function useDatabase() {
  const { dispatch } = useApp()
  const [loading, setLoading] = useState(false)

  const loadUserData = async () => {
    setLoading(true)
    try {
      // Load tasks from mock database
      const tasks = mockDatabase.tasks;
      dispatch({ type: 'LOAD_TASKS', payload: tasks })

      // Load flashcards from mock database
      const flashcards = mockDatabase.flashcards;
      dispatch({ type: 'LOAD_FLASHCARDS', payload: flashcards })
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveTask = async (task: Task) => {
    try {
      // Save task to mock database
      const existingTaskIndex = mockDatabase.tasks.findIndex(t => t.id === task.id);
      
      if (existingTaskIndex >= 0) {
        // Update existing task
        mockDatabase.tasks[existingTaskIndex] = task;
      } else {
        // Add new task
        mockDatabase.tasks.push(task);
      }
      
      return { data: task, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      // Delete task from mock database
      mockDatabase.tasks = mockDatabase.tasks.filter(t => t.id !== taskId);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  const saveFlashcard = async (flashcard: Flashcard) => {
    try {
      // Save flashcard to mock database
      const existingFlashcardIndex = mockDatabase.flashcards.findIndex(f => f.id === flashcard.id);
      
      if (existingFlashcardIndex >= 0) {
        // Update existing flashcard
        mockDatabase.flashcards[existingFlashcardIndex] = flashcard;
      } else {
        // Add new flashcard
        mockDatabase.flashcards.push(flashcard);
      }
      
      return { data: flashcard, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  const deleteFlashcard = async (flashcardId: string) => {
    try {
      // Delete flashcard from mock database
      mockDatabase.flashcards = mockDatabase.flashcards.filter(f => f.id !== flashcardId);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  return {
    loading,
    loadUserData,
    saveTask,
    deleteTask,
    saveFlashcard,
    deleteFlashcard,
  }
}