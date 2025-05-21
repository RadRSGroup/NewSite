import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

// Define the parameters for each screen
export type RootStackParamList = {
  Home: undefined;
  About: undefined;
  Services: {
    section?: 'challenge' | 'solution' | 'approach';
  };
  Contact: {
    prefilledSubject?: string;
    referralSource?: string;
  };
};

// Create types for navigation props
export type RootStackNavigationProp<T extends keyof RootStackParamList> = 
  StackNavigationProp<RootStackParamList, T>;

// Create types for route props
export type RootStackRouteProp<T extends keyof RootStackParamList> = 
  RouteProp<RootStackParamList, T>;

// Create a type for components that need navigation props
export interface NavigationProps<T extends keyof RootStackParamList> {
  navigation: RootStackNavigationProp<T>;
  route: RootStackRouteProp<T>;
}

// Common navigation actions
export const NavigationActions = {
  // Navigate to a screen with optional params
  navigateToScreen: <T extends keyof RootStackParamList>(
    navigation: RootStackNavigationProp<any>,
    screen: T,
    params?: RootStackParamList[T]
  ) => {
    navigation.navigate(screen, params);
  },

  // Reset navigation stack to a specific screen
  resetToScreen: <T extends keyof RootStackParamList>(
    navigation: RootStackNavigationProp<any>,
    screen: T,
    params?: RootStackParamList[T]
  ) => {
    navigation.reset({
      index: 0,
      routes: [{ name: screen, params }],
    });
  },

  // Navigate back
  goBack: (navigation: RootStackNavigationProp<any>) => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  },
};

// Screen configuration types
export interface ScreenConfig {
  name: keyof RootStackParamList;
  component: React.ComponentType<any>;
  options?: {
    title?: string;
    headerShown?: boolean;
    animation?: 'default' | 'fade' | 'slide' | 'none';
    gestureEnabled?: boolean;
  };
}

// Navigation event types
export type NavigationEventType = 
  | 'focus'
  | 'blur'
  | 'beforeRemove'
  | 'state';

export interface NavigationEventHandler {
  (event: { data: { state: any } }): void;
}

// Navigation state types
export interface NavigationState {
  index: number;
  routes: Array<{
    name: string;
    key: string;
    params?: any;
  }>;
}

// Navigation helper types
export type NavigationReadyCallback = () => void;

export interface NavigationRef {
  current: {
    navigate: (name: string, params?: any) => void;
    goBack: () => void;
    reset: (state: any) => void;
  } | null;
}

// Export default object with all navigation-related utilities
export default {
  Actions: NavigationActions,
};
