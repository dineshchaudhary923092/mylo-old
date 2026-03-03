import 'react-native-gesture-handler';
import React, {useState, useEffect, useMemo, useReducer} from 'react';
import { StatusBar, Dimensions, Platform, NativeModules, SafeAreaView, View, Image, Text, Appearance, PermissionsAndroid } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import AppNavigation from './Navigation/AppNavigation';
import AsyncStorage from '@react-native-community/async-storage';
import { AuthContext } from './Components/Context';
import { SocketContext } from './Components/SocketContext';
import SplashScreen from './Screens/SplashScreen';
import FlashMessage from "react-native-flash-message";
import EStyleSheet from 'react-native-extended-stylesheet';
import Contacts from 'react-native-contacts';
import { showMessage } from "react-native-flash-message";
import { Api } from './Constants/Api';
const qs = require('qs');
const axios = require('axios');
import useTracking from './Hooks/useTracking';
import { getDeviceType } from 'react-native-device-info';
import OneSignal from 'react-native-onesignal';
import NetInfo from "@react-native-community/netinfo";
import io from "socket.io-client";

let deviceType = getDeviceType();

const {width} = Dimensions.get('window');
const rem = width / 380;
const remSm = width / 400;
const remTab = width / 420; 

EStyleSheet.build({
	$rem: deviceType === 'Tablet' ? 
		remTab : 
		width > 400 ? rem : remSm,
});

