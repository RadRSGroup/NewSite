import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber/native';
import * as THREE from 'three';

interface ParticleSystemProps {
  count?: number;
  color?: string;
  size?: number;
  speed?: number;
  spread?: number;
  opacity?: number;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({
  count = 5000,
  color = '#ffffff',
  size = 0.005,
  speed = 0.1,
  spread = 10,
  opacity = 1.0,
}) => {
  const particlesRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  // Create particles
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  const colorObj = new THREE.Color(color);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * spread;
    positions[i3 + 1] = (Math.random() - 0.5) * spread;
    positions[i3 + 2] = (Math.random() - 0.5) * spread;

    colors[i3] = colorObj.r;
    colors[i3 + 1] = colorObj.g;
    colors[i3 + 2] = colorObj.b;

    sizes[i] = Math.random() * size;
  }

  useFrame((state, delta) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.x += delta * speed;
      particlesRef.current.rotation.y += delta * speed;

      // Optional: Add mouse interaction
      const mouseX = state.mouse.x * viewport.width / 2;
      const mouseY = state.mouse.y * viewport.height / 2;
      particlesRef.current.rotation.x += (mouseY * 0.0001);
      particlesRef.current.rotation.y += (mouseX * 0.0001);
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        vertexColors
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
};

interface ParticleBackgroundProps extends ParticleSystemProps {
  style?: any;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ style, ...props }) => {
  return (
    <Canvas style={{ flex: 1, ...(style || {}) }}>
      <ambientLight intensity={0.5} />
      <ParticleSystem {...props} />
    </Canvas>
  );
};

export default ParticleBackground;
