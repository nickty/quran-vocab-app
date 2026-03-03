import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView
} from 'react-native';
import { auth } from '../../firebase';
import { useAuth } from '../context/AuthContext';
import { getRandomWords } from '../utils/quranData';

const QuizScreen = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const { updateUserProgress } = useAuth();

  useEffect(() => {
    loadQuiz();
  }, []);

  const loadQuiz = () => {
    const randomWords = getRandomWords(10);
    const quizQuestions = randomWords.map(word => ({
      question: `What does "${word.word}" mean?`,
      word: word.word,
      correctAnswer: word.meaning,
      options: generateOptions(word.meaning, word.partOfSpeech)
    }));
    setQuestions(quizQuestions);
  };

  const generateOptions = (correctMeaning, partOfSpeech) => {
    // Generate 3 random incorrect options
    const allMeanings = quranWords.map(w => w.meaning);
    const incorrectOptions = [];
    
    while (incorrectOptions.length < 3) {
      const randomMeaning = allMeanings[Math.floor(Math.random() * allMeanings.length)];
      if (randomMeaning !== correctMeaning && !incorrectOptions.includes(randomMeaning)) {
        incorrectOptions.push(randomMeaning);
      }
    }

    // Combine and shuffle
    const options = [correctMeaning, ...incorrectOptions];
    return options.sort(() => Math.random() - 0.5);
  };

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    setShowAnswer(true);
    
    const isCorrect = answer === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      setShowAnswer(false);
      setSelectedAnswer(null);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setShowResult(true);
        saveQuizResult();
      }
    }, 1500);
  };

  const saveQuizResult = async () => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      await updateUserProgress(userId, {
        quizScores: {
          date: new Date().toISOString(),
          score: score,
          total: questions.length
        }
      });
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    loadQuiz();
  };

  if (showResult) {
    return (
      <View style={styles.container}>
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Quiz Complete!</Text>
          <Text style={styles.resultScore}>
            Your Score: {score}/{questions.length}
          </Text>
          <Text style={styles.resultPercentage}>
            {Math.round((score / questions.length) * 100)}%
          </Text>
          
          <TouchableOpacity style={styles.restartButton} onPress={restartQuiz}>
            <Text style={styles.restartButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Loading quiz...</Text>
      </View>
    );
  }

  const question = questions[currentQuestion];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.questionCount}>
          Question {currentQuestion + 1}/{questions.length}
        </Text>
        <Text style={styles.score}>Score: {score}</Text>
      </View>

      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{question.word}</Text>
        
        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                showAnswer && option === question.correctAnswer && styles.correctOption,
                showAnswer && selectedAnswer === option && 
                option !== question.correctAnswer && styles.incorrectOption,
                !showAnswer && styles.optionButton
              ]}
              onPress={() => handleAnswer(option)}
              disabled={showAnswer}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#2E7D32',
  },
  questionCount: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  score: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  questionCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
  },
  questionText: {
    fontSize: 42,
    textAlign: 'center',
    color: '#2E7D32',
    marginBottom: 30,
  },
  optionsContainer: {
    gap: 10,
  },
  optionButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  optionText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
  },
  correctOption: {
    backgroundColor: '#4CAF50',
    borderColor: '#388E3C',
  },
  incorrectOption: {
    backgroundColor: '#f44336',
    borderColor: '#d32f2f',
  },
  resultCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 3,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 20,
  },
  resultScore: {
    fontSize: 24,
    color: '#333',
    marginBottom: 10,
  },
  resultPercentage: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 30,
  },
  restartButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  restartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default QuizScreen;