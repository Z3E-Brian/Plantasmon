import React from "react"
import { render, fireEvent } from "@testing-library/react-native"
import LoginScreen from "@/src/screens/auth/loginScreen"

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn() }),
}))

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaView: ({ children }: any) => children,
}))

jest.mock("expo-auth-session/providers/google", () => ({
  useIdTokenAuthRequest: () => [null, null, jest.fn()],
}))

jest.mock("firebase/auth", () => ({
  GoogleAuthProvider: { credential: jest.fn() },
  signInWithCredential: jest.fn(),
}))

jest.mock("@/src/config/firebase", () => ({
  auth: {},
}))

jest.mock("@/src/services/authService", () => ({
  login: jest.fn(),
  resetPassword: jest.fn(),
}))

describe("LoginScreen", () => {
  it("muestra error cuando el formulario está vacío", () => {
    const { getByText, queryByText } = render(<LoginScreen />)

    expect(queryByText("Por favor completa todos los campos.")).toBeNull()

    fireEvent.press(getByText("Entrar"))

    expect(getByText("Por favor completa todos los campos.")).toBeTruthy()
  })
})
