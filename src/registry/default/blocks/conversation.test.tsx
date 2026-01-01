import { render, screen } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { createSignal } from "solid-js";
import { describe, expect, it, vi } from "vitest";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "./conversation";

describe("Conversation", () => {
  it("renders children", () => {
    render(() => (
      <Conversation>
        <ConversationContent>Messages</ConversationContent>
      </Conversation>
    ));
    expect(screen.getByText("Messages")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(() => (
      <Conversation class="custom">
        <div>Content</div>
      </Conversation>
    ));
    expect(container.firstChild).toHaveClass("custom");
  });

  it("has role log", () => {
    const { container } = render(() => (
      <Conversation>
        <div>Content</div>
      </Conversation>
    ));
    expect(container.firstChild).toHaveAttribute("role", "log");
  });
});

describe("ConversationContent", () => {
  it("renders content", () => {
    render(() => (
      <Conversation>
        <ConversationContent>Content</ConversationContent>
      </Conversation>
    ));
    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});

describe("ConversationEmptyState", () => {
  it("renders default empty state", () => {
    render(() => <ConversationEmptyState />);
    expect(screen.getByText("No messages yet")).toBeInTheDocument();
    // Description only shows when explicitly provided
  });

  it("renders custom title and description", () => {
    render(() => (
      <ConversationEmptyState
        description="Custom description"
        title="Custom title"
      />
    ));
    expect(screen.getByText("Custom title")).toBeInTheDocument();
    expect(screen.getByText("Custom description")).toBeInTheDocument();
  });

  it("renders icon", () => {
    render(() => <ConversationEmptyState icon={<span>Icon</span>} />);
    expect(screen.getByText("Icon")).toBeInTheDocument();
  });

  it("renders custom children", () => {
    render(() => (
      <ConversationEmptyState>
        <div>Custom content</div>
      </ConversationEmptyState>
    ));
    expect(screen.getByText("Custom content")).toBeInTheDocument();
  });
});

describe("Conversation scroll behavior", () => {
  it("shows scroll button when not at bottom", () => {
    const [isAtBottom] = createSignal(false);

    render(() => (
      <Conversation isAtBottom={isAtBottom}>
        <ConversationContent>
          <div>Content</div>
        </ConversationContent>
      </Conversation>
    ));

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("hides scroll button when at bottom", () => {
    const [isAtBottom] = createSignal(true);

    render(() => (
      <Conversation isAtBottom={isAtBottom}>
        <ConversationContent>
          <div>Content</div>
        </ConversationContent>
      </Conversation>
    ));

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("calls scrollToBottom when button clicked", async () => {
    const [isAtBottom] = createSignal(false);
    const scrollToBottom = vi.fn();
    const user = userEvent.setup();

    render(() => (
      <Conversation isAtBottom={isAtBottom} scrollToBottom={scrollToBottom}>
        <ConversationContent>
          <div>Content</div>
        </ConversationContent>
      </Conversation>
    ));

    const button = screen.getByRole("button");
    await user.click(button);

    expect(scrollToBottom).toHaveBeenCalled();
  });
});

describe("ConversationScrollButton", () => {
  it("renders scroll button", () => {
    render(() => <ConversationScrollButton />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(() => <ConversationScrollButton class="custom-scroll-btn" />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-scroll-btn");
  });

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(() => <ConversationScrollButton onClick={onClick} />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(onClick).toHaveBeenCalled();
  });
});
