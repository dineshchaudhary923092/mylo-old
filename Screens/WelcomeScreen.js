import React, { useState, useEffect } from 'react';
import { Text, View, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Colors } from '../Constants/Colors';
import StatusBarComponent from '../Components/StatusbarComponent';
import { useTheme } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { getDeviceType, isLandscape } from 'react-native-device-info';

let deviceType = getDeviceType();

const WelcomeScreen = ({ navigation }) => {

    const theme = useTheme();
    const { colors } = useTheme();

    const [isLandscape, setIsLandscape] = useState(null);

	useEffect(() => {
		if(Dimensions.get('window').width > Dimensions.get('window').height) {
			setIsLandscape(true);
		} else {
			setIsLandscape(false);
		}
        Dimensions.addEventListener("change", onChange);
		return () => {
			Dimensions.removeEventListener("change", onChange);
		};
	}, []);

	const onChange = ({ window }) => {
		if(window.width > window.height) {
			setIsLandscape(true);
		} else {
			setIsLandscape(false);
		}
	};

    return (
        <View style={{flex: 1}}>
            <StatusBarComponent bgColor={colors.background} barStyle={theme.dark ? 'light' : 'dark'} />
            <View style={[styles.ContainerStyle, {backgroundColor: colors.background, flexDirection: isLandscape ? 'row' : null} ]}>
                <View 
                    style={[styles.HalfContainer, {
                        height: isLandscape ? '100%' : '50%', 
                        width: isLandscape ? '50%' : '100%'
                    }]}
                >
                    <Image 
                        source={require('../assets/logo_transparent.png')} 
                        resizeMode='contain' 
                        style={{
                            height: deviceType === 'Tablet' ? 220 : 150,
                            width: deviceType === 'Tablet' ? 220 : 150
                        }}
                    />
                </View>
                <View 
                    style={[styles.HalfContainer, {
                        justifyContent: isLandscape ? 'center' : 'space-between', 
                        height: isLandscape ? '100%' : '50%', 
                        width: isLandscape ? '50%' : '100%'
                    }]}
                >
                    <View style={styles.ButtonsWrap}>
                        <Text style={[styles.TopText, {color: colors.text}]}>Create a free account</Text>
                        <TouchableOpacity 
                            style={styles.ButtonContainer}
                            onPress={() => navigation.navigate('SignUp')}
                        >
                            <View style={[styles.ButtonView, {backgroundColor: colors.primary}]}>
                                <Text style={[styles.ButtonText, {color: Colors.dark}]}>Create an account</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.ButtonContainer}
                            onPress={() => navigation.navigate('Login')}
                        >
                            <View style={[styles.ButtonView, {backgroundColor: colors.bgVar}]}>
                                <Text style={[styles.ButtonText, {color: colors.text}]}>Login</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.VersionText, {color: colors.text}]}>Version 0.0.1</Text>
                </View>
            </View>
        </View>
    )
}

const styles = EStyleSheet.create({
    ContainerStyle: {
        flex: 1,
        paddingVertical: '5%'
    },
    HalfContainer: {
        height: '50%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    TopText: {
        fontSize: deviceType === 'Tablet' ? '22rem' : '24rem',
        fontFamily: 'GTWalsheimProMedium',
        marginBottom: deviceType === 'Tablet' ? '6%' : '10%'
    },
    ButtonsWrap: {
        width: '100%',
        alignItems: 'center'
    },
    ButtonContainer: {
        height: deviceType === 'Tablet' ? '30rem' : '50rem',
        width: '55%',
        marginVertical: deviceType === 'Tablet' ? '6rem' : '8rem',
    },
    ButtonView: {
        flex: 1,
        borderRadius: deviceType === 'Tablet' ? '12rem' : '20rem',
        alignItems: 'center',
        justifyContent: 'center',
    },
    ButtonText: {
        fontFamily: 'GTWalsheimProMedium',
        fontSize: deviceType === 'Tablet' ? '10rem' : '15rem',
    },
    VersionText: {
        fontFamily: 'GTWalsheimProRegular',
        fontSize: deviceType === 'Tablet' ? '12rem' : '15rem',
        paddingTop: deviceType === 'Tablet' ? '10rem' : '15rem',
    }
})

export default WelcomeScreen;

