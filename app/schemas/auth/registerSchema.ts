// @ts-nocheck
import * as yup from "yup";
const registerSchema = yup.object().shape({
  email: yup.string().required("Email is required").email("Email is invalid"),
  firstName: yup
    .string()
    .required("First name is required")
    .max(50, "First name is longer than 50 letters"),
  lastName: yup
    .string()
    .required("Last name is required")
    .max(50, "Last name longer than 50 letters"),
  location: yup.string(),
  occupation: yup.string(),
  password: yup
    .string()
    .required("Password is required")
    .min(4, "Password must be longer than 4 digits")
    .max(50, "Password must be shorter than 50 digits"),
  confirmPassword: yup
    .string()
    .required("Password confirm is required")
    .min(4, "Password confirm must be longer than 4 digits")
    .max(50, "Password confirm must be shorter than 50 digits")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

export default registerSchema;
