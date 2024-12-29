import React, { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import { Base_url } from '../Base_URL';


const Firebase = () => {
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  };

  const getTokenAndSendToBackend = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('FCM Token:', fcmToken);
      try {
        await axios.post(`${Base_url}/api/save-fcm-token`, { token: fcmToken });
        console.log('Token sent to backend successfully');
      } catch (error) {
        console.error('Error sending token to backend:', error);
      }

      
    } else {
      console.log('Failed to get FCM token');
    }
  };

  useEffect(() => {
    requestUserPermission();
    getTokenAndSendToBackend();

    // Handle incoming foreground messages
    const unsubscribeOnMessage = messaging().onMessage(async (remoteMessage) => {
      console.log('New Notification', remoteMessage.notification?.body);
    });

    return unsubscribeOnMessage;
  }, []);

  return null;
};

export default Firebase;