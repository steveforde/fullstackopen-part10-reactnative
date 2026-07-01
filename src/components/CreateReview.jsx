import React, { useState } from "react";
import { StyleSheet, View, Pressable, TextInput } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@apollo/client/react";
// WHY /react: Apollo Client v4 moved all React hooks out of the main
// @apollo/client package into @apollo/client/react - must use this path
import { useNavigate } from "react-router-native";

import { CREATE_REVIEW } from "../graphql/mutations";
import { GET_CURRENT_USER } from "../graphql/queries";
import Text from "./Text";
import theme from "../theme";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 15,
    fontSize: theme.fontSizes.body,
    marginTop: 10,
  },
  // Applied on top of input style when Yup validation fails for that field
  inputError: {
    borderColor: "#d73a4a",
  },
  // Red text shown beneath an invalid field
  errorText: {
    color: "#d73a4a",
    fontSize: theme.fontSizes.body,
    marginTop: 5,
    marginLeft: 5,
  },
  // Banner shown when the GraphQL API rejects the mutation (e.g. already reviewed)
  serverErrorContainer: {
    backgroundColor: "#fde8e8",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#f8b4b4",
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "white",
    fontWeight: theme.fontWeights.bold,
    fontSize: theme.fontSizes.subheading,
  },
});

// Yup validation schema — runs client-side before the mutation fires.
// WHY: Catches obvious errors (empty fields, out-of-range rating) without
// wasting a network round-trip to the GraphQL server.
const validationSchema = Yup.object().shape({
  ownerName: Yup.string().required("Repository owner name is required"),
  repositoryName: Yup.string().required("Repository name is required"),
  rating: Yup.number()
    .required("Rating is required")
    .min(0, "Rating must be between 0 and 100")
    .max(100, "Rating must be between 0 and 100")
    .integer("Rating must be an integer"),
  text: Yup.string().optional(), // Review text is optional per the API schema
});

// Blank starting values for every form field
const initialValues = {
  ownerName: "",
  repositoryName: "",
  rating: "",
  text: "",
};

/**
 * CreateReviewContainer — Pure presentational component (the form UI).
 *
 * WHY SPLIT FROM CreateReview: Separating the form UI from the mutation logic
 * makes this component independently testable. In tests we can pass a mock
 * onSubmit function and assert the form calls it with the right values,
 * without needing a real Apollo Client or GraphQL server running.
 *
 * Props:
 *   onSubmit     — async function called by Formik on valid submission
 *   serverError  — string error message from the API (null when no error)
 */
