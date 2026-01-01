import { render, screen } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { createSignal } from "solid-js";
import { describe, expect, it, vi } from "vitest";
import { Reasoning, ReasoningContent, ReasoningTrigger } from "./reasoning";

describe("Reasoning", () => {
  it("renders children", () => {
    render(() => <Reasoning>Content</Reasoning>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("throws error when components used outside Reasoning provider", () => {
    // Suppress console.error for this test
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    expect(() => render(() => <ReasoningTrigger />)).toThrow(
      "Reasoning components must be used within Reasoning"
    );

    spy.mockRestore();
  });

  it("starts open by default", () => {
    render(() => (
      <Reasoning>
        <ReasoningTrigger />
        <ReasoningContent>Reasoning content</ReasoningContent>
      </Reasoning>
    ));
    expect(screen.getByText("Reasoning content")).toBeVisible();
  });

  it("can start closed", () => {
    render(() => (
      <Reasoning defaultOpen={false}>
        <ReasoningTrigger />
        <ReasoningContent>Hidden content</ReasoningContent>
      </Reasoning>
    ));
    expect(screen.queryByText("Hidden content")).not.toBeInTheDocument();
  });

  it("calls onOpenChange", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();

    render(() => (
      <Reasoning defaultOpen={false} onOpenChange={onOpenChange}>
        <ReasoningTrigger />
        <ReasoningContent>Content</ReasoningContent>
      </Reasoning>
    ));

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    expect(onOpenChange).toHaveBeenCalled();
  });

  it("auto-closes after delay when streaming stops", async () => {
    // This tests the auto-close behavior when streaming transitions from true to false.
    // In SolidJS, we need to use controlled state to test this properly.
    vi.useFakeTimers();
    const onOpenChange = vi.fn();
    let setStreaming!: (v: boolean) => void;

    function TestWrapper() {
      const [isStreaming, setIsStreaming] = createSignal(true);
      setStreaming = setIsStreaming;
      return (
        <Reasoning
          defaultOpen
          isStreaming={isStreaming()}
          onOpenChange={onOpenChange}
        >
          <ReasoningTrigger />
          <ReasoningContent>Reasoning content</ReasoningContent>
        </Reasoning>
      );
    }

    render(() => <TestWrapper />);

    // Initially open
    expect(screen.getByText("Reasoning content")).toBeVisible();
    expect(onOpenChange).not.toHaveBeenCalled();

    // Stop streaming - this should trigger the auto-close timer
    setStreaming(false);

    // Should still be open immediately after stopping streaming
    expect(screen.getByText("Reasoning content")).toBeVisible();

    // Advance time past AUTO_CLOSE_DELAY (1000ms)
    await vi.advanceTimersByTimeAsync(1100);

    // The onOpenChange callback should have been called with false
    expect(onOpenChange).toHaveBeenCalledWith(false);

    vi.useRealTimers();
  });
});

describe("ReasoningTrigger", () => {
  it("renders default thinking message when streaming", () => {
    render(() => (
      <Reasoning isStreaming>
        <ReasoningTrigger />
      </Reasoning>
    ));
    expect(screen.getByText("Thinking...")).toBeInTheDocument();
  });

  it("renders duration message when not streaming", () => {
    render(() => (
      <Reasoning duration={5} isStreaming={false}>
        <ReasoningTrigger />
      </Reasoning>
    ));
    expect(screen.getByText("Thought for 5 seconds")).toBeInTheDocument();
  });

  it("renders thinking message when duration is 0", () => {
    render(() => (
      <Reasoning duration={0} isStreaming={false}>
        <ReasoningTrigger />
      </Reasoning>
    ));
    expect(screen.getByText("Thinking...")).toBeInTheDocument();
  });

  it("renders generic message when duration is undefined", () => {
    render(() => (
      <Reasoning isStreaming={false}>
        <ReasoningTrigger />
      </Reasoning>
    ));
    expect(screen.getByText("Thought for a few seconds")).toBeInTheDocument();
  });

  it("renders custom children", () => {
    render(() => (
      <Reasoning>
        <ReasoningTrigger>Custom trigger</ReasoningTrigger>
      </Reasoning>
    ));
    expect(screen.getByText("Custom trigger")).toBeInTheDocument();
  });

  it("has brain icon", () => {
    const { container } = render(() => (
      <Reasoning>
        <ReasoningTrigger />
      </Reasoning>
    ));
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});

describe("ReasoningContent", () => {
  it("renders reasoning text", () => {
    render(() => (
      <Reasoning>
        <ReasoningContent>The reasoning process</ReasoningContent>
      </Reasoning>
    ));
    expect(screen.getByText("The reasoning process")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(() => (
      <Reasoning>
        <ReasoningContent class="custom">Content</ReasoningContent>
      </Reasoning>
    ));
    expect(container.querySelector(".custom")).toBeInTheDocument();
  });
});
