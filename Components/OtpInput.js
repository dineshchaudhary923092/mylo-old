import React, { useState, useRef } from 'react';
import { View, TextInput, StyleSheet, Dimensions } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

const OtpInput = ({ length = 4, onComplete }) => {
    const [otp, setOtp] = useState(new Array(length).fill(''));
    const inputs = useRef([]);

    const handleChange = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text && index < length - 1) {
            inputs.current[index + 1].focus();
        }

        if (newOtp.every(val => val !== '') && newOtp.join('').length === length) {
            onComplete(newOtp.join(''));
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    return (
        <View style={styles.container}>
            {otp.map((digit, index) => (
                <View key={index} style={[styles.boxWrap, otp[index] && styles.boxActive]}>
                    <TextInput
                        ref={el => inputs.current[index] = el}
                        style={styles.box}
                        maxLength={1}
                        keyboardType="number-pad"
                        keyboardAppearance="dark"
                        onChangeText={text => handleChange(text, index)}
                        onKeyPress={e => handleKeyPress(e, index)}
                        value={digit}
                        autoFocus={index === 0}
                        selectionColor="#7FFFD4"
                    />
                </View>
            ))}
        </View>
    );
};

const styles = EStyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: '40rem',
    },
    boxWrap: {
        width: '66rem',
        height: '66rem',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: '14rem',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.09)',
        marginHorizontal: '8rem',
        justifyContent: 'center',
        alignItems: 'center',
    },
    boxActive: {
        borderColor: '#7FFFD4',
        backgroundColor: 'rgba(127,255,212,0.06)',
    },
    box: {
        fontSize: '28rem',
        fontFamily: 'GTWalsheimProBold',
        color: '#FFFFFF',
        textAlign: 'center',
        width: '100%',
        height: '100%',
    },
});

export default OtpInput;
