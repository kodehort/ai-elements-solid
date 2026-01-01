import { render, screen } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from "./message";

describe("Message", () => {
  it("renders children", () => {
    render(() => <Message from="user">Message content</Message>);
    expect(screen.getByText("Message content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(() => (
      <Message class="custom" from="user">
        Test
      </Message>
    ));
    expect(container.firstChild).toHaveClass("custom");
  });

  it("applies user styles when from is user", () => {
    const { container } = render(() => (
      <Message from="user">User message</Message>
    ));
    expect(container.firstChild).toHaveClass("is-user");
  });

  it("applies assistant styles when from is assistant", () => {
    const { container } = render(() => (
      <Message from="assistant">Assistant message</Message>
    ));
    expect(container.firstChild).toHaveClass("is-assistant");
  });
});

describe("MessageContent", () => {
  it("renders content", () => {
    render(() => (
      <Message from="assistant">
        <MessageContent>Content</MessageContent>
      </Message>
    ));
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(() => (
      <Message from="assistant">
        <MessageContent class="custom">Content</MessageContent>
      </Message>
    ));
    expect(container.querySelector(".custom")).toBeInTheDocument();
  });
});

describe("MessageResponse", () => {
  it("renders response text", () => {
    render(() => (
      <Message from="assistant">
        <MessageContent>
          <MessageResponse>Response text</MessageResponse>
        </MessageContent>
      </Message>
    ));
    expect(screen.getByText("Response text")).toBeInTheDocument();
  });

  it("applies prose styling", () => {
    const { container } = render(() => (
      <Message from="assistant">
        <MessageContent>
          <MessageResponse>Response</MessageResponse>
        </MessageContent>
      </Message>
    ));
    expect(container.querySelector(".prose")).toBeInTheDocument();
  });
});

describe("MessageActions", () => {
  it("renders actions", () => {
    render(() => (
      <Message from="assistant">
        <MessageContent>
          <MessageActions>Actions</MessageActions>
        </MessageContent>
      </Message>
    ));
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });
});

describe("MessageAction", () => {
  it("renders action button", () => {
    render(() => (
      <Message from="assistant">
        <MessageContent>
          <MessageActions>
            <MessageAction label="Copy">Copy</MessageAction>
          </MessageActions>
        </MessageContent>
      </Message>
    ));
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("has sr-only label text", () => {
    render(() => (
      <Message from="assistant">
        <MessageContent>
          <MessageActions>
            <MessageAction label="Copy">Icon</MessageAction>
          </MessageActions>
        </MessageContent>
      </Message>
    ));
    expect(screen.getByText("Copy")).toHaveClass("sr-only");
  });

  it("calls onClick handler", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(() => (
      <Message from="assistant">
        <MessageContent>
          <MessageActions>
            <MessageAction label="Copy" onClick={handleClick}>
              Copy
            </MessageAction>
          </MessageActions>
        </MessageContent>
      </Message>
    ));

    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalled();
  });
});

describe("Message integration", () => {
  it("renders complete user message", () => {
    render(() => (
      <Message from="user">
        <MessageContent>Hello world</MessageContent>
      </Message>
    ));

    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("renders complete assistant message", () => {
    render(() => (
      <Message from="assistant">
        <MessageContent>
          <MessageResponse>AI response</MessageResponse>
          <MessageActions>
            <MessageAction label="Copy">Copy</MessageAction>
          </MessageActions>
        </MessageContent>
      </Message>
    ));

    expect(screen.getByText("AI response")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
