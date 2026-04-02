import React, { useState, useContext, useRef } from 'react';
import {
    Text, View, TextInput, TouchableOpacity,
    ActivityIndicator, StatusBar, StyleSheet, Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CountryPicker from 'react-native-country-picker-modal';
import { AuthContext } from '../Components/Context';
import OtpInput from '../Components/OtpInput';
import EStyleSheet from 'react-native-extended-stylesheet';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
// Svg, Defs, RadialGradient, Rect, Stop removed from react-native-svg as they are now unused
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

import AuroraBackgroundSVG from '../Components/AuroraBackgroundSVG';

const SignUpScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { register } = useContext(AuthContext);

    const [data, setData] = useState({ fullname: '', phone: '', password: '', secureTextEntry: true });
    const [showOTP, setShowOTP] = useState(false);
    const [showActivity, setShowActivity] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [focused, setFocused] = useState(null);
    const [countryCode, setCountryCode] = useState('IN');
    const [callingCode, setCallingCode] = useState('91');
    const otpbox = useRef();

    const onSelect = (c) => { setCountryCode(c.cca2); setCallingCode(c.callingCode); };

    const handleRegister = () => {
        setShowActivity(true);
        setTimeout(() => {
            register({
                error: 1, token: 'dummy-token',
                data: {
                    user: {
                        id: 1,
                        username: data.fullname?.toLowerCase().replace(' ', '_') || 'showcase_user',
                        first_name: data.fullname?.split(' ')[0] || 'Showcase',
                        last_name: data.fullname?.split(' ')[1] || 'User',
                        device_type: 'ios', status: 'active',
                    }
                }
            });
            setShowActivity(false);
        }, 1500);
    };

    const BG = () => <AuroraBackgroundSVG />;

    // OTP Screen
    if (showOTP) {
        return (
            <View style={s.Root}>
                <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
                <BG />
                <View style={[s.Screen, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 }]}>
                    <TouchableOpacity style={s.BackBtn} onPress={() => setShowOTP(false)}>
                        <Ionicons name="chevron-back-outline" size={22} color="rgba(255,255,255,0.7)" />
                    </TouchableOpacity>

                    <Animatable.View animation="fadeIn" duration={500} style={{ alignItems: 'center', marginTop: 40 }}>
                        <Text style={[s.Title, { textAlign: 'center' }]}>Verify Code</Text>
                        <View style={[s.SubtitleRow, { justifyContent: 'center', marginBottom: 40 }]}>
                            <Text style={s.Subtitle}>
                                Sent to +{callingCode} {data.phone}
                            </Text>
                            <TouchableOpacity onPress={() => setShowOTP(false)} style={s.EditNumberBtn} activeOpacity={0.7}>
                                <Text style={s.EditNumberText}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                        <OtpInput length={4} onComplete={handleRegister} />
                        {showActivity && <ActivityIndicator size="large" color="#7FFFD4" style={{ marginTop: 48 }} />}
                    </Animatable.View>
                </View>
            </View>
        );
    }

    return (
        <View style={s.Root}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <BG />

            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                keyboardShouldPersistTaps="always"
                enableOnAndroid
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <View style={[s.Screen, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 }]}>

                    <TouchableOpacity style={s.BackBtn} onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back-outline" size={22} color="rgba(255,255,255,0.8)" />
                    </TouchableOpacity>

                    <Animatable.View animation="fadeInDown" delay={100} duration={600} style={s.TopSection}>
                        <Text style={s.Title}>Create Account</Text>
                        <Text style={s.Subtitle}>Join Mylo and start connecting today.</Text>
                    </Animatable.View>

                    <Animatable.View animation="fadeInUp" delay={220} duration={600}>

                        {/* Full Name */}
                        <View style={s.FieldGroup}>
                            <Text style={s.Label}>Full Name</Text>
                            <View style={[s.Field, focused === 'name' && s.FieldFocused]}>
                                <Ionicons name="person-outline" size={18} color={focused === 'name' ? '#7FFFD4' : 'rgba(255,255,255,0.25)'} style={s.Icon} />
                                <TextInput
                                    style={s.Input}
                                    placeholder="Your full name"
                                    placeholderTextColor="rgba(255,255,255,0.22)"
                                    autoCapitalize="words"
                                    keyboardAppearance="dark"
                                    onFocus={() => setFocused('name')}
                                    onBlur={() => setFocused(null)}
                                    onChangeText={(v) => setData({ ...data, fullname: v })}
                                />
                                {data.fullname.length > 2 && <Ionicons name="checkmark-circle" size={16} color="#7FFFD4" />}
                            </View>
                        </View>

                        {/* Phone */}
                        <View style={s.FieldGroup}>
                            <Text style={s.Label}>Phone Number</Text>
                            <View style={[s.Field, focused === 'phone' && s.FieldFocused]}>
                                <CountryPicker
                                    {...{ countryCode, withFilter: true, withFlag: true, withCallingCode: true, onSelect }}
                                    theme={{ backgroundColor: '#0A1410', primaryColor: '#fff', primaryColorVariant: '#7FFFD4' }}
                                />
                                <Text style={s.CallingCode}>+{callingCode}</Text>
                                <TextInput
                                    style={s.Input}
                                    placeholder="Phone number"
                                    placeholderTextColor="rgba(255,255,255,0.22)"
                                    keyboardType="phone-pad"
                                    keyboardAppearance="dark"
                                    onFocus={() => setFocused('phone')}
                                    onBlur={() => setFocused(null)}
                                    onChangeText={(v) => setData({ ...data, phone: v })}
                                />
                            </View>
                        </View>

                        {/* Password */}
                        <View style={s.FieldGroup}>
                            <Text style={s.Label}>Password</Text>
                            <View style={[s.Field, focused === 'pass' && s.FieldFocused]}>
                                <Ionicons name="lock-closed-outline" size={18} color={focused === 'pass' ? '#7FFFD4' : 'rgba(255,255,255,0.25)'} style={s.Icon} />
                                <TextInput
                                    style={s.Input}
                                    placeholder="Min 6 characters"
                                    placeholderTextColor="rgba(255,255,255,0.22)"
                                    secureTextEntry={data.secureTextEntry}
                                    autoCapitalize="none"
                                    keyboardAppearance="dark"
                                    onFocus={() => setFocused('pass')}
                                    onBlur={() => setFocused(null)}
                                    onChangeText={(v) => setData({ ...data, password: v })}
                                />
                                <TouchableOpacity onPress={() => setData({ ...data, secureTextEntry: !data.secureTextEntry })}>
                                    <Ionicons name={data.secureTextEntry ? "eye-off-outline" : "eye-outline"} size={20} color="rgba(255,255,255,0.3)" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Submit */}
                        <TouchableOpacity
                            activeOpacity={0.88}
                            onPress={() => { setButtonDisabled(true); handleRegister(); }}
                            disabled={buttonDisabled}
                            style={{ marginTop: EStyleSheet.value('8rem') }}
                        >
                            <LinearGradient
                                colors={['#7FFFD4', '#3ECFA4']}
                                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                style={s.SubmitBtn}
                            >
                                {buttonDisabled
                                    ? <ActivityIndicator color="#060D0A" />
                                    : <><Text style={s.SubmitText}>Create Account</Text><Ionicons name="arrow-forward" size={20} color="#060D0A" /></>
                                }
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animatable.View>

                    <Animatable.View animation="fadeIn" delay={500} style={s.Footer}>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={s.FooterText}>
                                Already have an account?{'  '}<Text style={s.FooterLink}>Sign In</Text>
                            </Text>
                        </TouchableOpacity>
                    </Animatable.View>

                </View>
            </KeyboardAwareScrollView>
        </View>
    );
};