const App = () => {

	const dummySocket = {
		emit: (event, payload, callback) => {
			if (callback) {
				if (event === 'notification') {
					callback(JSON.stringify({count: 3}));
				} else if (event === 'get-conversation') {
					callback(JSON.stringify({data: []}));
				} else if (event === 'init-conversation') {
					callback(JSON.stringify({data: {id: '123'}}));
				} else {
					callback(JSON.stringify({}));
				}
			}
		},
		on: () => {},
		off: () => {}
	};
	const socket = dummySocket;

	const requestLocationPermission = async () => {
		try {
			const granted = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
			{
				'title': 'Example App',
				'message': 'Example App access to your location '
			}
			)
			if (granted === PermissionsAndroid.RESULTS.GRANTED) {
				console.log("You can use the location")
			} else {
				console.log("bg location permission denied")
			}
		} catch (err) {
			console.warn(err)
		}
	}

	const [isNetworkReachable, setIsNetworkReachable] = useState(true)

	function MiniOfflineSign() {
		return (
			<View style={styles.offlineAreaStyle}>
				<View style={styles.offlineContainer}>
					<Text style={styles.offlineText}>No Internet Connection</Text>
				</View>
				<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
					<Image source={(require('./assets/wifi.png'))} width='120' height='120' />
				</View>
			</View>
		)
	}

	const colorScheme = Appearance.getColorScheme();
	const [isDarkTheme, setIsDarkTheme] = useState(true);
	const {location, history, distance} = useTracking(true);

	const initialLoginState = {
		isLoading: false,
		userToken: null
	}

	const appDefaultTheme = {
		...DefaultTheme,
		colors: {
			...DefaultTheme.colors,
			background: '#fff',
			black: '#16171B',
			primary: '#7FFFD4',
			light: 'rgba(0, 0, 0, 0.5)',
			lighter: 'rgba(0, 0, 0, 0.1)',
			text: '#333',
			bgVar: '#e3e3e3',
			pText: '#333',
			sheet: '#ECECEC'
		},
	}
	  
	const appDarkTheme = {
		...DarkTheme,
		colors: {
			...DarkTheme.colors,
			background: '#16171B',
			black: '#16171B',
			primary: '#7FFFD4',
			light: 'rgba(255, 255, 255, 0.5)',
			lighter: 'rgba(255, 255, 255, 0.1)',
			text: '#fff',
			bgVar: '#0D0E10',
			pText: '#7FFFD4',
			sheet: '#232323'
		},
	}

	const theme = isDarkTheme ? appDarkTheme : appDefaultTheme;

	const savePushToken = async(data) => {
		try{
			await AsyncStorage.setItem('mobileToken', JSON.stringify(data.userId));
		} catch(e) {
			console.log(e);
		}
	}

	const loginReducer = (prevState, action) => {
		switch(action.type) {
			case 'RETRIEVE_TOKEN':
				return {
					...prevState,
					userToken: action.token,
					isLoading: false
				};
			case 'LOGIN':
				return {
					...prevState,
					userToken: action.token,
					isLoading: false
				};
			case 'LOGOUT':
				return {
					...prevState,
					userToken: null,
					isLoading: false
				};
			case 'REGISTER':
				return {
					...prevState,
					userToken: action.token,
					isLoading: false
				};
		}
	}
	
	const [loginState, dispatch] = useReducer(loginReducer, initialLoginState);

	const authContext = useMemo(() => ({
		login: async(data) => {
			let userToken;
			userToken = String(data.token);
			if(data.error === 1) {
				try{
					await AsyncStorage.setItem('userData', JSON.stringify(data));
					await AsyncStorage.setItem('userToken', JSON.stringify(data.token));
					await syncContacts('login');
				} catch(e) {
					console.log(e);
				}
			}
		},
		logout: async() => {
			try {
				await AsyncStorage.removeItem('userData');
				await AsyncStorage.removeItem('userToken');
				await AsyncStorage.removeItem('darkOn');
				await AsyncStorage.removeItem('localContacts');
				setIsDarkTheme(colorScheme === 'dark' ? true : false);
			} catch(e) {
				console.log(e);
			}
			dispatch({ type: 'LOGOUT' })
		},
		register: async(data) => {
			let userToken;
			userToken = String(data.token);
			if(data.error === 1) {
				try{
					await AsyncStorage.setItem('userData', JSON.stringify(data));
					await AsyncStorage.setItem('userToken', JSON.stringify(data.token));
					await syncContacts('register');
				} catch(e) {
					console.log(e);
				}
			}
		},
		toggleTheme: async() => {
			try{
				await AsyncStorage.setItem('darkOn', JSON.stringify(!isDarkTheme));
			} catch(e) {
				console.log(e);
			}
			setIsDarkTheme( isDarkTheme => !isDarkTheme );
		},
		latitude: location.latitude,
		longitude: location.longitude,
	}), [location]);

	const updateLocation = async(location) => {
		// Bypassed for dummy data mockup model
	}
	
	useEffect(() => {
		updateLocation(location);
	}, [location])

	useEffect(()=> {
		setTimeout(async()=> {
			if(Platform.OS === 'android') {
				await requestLocationPermission();
			}
			setIsDarkTheme(true);
		}, 2000)
		OneSignal.init('bdc3edca-128e-48c6-a99c-7484884de7f9');
		OneSignal.addEventListener('ids', (data) => {
			savePushToken(data);
		});
		OneSignal.inFocusDisplaying(2);
		const unsubscribe = NetInfo.addEventListener(({isInternetReachable}) => {
			setIsNetworkReachable(isInternetReachable);
		});
		return () => {
			unsubscribe();
			OneSignal.removeEventListener('ids');
		}
	}, [])

	const initSocket = (tok) => {
		// Mocked out
	}
	
	const syncContacts = async(type) => {
		let userToken = await AsyncStorage.getItem('userToken');
		userToken = userToken != null ? JSON.parse(userToken) : 'dummy-token';

		if(type === 'retrieve') {
			dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
		}
		if(type === 'login') {
			dispatch({ type: 'LOGIN', token: userToken})
		}
		if(type === 'register') {
			dispatch({ type: 'REGISTER', token: userToken})
		}
	}

	const getData = async(contacts, userToken, type) => {
		// completely bypassed for dummy design evaluation
	}

	if(loginState.isLoading) {
		return (
			<SplashScreen />
		)
	}

	return (
		<>
			{
				isNetworkReachable ?
				<SocketContext.Provider value={socket}>
					<AuthContext.Provider value={authContext}>
						<NavigationContainer theme={theme}>
							<AppNavigation userToken={loginState.userToken} />
						</NavigationContainer>
						<FlashMessage position="top" />
					</AuthContext.Provider>
				</SocketContext.Provider>
				:
				<SafeAreaView style={{flex: 1, backgroundColor: '#b52424', top: 0}}>
					<StatusBar backgroundColor='#b52424' barStyle='light-content' />
					<MiniOfflineSign />
				</SafeAreaView>
			}
		</>
	);
};

const styles = EStyleSheet.create({
	offlineAreaStyle: {
		flex: 1,
		backgroundColor: '#fff'
	},
	offlineContainer: {
		backgroundColor: '#b52424',
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		width,
		zIndex: 2
	},
	offlineText: { 
	  	color: '#fff'
	}
})

export default App;