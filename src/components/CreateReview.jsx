import React, { useState } from "react";
import { StyleSheet, View, Pressable, TextInput } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@apollo/client/react";
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
  inputError: {
    borderColor: "#d73a4a",
  },
  errorText: {
    color: "#d73a4a",
    fontSize: theme.fontSizes.body,
    marginTop: 5,
    marginLeft: 5,
  },
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

const validationSchema = Yup.object().shape({
  ownerName: Yup.string().required("Repository owner name is required"),
  repositoryName: Yup.string().required("Repository name is required"),
  rating: Yup.number()
    .required("Rating is required")
    .min(0, "Rating must be between 0 and 100")
    .max(100, "Rating must be between 0 and 100")
    .integer("Rating must be an integer"),
  text: Yup.string().optional(),
});

const initialValues = {
  ownerName: "",
  repositoryName: "",
  rating: "",
  text: "",
};

export const CreateReviewContainer = ({ onSubmit, serverError }) => {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <View style={styles.container}>
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

          {/* Visual banner to display API restriction errors */}
          {serverError && (
            <View style={styles.serverErrorContainer}>
              <Text style={{ color: "#d73a4a" }}>{serverError}</Text>
            </View>
          )}

          <Pressable onPress={handleSubmit} style={styles.button}>
            <Text style={styles.buttonText}>Create a review</Text>
          </Pressable>
        </View>
      )}
    </Formik>
  );
};

const CreateReview = () => {
  const [error, setError] = useState(null);
  const [mutate] = useMutation(CREATE_REVIEW, {
    refetchQueries: ["getCurrentUser"],
  });
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    const { ownerName, repositoryName, rating, text } = values;
    try {
      setError(null);
      const { data } = await mutate({
        variables: {
          review: {
            ownerName,
            repositoryName,
            rating: Number(rating),
            text,
          },
        },
      });

      if (data?.createReview?.repositoryId) {
        navigate(`/repository/${data.createReview.repositoryId}`);
      }
    } catch (e) {
      setError(e.message);
      console.log("Error creating review:", e.message);
    }
  };

  return <CreateReviewContainer onSubmit={onSubmit} serverError={error} />;
};

export default CreateReview;