const s = EStyleSheet.create({
    Root: { flex: 1, backgroundColor: '#09090B' },
    Screen: { flex: 1, paddingHorizontal: '24rem' },

    BackBtn: {
        width: '40rem', height: '40rem', borderRadius: '13rem',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
        alignItems: 'center', justifyContent: 'center',
        marginBottom: '44rem',
    },

    TopSection: { marginBottom: '36rem' },
    Title: {
        fontSize: '38rem', fontFamily: 'GTWalsheimProBold',
        color: '#FFFFFF', letterSpacing: '-0.5rem', marginBottom: '8rem',
    },
    Subtitle: {
        fontSize: '15rem', fontFamily: 'GTWalsheimProRegular',
        color: 'rgba(255,255,255,0.38)',
    },

    FieldGroup: { marginBottom: '18rem' },
    Label: {
        fontSize: '13rem', fontFamily: 'GTWalsheimProMedium',
        color: 'rgba(255,255,255,0.5)', marginBottom: '9rem',
    },

    Field: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: '14rem',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
        height: '54rem', paddingHorizontal: '16rem',
    },
    FieldFocused: {
        backgroundColor: 'rgba(127,255,212,0.06)',
        borderColor: 'rgba(127,255,212,0.45)',
    },
    Icon: { marginRight: '12rem' },
    Input: {
        flex: 1, color: '#FFFFFF',
        fontSize: '15.5rem', fontFamily: 'GTWalsheimProRegular',
        height: '100%',
    },
    CallingCode: {
        fontSize: '15rem', fontFamily: 'GTWalsheimProMedium',
        color: '#FFFFFF', marginHorizontal: '8rem',
    },

    SubmitBtn: {
        height: '56rem', borderRadius: '18rem',
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        shadowColor: '#7FFFD4', shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.28, shadowRadius: 18,
    },
    SubmitText: {
        fontSize: '17rem', fontFamily: 'GTWalsheimProBold',
        color: '#060D0A', marginRight: '10rem',
    },

    Footer: { alignItems: 'center', marginTop: '32rem' },
    FooterText: {
        fontSize: '15rem', fontFamily: 'GTWalsheimProRegular',
        color: 'rgba(255,255,255,0.35)',
    },
    FooterLink: { fontFamily: 'GTWalsheimProBold', color: '#7FFFD4' },

    SubtitleRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
    EditNumberBtn: { marginLeft: '8rem', paddingVertical: '2rem' },
    EditNumberText: { fontSize: '14rem', fontFamily: 'GTWalsheimProBold', color: '#7FFFD4' },

    ContextAction: { marginTop: '32rem', paddingVertical: '8rem' },
    ContextActionText: {
        fontSize: '14rem', fontFamily: 'GTWalsheimProMedium',
        color: 'rgba(255,255,255,0.3)',
    },
    ContextLink: { color: '#7FFFD4', fontWeight: '600' },

    OTPBadge: {
        width: '76rem', height: '76rem', borderRadius: '26rem',
        backgroundColor: 'rgba(127,255,212,0.07)',
        borderWidth: 1, borderColor: 'rgba(127,255,212,0.18)',
        alignItems: 'center', justifyContent: 'center',
        marginBottom: '20rem',
    },
    OTPBox: {
        borderRadius: '14rem', borderWidth: '1.5rem',
        fontSize: '28rem', fontFamily: 'GTWalsheimProBold',
        color: '#FFFFFF', backgroundColor: 'rgba(255,255,255,0.05)',
    },
});

export default SignUpScreen;
