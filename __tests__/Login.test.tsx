import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react-native";
import Login from "../src/components/Login";
import { signIn } from "../src/utils/gcipAuth";
import { Alert } from "react-native";

// Mock react-native-safe-area-context to render children directly in tests
jest.mock('react-native-safe-area-context', () => {
    const React = require('react');
    const { View } = require('react-native');
    return {
        SafeAreaProvider: ({ children }: any) => children,
        SafeAreaView: ({ children, style }: any) => React.createElement(View, { style }, children),
    };
});

// Mocking useRouter
const mockPush = jest.fn();
jest.mock("expo-router", () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

// Mocking signIn
jest.mock("../src/utils/gcipAuth", () => ({
    signIn: jest.fn(),
}));

// Mock Expo vector icons so they don't try to load fonts/assets in Jest
jest.mock("@expo/vector-icons/Entypo", () => "Entypo");
jest.mock("@expo/vector-icons/AntDesign", () => "AntDesign");

// Clear mocks before each test
beforeEach(() => {
    jest.resetAllMocks();
});

// Restore any mocked implementations after each test
afterEach(() => {
    jest.restoreAllMocks();
});

describe("Login: renders correctly and manages state correctly.", () => {
    test("Test 1: Renders text.", () => {
        render(<Login />);

        expect(screen.getByText("Sign in to your Account")).toBeTruthy();
        expect(screen.getByText("Enter your phone number and password to log in")).toBeTruthy();
        expect(screen.getByText("Continue with Apple")).toBeTruthy();
        expect(screen.getByText("Or")).toBeTruthy();
        expect(screen.getByText("Remember me")).toBeTruthy();
        expect(screen.getByText("Forgot Password?")).toBeTruthy();
        expect(screen.getByText("Log In")).toBeTruthy();
        expect(screen.getByText("Don't have an account?")).toBeTruthy();
        expect(screen.getByText("Sign Up")).toBeTruthy();
    });

    test("Test 2: Updates input values when user types.", () => {
        render(<Login />);
        const emailOrPhoneInput = screen.getByTestId("emailOrPhoneInput");
        const passwordInput = screen.getByTestId("passwordInput");

        // Simulating user typing
        fireEvent.changeText(emailOrPhoneInput, "(123) 456-7890");
        fireEvent.changeText(passwordInput, "dummyPassword");

        // Asserting the input values
        expect(emailOrPhoneInput.props.value).toBe("(123) 456-7890");
        expect(passwordInput.props.value).toBe("dummyPassword");
    });
});

describe("Login: user interactions handle correctly.", () => {
    test("Test 3: Navigates to /signup when Sign Up is pressed", () => {
        render(<Login />);
        const signUpLink = screen.getByText("Sign Up");

        // Simulating press
        fireEvent.press(signUpLink);

        // Asserting navigation
        expect(mockPush).toHaveBeenCalledTimes(1);
        expect(mockPush).toHaveBeenCalledWith("/signup");
    });

    test("Test 4:Toggles password visibility when eye icon is pressed", () => {
        render(<Login />);
        const passwordInput = screen.getByTestId("passwordInput");
        const toggleButton = screen.getByTestId("togglePasswordVisibility");

        expect(passwordInput.props.secureTextEntry).toBe(true);

        fireEvent.press(toggleButton);
        expect(screen.getByTestId("passwordInput").props.secureTextEntry).toBe(false);

        fireEvent.press(toggleButton);
        expect(screen.getByTestId("passwordInput").props.secureTextEntry).toBe(true);
    });
});

describe("Login: auth flow.", () => {
    test("Test 5: Logs in successfully and navigates to /home", async () => {
        const mockSignIn = signIn as jest.Mock;
        const mockGetIdToken = jest.fn().mockResolvedValue("dummyToken");

        // Mocking successful signIn
        mockSignIn.mockResolvedValue({
            user: { getIdToken: mockGetIdToken },
        });

        const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => { });
        render(<Login />);

        fireEvent.changeText(screen.getByTestId("emailOrPhoneInput"), "(123) 456-7890");
        fireEvent.changeText(screen.getByTestId("passwordInput"), "dummyPassword");

        // Make sure no navigation before pressing login button
        expect(mockPush).not.toHaveBeenCalled();

        // Simulating login button press
        fireEvent.press(screen.getByTestId("loginButton"));

        // Awaiting async operations and asserting calls
        await waitFor(() => {
            expect(mockSignIn).toHaveBeenCalledWith("(123) 456-7890", "dummyPassword");
            expect(alertSpy).toHaveBeenCalledWith("Success", "Logged in successfully!");
            expect(mockPush).toHaveBeenCalledWith("/home");

        });

        expect(mockGetIdToken).toHaveBeenCalledTimes(1);
        expect(mockSignIn).toHaveBeenCalledTimes(1);
    });

    test("Test 6: Shows error alert when login fails via err.response.data.error.message", async () => {
        const mockSignIn = signIn as jest.Mock;

        mockSignIn.mockRejectedValue({
            response: {
                data: {
                    error: {
                        message: "INVALID CREDENTIALS",
                    },
                },
            },
            message: "Some other error message",
        });

        const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => { });
        render(<Login />);

        fireEvent.changeText(screen.getByTestId("emailOrPhoneInput"), "(123) 456-7890");
        fireEvent.changeText(screen.getByTestId("passwordInput"), "wrongPassword");
        fireEvent.press(screen.getByTestId("loginButton"));

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith("Login Failed", "INVALID CREDENTIALS");
        });
        expect(mockPush).not.toHaveBeenCalled();
    });

    test("Test 7: Shows error alert when login fails via error.message", async () => {
        const mockSignIn = signIn as jest.Mock;

        mockSignIn.mockRejectedValue(new Error("Some other error message"));

        const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => { });

        render(<Login />);

        fireEvent.changeText(screen.getByTestId("emailOrPhoneInput"), "(123) 456-7890");
        fireEvent.changeText(screen.getByTestId("passwordInput"), "wrongPassword");
        fireEvent.press(screen.getByTestId("loginButton"));

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith("Login Failed", "Some other error message");
        });
        expect(mockPush).not.toHaveBeenCalled();
    })
});