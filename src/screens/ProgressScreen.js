import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { auth } from '../../firebase';
import { useAuth } from '../context/AuthContext';
import { quranWords } from '../utils/quranData';

const ProgressScreen = () => {
  const [userProgress, setUserProgress] = useState(null);
  const [chartData, setChartData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: [0, 0, 0, 0, 0, 0, 0]
    }]
  });

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      const progress = await getUserProgress(userId);
      setUserProgress(progress);
      
      // Update chart data if we have quiz history
      if (progress?.quizScores) {
        // Process quiz scores for chart
        const weeklyData = processWeeklyData(progress.quizScores);
        setChartData(weeklyData);
      }
    }
  };

  const processWeeklyData = (quizScores) => {
    // This is a simplified version - you'd want to aggregate actual data
    return {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        data: [5, 7, 8, 6, 9, 7, 8]
      }]
    };
  };

  const calculateStats = () => {
    const totalWords = quranWords.length;
    const learnedWords = userProgress?.totalWordsLearned || 0;
    const percentage = (learnedWords / totalWords) * 100;

    return {
      totalWords,
      learnedWords,
      percentage: percentage.toFixed(1),
      remainingWords: totalWords - learnedWords,
      averageScore: userProgress?.quizScores?.average || 75
    };
  };

  const stats = calculateStats();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Progress</Text>
        <Text style={styles.headerSubtitle}>Keep up the great work!</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.learnedWords}</Text>
          <Text style={styles.statLabel}>Words Learned</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.percentage}%</Text>
          <Text style={styles.statLabel}>of Quran Complete</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.remainingWords}</Text>
          <Text style={styles.statLabel}>Words Remaining</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.averageScore}%</Text>
          <Text style={styles.statLabel}>Avg Quiz Score</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Weekly Activity</Text>
        <LineChart
          data={chartData}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.achievementsContainer}>
        <Text style={styles.sectionTitle}>Recent Achievements</Text>
        
        <View style={styles.achievementCard}>
          <Text style={styles.achievementEmoji}>🏆</Text>
          <View style={styles.achievementInfo}>
            <Text style={styles.achievementTitle}>First 10 Words</Text>
            <Text style={styles.achievementDesc}>Learned your first 10 Quranic words</Text>
          </View>
        </View>

        <View style={styles.achievementCard}>
          <Text style={styles.achievementEmoji}>⭐</Text>
          <View style={styles.achievementInfo}>
            <Text style={styles.achievementTitle}>Quiz Master</Text>
            <Text style={styles.achievementDesc}>Scored 100% on a quiz</Text>
          </View>
        </View>

        <View style={styles.achievementCard}>
          <Text style={styles.achievementEmoji}>🔥</Text>
          <View style={styles.achievementInfo}>
            <Text style={styles.achievementTitle}>3 Day Streak</Text>
            <Text style={styles.achievementDesc}>Learned for 3 days in a row</Text>
          </View>
        </View>
      </View>

      <View style={styles.nextMilestone}>
        <Text style={styles.milestoneTitle}>Next Milestone</Text>
        <Text style={styles.milestoneText}>
          {stats.learnedWords < 50 
            ? `Learn ${50 - stats.learnedWords} more words to reach 50 words!` 
            : 'Congratulations on reaching 50 words!'}
        </Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${Math.min((stats.learnedWords / 50) * 100, 100)}%` }
            ]} 
          />
        </View>
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
    backgroundColor: '#2E7D32',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginTop: 5,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    marginTop: -20,
  },
  statBox: {
    backgroundColor: '#fff',
    width: '45%',
    margin: '2.5%',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 3,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 15,
    borderRadius: 15,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  achievementsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  achievementCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
  },
  achievementEmoji: {
    fontSize: 30,
    marginRight: 15,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  achievementDesc: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  nextMilestone: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
  },
  milestoneTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  milestoneText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2E7D32',
    borderRadius: 5,
  },
});

export default ProgressScreen;