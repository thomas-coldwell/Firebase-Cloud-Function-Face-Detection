import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Firebase from './functions/Firebase/core';
import 'react-native-console-time-polyfill';

export default class App extends React.Component {

  state = {
    image: {},
    rawResponse: []
  }

  async componentDidMount() {
    Firebase.initialiseFirebase();
    this.selectPhoto();
  }

  async selectPhoto() {
    await ImagePicker.launchImageLibraryAsync({
      quality: 0.1
    }).then(async(image) => {
      if (!image.cancelled) {
        this.setState({
          image: {uri: image.uri},
          rawResponse: []
        });
        console.time('fd');
        await Firebase.runFaceDetection(image.uri).then(({faces}) => {
          console.timeEnd('fd');
          this.setState({rawResponse: faces});
        });
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{height: 300, width: 600}}>
          <Image source={this.state.image} style={{height: 300, width: 600, resizeMode: 'contain'}} />
          {
            this.state.rawResponse.map((item, index) => {
              let sf = 300 / item._imageDims._height;
              return (
                <View style={{
                        position: 'absolute',
                        borderColor: '#f0f',
                        borderWidth: 3,
                        opacity: 1.0,
                        height: item._box._height * sf, 
                        width: item._box._width * sf,
                        top: item._box._y * sf,
                        left: item._box._x * sf + ((600 - item._imageDims._width*sf)/2)}}
                        key={index.toString()}>
                  <Text>ID: {index.toString()}</Text>
                </View>
              );
            })
          }
        </View>
        <Text>
          {
            this.state.rawResponse.map((item, index) => {
              return (
                <Text key={index.toString()}>
                  Face ID: {index.toString()}, Confidence: {parseInt(item._classScore*100)/100}{"\n"}
                </Text>
              );
            })
          }
        </Text>
        <TouchableOpacity style={{height: 50, width: 150, backgroundColor: '#ccc', borderRadius: 10, justifyContent: "center", alignItems: "center"}}
                          onPress={() => this.selectPhoto()}>
          <Text>Select Photo</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
