import { Injectable } from '@angular/core';

interface ExamState {
  examId: string;
  formData: any;
  timeLeft: number;
  pageIndex: number;
  timestamp: number;
}

@Injectable({
  providedIn: 'root',
})
export class ExamStateService {
  private readonly STORAGE_KEY = 'exam_state';
  private readonly STATE_EXPIRY_MS = 6 * 60 * 60 * 1000; // 6 hours

  /**
   * Save exam state to sessionStorage
   * @param examId - The exam ID
   * @param formData - The form data to save
   * @param timeLeft - Remaining time in seconds
   * @param pageIndex - Current page/question index
   */
  saveExamState(
    examId: string,
    formData: any,
    timeLeft: number,
    pageIndex: number
  ): void {
    try {
      const state: ExamState = {
        examId,
        formData,
        timeLeft,
        pageIndex,
        timestamp: Date.now(),
      };
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to save exam state:', error);
    }
  }

  /**
   * Load exam state from sessionStorage
   * @param examId - The exam ID to verify against stored state
   * @returns ExamState if found and valid, null otherwise
   */
  loadExamState(examId: string): ExamState | null {
    try {
      const stored = sessionStorage.getItem(this.STORAGE_KEY);
      if (!stored) return null;

      const state: ExamState = JSON.parse(stored);

      // Verify exam ID matches and state hasn't expired
      if (state.examId !== examId) return null;
      if (Date.now() - state.timestamp > this.STATE_EXPIRY_MS) {
        this.clearExamState();
        return null;
      }

      return state;
    } catch (error) {
      console.warn('Failed to load exam state:', error);
      return null;
    }
  }

  /**
   * Clear saved exam state
   */
  clearExamState(): void {
    try {
      sessionStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear exam state:', error);
    }
  }

  /**
   * Check if valid exam state exists
   */
  hasExamState(examId: string): boolean {
    const state = this.loadExamState(examId);
    return state !== null;
  }
}
