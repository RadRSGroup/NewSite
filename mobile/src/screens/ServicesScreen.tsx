import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated3DBackground from '../components/Animated3DBackground';
import GlassCard from '../components/GlassCard';
import { colors, typography, spacing, layout } from '../styles/theme';
import appConfig from '../config/appConfig';

interface ServiceCardProps {
  title: string;
  content: string;
  index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, content, index }) => {
  const scrollOffset = useRef(new Animated.Value(0)).current;
  
  const animatedStyle = {
    transform: [{
      translateX: scrollOffset.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [50, 0, -50],
      })
    }]
  };

  return (
    <GlassCard 
      style={styles.serviceCard} 
      animated 
      animationDelay={index * 200}>
      <Animated.View style={animatedStyle}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardText}>{content}</Text>
      </Animated.View>
    </GlassCard>
  );
};

const ServicesScreen = () => {
  const navigation = useNavigation();
  const [scrollY] = useState(new Animated.Value(0));

  const services = [
    {
      title: "The Challenge",
      content: "AI is proving to be a major disruptor in every part of the modern business landscape. While adopting this technology is not an option, what is the best way to apply it to your business? Market AI software often promises quick solutions, but in practice, it frequently falls short for businesses with unique challenges. These generic tools are designed for broad use, which means they may not align well with specific workflows or industry nuances."
    },
    {
      title: "Our Solution",
      content: "In contrast, hyper-targeted AI solutions are tailored to a company's specific needs and can adapt as those needs evolve. Instead of becoming obsolete with technological advancements, these customized tools can incorporate new developments, ensuring they remain relevant and effective. This adaptability allows businesses to stay ahead, using AI that grows and changes alongside them."
    },
    {
      title: "Our Approach",
      content: "At RS Group, we specialize in creating AI solutions that fit seamlessly into your existing processes. Our approach focuses on enhancing your team's capabilities, not replacing them, ensuring that technology serves as a valuable assistant rather than a disruptive force. By aligning AI tools with your specific goals and workflows, we help you achieve greater efficiency and sustained growth. We believe that the future of AI is its integration with human intelligence."
    }
  ];

  const parallaxY = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.container}>
      <Animated3DBackground type="background" intensity={0.8} interactive={true} />

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

        <Animated.View style={[styles.contentContainer, { transform: [{ translateY: parallaxY }] }]}>
          <GlassCard style={styles.titleCard} animated>
            <Text style={styles.title}>Beyond Off-the-Shelf</Text>
          </GlassCard>

          {services.map((service, index) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              content={service.content}
              index={index + 1}
            />
          ))}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
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
  contentContainer: {
    flex: 1,
    gap: spacing.xl,
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
    textAlign: 'center',
  },
  serviceCard: {
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  cardTitle: {
    fontSize: typography.sizes.title3,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  cardText: {
    fontSize: typography.sizes.regular,
    color: colors.text.secondary,
    lineHeight: typography.lineHeights.regular * typography.sizes.regular,
  },
});

export default ServicesScreen;
