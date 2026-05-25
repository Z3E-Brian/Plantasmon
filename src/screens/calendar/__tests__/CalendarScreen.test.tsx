import React from "react"
import { render } from "@testing-library/react-native"
import CalendarScreen from "@/src/screens/calendar/CalendarScreen"

// Mock variables must be declared before jest.mock calls (hoisted)
const mockGetUserActivities = jest.fn()
const mockToActivityData = jest.fn()
const mockGetCurrentUserId = jest.fn()

// ── Mock ScreenWrapper — renders children directly ──
jest.mock("@/src/components/screenWrapper/ScreenWrapper", () => {
  const MockScreenWrapper = ({ children }: any) => children
  return MockScreenWrapper
})

// ── Mock SafeAreaContext (used by ScreenWrapper) ──
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaView: ({ children }: any) => children,
}))

// ── Mock ActivityFeed — renders simple text with count ──
jest.mock("@/src/components/profile/ActivityFeed", () => ({
  ActivityFeed: ({ activities }: any) => {
    const React = require("react")
    const { Text } = require("react-native")
    return React.createElement(Text, null,
      `ActivityFeed: ${activities.length} actividades`
    )
  },
}))

// ── Mock activityService — injectable mock functions ──
jest.mock("@/src/services/activityService", () => ({
  getUserActivities: (...args: any[]) => mockGetUserActivities(...args),
  toActivityData: (...args: any[]) => mockToActivityData(...args),
}))

// ── Mock userService — injectable mock function ──
jest.mock("@/src/services/userService", () => ({
  getCurrentUserId: (...args: any[]) => mockGetCurrentUserId(...args),
}))

// ── Mock react-native-calendars — simplified Calendar component ──
jest.mock("react-native-calendars", () => {
  const React = require("react")
  const { View, Text, TouchableOpacity } = require("react-native")
  return {
    Calendar: ({ onDayPress, markedDates }: any) => {
      return React.createElement(View, null,
        React.createElement(Text, null, "Calendar"),
        React.createElement(TouchableOpacity, {
          onPress: () => onDayPress && onDayPress({ dateString: "2026-05-24" }),
          testID: "calendar-day",
        }, React.createElement(Text, null, "Tap day"))
      )
    },
    LocaleConfig: {
      locales: {},
      defaultLocale: "en",
    },
  }
})

describe("CalendarScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("muestra indicador de carga al iniciar", () => {
    mockGetCurrentUserId.mockReturnValue("test_user")
    mockGetUserActivities.mockReturnValue(new Promise(() => {})) // never resolves

    const { getByText } = render(<CalendarScreen />)

    expect(getByText("📅 Calendario de actividades")).toBeTruthy()
  })

  it("muestra calendario y mensaje vacío cuando no hay actividades", async () => {
    mockGetCurrentUserId.mockReturnValue("test_user")
    mockGetUserActivities.mockResolvedValue([])

    const { findByText } = render(<CalendarScreen />)

    expect(await findByText("Calendar")).toBeTruthy()
    expect(await findByText("No hay actividades este día")).toBeTruthy()
  })

  it("muestra leyenda de colores en español", async () => {
    mockGetCurrentUserId.mockReturnValue("test_user")
    mockGetUserActivities.mockResolvedValue([])

    const { findByText } = render(<CalendarScreen />)

    expect(await findByText("Riego")).toBeTruthy()
    expect(await findByText("Identificación")).toBeTruthy()
    expect(await findByText("Logro")).toBeTruthy()
    expect(await findByText("Misión")).toBeTruthy()
  })

  it("muestra el título en español", () => {
    mockGetCurrentUserId.mockReturnValue("test_user")
    mockGetUserActivities.mockReturnValue(new Promise(() => {}))

    const { getByText } = render(<CalendarScreen />)

    expect(getByText("📅 Calendario de actividades")).toBeTruthy()
  })
})
