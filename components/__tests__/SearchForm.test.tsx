import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import useSWR from "swr";

import SearchForm from "../SearchForm";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("react-hook-form");

jest.mock("swr", () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    data: {
      data: [
        {
          id: 1,
          value: "category1",
          label: "category1",
        },
        {
          id: 2,
          value: "category2",
          label: "category2",
        },
      ],
    },
  }),
}));

describe("SearchForm", () => {
  const mockRouterPush = jest.fn();
  const mockUseForm = useForm as jest.Mock;
  const mockController = Controller as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRouterPush.mockClear();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    });
    mockUseForm.mockReturnValue({
      register: jest.fn(),
      control: jest.fn(),
      handleSubmit: jest.fn((callback) => () => {
        callback({ category: "category1", q: "item1" });
      }),
      setError: jest.fn(),
      setValue: jest.fn(),
      getValues: jest.fn().mockImplementation((name) => {
        if (name === "category") {
          return "category1";
        }
        return "item1";
      }),
    });

    mockController.mockImplementation(({ render }) =>
      render({
        field: { onChange: jest.fn(), onBlur: jest.fn(), value: "", name: "category" },
      }),
    );

    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
      query: {},
    });
  });

  it("renders the search form correctly", () => {
    render(<SearchForm />);
    const searchFormElement = screen.getByTestId("testid.form.searchForm");
    expect(searchFormElement).toBeInTheDocument();
  });

  it("updates the category and item values when the router query changes", () => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
      query: {
        category: "category1",
        q: "item1",
      },
    });
    render(<SearchForm />);
    expect(mockUseForm().setValue).toHaveBeenCalledWith("category", "category1", { shouldValidate: true });
    expect(mockUseForm().setValue).toHaveBeenCalledWith("item", "item1", { shouldValidate: true });
  });

  it("sets an error if both category and item are empty on form submission", () => {
    mockUseForm.mockReturnValue({
      register: jest.fn(),
      control: jest.fn(),
      handleSubmit: jest.fn((callback) => () => {
        callback({ category: "category1", q: "item1" });
      }),
      setError: jest.fn(),
      setValue: jest.fn(),
      getValues: jest.fn().mockImplementation((name) => {
        if (name === "category") {
          return "category1";
        }
        return "";
      }),
    });

    render(<SearchForm />);
    const submitButton = screen.getByTestId("testid.form.button.search");
    fireEvent.submit(submitButton);
    expect(mockUseForm().setError).toHaveBeenCalledWith("item", {
      type: "manual",
      message: "form.fieldRequired",
    });
    expect(mockRouterPush).not.toHaveBeenCalled();
  });

  it("navigates to the correct URL on form submission", () => {
    (useSWR as jest.Mock).mockReturnValue({
      data: {
        data: [
          { id: 1, value: "category1", label: "category1" },
          { id: 2, value: "category2", label: "category2" },
        ],
      },
    });

    render(<SearchForm />);
    const inputSearch = screen.getByTestId("testid.form.inputField.item");
    expect(inputSearch).toBeInTheDocument();
    userEvent.type(inputSearch, "item1");

    const selectSearch = screen.getByRole("combobox");
    expect(selectSearch).toBeInTheDocument();
    fireEvent.mouseDown(selectSearch);
    const option = screen.getByRole("option", { name: /category1/i });
    expect(option).toBeInTheDocument();
    userEvent.click(option);

    const submitButton = screen.getByTestId("testid.form.button.search");
    fireEvent.submit(submitButton);
    expect(mockUseForm().getValues).toHaveBeenCalledWith("item");
    expect(mockUseForm().getValues).toHaveBeenCalledWith("category");

    expect(mockRouterPush).toHaveBeenCalledWith("/reviews/category1?q=item1");
  });
});
