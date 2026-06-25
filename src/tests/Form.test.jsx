import { useState } from "react";
import { Text, TextInput, Pressable, View } from "react-native";
import { render, fireEvent, screen } from "@testing-library/react-native";

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

describe("Form", () => {
  it("calls function provided by onSubmit prop after pressing the submit button", async () => {
    const onSubmit = jest.fn();

    await render(<Form onSubmit={onSubmit} />);

    // 1. Await the text changes so React state updates fully commit
    await fireEvent.changeText(
      screen.getByPlaceholderText("Username"),
      "kalle",
    );
    await fireEvent.changeText(
      screen.getByPlaceholderText("Password"),
      "password",
    );

    // 2. Await the button press event
    await fireEvent.press(screen.getByText("Submit"));

    expect(onSubmit).toHaveBeenCalledTimes(1);

    expect(onSubmit.mock.calls[0][0]).toEqual({
      username: "kalle",
      password: "password",
    });
  });
});
