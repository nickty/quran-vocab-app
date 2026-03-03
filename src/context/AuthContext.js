import React, { createContext, useState, useContext } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const register = async (email, password, name) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: name
      });
      
      // Create user profile in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name,
        email,
        createdAt: new Date().toISOString(),
        totalWordsLearned: 0,
        currentLevel: 1,
        streak: 0,
        lastActive: new Date().toISOString(),
        masteredWords: [],
        learningWords: [],
        quizScores: []
      });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last active
      const userRef = doc(db, 'users', userCredential.user.uid);
      await updateDoc(userRef, {
        lastActive: new Date().toISOString()
      });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getUserProgress = async (userId) => {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
      return null;
    } catch (error) {
      console.error('Error getting user progress:', error);
      return null;
    }
  };

  const updateUserProgress = async (userId, data) => {
    try {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, data);
      return { success: true };
    } catch (error) {
      console.error('Error updating user progress:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    getUserProgress,
    updateUserProgress
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};