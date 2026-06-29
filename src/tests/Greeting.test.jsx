import { Text, View } from "react-native";
import { render } from "@testing-library/react-native";

/**
 * ULTRA-SIMPLE PRESENTATIONAL COMPONENT (Greeting)
 * WHY IT EXISTS HERE: Used as a beginner-level baseline to practice element querying
 * before adding dynamic state mutations, input fields, or external event hooks.
 */
const Greeting = ({ name }) => {
  return (
    <View>
      <Text>Hello {name}!</Text>
    </View>
  );
};

/**
 * COMPONENT RENDERING TEST SUITE
 * WHY IT EXISTS: To verify that properties passed into a layout component successfully
 * bind to UI nodes and display correctly on a device interface screen.
 */
describe("Greeting", () => {
  // 1. ASYNC TEST DECLARATION
  // WHY: React Native Testing Library (RNTL) v12+ handles component tree builds asynchronously.
  // Adding the `async` keyword to our test block wrapper allows us to safely resolve rendering.
  it("renders a greeting message based on the name prop", async () => {
    // 2. ASYNCHRONOUS COMPONENT RENDERING
    // WHY `await render(...)`: Instructs Jest to wait until the virtual component layout tree
    // is completely compiled, built, and mounted inside the virtual memory test window.
    const result = await render(<Greeting name="Steve" />);

    // 3. UI ELEMENT QUERY & ASSERTION
    // * `result.getByText(...)`: Searches through the virtual text nodes looking for an exact string match.
    // * If it finds the node, it returns the component reference; if it doesn't, it instantly crashes the test with a log.
    // * `.toBeDefined()`: Validates that the returned component reference is a valid, real node object.
    expect(result.getByText("Hello Steve!")).toBeDefined();
  });
});
