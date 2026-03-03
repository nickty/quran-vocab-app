import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert
} from 'react-native';
import * as Speech from 'expo-speech';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PronunciationButton = ({ word, onPress }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = async () => {
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

  return (
    <TouchableOpacity 
      style={styles.button} 
      onPress={speak}
      disabled={isSpeaking}
    >
      <Icon 
        name={isSpeaking ? "volume-off" : "volume-up"} 
        size={24} 
        color="#2E7D32" 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 5,
  },
});

export default PronunciationButton;