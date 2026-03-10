import * as React from 'react'
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, PressableProps } from 'react-native'
import { useAppTheme } from '@/src/constants/designSystem'

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'

interface ButtonProps extends PressableProps {
  variant?: ButtonVariant
  size?: ButtonSize
  children?: React.ReactNode
  style?: ViewStyle
  textStyle?: TextStyle
}

function Button({
  variant = 'default',
  size = 'default',
  children,
  style,
  textStyle,
  disabled,
  ...props
}: ButtonProps) {
  const theme = useAppTheme()
  
  const containerStyles = [
    styles.button,
    size === 'sm' && styles.buttonSm,
    size === 'lg' && styles.buttonLg,
    size === 'icon' && styles.buttonIcon,
    variant === 'default' && {
      backgroundColor: theme.colors.primary,
    },
    variant === 'destructive' && {
      backgroundColor: '#ef4444',
    },
    variant === 'outline' && {
      backgroundColor: 'transparent',
      borderColor: theme.colors.border,
      borderWidth: 1,
    },
    variant === 'secondary' && {
      backgroundColor: theme.colors.secondary,
    },
    variant === 'ghost' && {
      backgroundColor: 'transparent',
    },
    variant === 'link' && {
      backgroundColor: 'transparent',
    },
    disabled && styles.buttonDisabled,
    style,
  ]

  const textStyles = [
    styles.text,
    size === 'sm' && styles.textSm,
    size === 'lg' && styles.textLg,
    variant === 'default' && {
      color: theme.colors.primaryForeground,
    },
    variant === 'destructive' && {
      color: '#ffffff',
    },
    variant === 'outline' && {
      color: theme.colors.textPrimary,
    },
    variant === 'secondary' && {
      color: theme.colors.secondaryForeground,
    },
    variant === 'ghost' && {
      color: theme.colors.textPrimary,
    },
    variant === 'link' && {
      color: theme.colors.primary,
      textDecorationLine: 'underline',
    },
    disabled && styles.textDisabled,
    textStyle,
  ]

  return (
    <Pressable 
      style={containerStyles} 
      disabled={disabled}
      {...props}
    >
      <Text style={textStyles}>{children}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 40,
  },
  buttonSm: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 32,
  },
  buttonLg: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    minHeight: 44,
  },
  buttonIcon: {
    width: 40,
    height: 40,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
  textSm: {
    fontSize: 12,
  },
  textLg: {
    fontSize: 16,
  },
  textDisabled: {
    opacity: 0.7,
  },
})

export { Button }
export type { ButtonProps, ButtonVariant, ButtonSize }
