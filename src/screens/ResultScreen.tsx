import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../../App';

type ResultScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Result'>;
  route: RouteProp<RootStackParamList, 'Result'>;
};

const ResultScreen: React.FC<ResultScreenProps> = ({ navigation, route }) => {
  const { passportPhotoUri, selfieUri, matchConfidence } = route.params;
  const isMatch = matchConfidence >= 80;

  return (
    <View style={styles.container}>
      <View style={styles.imagesContainer}>
        <View style={styles.imageWrapper}>
          <Text style={styles.imageLabel}>Passport Photo</Text>
          <Image source={{ uri: passportPhotoUri }} style={styles.image} />
        </View>
        <View style={styles.imageWrapper}>
          <Text style={styles.imageLabel}>Selfie</Text>
          <Image source={{ uri: selfieUri }} style={styles.image} />
        </View>
      </View>

      <View style={styles.resultContainer}>
        <Text style={styles.resultTitle}>
          {isMatch ? '✅ Match Found' : '❌ No Match'}
        </Text>
        <Text style={styles.confidenceText}>
          Confidence Score: {matchConfidence.toFixed(1)}%
        </Text>
        <Text style={styles.thresholdText}>
          (Threshold: 80%)
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>Start New Verification</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  imagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  imageWrapper: {
    flex: 1,
    margin: 5,
    alignItems: 'center',
  },
  imageLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  resultContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  confidenceText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 5,
  },
  thresholdText: {
    fontSize: 14,
    color: '#999',
  },
  button: {
    backgroundColor: '#f4511e',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ResultScreen; 