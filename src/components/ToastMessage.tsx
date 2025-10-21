import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, Text } from 'react-native'
import { Colors } from '../utils/Colors'
import { height, width } from '../utils/Dimensions'

type Props = {
  type: 'success' | 'error' | 'info'
  message: string
  duration?: number
  onHide?: () => void
}

export default function ToastMessage({ type, message, duration = 3000, onHide }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(80)).current // start below the screen

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return '#4CAF50'
      case 'error':
        return '#F44336'
      case 'info':
        return Colors.primary
      default:
        return 'rgba(0,0,0,0.7)'
    }
  }

  useEffect(() => {
    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start()

    // Animate out after `duration`
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 80, duration: 500, useNativeDriver: true }),
      ]).start(() => onHide && onHide())
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, fadeAnim, translateY, onHide])

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          opacity: fadeAnim,
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: width * 0.9,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 50,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    zIndex: 5,
    elevation: 5,
  },
  text: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
})
