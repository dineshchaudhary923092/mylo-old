import React from 'react';
import { StatusBar } from 'react-native';
import { useTheme } from '@react-navigation/native';

const StatusbarComponent = ({ barStyle }) => {

    const theme = useTheme();
    const { colors } = useTheme();

    return (
        <>
            {
                barStyle === 'dark' ?
                <StatusBar barStyle='dark-content' />
                :
                <StatusBar barStyle='light-content' />
            }
        </>
    )
}

export default StatusbarComponent;