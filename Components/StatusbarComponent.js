import React from 'react';
import { StatusBar, Platform } from 'react-native';

const StatusbarComponent = ({ barStyle, bgColor = 'transparent' }) => {
    return (
        <StatusBar 
            barStyle={barStyle === 'dark' ? 'dark-content' : 'light-content'}
            backgroundColor={bgColor}
            translucent={true}
        />
    );
};

export default StatusbarComponent;