import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import Question from "../components/Question";

const testQuestion = {
  id: 1,
  prompt: "lorem testum",
  answers: ["choice 1", "choice 2", "choice 3", "choice 4"],
  correctIndex: 0,
};

const noop = () => {};

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

// const onChange = jest.fn();
test("creates an interval with setTimeout", () => {
  jest.spyOn(global, 'setTimeout');
  render(<Question question={testQuestion} onAnswered={noop} />);
  expect(setTimeout).toHaveBeenCalled();
});

test("decrements the timer by 1 every second", () => {
  render(<Question question={testQuestion} onAnswered={noop} />);
  expect(screen.queryByText(/10 seconds remaining/)).toBeInTheDocument();
  act(() => {
    jest.advanceTimersByTime(1000);
  });
  expect(screen.queryByText(/9 seconds remaining/)).toBeInTheDocument();
  act(() => {
    jest.advanceTimersByTime(1000);
  });
  expect(screen.queryByText(/8 seconds remaining/)).toBeInTheDocument();
  act(() => {
    jest.advanceTimersByTime(1000);
  });
  expect(screen.queryByText(/7 seconds remaining/)).toBeInTheDocument();
});

test("calls onAnswered after 10 seconds", () => {
  jest.useFakeTimers();

  const onAnswered = jest.fn();
  const { unmount } = render(<Question question={question} onAnswered={onAnswered} />);
  jest.advanceTimersByTime(10000);
  expect(onAnswered).toHaveBeenCalledWith(false);

  unmount();
  jest.useRealTimers();
});

test("clears the timeout after unmount", () => {
  jest.useFakeTimers();

  const clearTimeout = jest.fn();
  const { unmount } = render(<Question question={question} onAnswered={jest.fn()} clearTimeout={clearTimeout} />);
  unmount();
  expect(clearTimeout).toHaveBeenCalled();

  jest.useRealTimers();
});

