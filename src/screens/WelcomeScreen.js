import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const WelcomeScreen = ({ navigation }) => {
  const { startDemoMode, demoReviewerLogin } = useAuth();

  // Auto-login for Google Play reviewers (special case)
  useEffect(() => {
    const checkForReviewer = async () => {
      // This will auto-login with demo account for Google Play review
      const result = await demoReviewerLogin();
      if (!result.success) {
        console.log('Not in reviewer mode, showing options');
      }
    };
    
    // Uncomment this for production build to auto-login reviewers
    // checkForReviewer();
  }, []);

  const handleContinueAsGuest = async () => {
    await startDemoMode();
  };

  const handleCreateAccount = () => {
    navigation.navigate('Register');
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/icon.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Quran Vocabulary</Text>
        <Text style={styles.subtitle}>Learn the words of Allah</Text>
      </View>

      <View style={styles.featuresContainer}>
        <Text style={styles.featuresTitle}>✨ Features:</Text>
        <View style={styles.featureItem}>
          <Text style={styles.featureText}>✓ 500+ Quranic words</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureText}>✓ Audio pronunciation</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureText}>✓ Interactive quizzes</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureText}>✓ Progress tracking</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureText}>✓ No login required to start</Text>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={styles.guestButton} 
          onPress={handleContinueAsGuest}
        >
          <Text style={styles.guestButtonText}>Continue as Guest</Text>
          <Text style={styles.guestButtonSubtext}>Start learning immediately</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity 
          style={styles.createButton} 
          onPress={handleCreateAccount}
        >
          <Text style={styles.createButtonText}>Create Account</Text>
          <Text style={styles.createButtonSubtext}>Save progress to cloud</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.loginLink} 
          onPress={handleLogin}
        >
          <Text style={styles.loginText}>
            Already have an account? Sign in
          </Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Guest mode saves progress locally on your device.
          Create an account to sync across devices and never lose progress.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logoContainer: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  featuresContainer: {
    flex: 1,
    padding: 20,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  featureItem: {
    marginBottom: 10,
  },
  featureText: {
    fontSize: 16,
    color: '#666',
  },
  buttonsContainer: {
    flex: 1.5,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  guestButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  guestButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  guestButtonSubtext: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.9,
    marginTop: 5,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#999',
    fontSize: 14,
  },
  createButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  createButtonSubtext: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.9,
    marginTop: 5,
  },
  loginLink: {
    alignItems: 'center',
    marginBottom: 20,
  },
  loginText: {
    color: '#2E7D32',
    fontSize: 16,
  },
  disclaimer: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default WelcomeScreen;