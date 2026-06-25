import { render, screen, within } from "@testing-library/react-native";
import { RepositoryListContainer } from "../components/RepositoryList";

describe("RepositoryList", () => {
  describe("RepositoryListContainer", () => {
    it("renders repository information correctly", async () => {
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
              stargazersCount: 21856,
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
              stargazersCount: 1760,
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

      // Render our presentation layer container
      await render(<RepositoryListContainer repositories={repositories} />);

      // Capture our tagged items
      const repositoryItems = screen.getAllByTestId("repositoryItem");
      const [firstItem, secondItem] = repositoryItems;

      // --- ASSERTIONS FOR FIRST ITEM (Formik) ---
      expect(within(firstItem).getByText("jaredpalmer/formik")).toBeDefined();
      expect(
        within(firstItem).getByText("Build forms in React, without the tears"),
      ).toBeDefined();
      expect(within(firstItem).getByText("TypeScript")).toBeDefined();

      // Check stats (matching the k-rounding formatting if your component uses it)
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
