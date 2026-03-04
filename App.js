import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

// Keep splash screen visible while we check auth
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [user, setUser] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      // Check if user was in demo mode
      const demoMode = await AsyncStorage.getItem('isDemoMode');
      
      // Check Firebase auth state
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          setUser(firebaseUser);
          setIsDemoMode(false);
        } else if (demoMode === 'true') {
          // User was in demo mode
          setIsDemoMode(true);
          setUser({
            uid: 'demo-user',
            email: 'demo@local',
            displayName: 'Guest User',
            isDemo: true
          });
        } else {
          // No user, show options
          setUser(null);
          setIsDemoMode(false);
        }
        setLoading(false);
        await SplashScreen.hideAsync();
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error checking auth state:', error);
      setLoading(false);
      await SplashScreen.hideAsync();
    }
  };

  if (loading) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <AuthProvider>
          <NavigationContainer>
            <AppNavigator 
              user={user} 
              isDemoMode={isDemoMode}
            />
          </NavigationContainer>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}