import { useState } from "react";
import { Text, TextInput, Pressable, View } from "react-native";
import { render, fireEvent, screen } from "@testing-library/react-native";

/**
 * SIMPLIFIED INLINE TEST COMPONENT (Form)
 * WHY IT EXISTS HERE: The course includes this inline component directly inside the test file
 * to demonstrate basic state-driven user interaction mechanics before moving onto heavier
 * full-scale layout form engines like Formik.
 */
const Form = ({ onSubmit }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    onSubmit({ username, password });
  };

  return (
    <View>
      <TextInput
        value={username}
        onChangeText={(text) => setUsername(text)}
        placeholder="Username"
      />
      <TextInput
        value={password}
        onChangeText={(text) => setPassword(text)}
        placeholder="Password"
      />
      <Pressable onPress={handleSubmit}>
        <Text>Submit</Text>
      </Pressable>
    </View>
  );
};

/**
 * FORM USER INTERACTION TEST SUITE
 * WHY IT EXISTS: To verify that when a user interacts with the UI inputs and clicks submit,
 * the component responds by collecting the text states and firing the correct parent callback prop.
 */
describe("Form", () => {
  it("calls function provided by onSubmit prop after pressing the submit button", async () => {
    // 1. CREATE JEST MOCK FUNCTION (SPY)
    // WHY: We need a dummy tracker callback function to pass down into the component.
    // This allows us to inspect later if it was called, how many times, and with what parameters.
    const onSubmit = jest.fn();

    // 2. RENDER COMPONENT INTO MEMORY
    // Renders our virtual layout node tree so RNTL can query against it.
    await render(<Form onSubmit={onSubmit} />);

    // 3. SIMULATE TEXT ENTRY INTERACTIONS
    // fireEvent.changeText locates the component by its placeholder text string, injects
    // a fake user input value, and forces the internal useState hooks to commit state updates.
    await fireEvent.changeText(
      screen.getByPlaceholderText("Username"),
      "kalle",
    );
    await fireEvent.changeText(
      screen.getByPlaceholderText("Password"),
      "password",
    );

    // 4. SIMULATE INTERACTIVE SUBMIT ACTION
    // Fires a mock press event sequence right on top of our interactive button node text string element.
    await fireEvent.press(screen.getByText("Submit"));

    // 5. QUANTITATIVE VERIFICATION ASSERTION
    // Checks that the callback handler fired exactly once total throughout the interaction loop lifecycle.
    expect(onSubmit).toHaveBeenCalledTimes(1);

    // 6. QUALITATIVE DATA DEEP INSPECTION
    // WHY `.mock.calls[0][0]`: This is Jest's array ledger tracker syntax for tracking argument data.
    // - `.calls[0]` extracts details for the very FIRST time this function was executed.
    // - `[0]` pulls out the very FIRST individual argument passed into that function call.
    // We expect this argument payload to match our collected username/password object variables exactly.
    expect(onSubmit.mock.calls[0][0]).toEqual({
      username: "kalle",
      password: "password",
    });
  });
});
