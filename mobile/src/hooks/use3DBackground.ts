import { useRef, useEffect, useState } from 'react';
import { Animated } from 'react-native';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { particleConfigs } from '../utils/threeUtils';
import appConfig from '../config/appConfig';
import { AnimationUtils, AnimationPerformance } from '../utils/animationUtils';

interface Use3DBackgroundProps {
  type?: 'hero' | 'background';
  intensity?: number;
  interactive?: boolean;
  mouseEnabled?: boolean;
}

interface ParticleState {
  positions: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
}

export const use3DBackground = ({
  type = 'background',
  intensity = 1,
  interactive = true,
  mouseEnabled = true,
}: Use3DBackgroundProps = {}) => {
  const particlesRef = useRef<THREE.Points>();
  const mousePosition = useRef({ x: 0, y: 0 });
  const animationFrame = useRef<number>();
  const [isReady, setIsReady] = useState(false);

  // Animation values
  const rotationX = useRef(new Animated.Value(0)).current;
  const rotationY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // Initialize particle system
  const initializeParticles = (): ParticleState => {
    const config = particleConfigs[type];
    const optimizedCount = AnimationPerformance.shouldReduceAnimations()
      ? Math.floor(config.count * 0.6)
      : config.count;

    const positions = new Float32Array(optimizedCount * 3);
    const colors = new Float32Array(optimizedCount * 3);
    const sizes = new Float32Array(optimizedCount);
    const color = new THREE.Color(config.color);

    for (let i = 0; i < optimizedCount; i++) {
      const i3 = i * 3;
      // Position
      positions[i3] = (Math.random() - 0.5) * config.spread;
      positions[i3 + 1] = (Math.random() - 0.5) * config.spread;
      positions[i3 + 2] = (Math.random() - 0.5) * config.spread;

      // Color
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      // Size
      sizes[i] = Math.random() * config.size;
    }

    return { positions, colors, sizes };
  };

  // Animation loop
  useFrame((state, delta) => {
    if (!particlesRef.current || !interactive) return;

    const particles = particlesRef.current;
    const positions = particles.geometry.attributes.position.array as Float32Array;
    const time = state.clock.getElapsedTime();

    // Update particle positions
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];

      // Apply different animation patterns based on type
      if (type === 'hero') {
        positions[i] = x + Math.sin(time * 0.1 + y) * 0.01;
        positions[i + 1] = y + Math.cos(time * 0.1 + x) * 0.01;
        positions[i + 2] = z + Math.sin(time * 0.1) * 0.01;
      } else {
        positions[i] = x + Math.sin(time * 0.05 + y) * 0.005;
        positions[i + 1] = y + Math.cos(time * 0.05 + x) * 0.005;
        positions[i + 2] = z;
      }
    }

    particles.geometry.attributes.position.needsUpdate = true;

    // Apply mouse interaction
    if (mouseEnabled && mousePosition.current) {
      particles.rotation.x += (mousePosition.current.y * 0.0002 - particles.rotation.x) * 0.05;
      particles.rotation.y += (mousePosition.current.x * 0.0002 - particles.rotation.y) * 0.05;
    }

    // Base rotation
    particles.rotation.x += delta * 0.05 * intensity;
    particles.rotation.y += delta * 0.05 * intensity;
  });

  // Handle mouse/touch movement
  const handleMouseMove = (x: number, y: number) => {
    if (!mouseEnabled) return;
    mousePosition.current = { x, y };
  };

  // Initialize animations
  useEffect(() => {
    const { positions, colors, sizes } = initializeParticles();

    // Fade in animation
    Animated.timing(opacity, {
      toValue: 1,
      duration: appConfig.animationConfig.timing.normal,
      useNativeDriver: true,
    }).start();

    // Rotation animations
    if (interactive) {
      AnimationUtils.createLoopAnimation(
        rotationX,
        {
          toValue: Math.PI * 2,
          duration: 20000,
          useNativeDriver: true,
        }
      ).start();

      AnimationUtils.createLoopAnimation(
        rotationY,
        {
          toValue: Math.PI * 2,
          duration: 25000,
          useNativeDriver: true,
        }
      ).start();
    }

    setIsReady(true);

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  return {
    particlesRef,
    isReady,
    opacity,
    rotationX,
    rotationY,
    handleMouseMove,
  };
};

export default use3DBackground;
