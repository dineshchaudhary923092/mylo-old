import React, { useState, useRef } from 'react';
import {
    Text, View, TextInput, ActivityIndicator,
    TouchableOpacity, StatusBar, StyleSheet, Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CountryPicker from 'react-native-country-picker-modal';
import { showMessage } from 'react-native-flash-message';
import OtpInput from '../Components/OtpInput';
import EStyleSheet from 'react-native-extended-stylesheet';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

import AuroraBackgroundSVG from '../Components/AuroraBackgroundSVG';

const ForgotPasswordScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();

    const [data, setData] = useState({
        phone: '', password: '', confirm_password: '',
        secureTextEntry: true, confirmSecureTextEntry: true,
    });
    const [step, setStep] = useState(1);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [showActivity, setShowActivity] = useState(false);
    const [focused, setFocused] = useState(null);
    const [countryCode, setCountryCode] = useState('IN');
    const [callingCode, setCallingCode] = useState('91');
    const otpbox = useRef();

    const onSelect = (c) => { setCountryCode(c.cca2); setCallingCode(c.callingCode); };
    const getOTP = () => { setButtonDisabled(true); setTimeout(() => { setStep(2); setButtonDisabled(false); }, 1000); };
    const verifyOTP = () => { setShowActivity(true); setTimeout(() => { setStep(3); setShowActivity(false); }, 1500); };
    const loginReset = () => {
        setButtonDisabled(true);
        setTimeout(() => {
            showMessage({ message: 'Password reset successful!', type: 'success' });
            navigation.navigate('Login');
            setButtonDisabled(false);
        }, 1500);
    };

    const titles    = { 1: 'Forgot\nPassword?', 2: 'Enter\nOTP Code',   3: 'New\nPassword'   };
    const subtitles = {
        1: 'Enter your phone number and we\'ll send you a reset code.',
        2: `Code sent to +${callingCode} ${data.phone}`,
        3: 'Almost done — create a strong new password.',
    };

    return (
        <View style={s.Root}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <AuroraBackgroundSVG />

            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="always"
            >
                <View style={[s.Screen, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 }]}>

                    {/* Nav */}
                    <View style={s.NavRow}>
                        <TouchableOpacity style={s.BackBtn} onPress={() => step > 1 ? setStep(step - 1) : navigation.goBack()}>
                            <Ionicons name="chevron-back-outline" size={22} color="rgba(255,255,255,0.8)" />
                        </TouchableOpacity>
                        <View style={s.StepRow}>
                            {[1, 2, 3].map(n => (
                                <View key={n} style={[s.StepPill, step >= n && s.StepPillOn]} />
                            ))}
                        </View>
                    </View>

                    {/* Header */}
                    <Animatable.View key={`h${step}`} animation="fadeInDown" duration={400} style={s.TopSection}>
                        <Text style={s.Title}>{titles[step]}</Text>
                        <View style={s.SubtitleRow}>
                            <Text style={s.Subtitle}>{subtitles[step]}</Text>
                            {step === 2 && (
                                <TouchableOpacity onPress={() => setStep(1)} style={s.EditNumberBtn} activeOpacity={0.7}>
                                    <Text style={s.EditNumberText}>Edit</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </Animatable.View>

                    {/* ── Step 1 ── */}
                    {step === 1 && (
                        <Animatable.View key="s1" animation="fadeIn" duration={400}>
                            <View style={s.FieldGroup}>
                                <Text style={s.Label}>Phone Number</Text>
                                <View style={[s.Field, focused === 'phone' && s.FieldFocused]}>
                                    <CountryPicker
                                        {...{ countryCode, withFilter: true, withFlag: true, withCallingCode: true, onSelect }}
                                        theme={{ backgroundColor: '#09090B', primaryColor: '#fff', primaryColorVariant: '#7FFFD4' }}
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
                            <TouchableOpacity activeOpacity={0.88} onPress={getOTP} disabled={buttonDisabled} style={{ marginTop: EStyleSheet.value('8rem') }}>
                                <LinearGradient colors={['#7FFFD4', '#3ECFA4']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.SubmitBtn}>
                                    {buttonDisabled ? <ActivityIndicator color="#060D0A" /> : <><Text style={s.SubmitText}>Send Code</Text><Ionicons name="arrow-forward" size={20} color="#060D0A" /></>}
                                </LinearGradient>
                            </TouchableOpacity>
                        </Animatable.View>
                    )}

                    {/* ── Step 2 ── */}
                    {step === 2 && (
                        <Animatable.View key="s2" animation="fadeIn" duration={400} style={{ alignItems: 'center' }}>
                            <OtpInput length={4} onComplete={verifyOTP} />
                            {showActivity && <ActivityIndicator size="large" color="#7FFFD4" style={{ marginTop: 48 }} />}
                        </Animatable.View>
                    )}

                    {/* ── Step 3 ── */}
                    {step === 3 && (
                        <Animatable.View key="s3" animation="fadeIn" duration={400}>
                            <View style={s.FieldGroup}>
                                <Text style={s.Label}>New Password</Text>
                                <View style={[s.Field, focused === 'pass' && s.FieldFocused]}>
                                    <Ionicons name="lock-closed-outline" size={18} color={focused === 'pass' ? '#7FFFD4' : 'rgba(255,255,255,0.25)'} style={s.Icon} />
                                    <TextInput
                                        style={s.Input}
                                        placeholder="New password"
                                        placeholderTextColor="rgba(255,255,255,0.22)"
                                        secureTextEntry={data.secureTextEntry}
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

                            <View style={s.FieldGroup}>
                                <Text style={s.Label}>Confirm Password</Text>
                                <View style={[s.Field, focused === 'confirm' && s.FieldFocused]}>
                                    <Ionicons name="lock-closed-outline" size={18} color={focused === 'confirm' ? '#7FFFD4' : 'rgba(255,255,255,0.25)'} style={s.Icon} />
                                    <TextInput
                                        style={s.Input}
                                        placeholder="Confirm password"
                                        placeholderTextColor="rgba(255,255,255,0.22)"
                                        secureTextEntry={data.confirmSecureTextEntry}
                                        keyboardAppearance="dark"
                                        onFocus={() => setFocused('confirm')}
                                        onBlur={() => setFocused(null)}
                                        onChangeText={(v) => setData({ ...data, confirm_password: v })}
                                    />
                                    <TouchableOpacity onPress={() => setData({ ...data, confirmSecureTextEntry: !data.confirmSecureTextEntry })}>
                                        <Ionicons name={data.confirmSecureTextEntry ? "eye-off-outline" : "eye-outline"} size={20} color="rgba(255,255,255,0.3)" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TouchableOpacity activeOpacity={0.88} onPress={loginReset} disabled={buttonDisabled} style={{ marginTop: EStyleSheet.value('8rem') }}>
                                <LinearGradient colors={['#7FFFD4', '#3ECFA4']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.SubmitBtn}>
                                    {buttonDisabled ? <ActivityIndicator color="#060D0A" /> : <><Text style={s.SubmitText}>Reset Password</Text><Ionicons name="checkmark" size={18} color="#060D0A" /></>}
                                </LinearGradient>
                            </TouchableOpacity>
                        </Animatable.View>
                    )}

                    <View style={s.Footer}>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={s.FooterText}>
                                Remembered?{'  '}<Text style={s.FooterLink}>Sign In</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </KeyboardAwareScrollView>
        </View>
    );
};

const s = EStyleSheet.create({
    Root: { flex: 1, backgroundColor: '#09090B' },
    Screen: { flex: 1, paddingHorizontal: '24rem' },

    NavRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: '44rem' },
    BackBtn: {
        width: '40rem', height: '40rem', borderRadius: '13rem',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
        alignItems: 'center', justifyContent: 'center',
    },
    StepRow: { flexDirection: 'row' },
    StepPill: {
        width: '26rem', height: '4rem', borderRadius: '3rem',
        backgroundColor: 'rgba(255,255,255,0.1)', marginLeft: '6rem',
    },
    StepPillOn: { backgroundColor: '#7FFFD4' },

    TopSection: { marginBottom: '36rem' },
    Title: {
        fontSize: '38rem', fontFamily: 'GTWalsheimProBold',
        color: '#FFFFFF', letterSpacing: '-0.5rem',
        lineHeight: '48rem', marginBottom: '12rem',
    },
    Subtitle: {
        fontSize: '15rem', fontFamily: 'GTWalsheimProRegular',
        color: 'rgba(255,255,255,0.38)', lineHeight: '22rem',
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

    Footer: { alignItems: 'center', marginTop: '40rem' },
    FooterText: {
        fontSize: '15rem', fontFamily: 'GTWalsheimProRegular',
        color: 'rgba(255,255,255,0.35)',
    },
    FooterLink: { fontFamily: 'GTWalsheimProBold', color: '#7FFFD4' },

    ContextAction: { marginTop: '32rem', paddingVertical: '8rem' },
    ContextActionText: {
        fontSize: '14rem', fontFamily: 'GTWalsheimProMedium',
        color: 'rgba(255,255,255,0.3)',
    },
    ContextLink: { color: '#7FFFD4', fontWeight: '600' },

    SubtitleRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
    EditNumberBtn: { marginLeft: '12rem', paddingVertical: '4rem' },
    EditNumberText: { fontSize: '14rem', fontFamily: 'GTWalsheimProBold', color: '#7FFFD4' },
});


export default ForgotPasswordScreen;
