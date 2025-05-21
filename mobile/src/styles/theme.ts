import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const colors = {
  primary: '#007AFF',
  background: '#000000',
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255, 255, 255, 0.8)',
    muted: 'rgba(255, 255, 255, 0.6)',
  },
  glass: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'rgba(255, 255, 255, 0.2)',
  },
  status: {
    success: '#4CAF50',
    error: '#FF5252',
    warning: '#FFC107',
  },
};

export const typography = {
  sizes: {
    title1: 42,
    title2: 36,
    title3: 24,
    large: 20,
    regular: 16,
    small: 14,
  },
  weights: {
    bold: '700',
    semibold: '600',
    medium: '500',
    regular: '400',
  },
  lineHeights: {
    tight: 1.2,
    regular: 1.5,
    loose: 1.8,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const layout = {
  screen: {
    width,
    height,
  },
  borderRadius: {
    small: 8,
    medium: 15,
    large: 20,
  },
  maxWidth: 1200,
};

export const particles = {
  default: {
    count: 5000,
    color: '#ffffff',
    size: 0.005,
    speed: 0.1,
    spread: 10,
    opacity: 1.0,
  },
  subtle: {
    count: 3000,
    color: '#ffffff',
    size: 0.003,
    speed: 0.05,
    spread: 8,
    opacity: 0.7,
  },
};

export const animations = {
  durations: {
    short: 300,
    medium: 500,
    long: 1000,
  },
  timings: {
    easeIn: 'easeIn',
    easeOut: 'easeOut',
    easeInOut: 'easeInOut',
  },
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
};

export default {
  colors,
  typography,
  spacing,
  layout,
  particles,
  animations,
  shadows,
};
