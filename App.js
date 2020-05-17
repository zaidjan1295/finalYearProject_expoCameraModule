import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import axios from "axios"
export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null)
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [recording, setRecording] = useState(false)
  const BACKEND="http://192.168.1.7"
  const PORT="5000"
  const API = BACKEND+":"+PORT
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      const { status : audioStatus } = await Audio.requestPermissionsAsync()
      GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;
      GLOBAL.FormData = GLOBAL.originalFormData || GLOBAL.FormData
      setHasPermission(status === 'granted');
      })();
    }, []);
    if (hasPermission === null) {
      return <View />;
    }
    if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} type={type} ref={ref => {
        setCameraRef(ref) ;
    }}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'transparent',
          justifyContent: 'flex-end'
        }}>
          <View style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly'
          }}>
        <TouchableOpacity 
          style={{alignSelf: 'center'}} 
          onPress={async () => {
            if(!recording){
              setRecording(true)
              let video = await cameraRef.recordAsync();
              try{
              const data = new FormData();
              
              data.append("video", {
                filename: "video",
                type: "video/mp4",
                uri: video.uri
              });    
              const request = {
                  method: "post",
                  body: data,
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                  }
              }
              console.log("request", request)
              
              fetch(API + '/upload', request)
              // axios({
              //   method: 'post',
              //   url: API + '/upload',
              //   // data: {
              //   //   "text": "hello"
              //   // }
              //   data: data,
              //   headers: {'Content-Type': 'multipart/form-data' }
              //   })
                .then(data => {
                  console.log("data", data)
                  // this.setState({ processing: false });
                })
                .catch(err => {
                  console.log(err)
                  // this.setState({ processing: false });
                })
              console.log('video', video);
              } catch(e){
                debugger
              }
            } else {
                setRecording(false)
                cameraRef.stopRecording()
            }
        }}>
          <View style={{ 
              borderWidth: 2,
              borderRadius:50,
              borderColor: 'red',
              height: 50,
              width:50,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'}}
          >
            <View style={{
                borderWidth: 2,
                borderRadius:50,
                borderColor: 'red',
                height: 40,
                width:40,
                backgroundColor: 'red'}} >
            </View>
          </View>
        </TouchableOpacity>
          </View>
        </View>
      </Camera>
    </View>
  );
}