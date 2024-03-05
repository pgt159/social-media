// @ts-nocheck
import * as yup from "yup";
const updateSchema = yup.object().shape({
  location: yup.string().required("Please enter location"),
  occupation: yup.string().required("Please enter occupation"),
  linkFb: yup.string(),
  linkLinkedin: yup.string(),
});

export default updateSchema;
