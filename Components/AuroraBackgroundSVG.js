import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

/**
 * AuroraBackground Component (Teal Theme)
 * 
 * matches exactly with the HomeScreen.js background styling:
 * - LinearGradient background from dark teal to black.
 * - Subtle SVG RadialGradient glow at the top.
 */
const AuroraBackgroundSVG = () => {
    return (
        <View style={styles.container} pointerEvents="none">
            {/* 1. Base Gradient matching Home Screen */}
            <LinearGradient
                colors={['#0C1A14', '#09090B', '#09090B']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 0.6 }}
                style={StyleSheet.absoluteFill}
            />

            {/* 2. Teal Glow Blob matching Home Screen */}
            <View style={styles.glowBlob}>
                <Svg width="500" height="500">
                    <Defs>
                        <RadialGradient id="glow" cx="50%" cy="50%" rx="50%" ry="50%">
                            <Stop offset="0%" stopColor="#7FFFD4" stopOpacity="0.18" />
                            <Stop offset="45%" stopColor="#7FFFD4" stopOpacity="0.06" />
                            <Stop offset="100%" stopColor="#7FFFD4" stopOpacity="0" />
                        </RadialGradient>
                    </Defs>
                    <Rect width="500" height="500" fill="url(#glow)" />
                </Svg>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#09090B',
        zIndex: -1,
    },
    glowBlob: {
        position: 'absolute',
        top: -150,
        left: '50%',
        marginLeft: -250,
        width: 500,
        height: 500,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default AuroraBackgroundSVG;
