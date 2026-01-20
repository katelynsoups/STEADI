import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react-native";
import SignUp from "../src/components/SignUp";
import { signUp } from "../src/utils/gcipAuth";
import { Alert } from "react-native";

// Mocking signUp
jest.mock("../src/utils/gcipAuth", () => ({
    signUp: jest.fn(),
}));

// Mocking useRouter
const mockPush = jest.fn();

jest.mock("expo-router", () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

// Silence component console output during tests
beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => { });
    jest.spyOn(console, "error").mockImplementation(() => { });
});

// Restore all mocks after all tests
afterAll(() => {
    jest.restoreAllMocks();
});

// Clear mocks before each test
beforeEach(() => {
    jest.clearAllMocks();
});

describe("SignUp: render and state management.", () => {
    test("Test 1: Renders text and Next button.", () => {
        render(<SignUp />);

        expect(screen.getByText("First Name")).toBeTruthy();
        expect(screen.getByText("Last Name")).toBeTruthy();
        expect(screen.getByText("Email")).toBeTruthy();
        expect(screen.getByText("Password")).toBeTruthy();
        expect(screen.getByText("Confirm Password")).toBeTruthy();
        expect(screen.getByText("Next")).toBeTruthy();
    });

    test("Test 2: Updates input values when user types.", () => {
        render(<SignUp />);
        const emailInput = screen.getByTestId("emailInput");
        const passwordInput = screen.getByTestId("passwordInput");
        const confirmPasswordInput = screen.getByTestId("confirmPasswordInput");

        fireEvent.changeText(emailInput, "jonDoe@example.com");
        fireEvent.changeText(passwordInput, "JonDoe123!!");
        fireEvent.changeText(confirmPasswordInput, "JonDoe123!!");

        // Skip first/last name are uncontrolled (no value/onChangeText)
        // so we won't assert them for now.
        expect(emailInput.props.value).toBe("jonDoe@example.com");
        expect(passwordInput.props.value).toBe("JonDoe123!!");
        expect(confirmPasswordInput.props.value).toBe("JonDoe123!!");
    });

});

describe("SignUp: handle sign up process.", () => {
    test("Test 3: Calls signUp, shows alert on success, navigates to /login.", async () => {
        // Mocking successful signUp
        const mockSignUp = signUp as jest.Mock;
        mockSignUp.mockResolvedValue({ user: { uid: "12345" } });

        const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => { });
        render(<SignUp />);

        fireEvent.changeText(screen.getByTestId("emailInput"), "jonDoe@example.com");
        fireEvent.changeText(screen.getByTestId("passwordInput"), "JonDoe123!!");
        fireEvent.changeText(screen.getByTestId("confirmPasswordInput"), "JonDoe123!!");

        expect(mockPush).not.toHaveBeenCalled();

        fireEvent.press(screen.getByTestId("nextButton"));

        await waitFor(() => {
            expect(mockSignUp).toHaveBeenCalledWith("jonDoe@example.com", "JonDoe123!!");
            expect(alertSpy).toHaveBeenCalledWith("Success", "Account created successfully");
            expect(mockPush).toHaveBeenCalledWith("/login");
        });
        expect(mockSignUp).toHaveBeenCalledTimes(1);
    });

    test("Test 4: Client error - passwords do not match => shows alert, does not call signUp, does not navigate", async () => {
        // Mocking failed signup
        const mockSignUp = signUp as jest.Mock;
        const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => { });
        render(<SignUp />);

        fireEvent.changeText(screen.getByTestId("emailInput"), "jonDoe@example.com");
        fireEvent.changeText(screen.getByTestId("passwordInput"), "JonDoe123!!");
        fireEvent.changeText(screen.getByTestId("confirmPasswordInput"), "Bruce123!");
        fireEvent.press(screen.getByTestId("nextButton"));

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith("Error", "Passwords do not match");
        });

        expect(mockSignUp).not.toHaveBeenCalled();
        expect(mockPush).not.toHaveBeenCalled();
    });

    test("Test 5: Server/Network error - signUp rejects => shows alert, calls signUp once, does not navigate.", async () => {
        const mockSignUp = signUp as jest.Mock;
        mockSignUp.mockRejectedValue(new Error("Network Error"));

        const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => { });
        render(<SignUp />);

        fireEvent.changeText(screen.getByTestId("emailInput"), "jonDoe@example.com");
        fireEvent.changeText(screen.getByTestId("passwordInput"), "JonDoe123!!");
        fireEvent.changeText(screen.getByTestId("confirmPasswordInput"), "JonDoe123!!");
        
        expect(mockPush).not.toHaveBeenCalled();
        
        fireEvent.press(screen.getByTestId("nextButton"));

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith("Error", "Network Error");
        });
        expect(mockSignUp).toHaveBeenCalledTimes(1);
        expect(mockPush).not.toHaveBeenCalled();
    });
});