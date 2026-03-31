import { Question, MOCK_QUESTIONS } from '../types';
import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

// Simulate a backend fetch with a delay
export const fetchMinisterialQuestions = async (subjectId?: string, userId?: string): Promise<Question[]> => {
  return new Promise(async (resolve) => {
    let questions: Question[] = [];
    if (subjectId) {
      questions = (MOCK_QUESTIONS[subjectId] || []).filter(q => q.isMinisterial);
    } else {
      // Flatten all ministerial questions
      Object.values(MOCK_QUESTIONS).forEach(subjectQuestions => {
        questions = [...questions, ...subjectQuestions.filter(q => q.isMinisterial)];
      });
    }
    
    // Load user markings from Firestore if userId is provided
    let markings: Record<string, { isChallenging: boolean, isImportant: boolean }> = {};
    if (userId) {
      // We could fetch all markings for the user, but for now let's assume we fetch them per question or in bulk
      // For simplicity in this mock-heavy app, let's just use the provided questions and fetch their markings
      for (const q of questions) {
        const markingDoc = await getDoc(doc(db, 'users', userId, 'markings', q.id));
        if (markingDoc.exists()) {
          markings[q.id] = markingDoc.data() as any;
        }
      }
    } else {
      // Fallback to localStorage for guest
      markings = JSON.parse(localStorage.getItem('question_markings') || '{}');
    }
    
    const markedQuestions = questions.map(q => ({
      ...q,
      isChallenging: markings[q.id]?.isChallenging || false,
      isImportant: markings[q.id]?.isImportant || false,
    }));
    
    resolve(markedQuestions);
  });
};

export const toggleQuestionMarking = async (userId: string | undefined, questionId: string, type: 'isChallenging' | 'isImportant') => {
  if (!userId) {
    // Guest fallback
    const markings = JSON.parse(localStorage.getItem('question_markings') || '{}');
    if (!markings[questionId]) {
      markings[questionId] = { isChallenging: false, isImportant: false };
    }
    markings[questionId][type] = !markings[questionId][type];
    localStorage.setItem('question_markings', JSON.stringify(markings));
    return markings[questionId][type];
  }

  const markingRef = doc(db, 'users', userId, 'markings', questionId);
  const markingDoc = await getDoc(markingRef);
  
  if (!markingDoc.exists()) {
    const newMarking = {
      userId,
      questionId,
      isImportant: type === 'isImportant',
      isChallenging: type === 'isChallenging',
      updatedAt: new Date().toISOString()
    };
    await setDoc(markingRef, newMarking);
    return newMarking[type];
  } else {
    const currentData = markingDoc.data();
    const newValue = !currentData[type];
    await updateDoc(markingRef, {
      [type]: newValue,
      updatedAt: new Date().toISOString()
    });
    return newValue;
  }
};
