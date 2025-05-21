import { Platform, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Environment configurations
const ENV = {
  dev: {
    apiUrl: 'http://localhost:3000',
    debug: true,
    analyticsEnabled: false,
  },
  staging: {
    apiUrl: 'https://staging-api.rsgroup.com',
    debug: true,
    analyticsEnabled: true,
  },
  prod: {
    apiUrl: 'https://api.rsgroup.com',
    debug: false,
    analyticsEnabled: true,
  },
};

// Current environment
const currentEnv = __DEV__ ? 'dev' : 'prod';

// Device specific configurations
const deviceConfig = {
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
  screenWidth: width,
  screenHeight: height,
  isSmallDevice: width < 375,
  isTablet: width >= 768,
};

// Feature flags
const featureFlags = {
  enableNewNavigation: true,
  enable3DEffects: true,
  enableGestureAnimations: true,
  enableHapticFeedback: true,
  enableOfflineMode: true,
};

// Performance settings
const performanceConfig = {
  // 3D effect settings
  particleCount: deviceConfig.isSmallDevice ? 3000 : 5000,
  enableHighQualityRendering: !deviceConfig.isSmallDevice,
  maxFPS: deviceConfig.isIOS ? 60 : 30,
  
  // Animation settings
  enableParallaxEffects: !deviceConfig.isSmallDevice,
  enableBlurEffects: !deviceConfig.isSmallDevice,
  
  // Cache settings
  maxCacheSize: 50 * 1024 * 1024, // 50MB
  cacheDuration: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Animation configurations
const animationConfig = {
  timing: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  spring: {
    gentle: {
      damping: 15,
      mass: 1,
      stiffness: 130,
    },
    bouncy: {
      damping: 8,
      mass: 1,
      stiffness: 150,
    },
  },
};

// Contact form configuration
const contactConfig = {
  validation: {
    nameMinLength: 2,
    nameMaxLength: 50,
    messageMinLength: 10,
    messageMaxLength: 1000,
  },
  submitDelay: 500, // Delay before showing success message
  rateLimit: {
    maxAttempts: 5,
    timeWindow: 3600000, // 1 hour
  },
};

// App-wide constants
const constants = {
  storage: {
    keys: {
      userPreferences: '@RSGroup:userPreferences',
      themeMode: '@RSGroup:themeMode',
      cacheVersion: '@RSGroup:cacheVersion',
    },
  },
  api: {
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
  },
};

export default {
  env: ENV[currentEnv],
  currentEnv,
  deviceConfig,
  featureFlags,
  performanceConfig,
  animationConfig,
  contactConfig,
  constants,
};
