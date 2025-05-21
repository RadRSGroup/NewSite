import React from 'react';
import { TransitionPresets } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import AboutScreen from '../screens/AboutScreen';
import ServicesScreen from '../screens/ServicesScreen';
import ContactScreen from '../screens/ContactScreen';

// Import theme
import { colors } from '../styles/theme';

const Stack = createNativeStackNavigator();

// Custom transition configuration
const screenOptions = {
  ...TransitionPresets.SlideFromRightIOS, // Default transition
  headerShown: false,
  gestureEnabled: true,
  cardStyle: { backgroundColor: 'transparent' },
  cardOverlayEnabled: true,
  animationEnabled: true,
  presentation: 'card',
};

// Custom transitions for specific routes
const screenSpecificOptions = {
  Home: {
    ...screenOptions,
    gestureEnabled: false, // Disable gesture on home screen
  },
  About: {
    ...screenOptions,
    ...TransitionPresets.SlideFromRightIOS,
  },
  Services: {
    ...screenOptions,
    ...TransitionPresets.SlideFromRightIOS,
  },
  Contact: {
    ...screenOptions,
    ...TransitionPresets.SlideFromRightIOS,
  },
};

// Navigation theme
const navigationTheme = {
  dark: true,
  colors: {
    primary: colors.primary,
    background: colors.background,
    card: colors.background,
    text: colors.text.primary,
    border: colors.glass.border,
    notification: colors.status.error,
  },
};

export const AppNavigator = () => {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={screenOptions}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={screenSpecificOptions.Home}
        />
        <Stack.Screen
          name="About"
          component={AboutScreen}
          options={screenSpecificOptions.About}
        />
        <Stack.Screen
          name="Services"
          component={ServicesScreen}
          options={screenSpecificOptions.Services}
        />
        <Stack.Screen
          name="Contact"
          component={ContactScreen}
          options={screenSpecificOptions.Contact}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  About: undefined;
  Services: undefined;
  Contact: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export default AppNavigator;
