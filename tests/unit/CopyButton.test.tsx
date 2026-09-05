/**
 * tests/unit/CopyButton.test.tsx
 * Verifies that CopyButton shows "Copied" after click and announces it.
 * Design §5.7 / R9.1
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { CopyButton } from "@/components/ui/CopyButton";

// Mock clipboard API
const mockWriteText = vi.fn().mockResolvedValue(undefined);
Object.defineProperty(navigator, "clipboard", {
  value: { writeText: mockWriteText },
  writable: true,
});

describe("CopyButton", () => {
  beforeEach(() => {
    mockWriteText.mockClear();
  });

  it("renders with 'Copy email' label", () => {
    render(<CopyButton text="test@example.com" />);
    expect(screen.getByLabelText("Copy email address")).toBeInTheDocument();
  });

  it("copies text to clipboard on click", async () => {
    render(<CopyButton text="nasirfaisal83@gmail.com" />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button"));
    });
    expect(mockWriteText).toHaveBeenCalledWith("nasirfaisal83@gmail.com");
  });

  it('shows "Copied" after click', async () => {
    render(<CopyButton text="nasirfaisal83@gmail.com" />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button"));
    });
    await waitFor(() =>
      expect(screen.getByRole("button")).toHaveTextContent("Copied")
    );
  });

  it("updates aria-label to confirm copy", async () => {
    render(<CopyButton text="nasirfaisal83@gmail.com" />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button"));
    });
    await waitFor(() =>
      expect(screen.getByLabelText("Email copied to clipboard")).toBeInTheDocument()
    );
  });
});
