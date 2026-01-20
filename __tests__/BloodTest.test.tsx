import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";

// Mock the video file import
jest.mock("../src/assets/test_vid.mp4", () => "mock-video-file");

let lastPlayer: any;

const mockPlay = jest.fn();
const mockUseVideoPlayer = jest.fn(() => {
    lastPlayer = { loop: true, play: mockPlay };
    return lastPlayer;
});

jest.mock("expo-video", () => ({
    useVideoPlayer: (source: any, onReady: any) => {
        const player = mockUseVideoPlayer();
        onReady?.(player);
        return player;
    },
    VideoView: () => null,
}));

import BloodTest from "../src/components/BloodTest";

// Clear mocks before each test
beforeEach(() => {
    jest.clearAllMocks();
    lastPlayer = undefined;
});
// Restore any mocked implementations after each test
afterEach(() => {
    jest.restoreAllMocks();
});

describe("Blood Test", () => {
    test("Test 1: Renders the instructions text and labels.", () => {
        render(<BloodTest />);

        expect(screen.getByText("Watch the video tutorial on how to use your at-home kit blood pressure reader.")).toBeTruthy();
        expect(screen.getByText("Standing Blood Pressure:")).toBeTruthy();
        expect(screen.getByText("Lying Down Blood Pressure:")).toBeTruthy();
        expect(screen.getByText("Next")).toBeTruthy(); // Not checking button functionality yet

    });

    test("Test 2: Configures the video player and auto-plays.", () => {
        render(<BloodTest />);

        expect(mockUseVideoPlayer).toHaveBeenCalledTimes(1);
        expect(lastPlayer.loop).toBe(false);
        expect(mockPlay).toHaveBeenCalledTimes(1);

    });

    test("Test 3: User can type in the blood pressure inputs.", () => {
        render(<BloodTest />);
        const standingInput = screen.getByTestId("standingInput");
        const lyingInput = screen.getByTestId("lyingInput");


        fireEvent.changeText(standingInput, "120/80");
        expect(standingInput).toHaveDisplayValue("120/80");
        
        fireEvent.changeText(lyingInput, "110/75");
        expect(lyingInput).toHaveDisplayValue("110/75");
    });
});