export const CreateReviewContainer = ({ onSubmit, serverError }) => {
  return (
    // Formik manages form state, validation, and submission lifecycle
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({
        handleChange, // updates field value in Formik state on each keystroke
        handleBlur, // marks field as "touched" when user leaves it (triggers validation display)
        handleSubmit, // runs validation then calls onSubmit if all fields pass
        values, // current form field values
        errors, // validation error messages keyed by field name
        touched, // tracks which fields the user has interacted with
      }) => (
        <View style={styles.container}>
          {/* OWNER NAME FIELD
              touched.X && errors.X pattern: only show red border/error text
              AFTER the user has visited the field, avoiding premature red highlights */}
          <TextInput
            style={[
              styles.input,
              touched.ownerName && errors.ownerName && styles.inputError,
            ]}
            placeholder="Repository owner name"
            placeholderTextColor="#aaa"
            onChangeText={handleChange("ownerName")}
            onBlur={handleBlur("ownerName")}
            value={values.ownerName}
          />
          {touched.ownerName && errors.ownerName && (
            <Text style={styles.errorText}>{errors.ownerName}</Text>
          )}

          {/* REPOSITORY NAME FIELD */}
          <TextInput
            style={[
              styles.input,
              touched.repositoryName &&
                errors.repositoryName &&
                styles.inputError,
            ]}
            placeholder="Repository name"
            placeholderTextColor="#aaa"
            onChangeText={handleChange("repositoryName")}
            onBlur={handleBlur("repositoryName")}
            value={values.repositoryName}
          />
          {touched.repositoryName && errors.repositoryName && (
            <Text style={styles.errorText}>{errors.repositoryName}</Text>
          )}

          {/* RATING FIELD
              keyboardType="numeric" opens the number pad on mobile */}
          <TextInput
            style={[
              styles.input,
              touched.rating && errors.rating && styles.inputError,
            ]}
            placeholder="Rating between 0 and 100"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            onChangeText={handleChange("rating")}
            onBlur={handleBlur("rating")}
            value={values.rating}
          />
          {touched.rating && errors.rating && (
            <Text style={styles.errorText}>{errors.rating}</Text>
          )}

          {/* REVIEW TEXT FIELD
              multiline + numberOfLines allows a larger text entry area */}
          <TextInput
            style={[
              styles.input,
              touched.text && errors.text && styles.inputError,
            ]}
            placeholder="Review"
            placeholderTextColor="#aaa"
            multiline
            numberOfLines={4}
            onChangeText={handleChange("text")}
            onBlur={handleBlur("text")}
            value={values.text}
          />
          {touched.text && errors.text && (
            <Text style={styles.errorText}>{errors.text}</Text>
          )}

          {/* SERVER ERROR BANNER
              Shown when the API rejects the mutation — e.g. REPOSITORY_ALREADY_REVIEWED.
              This is separate from Yup validation errors because it only comes back
              after the network request, not from client-side field checks. */}
          {serverError && (
            <View style={styles.serverErrorContainer}>
              <Text style={{ color: "#d73a4a" }}>{serverError}</Text>
            </View>
          )}

          {/* Submit button — triggers Formik's handleSubmit which runs Yup
              validation first; only calls onSubmit if all fields are valid */}
          <Pressable onPress={handleSubmit} style={styles.button}>
            <Text style={styles.buttonText}>Create a review</Text>
          </Pressable>
        </View>
      )}
    </Formik>
  );
};

/**
 * CreateReview — Container component (handles data fetching and mutation logic).
 *
 * WHY THIS PATTERN: Keeps all Apollo/network logic here, passing only simple
 * props (onSubmit, serverError) down to the presentational CreateReviewContainer.
 * This is the "container/presentational" pattern — common in React for
 * separating concerns and keeping UI components testable in isolation.
 */
const CreateReview = () => {
  // Stores API-level error messages (e.g. "User has already reviewed this repository")
  // null when no error, string when something went wrong server-side
  const [error, setError] = useState(null);

  // useMutation returns [mutate, result] — we only need mutate here
  // refetchQueries: after a successful review creation, automatically re-runs
  // the getCurrentUser query so the "My reviews" tab updates without a manual refresh.
  // The string "getCurrentUser" must exactly match the operation name in queries.js
  const [mutate] = useMutation(CREATE_REVIEW, {
    refetchQueries: ["getCurrentUser"],
  });

  // useNavigate gives us programmatic routing — used to redirect after success
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    const { ownerName, repositoryName, rating, text } = values;
    try {
      // Clear any previous server error before each new attempt
      setError(null);

      const { data } = await mutate({
        variables: {
          review: {
            ownerName,
            repositoryName,
            rating: Number(rating), // Yup stores rating as string; API expects Int
            text,
          },
        },
      });

      // On success, redirect to the single repository view for the newly reviewed repo
      if (data?.createReview?.repositoryId) {
        navigate(`/repository/${data.createReview.repositoryId}`);
      }
    } catch (e) {
      // Catch GraphQL errors (e.g. REPOSITORY_ALREADY_REVIEWED) and surface
      // them to the user via the serverError banner rather than silently failing
      setError(e.message);
      console.log("Error creating review:", e.message);
    }
  };

  return <CreateReviewContainer onSubmit={onSubmit} serverError={error} />;
};

export default CreateReview;
