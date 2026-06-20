import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskForm } from "@/components/TaskForm";

describe("TaskForm", () => {
  it("shows a required error when submitted empty", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    render(<TaskForm onSubmit={onSubmit} onCancel={jest.fn()} />);

    await user.click(screen.getByRole("button", { name: /add task/i }));

    expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows a min-length error for titles under 3 characters", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    render(<TaskForm onSubmit={onSubmit} onCancel={jest.fn()} />);

    await user.type(screen.getByLabelText(/task title/i), "ab");
    await user.click(screen.getByRole("button", { name: /add task/i }));

    expect(await screen.findByText(/at least 3 characters/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("calls onSubmit with the trimmed title when valid", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    render(<TaskForm onSubmit={onSubmit} onCancel={jest.fn()} />);

    await user.type(screen.getByLabelText(/task title/i), "  Buy groceries  ");
    await user.click(screen.getByRole("button", { name: /add task/i }));

    expect(onSubmit).toHaveBeenCalledWith("Buy groceries", "medium", "work", 1);
  });
});
