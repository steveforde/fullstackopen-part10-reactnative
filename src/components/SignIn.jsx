import { TextInput, Pressable, View, StyleSheet } from "react-native";
import { useFormik } from "formik";
import * as yup from "yup";
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
  },
  inputError: {
    borderColor: "#d73a4a", // Soft red color matching GitHub's theme/course style
  },
  errorText: {
    color: "#d73a4a",
    marginTop: 5,
    marginBottom: 15,
  },
  inputMarginNormal: {
    marginBottom: 15,
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

// 1. Define validation schema requirements
const validationSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

const initialValues = {
  username: "",
  password: "",
};

const SignIn = () => {
  const onSubmit = (values) => {
    console.log(values);
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  // Helper flags to check validation conditions cleanly
  const usernameError = formik.touched.username && formik.errors.username;
  const passwordError = formik.touched.password && formik.errors.password;

  return (
    <View style={styles.container}>
      {/* Username Field */}
      <TextInput
        style={[
          styles.input,
          usernameError && styles.inputError,
          !usernameError && styles.inputMarginNormal,
        ]}
        placeholder="Username"
        value={formik.values.username}
        onChangeText={formik.handleChange("username")}
        onBlur={formik.handleBlur("username")}
        autoCapitalize="none"
      />
      {usernameError && (
        <Text style={styles.errorText}>{formik.errors.username}</Text>
      )}

      {/* Password Field */}
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
        secureTextEntry
        autoCapitalize="none"
      />
      {passwordError && (
        <Text style={styles.errorText}>{formik.errors.password}</Text>
      )}

      {/* Submit Button */}
      <Pressable style={styles.button} onPress={formik.handleSubmit}>
        <Text style={styles.buttonText} fontSize="subheading">
          Sign in
        </Text>
      </Pressable>
    </View>
  );
};

export default SignIn;
