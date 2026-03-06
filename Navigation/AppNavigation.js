import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, Dimensions, Platform, StatusBar } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../Screens/WelcomeScreen'
import LoginScreen from '../Screens/LoginScreen'
import SignUpScreen from '../Screens/SignUpScreen'
import ForgotPasswordScreen from '../Screens/ForgotPasswordScreen'
import HomeScreen from '../Screens/HomeScreen';
import ChatScreen from '../Screens/ChatScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import GroupsScreen from '../Screens/GroupsScreen';
import ManageGroupScreen from '../Screens/ManageGroupScreen';
import NotificationScreen from '../Screens/NotificationScreen';
import EditProfileScreen from '../Screens/EditProfileScreen';
import ChangePasswordScreen from '../Screens/ChangePasswordScreen';
import BuddyScreen from '../Screens/BuddyScreen';
import BuddiesScreen from '../Screens/BuddiesScreen';
import BuddyGroupScreen from '../Screens/BuddyGroupScreen';
import ImageViewScreen from '../Screens/ImageViewScreen';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useTheme } from '@react-navigation/native';

import { getDeviceType } from 'react-native-device-info';

let deviceType = getDeviceType();

const AuthStack = createStackNavigator();
const MainStack = createStackNavigator();

const MainScreen = () => {
	return (
		<MainStack.Navigator 
			headerMode='none' 
			initialRouteName='Home'
		>
			<MainStack.Screen name="Home" component={HomeScreen} />
			<MainStack.Screen name="Buddies" component={BuddiesScreen} />
			<MainStack.Screen name="Buddy" component={BuddyScreen} />
			<MainStack.Screen name="Chat" component={ChatScreen} />
			<MainStack.Screen name="Groups" component={GroupsScreen} />
			<MainStack.Screen name="ManageGroup" component={ManageGroupScreen} />
			<MainStack.Screen name="BuddyGroup" component={BuddyGroupScreen} />
			<MainStack.Screen name="Profile" component={ProfileScreen} />
			<MainStack.Screen name="EditProfile" component={EditProfileScreen} />
			<MainStack.Screen name="ChangePassword" component={ChangePasswordScreen} />
			<MainStack.Screen name="Notification" component={NotificationScreen} />
			<MainStack.Screen name="ImageView" component={ImageViewScreen} />
		</MainStack.Navigator>
	);
}

const AuthScreen = () => {
	return (
		<AuthStack.Navigator 
			headerMode='none' 
			initialRouteName='Welcome'
		>
			<AuthStack.Screen name="Welcome" component={WelcomeScreen} />
			<AuthStack.Screen name="Login" component={LoginScreen} />
			<AuthStack.Screen name="SignUp" component={SignUpScreen} />
			<AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
		</AuthStack.Navigator>
	);
}

const AppNavigation = ({userToken}) => {

	const theme = useTheme();
	const { colors } = useTheme();

	return (
		<View style={{flex: 1, backgroundColor: colors.background}}>
			<StatusBar 
				translucent 
				backgroundColor="transparent" 
				barStyle={theme.dark ? 'light-content' : 'dark-content'} 
			/>
			{
				userToken != null ?
				<MainScreen/> :
				<AuthScreen/>
			}
		</View>
	);
}

const styles = EStyleSheet.create({
	
})

export default AppNavigation;