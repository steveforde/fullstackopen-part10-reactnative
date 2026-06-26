import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { SignInContainer } from "../components/SignIn";

describe("SignIn", () => {
  describe("SignInContainer", () => {
    it("calls onSubmit function with correct arguments when a valid form is submitted", async () => {
      const onSubmit = jest.fn();

      // 1. Await the async render function to resolve the queries
      const { getByTestId } = await render(
        <SignInContainer onSubmit={onSubmit} />,
      );

      // 2. Await the modern asynchronous interaction events
      await fireEvent.changeText(getByTestId("usernameInput"), "kalle");
      await fireEvent.changeText(getByTestId("passwordInput"), "password");
      await fireEvent.press(getByTestId("submitButton"));

      // 3. Evaluate the submission expectation inside the asynchronous boundary
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledTimes(1);

        expect(onSubmit.mock.calls[0][0]).toEqual({
          username: "kalle",
          password: "password",
        });
      });
    });
  });
});
