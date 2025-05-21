import { TextStyle, ViewStyle } from 'react-native';

// Color palette types
export interface ColorPalette {
  primary: string;
  background: string;
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
  glass: {
    background: string;
    border: string;
  };
  status: {
    success: string;
    error: string;
    warning: string;
  };
}

// Typography types
export interface TypographyScale {
  sizes: {
    title1: number;
    title2: number;
    title3: number;
    large: number;
    regular: number;
    small: number;
  };
  weights: {
    bold: TextStyle['fontWeight'];
    semibold: TextStyle['fontWeight'];
    medium: TextStyle['fontWeight'];
    regular: TextStyle['fontWeight'];
  };
  lineHeights: {
    tight: number;
    regular: number;
    loose: number;
  };
}

// Spacing types
export interface SpacingScale {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

// Layout types
export interface LayoutConfig {
  screen: {
    width: number;
    height: number;
  };
  borderRadius: {
    small: number;
    medium: number;
    large: number;
  };
  maxWidth: number;
}

// Particle configuration types
export interface ParticleConfig {
  count: number;
  color: string;
  size: number;
  speed: number;
  spread: number;
  opacity: number;
}

export interface ParticleConfigs {
  default: ParticleConfig;
  subtle: ParticleConfig;
}

// Animation configuration types
export interface AnimationConfig {
  durations: {
    short: number;
    medium: number;
    long: number;
  };
  timings: {
    easeIn: string;
    easeOut: string;
    easeInOut: string;
  };
}

// Shadow configuration types
export interface ShadowConfig {
  shadowColor: string;
  shadowOffset: {
    width: number;
    height: number;
  };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export interface ShadowConfigs {
  small: ShadowConfig;
  medium: ShadowConfig;
  large: ShadowConfig;
}

// Complete theme type
export interface Theme {
  colors: ColorPalette;
  typography: TypographyScale;
  spacing: SpacingScale;
  layout: LayoutConfig;
  particles: ParticleConfigs;
  animations: AnimationConfig;
  shadows: ShadowConfigs;
}

// Utility types for component styles
export interface BaseStyles {
  container?: ViewStyle;
  content?: ViewStyle;
  text?: TextStyle;
}

// Theme context type
export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

// Component theme props
export interface WithThemeProps {
  theme?: Theme;
}

// Screen specific theme overrides
export interface ScreenThemeOverrides {
  colors?: Partial<ColorPalette>;
  typography?: Partial<TypographyScale>;
  spacing?: Partial<SpacingScale>;
}

// Export default theme type
export type { Theme as DefaultTheme };
