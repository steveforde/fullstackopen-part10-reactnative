import React from "react";
import { StyleSheet, View, Pressable, TextInput } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-native";

import { CREATE_USER } from "../graphql/mutations";
import useSignIn from "../hooks/useSignIn";
import Text from "./Text";
import theme from "../theme";

// ==========================================
// 1. LAYOUT STYLESHEET
// ==========================================
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
    borderColor: "#d73a4a", // Red border applied on top of normal input style if field fails validation
  },
  errorText: {
    color: "#d73a4a",
    fontSize: theme.fontSizes.body,
    marginTop: 5,
    marginLeft: 5,
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

// ==========================================
// 2. VALIDATION SCHEMA (YUP)
// ==========================================
const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required("Username is required")
    .min(5, "Username must be between 5 and 30 characters")
    .max(30, "Username must be between 5 and 30 characters"),
  password: Yup.string()
    .required("Password is required")
    .min(5, "Password must be between 5 and 50 characters")
    .max(50, "Password must be between 5 and 50 characters"),
  passwordConfirm: Yup.string()
    // WHY Yup.ref('password'): References the current value typed into the password input.
    // Enforces strict verification parity; if values do not match exactly, validation halts.
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Password confirmation is required"),
});

const initialValues = {
  username: "",
  password: "",
  passwordConfirm: "",
};

// ==========================================
// 3. PRESENTATIONAL CONTAINER (PURE FORM UI)
// ==========================================
export const SignUpContainer = ({ onSubmit }) => {
  return (
    // Formik encapsulates tracking field keystrokes, touched flags, and standard submission lifecycles
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({
        handleChange, // Function to pipe string entries straight into Formik's state container
        handleBlur, // Marks a field as "touched" upon exit so error text doesn't show prematurely
        handleSubmit, // Checks validation rules first; fires outer onSubmit prop only if clean
        values, // Mirror dictionary holding active state form inputs
        errors, // Dynamic validation error messaging mapping
        touched, // Dictionary tracking which input fields the user has interactive focus history with
      }) => (
        <View style={styles.container}>
          {/* USERNAME INPUT */}
          <TextInput
            style={[
              styles.input,
              touched.username && errors.username && styles.inputError,
            ]}
            placeholder="Username"
            placeholderTextColor="#aaa"
            onChangeText={handleChange("username")}
            onBlur={handleBlur("username")}
            value={values.username}
          />
          {touched.username && errors.username && (
            <Text style={styles.errorText}>{errors.username}</Text>
          )}

          {/* PASSWORD INPUT */}
          <TextInput
            style={[
              styles.input,
              touched.password && errors.password && styles.inputError,
            ]}
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry // Obscures typed credentials into dots for privacy
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            value={values.password}
          />
          {touched.password && errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}

          {/* PASSWORD CONFIRMATION INPUT */}
          <TextInput
            style={[
              styles.input,
              touched.passwordConfirm &&
                errors.passwordConfirm &&
                styles.inputError,
            ]}
            placeholder="Password confirmation"
            placeholderTextColor="#aaa"
            secureTextEntry // Masks confirmation credentials identically
            onChangeText={handleChange("passwordConfirm")}
            onBlur={handleBlur("passwordConfirm")}
            value={values.passwordConfirm}
          />
          {touched.passwordConfirm && errors.passwordConfirm && (
            <Text style={styles.errorText}>{errors.passwordConfirm}</Text>
          )}

          <Pressable onPress={handleSubmit} style={styles.button}>
            <Text style={styles.buttonText}>Sign up</Text>
          </Pressable>
        </View>
      )}
    </Formik>
  );
};

// ==========================================
// 4. SMART LOGIC CONTAINER COMPONENT
// ==========================================
const SignUp = () => {
  // Hook tracks GraphQL registration mutation configuration profile
  const [mutate] = useMutation(CREATE_USER);
  // Custom auth token persistence hook reused from the SignIn logic layout track
  const [signIn] = useSignIn();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    const { username, password } = values;
    try {
      // Step 1: Fire network mutation request to write the new user row to the database
      await mutate({
        variables: {
          user: { username, password },
        },
      });

      // Step 2: On registration success, execute auto-login using the same useSignIn hook logic.
      // This fetches the jwt access token and writes it straight to secure device storage.
      await signIn({ username, password });

      // Step 3: Redirect viewport straight back onto the safe home directory track
      navigate("/");
    } catch (e) {
      // Catches server-side database validation hits (e.g. "Username already taken")
      console.log("Error registering new user:", e);
    }
  };

  return <SignUpContainer onSubmit={onSubmit} />;
};

export default SignUp;
