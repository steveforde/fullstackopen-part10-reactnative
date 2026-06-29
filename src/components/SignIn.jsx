import { TextInput, Pressable, View, StyleSheet } from "react-native";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-native";
import Text from "./Text";
import theme from "../theme";
import useSignIn from "../hooks/useSignIn";

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
  },
  inputError: {
    borderColor: "#d73a4a", // Red border color rule applied when a validation constraint fails
  },
  errorText: {
    color: "#d73a4a",
    marginTop: 5,
    marginBottom: 15,
  },
  inputMarginNormal: {
    marginBottom: 15, // Normal spacing used only when no error string is occupying layout estate
  },
  button: {
    backgroundColor: "#2196f3",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    marginTop: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: theme.fontWeights.bold,
  },
});

/**
 * FORM VALIDATION SCHEMA (YUP)
 * WHY IT EXISTS: Separates verification rules from layout components. Yup checks constraints
 * declaratively before Formik triggers the actual onSubmit handler payload.
 */
const validationSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

// Sets baseline component field structure initialization variables for Formik engine tracker loops
const initialValues = {
  username: "",
  password: "",
};

/**
 * 1. PURE PRESENTATIONAL FORM CONTAINER (SignInContainer)
 * WHY IT'S EXPORTED: Allows isolated unit testing in Jest (`SignIn.test.jsx`). By passing a spy
 * mock function to `onSubmit`, tests can fill fields and verify that the submit handler fires with
 * correct values, without executing real API calls or triggering real router side effects.
 * * HOW IT WORKS: It links form fields up to Formik state hooks, dynamically injecting red borders
 * if fields have been touched and fail validation schema constraints.
 */
export const SignInContainer = ({ onSubmit }) => {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  // Evaluation flags: Display error message layouts ONLY after the user interacts with (touches) the element field
  const usernameError = formik.touched.username && formik.errors.username;
  const passwordError = formik.touched.password && formik.errors.password;

  return (
    <View style={styles.container}>
      {/* USERNAME FIELD */}
      <TextInput
        style={[
          styles.input,
          usernameError && styles.inputError,
          !usernameError && styles.inputMarginNormal, // Dynamic style array composition evaluation
        ]}
        placeholder="Username"
        value={formik.values.username}
        onChangeText={formik.handleChange("username")} // Formik auto tracks text mutations state updates
        onBlur={formik.handleBlur("username")} // Signals Formik that the user left the input field (sets "touched")
        autoCapitalize="none"
        testID="usernameInput"
      />
      {usernameError && (
        <Text style={styles.errorText}>{formik.errors.username}</Text>
      )}

      {/* PASSWORD FIELD */}
      <TextInput
        style={[
          styles.input,
          passwordError && styles.inputError,
          !passwordError && styles.inputMarginNormal,
        ]}
        placeholder="Password"
        value={formik.values.password}
        onChangeText={formik.handleChange("password")}
        onBlur={formik.handleBlur("password")}
        secureTextEntry // Masking utility obscuring inputs characters fields safely on displays
        autoCapitalize="none"
        testID="passwordInput"
      />
      {passwordError && (
        <Text style={styles.errorText}>{formik.errors.password}</Text>
      )}

      {/* SUBMIT BUTTON */}
      <Pressable
        style={styles.button}
        onPress={formik.handleSubmit} // Tells Formik to validate schema checks first, then execute onSubmit callback payload
        testID="submitButton"
      >
        <Text style={styles.buttonText} fontSize="subheading">
          Sign in
        </Text>
      </Pressable>
    </View>
  );
};

/**
 * 2. SMART COMPONENT WRAPPER (SignIn)
 * WHY IT EXISTS: Connects form UI components cleanly to active global app resources
 * (network mutation hooks, Apollo states, navigation router contexts).
 */
const SignIn = () => {
  const [signIn] = useSignIn(); // Custom application mutation hook firing credentials tokens queries to server
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    const { username, password } = values;
    try {
      // Execute the actual authentication mutation call
      await signIn({ username, password });
      // Redirect safely back to the home dashboard upon authentication confirmation success
      navigate("/");
    } catch (e) {
      console.log("Submission error:", e);
    }
  };

  return <SignInContainer onSubmit={onSubmit} />;
};

export default SignIn;
