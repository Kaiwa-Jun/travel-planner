import React from "react";
import { render, screen } from "@testing-library/react";
import { FadeInSection } from "../fade-in-section";

// Mock hooks and framer-motion
const mockUseInView = jest.fn();
const mockRef = { current: null };
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useRef: () => mockRef,
}));

jest.mock("framer-motion", () => ({
  motion: {
    div: React.forwardRef<HTMLDivElement, any>(
      ({ children, initial, animate, transition, className }, ref) => (
        <div
          ref={ref}
          data-testid="motion-div"
          data-initial={JSON.stringify(initial)}
          data-animate={JSON.stringify(animate)}
          data-transition={JSON.stringify(transition)}
          className={className}
        >
          {children}
        </div>
      )
    ),
  },
  useInView: () => mockUseInView(),
}));

describe("FadeInSection", () => {
  beforeEach(() => {
    mockUseInView.mockReset();
  });

  it("子要素を正しくレンダリングすること", () => {
    mockUseInView.mockReturnValue(true);
    render(
      <FadeInSection>
        <div>Test Content</div>
      </FadeInSection>
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("カスタムclassNameを適用できること", () => {
    mockUseInView.mockReturnValue(true);
    render(
      <FadeInSection className="custom-class">
        <div>Test Content</div>
      </FadeInSection>
    );

    const motionDiv = screen.getByTestId("motion-div");
    expect(motionDiv).toHaveClass("custom-class");
  });

  it("要素が表示されていない時の初期状態が正しいこと", () => {
    mockUseInView.mockReturnValue(false);
    render(
      <FadeInSection>
        <div>Test Content</div>
      </FadeInSection>
    );

    const motionDiv = screen.getByTestId("motion-div");
    const animate = JSON.parse(motionDiv.dataset.animate || "{}");
    expect(animate).toEqual({ opacity: 0, y: 50 });
  });

  it("要素が表示された時のアニメーション状態が正しいこと", () => {
    mockUseInView.mockReturnValue(true);
    render(
      <FadeInSection>
        <div>Test Content</div>
      </FadeInSection>
    );

    const motionDiv = screen.getByTestId("motion-div");
    const animate = JSON.parse(motionDiv.dataset.animate || "{}");
    expect(animate).toEqual({ opacity: 1, y: 0 });
  });

  it("delayプロパティが正しく適用されること", () => {
    mockUseInView.mockReturnValue(true);
    const delay = 0.5;
    render(
      <FadeInSection delay={delay}>
        <div>Test Content</div>
      </FadeInSection>
    );

    const motionDiv = screen.getByTestId("motion-div");
    const transition = JSON.parse(motionDiv.dataset.transition || "{}");
    expect(transition).toEqual({ duration: 0.6, delay: delay });
  });
});
