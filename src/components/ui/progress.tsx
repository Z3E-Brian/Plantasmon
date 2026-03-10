import * as React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { useAppTheme } from '@/src/constants/designSystem'

interface ProgressProps {
  value?: number
  style?: ViewStyle
}

function Progress({ value = 0, style }: ProgressProps) {
  const theme = useAppTheme()
  
  // Clamp value between 0 and 100
  const clampedValue = Math.min(Math.max(value, 0), 100)

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary + '30' }, style]}>
      <View 
        style={[
          styles.indicator, 
          { 
            width: `${clampedValue}%`,
            backgroundColor: theme.colors.primary,
          }
        ]} 
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 8,
    width: '100%',
    borderRadius: 999,
    overflow: 'hidden',
  },
  indicator: {
    height: '100%',
    borderRadius: 999,
  },
})

export { Progress }
export type { ProgressProps }
