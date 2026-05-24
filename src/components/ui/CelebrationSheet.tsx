import React, { useRef, useState, useEffect } from 'react'
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  PanResponder,
  StyleSheet,
} from 'react-native'
import { COLORS } from '@/src/constants/theme'

interface CelebrationSheetProps {
  visible: boolean
  title: string
  message: string
  icon: string
  onDismiss: () => void
}

function CelebrationSheet({
  visible,
  title,
  message,
  icon,
  onDismiss,
}: CelebrationSheetProps) {
  const slideAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0)).current
  const [rendered, setRendered] = useState(false)

  useEffect(() => {
    if (visible) {
      setRendered(true)
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 1,
          useNativeDriver: true,
          damping: 20,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          damping: 12,
          stiffness: 200,
        }),
      ]).start()
    } else {
      slideAnim.setValue(0)
      scaleAnim.setValue(0)
      const timer = setTimeout(() => setRendered(false), 100)
      return () => clearTimeout(timer)
    }
  }, [visible, slideAnim, scaleAnim])

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [400, 0],
  })

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) =>
        Math.abs(gs.dy) > 10 && gs.dy > 0,
      onPanResponderMove: (_, gs) => {
        if (gs.dy > 0) {
          slideAnim.setValue(1 - gs.dy / 400)
        }
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dy > 120 || gs.vy > 0.5) {
          onDismiss()
        } else {
          Animated.spring(slideAnim, {
            toValue: 1,
            useNativeDriver: true,
          }).start()
        }
      },
    }),
  ).current

  if (!rendered && !visible) {
    return null
  }

  return (
    <Modal
      visible={visible || rendered}
      transparent={true}
      animationType="none"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.sheetContainer,
            { transform: [{ translateY }] },
          ]}
          {...panResponder.panHandlers}
        >
          {/* Large centered icon */}
          <Animated.Text
            style={[
              styles.iconText,
              {
                transform: [
                  { scale: scaleAnim },
                  { translateY: translateY },
                ],
              },
            ]}
          >
            {icon}
          </Animated.Text>

          {/* Title */}
          <Text style={styles.titleText}>{title}</Text>

          {/* Message */}
          <Text style={styles.messageText}>{message}</Text>

          {/* "Entendido" button */}
          <TouchableOpacity
            style={styles.button}
            onPress={onDismiss}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Entendido</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: COLORS.card,
    padding: 24,
    paddingBottom: 36,
    alignItems: 'center',
  },
  iconText: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: 8,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.foreground,
    textAlign: 'center',
  },
  messageText: {
    fontSize: 15,
    color: COLORS.cardForeground,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 8,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
    alignSelf: 'stretch',
  },
  buttonText: {
    color: COLORS.primaryForeground,
    fontSize: 16,
    fontWeight: '600',
  },
})

export { CelebrationSheet }
export type { CelebrationSheetProps }
