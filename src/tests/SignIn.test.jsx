import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { SignInContainer } from "../components/SignIn";

/**
 * FORMIK AUTHENTICATION FORM TESTING SUITE
 * WHY IT EXISTS: This integration test completes your form validation setup. It ensures that
 * when valid credentials are inputs, Formik coordinates with Yup constraints successfully
 * and bubbles the final dataset up to our onSubmit handler.
 */
describe("SignIn", () => {
  describe("SignInContainer", () => {
    it("calls onSubmit function with correct arguments when a valid form is submitted", async () => {
      // 1. INITIALIZE JEST MOCK SPY
      // This spy tracks the execution state, frequency, and arguments passed during submission.
      const onSubmit = jest.fn();

      // 2. RENDERING THE TARGET FORM CONTAINER
      // We explicitly test SignInContainer (the presentational component) instead of SignIn
      // so we can bypass database API mutation hooks and native app router contexts.
      const { getByTestId } = await render(
        <SignInContainer onSubmit={onSubmit} />,
      );

      // 3. EMULATE FIELD INPUT ACTIONS (via testID)
      // Instead of hunting for changing placeholder strings, we use structural 'testID' keys.
      // This keeps our tests completely resilient against label copy or translation changes!
      await fireEvent.changeText(getByTestId("usernameInput"), "kalle");
      await fireEvent.changeText(getByTestId("passwordInput"), "password");

      // Triggers Formik's internal asynchronous handleSubmit runtime sequence loop
      await fireEvent.press(getByTestId("submitButton"));

      // 4. THE ASYNCHRONOUS WAITING BOUNDARY (waitFor)
      // WHY WE ABSOLUTELY NEED IT HERE: Formik runs validation schema checks asynchronously.
      // If we checked 'expect(onSubmit).toHaveBeenCalled()' immediately on the next line without
      // a pause, the test would fail because Formik would still be processing the input event!
      // * HOW IT WORKS: waitFor loops and re-runs the assertions repeatedly for a split second
      // until the internal promises resolve and the mock spy registers the submission data.
      await waitFor(() => {
        // Assert that the submit trigger executed exactly once total
        expect(onSubmit).toHaveBeenCalledTimes(1);

        // Inspect the call registry ledger matrix array to confirm accuracy
        expect(onSubmit.mock.calls[0][0]).toEqual({
          username: "kalle",
          password: "password",
        });
      });
    });
  });
});
