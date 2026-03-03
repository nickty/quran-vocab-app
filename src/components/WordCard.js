import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import PronunciationButton from './PronunciationButton';

const WordCard = ({ word, onPress, showMeaning = false }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.wordArabic}>{word.word}</Text>
        <PronunciationButton word={word.word} />
      </View>
      
      {showMeaning && (
        <View style={styles.meaningContainer}>
          <Text style={styles.meaning}>{word.meaning}</Text>
          <Text style={styles.partOfSpeech}>{word.partOfSpeech}</Text>
        </View>
      )}
      
      <Text style={styles.frequency}>Frequency: {word.frequency}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  wordArabic: {
    fontSize: 24,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  meaningContainer: {
    marginBottom: 10,
  },
  meaning: {
    fontSize: 18,
    color: '#333',
    marginBottom: 5,
  },
  partOfSpeech: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  frequency: {
    fontSize: 12,
    color: '#999',
  },
});

export default WordCard;