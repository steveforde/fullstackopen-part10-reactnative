import { render, screen, within } from "@testing-library/react-native";
import { RepositoryListContainer } from "../components/RepositoryList";

/**
 * REPOSITORY LIST LAYOUT INTEGRATION SUITE
 * WHY IT EXISTS: This is a major structural test for Exercise 5.1. It validates that the pure
 * container (`RepositoryListContainer`) loops over a standardized GraphQL mock data fixture and
 * maps fields accurately to individual layout positions without crashing or misaligning statistics rows.
 */
describe("RepositoryList", () => {
  describe("RepositoryListContainer", () => {
    it("renders repository information correctly", async () => {
      // GraphQL Edge-Node Data Structure Mock Mock Fixture
      const repositories = {
        totalCount: 8,
        pageInfo: {
          hasNextPage: true,
          endCursor:
            "WyJhc3luYy1saWJyYXJ5LnJlYWN0LWFzeW5jIiwxNTg4NjU2NzUwMDc2XQ==",
          startCursor: "WyJqYXJlZHBhbG1lci5mb3JtaWsiLDE1ODg2NjAzNTAwNzZd",
        },
        edges: [
          {
            node: {
              id: "jaredpalmer.formik",
              fullName: "jaredpalmer/formik",
              description: "Build forms in React, without the tears",
              language: "TypeScript",
              forksCount: 1619,
              stargazersCount: 21856, // Evaluates to "21.9k" after RepositoryStat processing
              ratingAverage: 88,
              reviewCount: 3,
              ownerAvatarUrl:
                "https://avatars2.githubusercontent.com/u/4060187?v=4",
            },
            cursor: "WyJqYXJlZHBhbG1lci5mb3JtaWsiLDE1ODg2NjAzNTAwNzZd",
          },
          {
            node: {
              id: "async-library.react-async",
              fullName: "async-library/react-async",
              description: "Flexible promise-based React data loader",
              language: "JavaScript",
              forksCount: 69,
              stargazersCount: 1760, // Evaluates to "1.8k" after RepositoryStat processing
              ratingAverage: 72,
              reviewCount: 3,
              ownerAvatarUrl:
                "https://avatars1.githubusercontent.com/u/54310907?v=4",
            },
            cursor:
              "WyJhc3luYy1saWJyYXJ5LnJlYWN0LWFzeW5jIiwxNTg4NjU2NzUwMDc2XQ==",
          },
        ],
      };

      // Create a dummy mock spy to pass as the interaction handler prop
      const mockOnRepositoryPress = jest.fn();

      // Mount container layout directly into virtual memory, avoiding native router dependencies
      await render(
        <RepositoryListContainer
          repositories={repositories}
          onRepositoryPress={mockOnRepositoryPress}
        />,
      );

      // DOMAIN SCOPING PATTERN (screen.getAllByTestId)
      // WHY: FlatList outputs multiple instances of `RepositoryItem`. Querying globally would
      // return multiple identical fields (e.g. both cards contain a "3" review count), causing
      // an ambiguous query collision crash. We capture them into an array sequence instead.
      const repositoryItems = screen.getAllByTestId("repositoryItem");
      const [firstItem, secondItem] = repositoryItems; // Array destructuring into row nodes

      // THE `within(...)` SCOPING ENGINE
      // WHY: By wrapping a parent node in `within()`, we restrict all inner queries exclusively
      // to that single card layout block. This ensures we check text *inside* a specific row item.

      // --- ASSERTIONS FOR FIRST ITEM (Formik) ---
      expect(within(firstItem).getByText("jaredpalmer/formik")).toBeDefined();
      expect(
        within(firstItem).getByText("Build forms in React, without the tears"),
      ).toBeDefined();
      expect(within(firstItem).getByText("TypeScript")).toBeDefined();

      // Verifies numerical utility conversion mappings (.toFixed(1) rounding rules)
      expect(within(firstItem).getByText("21.9k")).toBeDefined();
      expect(within(firstItem).getByText("1.6k")).toBeDefined();
      expect(within(firstItem).getByText("88")).toBeDefined();
      expect(within(firstItem).getByText("3")).toBeDefined();

      // --- ASSERTIONS FOR SECOND ITEM (React Async) ---
      expect(
        within(secondItem).getByText("async-library/react-async"),
      ).toBeDefined();
      expect(
        within(secondItem).getByText(
          "Flexible promise-based React data loader",
        ),
      ).toBeDefined();
      expect(within(secondItem).getByText("JavaScript")).toBeDefined();

      expect(within(secondItem).getByText("1.8k")).toBeDefined();
      expect(within(secondItem).getByText("69")).toBeDefined();
      expect(within(secondItem).getByText("72")).toBeDefined();
      expect(within(secondItem).getByText("3")).toBeDefined();
    });
  });
});
