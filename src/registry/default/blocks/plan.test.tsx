import { render, screen } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Plan,
  PlanContent,
  PlanDescription,
  PlanHeader,
  PlanTitle,
  PlanTrigger,
} from "../src/plan";

describe("Plan", () => {
  it("renders children", () => {
    render(() => <Plan>Plan content</Plan>);
    expect(screen.getByText("Plan content")).toBeInTheDocument();
  });

  it("throws error when PlanTitle used outside Plan provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    expect(() => render(() => <PlanTitle>Title</PlanTitle>)).toThrow(
      "Plan components must be used within Plan"
    );

    spy.mockRestore();
  });

  it("starts closed by default", () => {
    render(() => (
      <Plan>
        <PlanHeader>
          <PlanTrigger />
        </PlanHeader>
        <PlanContent>Hidden content</PlanContent>
      </Plan>
    ));

    expect(screen.queryByText("Hidden content")).not.toBeInTheDocument();
  });

  it("can start open", () => {
    render(() => (
      <Plan defaultOpen>
        <PlanHeader>
          <PlanTrigger />
        </PlanHeader>
        <PlanContent>Visible content</PlanContent>
      </Plan>
    ));

    expect(screen.getByText("Visible content")).toBeVisible();
  });

  it("calls onOpenChange", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();

    render(() => (
      <Plan onOpenChange={onOpenChange}>
        <PlanHeader>
          <PlanTrigger />
        </PlanHeader>
        <PlanContent>Content</PlanContent>
      </Plan>
    ));

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    expect(onOpenChange).toHaveBeenCalled();
  });
});

describe("PlanHeader", () => {
  it("renders header content", () => {
    render(() => (
      <Plan>
        <PlanHeader>Header content</PlanHeader>
      </Plan>
    ));

    expect(screen.getByText("Header content")).toBeInTheDocument();
  });
});

describe("PlanTitle", () => {
  it("renders title text", () => {
    render(() => (
      <Plan>
        <PlanHeader>
          <PlanTitle>Plan Title</PlanTitle>
        </PlanHeader>
      </Plan>
    ));

    expect(screen.getByText("Plan Title")).toBeInTheDocument();
  });

  it("renders with shimmer when streaming", () => {
    const { container } = render(() => (
      <Plan isStreaming>
        <PlanHeader>
          <PlanTitle>Plan Title</PlanTitle>
        </PlanHeader>
      </Plan>
    ));

    // Should have shimmer animation span (uses bg-clip-text for shimmer effect)
    expect(container.querySelector(".bg-clip-text")).toBeInTheDocument();
  });
});

describe("PlanDescription", () => {
  it("renders description text", () => {
    render(() => (
      <Plan>
        <PlanHeader>
          <PlanDescription>Plan description</PlanDescription>
        </PlanHeader>
      </Plan>
    ));

    expect(screen.getByText("Plan description")).toBeInTheDocument();
  });

  it("renders with shimmer when streaming", () => {
    const { container } = render(() => (
      <Plan isStreaming>
        <PlanHeader>
          <PlanDescription>Plan description</PlanDescription>
        </PlanHeader>
      </Plan>
    ));

    // Should have shimmer animation span
    expect(container.querySelector(".bg-clip-text")).toBeInTheDocument();
  });
});

describe("PlanContent", () => {
  it("renders content when open", () => {
    render(() => (
      <Plan defaultOpen>
        <PlanHeader>
          <PlanTrigger />
        </PlanHeader>
        <PlanContent>Plan details</PlanContent>
      </Plan>
    ));

    expect(screen.getByText("Plan details")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(() => (
      <Plan defaultOpen>
        <PlanHeader>
          <PlanTrigger />
        </PlanHeader>
        <PlanContent class="custom">Content</PlanContent>
      </Plan>
    ));

    expect(container.querySelector(".custom")).toBeInTheDocument();
  });
});

describe("PlanTrigger", () => {
  it("renders trigger button", () => {
    render(() => (
      <Plan>
        <PlanHeader>
          <PlanTrigger />
        </PlanHeader>
      </Plan>
    ));

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("has chevron icon", () => {
    const { container } = render(() => (
      <Plan>
        <PlanHeader>
          <PlanTrigger />
        </PlanHeader>
      </Plan>
    ));

    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("toggles content on click", async () => {
    const user = userEvent.setup();

    render(() => (
      <Plan>
        <PlanHeader>
          <PlanTrigger />
        </PlanHeader>
        <PlanContent>Content</PlanContent>
      </Plan>
    ));

    expect(screen.queryByText("Content")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button"));

    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});
