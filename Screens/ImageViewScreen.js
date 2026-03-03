import React, { useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Colors } from '../Constants/Colors';
import FlashMessage from "react-native-flash-message";
import Image from 'react-native-scalable-image';
import { getDeviceType } from 'react-native-device-info';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useTheme } from '@react-navigation/native';

let deviceType = getDeviceType();

const ImageViewScreen = ({navigation, route}) => {

    const { image } = route.params;

    const theme = useTheme();
    const { colors } = useTheme();

    return (
        <>
            <View style={{flex: 1}}>
                <View style={[styles.TopBarStyle, {backgroundColor: colors.background}]}>
                    <TouchableOpacity onPress={()=> navigation.goBack()}>
                        <AntDesign name="arrowleft" style={[styles.BackBtn, {color: colors.pText}]} />
                    </TouchableOpacity>
                </View>
                <View style={[styles.Container]}>
                    <Image source={{uri: image}} style={styles.SplashImg} resizeMode="contain" />
                </View>
            </View>
            <FlashMessage position="top" />
        </>
    )
}

const styles = EStyleSheet.create({
    Container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    TopBarStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: deviceType === 'Tablet' ? '14rem' : '20rem',
        height: deviceType === 'Tablet' ? '46rem' : '50rem',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.075,
        shadowRadius: 3,
        elevation: 2,
    },
    TopBarBtnText: {
        fontSize: deviceType === 'Tablet' ? '12rem' : '18rem',
        fontFamily: 'GTWalsheimProMedium',
        color: Colors.dark,
    },
    BackBtn: {
        fontSize: deviceType === 'Tablet' ? '18rem' : '30rem',
    },
})

export default ImageViewScreen;