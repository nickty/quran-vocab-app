import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';
import { auth } from '../../firebase';
import { useAuth } from '../context/AuthContext';
import { getWordsByFrequency } from '../utils/quranData';
import ProgressBar from '../components/ProgressBar';

const HomeScreen = ({ navigation }) => {
  const { getUserProgress } = useAuth();
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalWords: 0,
    masteredToday: 0,
    streak: 0,
    level: 1
  });

  useEffect(() => {
    loadUserProgress();
  }, []);

  const loadUserProgress = async () => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      const progress = await getUserProgress(userId);
      setUserProgress(progress);
      setStats({
        totalWords: progress?.totalWordsLearned || 0,
        masteredToday: progress?.masteredToday || 0,
        streak: progress?.streak || 0,
        level: progress?.currentLevel || 1
      });
    }
    setLoading(false);
  };

  const popularWords = getWordsByFrequency(5);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{auth.currentUser?.displayName || 'Learner'}</Text>
        </View>
        <Image
          source={require('../../assets/icon.png')}
          style={styles.profileIcon}
        />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalWords}</Text>
          <Text style={styles.statLabel}>Words Learned</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.level}</Text>
          <Text style={styles.statLabel}>Level</Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <Text style={styles.sectionTitle}>Today's Progress</Text>
        <ProgressBar progress={stats.masteredToday / 10} />
        <Text style={styles.progressText}>{stats.masteredToday}/10 words mastered today</Text>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => navigation.navigate('Learn')}
        >
          <Text style={styles.actionEmoji}>📚</Text>
          <Text style={styles.actionTitle}>Learn New Words</Text>
          <Text style={styles.actionSubtitle}>5 words remaining</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => navigation.navigate('Quiz')}
        >
          <Text style={styles.actionEmoji}>🎯</Text>
          <Text style={styles.actionTitle}>Daily Quiz</Text>
          <Text style={styles.actionSubtitle}>Test your knowledge</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.popularSection}>
        <Text style={styles.sectionTitle}>Most Frequent Words</Text>
        {popularWords.map((word, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.wordCard}
            onPress={() => navigation.navigate('Learn', { word: word.word })}
          >
            <Text style={styles.wordArabic}>{word.word}</Text>
            <Text style={styles.wordMeaning}>{word.meaning}</Text>
            <Text style={styles.wordFrequency}>Frequency: {word.frequency}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#2E7D32',
  },
  greeting: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#fff',
    marginTop: -20,
    marginHorizontal: 20,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statCard: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  progressSection: {
    padding: 20,
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  progressText: {
    textAlign: 'center',
    marginTop: 10,
    color: '#666',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  actionCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    width: '45%',
    elevation: 3,
  },
  actionEmoji: {
    fontSize: 30,
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  popularSection: {
    padding: 20,
  },
  wordCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  wordArabic: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
  },
  wordMeaning: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  wordFrequency: {
    fontSize: 12,
    color: '#999',
  },
});

export default HomeScreen;