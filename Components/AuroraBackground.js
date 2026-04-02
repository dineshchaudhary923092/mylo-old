import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
/**
 * CRITICAL: This component requires @shopify/react-native-skia
 * Installation: yarn add @shopify/react-native-skia
 */
import { Canvas, Circle, BlurMask } from '@shopify/react-native-skia';

const { width, height } = Dimensions.get('window');

/**
 * AuroraBackground Component
 * 
 * Provides a high-performance, deeply blurred 'aura' background effect
 * using Skia's GPU-accelerated BlurMask.
 */
const AuroraBackground = () => {
    return (
        <View style={styles.container}>
            <Canvas style={styles.canvas}>
                {/* 
                  1. Deep Purple Orb (Top Left)
                  Positioned slightly off-screen to create a 'wash' effect
                */}
                <Circle 
                    cx={width * 0.15} 
                    cy={height * 0.2} 
                    r={width * 0.75} 
                    color="#4F46E5" 
                    opacity={0.35}
                >
                    <BlurMask blur={110} style="normal" />
                </Circle>

                {/* 
                  2. Warm Orange/Peach Orb (Bottom Right)
                  Positioned to balance the composition
                */}
                <Circle 
                    cx={width * 0.85} 
                    cy={height * 0.8} 
                    r={width * 0.7} 
                    color="#FB923C" 
                    opacity={0.3}
                >
                    <BlurMask blur={140} style="normal" />
                </Circle>

                {/* 
                  3. Subtle Secondary Purple/Pink Accent (Center Right)
                  Adds depth and color complexity
                */}
                <Circle 
                    cx={width * 0.95} 
                    cy={height * 0.35} 
                    r={width * 0.5} 
                    color="#7C3AED" 
                    opacity={0.15}
                >
                    <BlurMask blur={100} style="normal" />
                </Circle>
            </Canvas>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#09090B', // Dark almost black base
        zIndex: -1,
    },
    canvas: {
        flex: 1,
    },
});

export default AuroraBackground;
