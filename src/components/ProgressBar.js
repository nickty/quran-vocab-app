import React from 'react';
import { View, StyleSheet } from 'react-native';

const ProgressBar = ({ progress, height = 10, color = '#2E7D32' }) => {
  return (
    <View style={[styles.container, { height }]}>
      <View 
        style={[
          styles.fill, 
          { 
            width: `${Math.min(progress * 100, 100)}%`,
            backgroundColor: color,
            height 
          }
        ]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 5,
  },
});

export default ProgressBar;