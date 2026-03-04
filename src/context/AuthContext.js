import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { DEMO_ACCOUNT } from '../config/demoAccount';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [demoProgress, setDemoProgress] = useState({});

  // Load demo progress from AsyncStorage on startup
  useEffect(() => {
    loadDemoProgress();
    checkSavedUser();
  }, []);

  const loadDemoProgress = async () => {
    try {
      const savedProgress = await AsyncStorage.getItem('demoProgress');
      if (savedProgress) {
        setDemoProgress(JSON.parse(savedProgress));
      }
    } catch (error) {
      console.error('Error loading demo progress:', error);
    }
  };

  const checkSavedUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  // Start in demo mode (no login required)
  const startDemoMode = async () => {
    setIsDemoMode(true);
    setUser({
      uid: 'demo-user',
      email: 'demo@local',
      displayName: 'Guest User',
      isDemo: true
    });
    await AsyncStorage.setItem('isDemoMode', 'true');
  };

  // Convert demo progress to real account
  const convertDemoToAccount = async (email, password, name) => {
    try {
      setLoading(true);
      
      // Create real Firebase account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile
      await updateProfile(userCredential.user, {
        displayName: name
      });
      
      // Save demo progress to Firebase
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name,
        email,
        createdAt: new Date().toISOString(),
        ...demoProgress, // Merge demo progress
        lastActive: new Date().toISOString()
      });
      
      // Clear demo mode
      setIsDemoMode(false);
      await AsyncStorage.removeItem('isDemoMode');
      await AsyncStorage.removeItem('demoProgress');
      
      setUser(userCredential.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Special login for Google Play reviewers
  const demoReviewerLogin = async () => {
    try {
      setLoading(true);
      
      // Try to sign in with demo account
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth, 
          DEMO_ACCOUNT.email, 
          DEMO_ACCOUNT.password
        );
        setUser(userCredential.user);
        setIsDemoMode(false);
        return { success: true, isReviewer: true };
      } catch (error) {
        // If account doesn't exist, create it
        if (error.code === 'auth/user-not-found') {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            DEMO_ACCOUNT.email,
            DEMO_ACCOUNT.password
          );
          
          await updateProfile(userCredential.user, {
            displayName: DEMO_ACCOUNT.name
          });
          
          // Create reviewer profile in Firestore
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            name: DEMO_ACCOUNT.name,
            email: DEMO_ACCOUNT.email,
            isReviewer: true,
            createdAt: new Date().toISOString(),
            totalWordsLearned: 500, // Unlock all words for review
            currentLevel: 10,
            masteredWords: [], // Will be populated during review
            learningWords: []
          });
          
          setUser(userCredential.user);
          setIsDemoMode(false);
          return { success: true, isReviewer: true };
        }
        throw error;
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, name) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateProfile(userCredential.user, {
        displayName: name
      });
      
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
      
      setIsDemoMode(false);
      await AsyncStorage.removeItem('isDemoMode');
      setUser(userCredential.user);
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
      
      const userRef = doc(db, 'users', userCredential.user.uid);
      await updateDoc(userRef, {
        lastActive: new Date().toISOString()
      });
      
      setIsDemoMode(false);
      await AsyncStorage.removeItem('isDemoMode');
      setUser(userCredential.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (isDemoMode) {
        // Just clear demo mode
        setIsDemoMode(false);
        setUser(null);
        await AsyncStorage.removeItem('isDemoMode');
      } else {
        await signOut(auth);
        setUser(null);
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Save demo progress locally
  const saveDemoProgress = async (progress) => {
    const newProgress = { ...demoProgress, ...progress };
    setDemoProgress(newProgress);
    await AsyncStorage.setItem('demoProgress', JSON.stringify(newProgress));
  };

  const getUserProgress = async (userId) => {
    if (isDemoMode) {
      return demoProgress;
    }
    
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
    if (isDemoMode) {
      await saveDemoProgress(data);
      return { success: true };
    }
    
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
    isDemoMode,
    loading,
    startDemoMode,
    demoReviewerLogin,
    convertDemoToAccount,
    register,
    login,
    logout,
    getUserProgress,
    updateUserProgress
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};