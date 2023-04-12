import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Button, View, SafeAreaView, StyleSheet, Text } from 'react-native';

export default function App() {
  let cameraRef = useRef();

  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibrary, setHasMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState();

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status == 'granted');
      setHasMediaLibraryPermission(mediaLibraryPermission.status == 'granted');
    })();
  }, []);

  if (hasCameraPermission === undefined) {
    return <Text>Requesting permission...</Text>;
  } else if (!hasCameraPermission) {
    return <Text>Permision for camera not granted. Please change this in settings.</Text>;
  }

  const takePic = async () => {
    const options = {
      quality: 1,
      base64: true,
      exif: false,
    };

    const newPhoto = await cameraRef.current.takePicturesAsync(options);
    setPhoto(newPhoto);
  };

  if (photo) {
    const savePhoto = () => {
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };

    return (
      <SafeAreaView style={styles.container}>
        <Image style={styles.preview} source={{ uri: 'data:image/jpg;base64,' + photo.base64 }} />
        {setHasMediaLibraryPermission ? <Button title='Save' onPress={savePhoto} /> : undefined}
        <Button title='Discard' onPress={() => setPhoto(undefined)} />
      </SafeAreaView>
    );
  }

  return (
    <Camera style={styles.container} ref={cameraRef}>
      <View style={styles.buttonContainer}>
        <Button title='Take Pic' onPress={{ takePic }} />
      </View>
      <StatusBar style='auto' />
    </Camera>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    backgroundColor: '#ffffff',
    alignSelf: 'flex-end',
  },
  preview: {
    flex: 1,
    alignSelf: 'stretch',
  },
});
