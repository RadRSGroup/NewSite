import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Canvas } from '@react-three/fiber/native';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import appConfig from '../config/appConfig';
import { particleConfigs, particleAnimations, performanceUtils } from '../utils/threeUtils';

interface Animated3DBackgroundProps {
  type?: 'hero' | 'background';
  intensity?: number;
  interactive?: boolean;
  style?: any;
}

const ParticleField = ({ 
  type = 'background',
  intensity = 1,
  interactive = true 
}) => {
  const particlesRef = useRef<THREE.Points>();
  const mousePosition = useRef({ x: 0, y: 0 });
  const [positions, setPositions] = useState<Float32Array>();
  const [colors, setColors] = useState<Float32Array>();

  useEffect(() => {
    const config = particleConfigs[type];
    const optimizedCount = performanceUtils.getOptimalParticleCount(config.count);
    
    // Initialize particles
    const posArray = new Float32Array(optimizedCount * 3);
    const colArray = new Float32Array(optimizedCount * 3);
    const color = new THREE.Color(config.color);

    for (let i = 0; i < optimizedCount; i++) {
      const i3 = i * 3;
      posArray[i3] = (Math.random() - 0.5) * config.spread;
      posArray[i3 + 1] = (Math.random() - 0.5) * config.spread;
      posArray[i3 + 2] = (Math.random() - 0.5) * config.spread;

      colArray[i3] = color.r;
      colArray[i3 + 1] = color.g;
      colArray[i3 + 2] = color.b;
    }

    setPositions(posArray);
    setColors(colArray);
  }, [type]);

  useFrame((state, delta) => {
    if (!particlesRef.current || !positions) return;

    // Apply animation based on type
    const particles = particlesRef.current;
    const positions = particles.geometry.attributes.position.array as Float32Array;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < positions.length; i += 3) {
      const position = new THREE.Vector3(
        positions[i],
        positions[i + 1],
        positions[i + 2]
      );

      if (type === 'hero') {
        particleAnimations.vortex(position, time * 0.1);
      } else {
        particleAnimations.wave(position, time * 0.1);
      }

      positions[i] = position.x;
      positions[i + 1] = position.y;
      positions[i + 2] = position.z;
    }

    particles.geometry.attributes.position.needsUpdate = true;

    // Interactive rotation
    if (interactive) {
      particles.rotation.x += delta * 0.05 * intensity;
      particles.rotation.y += delta * 0.05 * intensity;

      if (mousePosition.current) {
        particles.rotation.x += mousePosition.current.y * 0.0001;
        particles.rotation.y += mousePosition.current.x * 0.0001;
      }
    }
  });

  return positions && colors ? (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attachObject={['attributes', 'position']}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attachObject={['attributes', 'color']}
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={particleConfigs[type].size}
        vertexColors
        transparent
        opacity={particleConfigs[type].opacity * intensity}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  ) : null;
};

const Animated3DBackground: React.FC<Animated3DBackgroundProps> = ({
  type = 'background',
  intensity = 1,
  interactive = true,
  style,
}) => {
  // Only render if 3D effects are enabled in config
  if (!appConfig.featureFlags.enable3DEffects) {
    return <View style={[styles.container, style]} />;
  }

  return (
    <View style={[styles.container, style]}>
      <Canvas
        style={styles.canvas}
        frameloop={performanceUtils.shouldReduceEffects() ? 'demand' : 'always'}
        gl={{
          antialias: appConfig.performanceConfig.enableHighQualityRendering,
          powerPreference: 'high-performance',
        }}>
        <ambientLight intensity={0.5} />
        <ParticleField
          type={type}
          intensity={intensity}
          interactive={interactive}
        />
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  canvas: {
    flex: 1,
  },
});

export default Animated3DBackground;
