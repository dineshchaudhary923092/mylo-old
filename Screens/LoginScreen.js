import React, { useState, useContext } from 'react';
import {
    Text, View, TextInput, ActivityIndicator,
    TouchableOpacity, StatusBar, StyleSheet, Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthContext } from '../Components/Context';
import EStyleSheet from 'react-native-extended-stylesheet';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
// Svg, Defs, RadialGradient, Rect, Stop removed from react-native-svg as they are now unused
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

import AuroraBackgroundSVG from '../Components/AuroraBackgroundSVG';

const LoginScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { login } = useContext(AuthContext);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [secureText, setSecureText] = useState(true);
    const [focused, setFocused] = useState(null);
    const [data, setData] = useState({ username: '', password: '' });

    const loginHandle = () => {
        setButtonDisabled(true);
        setTimeout(() => {
            login({
                error: 1, token: 'dummy-token',
                data: {
                    user: {
                        id: 1, username: data.username,
                        first_name: 'Showcase', last_name: 'User',
                        device_type: 'ios', status: 'active',
                    }
                }
            });
            setButtonDisabled(false);
        }, 1000);
    };

    return (
        <View style={s.Root}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <AuroraBackgroundSVG />

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

                    {/* Logo + Title */}
                    <Animatable.View animation="fadeInDown" delay={100} duration={600} style={s.TopSection}>
                        <Text style={s.Title}>Sign In</Text>
                        <Text style={s.Subtitle}>Welcome back — you've been missed.</Text>
                    </Animatable.View>

                    {/* Form */}
                    <Animatable.View animation="fadeInUp" delay={220} duration={600} style={s.Form}>

                        <View style={s.FieldGroup}>
                            <Text style={s.Label}>Email or Username</Text>
                            <View style={[s.Field, focused === 'user' && s.FieldFocused]}>
                                <Ionicons name="person-outline" size={18} color={focused === 'user' ? '#7FFFD4' : 'rgba(255,255,255,0.25)'} style={s.Icon} />
                                <TextInput
                                    style={s.Input}
                                    placeholder="Enter username or email"
                                    placeholderTextColor="rgba(255,255,255,0.22)"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardAppearance="dark"
                                    onFocus={() => setFocused('user')}
                                    onBlur={() => setFocused(null)}
                                    onChangeText={(v) => setData({ ...data, username: v })}
                                />
                                {data.username.length > 3 && <Ionicons name="checkmark-circle" size={16} color="#7FFFD4" />}
                            </View>
                        </View>

                        <View style={s.FieldGroup}>
                            <View style={s.LabelRow}>
                                <Text style={s.Label}>Password</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                                    <Text style={s.ForgotLink}>Forgot Password?</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[s.Field, focused === 'pass' && s.FieldFocused]}>
                                <Ionicons name="lock-closed-outline" size={18} color={focused === 'pass' ? '#7FFFD4' : 'rgba(255,255,255,0.25)'} style={s.Icon} />
                                <TextInput
                                    style={s.Input}
                                    placeholder="Enter password"
                                    placeholderTextColor="rgba(255,255,255,0.22)"
                                    secureTextEntry={secureText}
                                    autoCapitalize="none"
                                    keyboardAppearance="dark"
                                    onFocus={() => setFocused('pass')}
                                    onBlur={() => setFocused(null)}
                                    onChangeText={(v) => setData({ ...data, password: v })}
                                />
                                <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                                    <Ionicons name={secureText ? "eye-off-outline" : "eye-outline"} size={20} color="rgba(255,255,255,0.3)" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* CTA */}
                        <TouchableOpacity activeOpacity={0.88} onPress={loginHandle} disabled={buttonDisabled} style={{ marginTop: EStyleSheet.value('8rem') }}>
                            <LinearGradient
                                colors={['#7FFFD4', '#3ECFA4']}
                                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                style={s.SubmitBtn}
                            >
                                {buttonDisabled
                                    ? <ActivityIndicator color="#060D0A" />
                                    : <><Text style={s.SubmitText}>Sign In</Text><Ionicons name="arrow-forward" size={20} color="#060D0A" /></>
                                }
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animatable.View>

                    <Animatable.View animation="fadeIn" delay={500} style={s.Footer}>
                        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                            <Text style={s.FooterText}>
                                Don't have an account?{'  '}<Text style={s.FooterLink}>Create one</Text>
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

    TopSection: { marginBottom: '40rem' },
    Title: {
        fontSize: '38rem', fontFamily: 'GTWalsheimProBold',
        color: '#FFFFFF', letterSpacing: '-0.5rem', marginBottom: '8rem',
    },
    Subtitle: {
        fontSize: '15rem', fontFamily: 'GTWalsheimProRegular',
        color: 'rgba(255,255,255,0.38)',
    },

    Form: {},
    FieldGroup: { marginBottom: '20rem' },
    LabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10rem' },
    Label: {
        fontSize: '13rem', fontFamily: 'GTWalsheimProMedium',
        color: 'rgba(255,255,255,0.5)', marginBottom: '10rem',
    },
    ForgotLink: {
        fontSize: 13, fontFamily: 'GTWalsheimProMedium', color: '#7FFFD4',
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

    Footer: { alignItems: 'center', marginTop: '40rem' },
    FooterText: {
        fontSize: '15rem', fontFamily: 'GTWalsheimProRegular',
        color: 'rgba(255,255,255,0.35)',
    },
    FooterLink: { fontFamily: 'GTWalsheimProBold', color: '#7FFFD4' },
});

export default LoginScreen;
