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

interface InfoBottomSheetProps {
  visible: boolean
  title: string
  message: string
  icon?: string
  showDontShowAgain?: boolean
  onDismiss: () => void
  onDontShowAgain?: () => void
}

function InfoBottomSheet({
  visible,
  title,
  message,
  icon,
  showDontShowAgain = false,
  onDismiss,
  onDontShowAgain,
}: InfoBottomSheetProps) {
  const slideAnim = useRef(new Animated.Value(0)).current
  const [dontShowAgain, setDontShowAgain] = useState(false)
  const [rendered, setRendered] = useState(false)

  // Reset animation state when visibility changes
  useEffect(() => {
    if (visible) {
      setRendered(true)
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        damping: 20,
      }).start()
    } else {
      slideAnim.setValue(0)
      // Delay unmount so reset is clean
      const timer = setTimeout(() => setRendered(false), 100)
      return () => clearTimeout(timer)
    }
  }, [visible, slideAnim])

  // Reset checkbox when sheet opens
  useEffect(() => {
    if (visible) {
      setDontShowAgain(false)
    }
  }, [visible])

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

  const handleEntendido = () => {
    if (dontShowAgain && onDontShowAgain) {
      onDontShowAgain()
    }
    onDismiss()
  }

  const handleToggleCheckbox = () => {
    setDontShowAgain((prev) => !prev)
  }

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
          {/* Header row */}
          <View style={styles.headerRow}>
            {icon ? <Text style={styles.iconText}>{icon}</Text> : null}
            <Text style={styles.titleText}>{title}</Text>
          </View>

          {/* Body message */}
          <Text style={styles.messageText}>{message}</Text>

          {/* "No mostrar de nuevo" checkbox */}
          {showDontShowAgain && (
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={handleToggleCheckbox}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.checkbox,
                  dontShowAgain && styles.checkboxChecked,
                ]}
              >
                {dontShowAgain && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
              <Text style={styles.checkboxLabel}>
                No mostrar de nuevo
              </Text>
            </TouchableOpacity>
          )}

          {/* "Entendido" button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleEntendido}
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
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconText: {
    fontSize: 40,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.foreground,
    flexShrink: 1,
  },
  messageText: {
    fontSize: 15,
    color: COLORS.cardForeground,
    lineHeight: 22,
    marginTop: 12,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
  },
  checkmark: {
    color: COLORS.primaryForeground,
    fontSize: 14,
    fontWeight: '700',
  },
  checkboxLabel: {
    color: COLORS.cardForeground,
    fontSize: 14,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: COLORS.primaryForeground,
    fontSize: 16,
    fontWeight: '600',
  },
})

export { InfoBottomSheet }
export type { InfoBottomSheetProps }
