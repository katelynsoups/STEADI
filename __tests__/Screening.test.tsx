import React from "react";
import { render, fireEvent, screen } from "@testing-library/react-native";
import Screening from "../src/components/Screening";

// Silent console warnings during tests
let warnSpy: jest.SpyInstance;
beforeAll(() => {
    warnSpy = jest.spyOn(console, "warn").mockImplementation(() => { });
});
afterAll(() => {
    warnSpy.mockRestore();
});

// Mocking router
const mockPush = jest.fn();
jest.mock("expo-router", () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

// Mock logger
const mockSaveScreeningEvent = jest.fn();
jest.mock("../src/utils/eventLogger", () => ({
    saveScreeningEvent: (...args: any[]) => mockSaveScreeningEvent(...args),
}));

// Mock Ionicons to avoid loading fonts/assets in Jest
jest.mock("@expo/vector-icons/Ionicons", () => "Ionicons");

// StatusBar mock
jest.mock("expo-status-bar", () => ({
    StatusBar: () => null,
}));

// Clear mocks before each test
beforeEach(() => {
    jest.resetAllMocks();
});

// Restore any mocked implementations after each test
afterEach(() => {
    jest.restoreAllMocks();
});

// Sample test data from screeningQuestions.ts
const questions = [
    {
        id: 'fallen',
        prompt: 'I have fallen in the past year.',
        whyItMatters: 'People who have fallen once are likely to fall again.'
    }, {
        id: 'cane',
        prompt: 'I use or have been advised to use a cane or walker to get around safely.',
        whyItMatters: 'People who have been advised to use a cane or walker may already be more likely to fall.'
    }
];

describe("Screening: rendering and initial state.", () => {
    test("Test 1: Renders all questions with numbering", () => {
        // Render the Screening component with the test questions
        render(<Screening questions={questions} />);

        expect(screen.getByText("1. I have fallen in the past year.")).toBeTruthy();
        expect(screen.getByText("2. I use or have been advised to use a cane or walker to get around safely.")).toBeTruthy();

    });

    test("Test 2: Next button starts disabled when not all questions are answered", () => {
        // Render the Screening component with the test questions
        render(<Screening questions={questions} />);

        // Check that the Next button is initially disabled
        expect(screen.getByTestId("nextButton")).toBeDisabled();
    });
});

describe("Screening: answering questions.", () => {
    test("Test 3A: Selecting an answer logs the saveScreeningEvent(questionId, option)", () => {
        render(<Screening questions={questions} />);

        fireEvent.press(screen.getByTestId("answer-fallen-Yes"));

        expect(mockSaveScreeningEvent).toHaveBeenCalledTimes(1);
        expect(mockSaveScreeningEvent).toHaveBeenCalledWith("fallen", "Yes");

    });

    test("Test 3B: Selecting No logs the saveScreeningEvent(questionId, option)", () => {
        render(<Screening questions={questions} />);
        fireEvent.press(screen.getByTestId("answer-cane-No"));

        expect(mockSaveScreeningEvent).toHaveBeenCalledTimes(1);
        expect(mockSaveScreeningEvent).toHaveBeenCalledWith("cane", "No");
    });

    test("Test 4: Next stays disabled until all questions are answered.", () => {
        render(<Screening questions={questions} />);

        fireEvent.press(screen.getByTestId("answer-fallen-Yes"));
        expect(screen.getByTestId("nextButton")).toBeDisabled();

        fireEvent.press(screen.getByTestId("answer-cane-No"));
        expect(screen.getByTestId("nextButton")).toBeEnabled();
    });
});

describe("Screening: Next button behavior.", () => {
    test("Test 5: When questions are not all answered, pressing Next does nothing.", () => {
        // Covering if(!allAnswered) return; in handleNext

        const onComplete = jest.fn();
        render(<Screening questions={questions} nextRoute="/next-screen" onComplete={onComplete} />);

        // One question answered
        fireEvent.press(screen.getByTestId("answer-fallen-Yes"));
        // Try to press Next
        fireEvent.press(screen.getByTestId("nextButton"));

        // onComplete and navigation should not be called
        expect(onComplete).not.toHaveBeenCalled();
        expect(mockPush).not.toHaveBeenCalled();
    });
    test("Test 6: All questions and nextRoute is provided, Next navigates.", () => {
        render(<Screening questions={questions} nextRoute="/next-screen" />);

        fireEvent.press(screen.getByTestId("answer-fallen-Yes"));
        fireEvent.press(screen.getByTestId("answer-cane-No"));
        fireEvent.press(screen.getByTestId("nextButton"));

        expect(mockPush).toHaveBeenCalledTimes(1);
        expect(mockPush).toHaveBeenCalledWith("/next-screen");
    });

    test("Test 7: When onComplete is provided, onComplete is called and does not navigate.", () => {
        const onComplete = jest.fn();
        render(<Screening questions={questions} nextRoute="/next-screen" onComplete={onComplete} />);

        fireEvent.press(screen.getByTestId("answer-fallen-Yes"));
        fireEvent.press(screen.getByTestId("answer-cane-No"));
        fireEvent.press(screen.getByTestId("nextButton"));

        expect(onComplete).toHaveBeenCalledTimes(1);
        expect(mockPush).not.toHaveBeenCalled();
    });
});

describe("Screening: Why it matters modal.", () => {
    test("Test 8: Opens modal when 'Why it matters' is pressed and closes when Got it is pressed", () => {
        render(<Screening questions={questions} />);

        // Open modal
        fireEvent.press(screen.getByTestId("why-fallen"));
        expect(screen.getByText("People who have fallen once are likely to fall again.")).toBeTruthy();

        // Close modal
        fireEvent.press(screen.getByText("Got it"));
        expect(screen.queryByText("People who have fallen once are likely to fall again.")).toBeNull();
    });

    test("Test 9: Modal closes when backdrop is pressed", () => {
        render(<Screening questions={questions} />);
        
        // Open modal
        fireEvent.press(screen.getByTestId("why-fallen"));
        expect(screen.queryByText("People who have fallen once are likely to fall again.")).not.toBeNull();
        
        // Close modal by pressing backdrop
        fireEvent.press(screen.getByTestId("whyModalBackdrop"));
        expect(screen.queryByText("People who have fallen once are likely to fall again.")).toBeNull();
    });
});