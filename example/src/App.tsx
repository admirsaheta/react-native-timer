import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTime } from 'react-native-timer'; // Adjust the import based on your actual file structure

const App = () => {
  const { hours, minutes, seconds, ampm } = useTime({ format: '12-hour' });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{`${hours}:${minutes}:${seconds} ${ampm}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default App;
