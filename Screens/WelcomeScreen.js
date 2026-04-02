import React from 'react';
import {
    Text, View, Image, TouchableOpacity,
    StatusBar, Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import EStyleSheet from 'react-native-extended-stylesheet';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';

const { width, height } = Dimensions.get('window');

/**
 * Premium Welcome Screen (V5 - Professional Refinement)
 */
import AuroraBackgroundSVG from '../Components/AuroraBackgroundSVG';

const WelcomeScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={s.Root}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            
            {/* Keeping the liked Background Layer */}
            <AuroraBackgroundSVG />

            <View style={[s.Screen, { paddingTop: insets.top, paddingBottom: insets.bottom + 20 }]}>
                
                {/* Quiet Luxury Branding */}
                <Animatable.View animation="fadeInDown" duration={1000} style={s.BrandingArea}>
                    <View style={s.BrandMark}>
                        <Image
                            source={require('../assets/logo_transparent.png')}
                            resizeMode="contain"
                            style={s.LogoMini}
                        />
                    </View>
                    <Text style={s.BrandIdentity}>MYLO</Text>
                </Animatable.View>

                {/* Hero Panel */}
                <View style={s.CenterPanel}>
                    <Animatable.View animation="fadeInUp" delay={200} duration={1000}>
                        <Text style={s.TopicOverline}>ULTRA-SECURE MESSAGING</Text>
                        
                        <Text style={s.HeroText}>
                            Connect with {'\n'}
                            <Text style={s.TealAcc}>Confidence</Text>
                        </Text>
                        
                        <Text style={s.SubText}>
                            Experience the pinnacle of privacy. {'\n'}
                            Designed for those who value discretion.
                        </Text>
                    </Animatable.View>
                </View>

                {/* Interaction Section - Modern & Clean */}
                <View style={s.BottomPanel}>
                    <Animatable.View 
                        animation="fadeInUp" 
                        delay={600} 
                        duration={800} 
                        style={s.ActionGroup}
                    >
                        <TouchableOpacity 
                            activeOpacity={0.9} 
                            onPress={() => navigation.navigate('SignUp')}
                        >
                            <LinearGradient
                                colors={['#7FFFD4', '#45D1A8']}
                                start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}
                                style={s.MainButton}
                            >
                                <Text style={s.MainButtonLabel}>Create an Account</Text>
                                <View style={s.ButtonIconShell}>
                                    <Feather name="arrow-right" size={18} color="#040A07" />
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>

                        <View style={s.AuthRow}>
                            <Text style={s.AuthHint}>Already using Mylo?</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={s.LoginAction}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </Animatable.View>
                </View>

            </View>
        </View>
    );
};

const s = EStyleSheet.create({
    Root: { flex: 1, backgroundColor: '#09090B' },
    Screen: { flex: 1, paddingHorizontal: '28rem' },

    // Luxury Branding Area
    BrandingArea: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '25rem',
        marginBottom: '60rem',
    },
    BrandMark: {
        width: '32rem',
        height: '32rem',
        marginRight: '12rem',
        opacity: 0.9,
    },
    LogoMini: { width: '100%', height: '100%' },
    BrandIdentity: {
        fontSize: '14rem',
        fontFamily: 'GTWalsheimProBold',
        color: '#FFFFFF',
        letterSpacing: '3rem',
        opacity: 0.8,
    },

    // Hero Panel
    CenterPanel: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    TopicOverline: {
        fontSize: '9rem',
        fontFamily: 'GTWalsheimProBold',
        color: '#7FFFD4',
        letterSpacing: '3.5rem',
        marginBottom: '22rem',
        opacity: 0.8,
    },
    HeroText: {
        fontSize: '56rem',
        fontFamily: 'GTWalsheimProBold',
        color: '#FFFFFF',
        lineHeight: '60rem',
        letterSpacing: '-2rem',
    },
    TealAcc: {
        color: '#7FFFD4',
    },
    SubText: {
        fontSize: '18rem',
        fontFamily: 'GTWalsheimProRegular',
        color: 'rgba(255,255,255,0.45)', // Slightly better contrast
        lineHeight: '26rem',
        marginTop: '25rem',
        maxWidth: '85%',
    },

    // Interaction Section
    BottomPanel: {
        justifyContent: 'flex-end',
    },
    ActionGroup: {
        width: '100%',
        paddingBottom: '20rem',
    },
    MainButton: {
        height: '64rem',
        borderRadius: '18rem', // Premium rounded corners (not bubble)
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: '24rem',
        shadowColor: '#7FFFD4',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 15,
    },
    MainButtonLabel: {
        fontSize: '18rem',
        fontFamily: 'GTWalsheimProBold',
        color: '#040A07',
        letterSpacing: '-0.2rem',
    },
    ButtonIconShell: {
        width: '32rem',
        height: '32rem',
        borderRadius: '10rem',
        backgroundColor: 'rgba(0,0,0,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    AuthRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '24rem',
    },
    AuthHint: {
        fontSize: '14rem',
        fontFamily: 'GTWalsheimProRegular',
        color: 'rgba(255,255,255,0.4)',
    },
    LoginAction: {
        fontSize: '14rem',
        fontFamily: 'GTWalsheimProBold',
        color: '#7FFFD4',
        marginLeft: '6rem',
    },
});

export default WelcomeScreen;
