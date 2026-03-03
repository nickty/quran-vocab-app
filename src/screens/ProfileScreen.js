import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { auth } from '../../firebase';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = ({ navigation }) => {
  const { logout, getUserProgress } = useAuth();
  const [userStats, setUserStats] = useState({
    name: '',
    email: '',
    memberSince: '',
    totalWords: 0,
    streak: 0,
    quizzesTaken: 0
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const user = auth.currentUser;
    if (user) {
      const progress = await getUserProgress(user.uid);
      setUserStats({
        name: user.displayName || progress?.name || 'Learner',
        email: user.email || '',
        memberSince: progress?.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
        totalWords: progress?.totalWordsLearned || 0,
        streak: progress?.streak || 0,
        quizzesTaken: progress?.quizScores?.length || 0
      });
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          onPress: async () => {
            const result = await logout();
            if (!result.success) {
              Alert.alert('Error', result.error);
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  const menuItems = [
    { icon: 'book', title: 'My Learning Plan', screen: 'Learn' },
    { icon: 'settings', title: 'App Settings', screen: 'Settings' },
    { icon: 'help', title: 'Help & Support', screen: 'Support' },
    { icon: 'info', title: 'About', screen: 'About' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image
            source={require('../../assets/icon.png')}
            style={styles.profileImage}
          />
        </View>
        <Text style={styles.userName}>{userStats.name}</Text>
        <Text style={styles.userEmail}>{userStats.email}</Text>
        <Text style={styles.memberSince}>Member since {userStats.memberSince}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userStats.totalWords}</Text>
          <Text style={styles.statLabel}>Words Learned</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userStats.streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userStats.quizzesTaken}</Text>
          <Text style={styles.statLabel}>Quizzes</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Icon name={item.icon} size={24} color="#2E7D32" />
            <Text style={styles.menuItemText}>{item.title}</Text>
            <Icon name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={24} color="#f44336" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Version 1.0.0</Text>
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
    paddingTop: 30,
    paddingBottom: 30,
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 5,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 5,
  },
  memberSince: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop: -20,
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
    elevation: 5,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#ddd',
  },
  menuContainer: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 20,
    padding: 15,
    borderRadius: 15,
    justifyContent: 'center',
    elevation: 3,
  },
  logoutText: {
    fontSize: 18,
    color: '#f44336',
    marginLeft: 10,
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    color: '#999',
    marginBottom: 20,
  },
});

export default ProfileScreen;