import React, { useEffect } from 'react';
import { Text, View, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Colors } from '../Constants/Colors';
import StatusBarComponent from '../Components/StatusbarComponent';
import FlashMessage from "react-native-flash-message";

const SplashScreen = () => {

    return (
        <>
            <View style={{flex: 1}}>
                <StatusBarComponent bgColor={Colors.primary} barStyle='dark' />
                <View style={[styles.Container, {backgroundColor: Colors.primary} ]}>
                    <View style={styles.Splash}>
                        <Image source={require('../assets/logo_transparent.png')} style={styles.SplashImg} resizeMode="contain" />
                    </View>
                    <ActivityIndicator color={Colors.dark} size='large' />
                </View>
            </View>
            <FlashMessage position="top" />
        </>
    )
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    Splash: {
        width: 250,
        height: 150,
        maxWidth: '50%',
        marginBottom: 40
    },
    SplashImg: {
        height: '100%',
        width: '100%',
    }
})

export default SplashScreen;