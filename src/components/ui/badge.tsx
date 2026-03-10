import * as React from 'react'
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native'
import { useAppTheme } from '@/src/constants/designSystem'

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'

interface BadgeProps {
  variant?: BadgeVariant
  children?: React.ReactNode
  style?: ViewStyle
  textStyle?: TextStyle
}

function Badge({
  variant = 'default',
  children,
  style,
  textStyle,
  ...props
}: BadgeProps) {
  const theme = useAppTheme()
  
  const containerStyles = [
    styles.badge,
    variant === 'default' && {
      backgroundColor: theme.colors.primary,
      borderColor: 'transparent',
    },
    variant === 'secondary' && {
      backgroundColor: theme.colors.secondary,
      borderColor: 'transparent',
    },
    variant === 'destructive' && {
      backgroundColor: '#ef4444',
      borderColor: 'transparent',
    },
    variant === 'outline' && {
      backgroundColor: 'transparent',
      borderColor: theme.colors.border,
    },
    style,
  ]

  const textStyles = [
    styles.text,
    variant === 'default' && {
      color: theme.colors.primaryForeground,
    },
    variant === 'secondary' && {
      color: theme.colors.secondaryForeground,
    },
    variant === 'destructive' && {
      color: '#ffffff',
    },
    variant === 'outline' && {
      color: theme.colors.textPrimary,
    },
    textStyle,
  ]

  return (
    <View style={containerStyles} {...props}>
      <Text style={textStyles}>{children}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
})

export { Badge }
export type { BadgeProps, BadgeVariant }
