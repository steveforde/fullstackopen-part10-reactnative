import { Text, View } from "react-native";
import { render } from "@testing-library/react-native";

const Greeting = ({ name }) => {
  return (
    <View>
      <Text>Hello {name}!</Text>
    </View>
  );
};

describe("Greeting", () => {
  // 1. Notice the 'async' keyword added here
  it("renders a greeting message based on the name prop", async () => {
    // 2. Notice the 'await' keyword used here before render
    const result = await render(<Greeting name="Steve" />);

    // 3. Query directly from the result instance
    expect(result.getByText("Hello Steve!")).toBeDefined();
  });
});
