import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';
import * as Speech from 'expo-speech';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { auth } from '../../firebase';
import { useAuth } from '../context/AuthContext';
import { quranWords } from '../utils/quranData';

const LearnScreen = () => {
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [learnedWords, setLearnedWords] = useState([]);
  const [showMeaning, setShowMeaning] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { getUserProgress, updateUserProgress } = useAuth();

  useEffect(() => {
    setWords(quranWords.slice(0, 20));
    loadUserProgress();
  }, []);

  const loadUserProgress = async () => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      const progress = await getUserProgress(userId);
      if (progress?.learningWords) {
        setLearnedWords(progress.learningWords);
      }
    }
  };

  const speakWord = async (word) => {
    try {
      setIsSpeaking(true);
      await Speech.speak(word, {
        language: 'ar',
        pitch: 1,
        rate: 0.8,
        onDone: () => setIsSpeaking(false),
        onError: () => {
          setIsSpeaking(false);
          Alert.alert('Error', 'Failed to pronounce word');
        }
      });
    } catch (error) {
      setIsSpeaking(false);
      Alert.alert('Error', 'Speech not available');
    }
  };

  const markAsLearned = async () => {
    const currentWord = words[currentIndex];
    const newLearnedWords = [...learnedWords, currentWord.word];
    setLearnedWords(newLearnedWords);

    const userId = auth.currentUser?.uid;
    if (userId) {
      await updateUserProgress(userId, {
        learningWords: newLearnedWords,
        totalWordsLearned: newLearnedWords.length
      });
    }

    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowMeaning(false);
    } else {
      Alert.alert('Congratulations!', 'You have completed all words for today!');
    }
  };

  const renderWord = () => {
    if (words.length === 0) return null;
    const currentWord = words[currentIndex];

    return (
      <View style={styles.wordContainer}>
        <Text style={styles.wordArabic}>{currentWord.word}</Text>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.listenButton, isSpeaking && styles.disabledButton]}
            onPress={() => speakWord(currentWord.word)}
            disabled={isSpeaking}
          >
            <Icon name="volume-up" size={20} color="#fff" />
            <Text style={styles.buttonText}>
              {isSpeaking ? 'Playing...' : 'Listen'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.meaningButton}
            onPress={() => setShowMeaning(!showMeaning)}
          >
            <Icon name="translate" size={20} color="#fff" />
            <Text style={styles.buttonText}>
              {showMeaning ? 'Hide' : 'Meaning'}
            </Text>
          </TouchableOpacity>
        </View>

        {showMeaning && (
          <View style={styles.meaningContainer}>
            <Text style={styles.meaning}>{currentWord.meaning}</Text>
            <Text style={styles.partOfSpeech}>{currentWord.partOfSpeech}</Text>
            <Text style={styles.example}>Example: {currentWord.example}</Text>
            <Text style={styles.translation}>Translation: {currentWord.translation}</Text>
            <Text style={styles.frequency}>Frequency: {currentWord.frequency}</Text>
          </View>
        )}

        <TouchableOpacity 
          style={styles.learnedButton} 
          onPress={markAsLearned}
          disabled={learnedWords.includes(currentWord.word)}
        >
          <Text style={styles.learnedButtonText}>
            {learnedWords.includes(currentWord.word) ? 'Already Learned' : 'Mark as Learned'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.progress}>
          Word {currentIndex + 1} of {words.length}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Learn Quranic Words</Text>
        <Text style={styles.headerSubtitle}>
          {words.length - learnedWords.length} words remaining
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {renderWord()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2E7D32',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginTop: 5,
  },
  content: {
    flexGrow: 1,
    padding: 20,
  },
  wordContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  wordArabic: {
    fontSize: 48,
    textAlign: 'center',
    color: '#2E7D32',
    marginBottom: 30,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'normal',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    gap: 10,
  },
  listenButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    gap: 8,
    flex: 1,
    justifyContent: 'center',
  },
  meaningButton: {
    backgroundColor: '#FF9800',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    gap: 8,
    flex: 1,
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  meaningContainer: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 10,
    marginVertical: 20,
  },
  meaning: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  partOfSpeech: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 10,
  },
  example: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  translation: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  frequency: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
  },
  learnedButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  learnedButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  progress: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
});

export default LearnScreen;