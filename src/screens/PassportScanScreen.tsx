import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Camera, CameraType } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import React, { useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createWorker } from 'tesseract.js';
import { RootStackParamList } from '../../App';

type PassportScanScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PassportScan'>;
};

const PassportScanScreen: React.FC<PassportScanScreenProps> = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<Camera>(null);

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const processImage = async (uri: string) => {
    try {
      setIsProcessing(true);
      
      // Get image dimensions
      const { width, height } = await ImageManipulator.manipulateAsync(
        uri,
        [],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );
      
      // Crop the image to focus on the MRZ area
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        [
          {
            crop: {
              originX: 0,
              originY: height * 0.7,
              width: width,
              height: height * 0.3,
            },
          },
          { resize: { width: width * 1.5 } },
        ],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );

      // Initialize Tesseract worker
      const worker = await createWorker();
      // @ts-ignore - Tesseract.js types are not properly exported
      await worker.loadLanguage('eng');
      // @ts-ignore - Tesseract.js types are not properly exported
      await worker.initialize('eng');

      // Perform OCR
      const { data: { text } } = await worker.recognize(manipulatedImage.uri);
      await worker.terminate();

      // Extract passport photo
      const passportPhoto = await ImageManipulator.manipulateAsync(
        uri,
        [
          {
            crop: {
              originX: width * 0.1,
              originY: height * 0.1,
              width: width * 0.3,
              height: height * 0.4,
            },
          },
        ],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );

      // Navigate to selfie screen with the passport photo
      navigation.navigate('Selfie', { passportPhotoUri: passportPhoto.uri });
    } catch (error) {
      Alert.alert('Error', 'Failed to process passport image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        await processImage(photo.uri);
      } catch (error) {
        Alert.alert('Error', 'Failed to capture image. Please try again.');
      }
    }
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Requesting camera permission...</Text></View>;
  }
  if (hasPermission === false) {
    return <View style={styles.container}><Text>No access to camera</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Camera
        // @ts-ignore - expo-camera types are not properly exported
        ref={cameraRef}
        style={styles.camera}
        type={CameraType.back}
        ratio="16:9"
      >
        <View style={styles.overlay}>
          <View style={styles.scanArea} />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, isProcessing && styles.buttonDisabled]}
            onPress={takePicture}
            disabled={isProcessing}
          >
            <Text style={styles.buttonText}>
              {isProcessing ? 'Processing...' : 'Capture'}
            </Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: '80%',
    height: '30%',
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#f4511e',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PassportScanScreen; 