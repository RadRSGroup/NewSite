import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated3DBackground from '../components/Animated3DBackground';
import GlassCard from '../components/GlassCard';
import { colors, typography, spacing, layout } from '../styles/theme';
import appConfig from '../config/appConfig';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const ContactScreen = () => {
  const navigation = useNavigation();
  // Form management hook
  const {
    values,
    errors,
    touched,
    isSubmitting,
    submitStatus,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldProps
  } = useFormManagement({
    initialValues: {
      name: '',
      email: '',
      message: '',
    },
    validations: {
      name: [
        ValidationRules.required('Please enter your name'),
        ValidationRules.minLength(appConfig.contactConfig.validation.nameMinLength, 'Name is too short'),
        ValidationRules.maxLength(appConfig.contactConfig.validation.nameMaxLength, 'Name is too long'),
      ],
      email: [
        ValidationRules.required('Please enter your email'),
        ValidationRules.email(),
      ],
      message: [
        ValidationRules.required('Please enter your message'),
        ValidationRules.minLength(
          appConfig.contactConfig.validation.messageMinLength,
          'Message is too short'
        ),
        ValidationRules.maxLength(
          appConfig.contactConfig.validation.messageMaxLength,
          'Message is too long'
        ),
      ],
    },
    onSubmit: async (values) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, appConfig.contactConfig.submitDelay));
      // Here you would typically make an API call to submit the form
      console.log('Form submitted:', values);
    },
    formId: 'contact-form',
  });
  const [scrollY] = useState(new Animated.Value(0));

  // Animation values for form elements
  const inputAnimations = {
    name: useRef(new Animated.Value(0)).current,
    email: useRef(new Animated.Value(0)).current,
    message: useRef(new Animated.Value(0)).current,
  };

  React.useEffect(() => {
    // Stagger the animations
    Object.values(inputAnimations).forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: appConfig.animationConfig.timing.normal,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, appConfig.contactConfig.submitDelay));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = () => {
    const { nameMinLength, messageMinLength } = appConfig.contactConfig.validation;
    return (
      formData.name.length >= nameMinLength &&
      formData.email.includes('@') &&
      formData.message.length >= messageMinLength
    );
  };

  const getInputAnimation = (key) => ({
    opacity: inputAnimations[key],
    transform: [
      {
        translateY: inputAnimations[key].interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        }),
      },
    ],
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <Animated3DBackground type="background" intensity={0.6} interactive={true} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}>
          
          <GlassCard style={styles.headerCard} animated>
            <Pressable
              style={styles.backButton}
              onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>← Back</Text>
            </Pressable>
          </GlassCard>

          <GlassCard style={styles.titleCard} animated>
            <Text style={styles.title}>Contact Us</Text>
            <Text style={styles.subtitle}>
              Let's discuss how we can help transform your business
            </Text>
          </GlassCard>

          <GlassCard style={styles.formCard} animated animationDelay={200}>
            <Animated.View style={[styles.inputGroup, getInputAnimation('name')]}>
              <Text style={styles.label}>Name</Text>
              <AnimatedTextInput
                {...getFieldProps('name')}
                style={[
                  styles.input,
                  touched.name && errors.name && styles.inputError
                ]}
                placeholder="Your Name"
                placeholderTextColor={colors.text.muted}
              />
              {touched.name && errors.name && (
                <Text style={styles.errorText}>{errors.name[0]}</Text>
              )}
            </Animated.View>

            <Animated.View style={[styles.inputGroup, getInputAnimation('email')]}>
              <Text style={styles.label}>Email</Text>
              <AnimatedTextInput
                {...getFieldProps('email')}
                style={[
                  styles.input,
                  touched.email && errors.email && styles.inputError
                ]}
                placeholder="your@email.com"
                placeholderTextColor={colors.text.muted}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {touched.email && errors.email && (
                <Text style={styles.errorText}>{errors.email[0]}</Text>
              )}
            </Animated.View>

            <Animated.View style={[styles.inputGroup, getInputAnimation('message')]}>
              <Text style={styles.label}>Message</Text>
              <AnimatedTextInput
                {...getFieldProps('message')}
                style={[
                  styles.input,
                  styles.messageInput,
                  touched.message && errors.message && styles.inputError
                ]}
                placeholder="How can we help?"
                placeholderTextColor={colors.text.muted}
                multiline
                numberOfLines={4}
              />
              {touched.message && errors.message && (
                <Text style={styles.errorText}>{errors.message[0]}</Text>
              )}
            </Animated.View>

            <View style={styles.messageContainer}>
              <Button
                title={Object.keys(errors).length > 0 ? 'Please fix errors' : 'Send Message'}
                onPress={handleSubmit}
                disabled={isSubmitting || Object.keys(errors).length > 0}
                loading={isSubmitting}
                error={Object.keys(errors).length > 0}
                variant="primary"
                size="large"
                glassEffect={true}
                animated={true}
                animationDelay={400}
              />

              {submitStatus === 'success' && (
                <Animated.View 
                  style={[styles.formValidation, { opacity: fadeAnim }]}>
                  <GlassCard style={styles.messageCard} animated>
                    <Text style={styles.successMessage}>
                      Thank you! We'll get back to you soon.
                    </Text>
                  </GlassCard>
                </Animated.View>
              )}
              
              {submitStatus === 'error' && errors.form && (
                <Animated.View 
                  style={[styles.formValidation, { opacity: fadeAnim }]}>
                  <GlassCard style={styles.messageCard} animated>
                    <Text style={styles.errorMessage}>
                      {errors.form[0]}
                    </Text>
                  </GlassCard>
                </Animated.View>
              )}
            </View>
          </GlassCard>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  headerCard: {
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  backButton: {
    padding: spacing.sm,
  },
  backButtonText: {
    color: colors.text.primary,
    fontSize: typography.sizes.regular,
  },
  titleCard: {
    padding: spacing.xl,
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.sizes.title2,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.sizes.large,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  formCard: {
    padding: spacing.xl,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    color: colors.text.primary,
    fontSize: typography.sizes.regular,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.glass.background,
    borderRadius: layout.borderRadius.medium,
    padding: spacing.md,
    color: colors.text.primary,
    fontSize: typography.sizes.regular,
  },
  messageInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: layout.borderRadius.medium,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: colors.text.primary,
    fontSize: typography.sizes.regular,
    fontWeight: typography.weights.bold,
  },
  inputError: {
    borderWidth: 1,
    borderColor: colors.status.error,
    backgroundColor: `${colors.status.error}10`,
  },
  errorText: {
    color: colors.status.error,
    fontSize: typography.sizes.small,
    marginTop: spacing.xs,
    marginLeft: spacing.sm,
  },
  successMessage: {
    color: colors.status.success,
    textAlign: 'center',
    marginTop: spacing.md,
    fontSize: typography.sizes.regular,
    fontWeight: typography.weights.medium,
  },
  errorMessage: {
    color: colors.status.error,
    textAlign: 'center',
    marginTop: spacing.md,
    fontSize: typography.sizes.regular,
    fontWeight: typography.weights.medium,
  },
  submitButtonError: {
    backgroundColor: colors.status.error,
    opacity: 0.7,
  },
  messageContainer: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  formValidation: {
    marginTop: spacing.sm,
  },
});

export default ContactScreen;
