import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import LearnScreen from '../screens/LearnScreen';
import QuizScreen from '../screens/QuizScreen';
import ProgressScreen from '../screens/ProgressScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SaveProgressScreen from '../screens/SaveProgressScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabs = ({ isDemoMode }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Learn') {
            iconName = 'school';
          } else if (route.name === 'Quiz') {
            iconName = 'quiz';
          } else if (route.name === 'Progress') {
            iconName = 'trending-up';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#2E7D32',
        },
        headerTintColor: '#fff',
        headerRight: () => 
          isDemoMode ? (
            <Icon.Button
              name="cloud-upload"
              backgroundColor="#2E7D32"
              onPress={() => navigation.navigate('SaveProgress')}
            >
              Save
            </Icon.Button>
          ) : null
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        initialParams={{ isDemoMode }}
      />
      <Tab.Screen 
        name="Learn" 
        component={LearnScreen}
        initialParams={{ isDemoMode }}
      />
      <Tab.Screen 
        name="Quiz" 
        component={QuizScreen}
        initialParams={{ isDemoMode }}
      />
      <Tab.Screen 
        name="Progress" 
        component={ProgressScreen}
        initialParams={{ isDemoMode }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        initialParams={{ isDemoMode }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = ({ user, isDemoMode }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user && !isDemoMode ? (
        // No user - show welcome screen with options
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
      ) : (
        // User logged in OR in demo mode - show main app
        <Stack.Screen name="Main">
          {props => <MainTabs {...props} isDemoMode={isDemoMode} />}
        </Stack.Screen>
      )}
      
      {/* Auth screens - accessible from welcome screen */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="SaveProgress" component={SaveProgressScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;