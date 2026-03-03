import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import AsyncStorage from '@react-native-community/async-storage';
import { Api } from './Constants/Api';
const qs = require('qs');
const axios = require('axios');

if(Platform.OS === 'android') {
    BackgroundGeolocation.headlessTask(async (event) => {
        // Mock bypassed logic
    });
}


AppRegistry.registerComponent(appName, () => App);
