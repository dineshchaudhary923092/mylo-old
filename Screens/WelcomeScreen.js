import React, { useState, useEffect } from 'react';
import { Text, View, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Colors } from '../Constants/Colors';
import StatusBarComponent from '../Components/StatusbarComponent';
import { useTheme } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { getDeviceType } from 'react-native-device-info';
import * as Animatable from 'react-native-animatable';

let deviceType = getDeviceType();

const WelcomeScreen = ({ navigation }) => {

    const theme = useTheme();
    const { colors } = useTheme();

    const [isLandscape, setIsLandscape] = useState(Dimensions.get('window').width > Dimensions.get('window').height);

	useEffect(() => {
        const onChange = ({ window }) => {
            setIsLandscape(window.width > window.height);
        };
        Dimensions.addEventListener("change", onChange);
		return () => {
			Dimensions.removeEventListener("change", onChange);
		};
	}, []);

    return (
        <View style={{flex: 1, backgroundColor: colors.background}}>
            <StatusBarComponent bgColor={colors.background} barStyle={theme.dark ? 'light' : 'dark'} />
            <View style={[styles.ContainerStyle, {flexDirection: isLandscape ? 'row' : 'column'} ]}>
                <Animatable.View 
                    animation="fadeInDown"
                    duration={1000}
                    style={[styles.HalfContainer, {
                        height: isLandscape ? '100%' : '45%', 
                        width: isLandscape ? '50%' : '100%'
                    }]}
                >
                    <Image 
                        source={require('../assets/logo_transparent.png')} 
                        resizeMode='contain' 
                        style={styles.LogoStyle}
                    />
                    <Animatable.Text 
                        animation="fadeIn" 
                        delay={500}
                        style={[styles.Tagline, {color: colors.text}]}
                    >
                        Connecting Hearts, Effortlessly.
                    </Animatable.Text>
                </Animatable.View>

                <View 
                    style={[styles.HalfContainer, {
                        justifyContent: 'center', 
                        height: isLandscape ? '100%' : '55%', 
                        width: isLandscape ? '50%' : '100%',
                        paddingHorizontal: '10%'
                    }]}
                >
                    <Animatable.View 
                        animation="fadeInUp" 
                        delay={800}
                        style={styles.ButtonsWrap}
                    >
                        <Text style={[styles.TopText, {color: colors.text}]}>Welcome to Mylo</Text>
                        <Text style={[styles.SubText, {color: colors.light}]}>The future of secure social networking is here.</Text>
                        
                        <TouchableOpacity 
                            activeOpacity={0.8}
                            style={styles.ButtonContainer}
                            onPress={() => navigation.navigate('SignUp')}
                        >
                            <View style={[styles.ButtonView, {backgroundColor: colors.primary, shadowColor: colors.primary}]}>
                                <Text style={[styles.ButtonText, {color: Colors.dark}]}>Get Started</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            activeOpacity={0.8}
                            style={styles.ButtonContainer}
                            onPress={() => navigation.navigate('Login')}
                        >
                            <View style={[styles.ButtonView, styles.LoginBtn, {borderColor: colors.primary}]}>
                                <Text style={[styles.ButtonText, {color: colors.text}]}>Login to Account</Text>
                            </View>
                        </TouchableOpacity>
                    </Animatable.View>
                    
                    <Animatable.Text 
                        animation="fadeIn" 
                        delay={1200}
                        style={[styles.VersionText, {color: colors.light}]}
                    >
                        v2026.1.0 • Built for Performance
                    </Animatable.Text>
                </View>
            </View>
        </View>
    )
}

const styles = EStyleSheet.create({
    ContainerStyle: {
        flex: 1,
    },
    HalfContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    LogoStyle: {
        height: deviceType === 'Tablet' ? '180rem' : '150rem',
        width: deviceType === 'Tablet' ? '180rem' : '150rem',
    },
    Tagline: {
        fontFamily: 'GTWalsheimProLight',
        fontSize: deviceType === 'Tablet' ? '12.5rem' : '16rem',
        marginTop: '-10rem',
        letterSpacing: '1rem',
        opacity: 0.8
    },
    TopText: {
        fontSize: deviceType === 'Tablet' ? '24rem' : '32rem',
        fontFamily: 'GTWalsheimProBold',
        textAlign: 'center',
        marginBottom: '8rem'
    },
    SubText: {
        fontSize: deviceType === 'Tablet' ? '10rem' : '14rem',
        fontFamily: 'GTWalsheimProRegular',
        textAlign: 'center',
        marginBottom: '40rem',
        lineHeight: '20rem'
    },
    ButtonsWrap: {
        width: '100%',
        alignItems: 'center'
    },
    ButtonContainer: {
        height: deviceType === 'Tablet' ? '34rem' : '52rem',
        width: '100%',
        marginVertical: '10rem',
    },
    ButtonView: {
        flex: 1,
        borderRadius: '16rem',
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5
    },
    LoginBtn: {
        backgroundColor: 'transparent',
        borderWidth: '1.5rem',
    },
    ButtonText: {
        fontFamily: 'GTWalsheimProMedium',
        fontSize: deviceType === 'Tablet' ? '11rem' : '16rem',
        letterSpacing: '0.5rem'
    },
    VersionText: {
        fontFamily: 'GTWalsheimProLight',
        fontSize: deviceType === 'Tablet' ? '8.5rem' : '12rem',
        position: 'absolute',
        bottom: '25rem',
        letterSpacing: '0.5rem'
    }
})

export default WelcomeScreen;

