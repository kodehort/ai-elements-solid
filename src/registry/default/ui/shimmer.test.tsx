import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import { Shimmer } from "./shimmer";

describe("Shimmer", () => {
  it("renders text content", () => {
    render(() => <Shimmer>Loading...</Shimmer>);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders as span element", () => {
    const { container } = render(() => <Shimmer>Text</Shimmer>);
    expect(container.querySelector("span")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(() => (
      <Shimmer class="custom-class">Text</Shimmer>
    ));
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("applies default styling classes", () => {
    const { container } = render(() => <Shimmer>Text</Shimmer>);
    expect(container.firstChild).toHaveClass("relative");
    expect(container.firstChild).toHaveClass("inline-block");
    expect(container.firstChild).toHaveClass("text-transparent");
  });

  it("sets dynamic spread based on text length", () => {
    const { container } = render(() => <Shimmer spread={2}>Hello</Shimmer>);
    const element = container.firstChild as HTMLElement;
    // With 5 characters and spread=2, expected spread is 10px
    expect(element.style.getPropertyValue("--spread")).toBe("10px");
  });

  it("respects custom spread", () => {
    const { container } = render(() => <Shimmer spread={5}>Test</Shimmer>);
    const element = container.firstChild as HTMLElement;
    // With 4 characters and spread=5, expected spread is 20px
    expect(element.style.getPropertyValue("--spread")).toBe("20px");
  });

  it("calculates spread for long text", () => {
    const longText = "This is a very long text for shimmer effect";
    const { container } = render(() => (
      <Shimmer spread={3}>{longText}</Shimmer>
    ));
    const element = container.firstChild as HTMLElement;
    // Length is 43 characters, spread=3, so 129px
    expect(element.style.getPropertyValue("--spread")).toBe("129px");
  });

  it("handles empty string", () => {
    const { container } = render(() => <Shimmer>{""}</Shimmer>);
    const element = container.firstChild as HTMLElement;
    expect(element.style.getPropertyValue("--spread")).toBe("0px");
  });

  it("sets background image styles", () => {
    const { container } = render(() => <Shimmer>Text</Shimmer>);
    const element = container.firstChild as HTMLElement;
    expect(element.style.backgroundImage).toContain("linear-gradient");
  });
});
