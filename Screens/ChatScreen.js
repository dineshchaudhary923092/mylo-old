import React, { useState, useContext, useEffect, useRef } from 'react';
import { Text, View, TextInput, Image, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Api } from '../Constants/Api';
import StatusBarComponent from '../Components/StatusbarComponent';
import ChatComponent from '../Components/ChatComponent';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import useAxios from '../Hooks/useAxios';
import Octicons from 'react-native-vector-icons/Octicons';
import { useTheme } from '@react-navigation/native';
import { getDeviceType } from 'react-native-device-info';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors } from '../Constants/Colors';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { SocketContext } from '../Components/SocketContext'

let deviceType = getDeviceType();

const ChatScreen = ({ navigation, route }) => {

    const theme = useTheme();
    const { colors } = useTheme();

    const isFocused = useIsFocused();
    const { chatType, cData } = route.params;

    // console.log(cData);

    return (
        <View style={[styles.Container, { backgroundColor: colors.background }]}>
            <StatusBarComponent bgcolor={colors.background} barStyle={theme.dark ? 'light' : 'dark'} />
            <SocketContext.Consumer>
                {
                    socket =>
                    <ChatComponent chatType={chatType} data={cData} navigation={navigation} socket={socket} />
                }
            </SocketContext.Consumer>
        </View>
    )
}

const styles = EStyleSheet.create({
    Container: {
        flex: 1,
    },
})

export default ChatScreen;

