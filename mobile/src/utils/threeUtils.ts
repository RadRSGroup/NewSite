import * as THREE from 'three';
import { Vector3 } from 'three';

// Common particle configurations
export const particleConfigs = {
  // Hero section particles
  hero: {
    count: 5000,
    size: 0.005,
    spread: 10,
    speed: 0.1,
    color: '#ffffff',
    opacity: 1.0,
  },
  
  // Background particles (more subtle)
  background: {
    count: 3000,
    size: 0.003,
    spread: 8,
    speed: 0.05,
    color: '#ffffff',
    opacity: 0.7,
  },
};

// Utility functions for particle animations
export const particleAnimations = {
  // Wave pattern animation
  wave: (position: Vector3, time: number, amplitude: number = 0.5, frequency: number = 1) => {
    position.y = Math.sin(time * frequency + position.x) * amplitude;
    return position;
  },

  // Spiral pattern animation
  spiral: (position: Vector3, time: number, radius: number = 1) => {
    const angle = time + position.z;
    position.x = Math.cos(angle) * radius;
    position.y = Math.sin(angle) * radius;
    return position;
  },

  // Vortex pattern animation
  vortex: (position: Vector3, time: number, strength: number = 0.1) => {
    const distance = position.length();
    const angle = time * (1 - distance * strength);
    position.x = Math.cos(angle) * distance;
    position.z = Math.sin(angle) * distance;
    return position;
  },
};

// Camera movement utilities
export const cameraAnimations = {
  // Smooth camera look-at
  smoothLookAt: (
    camera: THREE.Camera,
    target: Vector3,
    speed: number = 0.1
  ) => {
    const direction = new Vector3();
    direction.subVectors(target, camera.position).normalize();
    camera.quaternion.slerp(
      new THREE.Quaternion().setFromRotationMatrix(
        new THREE.Matrix4().lookAt(camera.position, target, camera.up)
      ),
      speed
    );
  },

  // Orbit around a point
  orbit: (
    camera: THREE.Camera,
    center: Vector3,
    radius: number,
    speed: number = 0.001
  ) => {
    const time = Date.now() * speed;
    camera.position.x = Math.cos(time) * radius + center.x;
    camera.position.z = Math.sin(time) * radius + center.z;
    camera.lookAt(center);
  },
};

// Shader utilities
export const shaderUtils = {
  // Basic vertex shader for particles
  particleVertexShader: `
    attribute float size;
    varying vec3 vColor;
    void main() {
      vColor = color;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,

  // Basic fragment shader for particles
  particleFragmentShader: `
    varying vec3 vColor;
    void main() {
      if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
      gl_FragColor = vec4(vColor, 1.0);
    }
  `,
};

// Performance optimization utilities
export const performanceUtils = {
  // Calculate optimal particle count based on device performance
  getOptimalParticleCount: (defaultCount: number = 5000): number => {
    // This is a simple implementation - you might want to add more sophisticated detection
    const isLowEnd = false; // Add actual device performance detection logic
    return isLowEnd ? Math.floor(defaultCount / 2) : defaultCount;
  },

  // Adjust animation complexity based on frame rate
  shouldReduceEffects: (fpsThreshold: number = 30): boolean => {
    // Add actual FPS measurement logic
    return false;
  },
};

export default {
  particleConfigs,
  particleAnimations,
  cameraAnimations,
  shaderUtils,
  performanceUtils,
};
