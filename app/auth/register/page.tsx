"use client";

import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import React from "react";
import "../auth.scss";
import { Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import registerSchema from "@/app/schemas/auth/registerSchema";
import { registerService } from "../services";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { authRegister } from "@/lib/features/auth/authSlice";
import { IRegisterProps } from "../type";

const RegisterPage = () => {
  const initialValue = {
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    location: "",
    occupation: "",
  };
  const appLoading = useAppSelector((state) => state.loading.loading);

  const dispatch = useAppDispatch();

  const onSubmit = async (
    values: IRegisterProps,
    formikHelpers: FormikHelpers<IRegisterProps>
  ): Promise<void> => {
    // const res = registerService(values);
    dispatch(authRegister(values));
    formikHelpers.resetForm({});
  };
  const router = useRouter();
  const { palette } = useTheme();

  return (
    <div className="my-[2rem] mx-auto rounded-xl bg-[#fff] p-[2rem] w-[90%] md:w-[50%] box-border">
      <Formik
        initialValues={initialValue}
        onSubmit={onSubmit}
        validationSchema={registerSchema}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: true ? undefined : "span 4" },
              }}
            >
              <TextField
                label="First name"
                InputLabelProps={{
                  shrink: true,
                }}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                name="firstName"
                error={Boolean(touched.firstName) && Boolean(errors.firstName)}
                helperText={touched.firstName && errors.firstName}
                sx={{
                  gridColumn: "span 2",
                  height: "auto",
                }}
                required
              />
              <TextField
                label="Last name"
                InputLabelProps={{
                  shrink: true,
                }}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                name="lastName"
                error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                helperText={touched.lastName && errors.lastName}
                sx={{
                  gridColumn: "span 2",
                  height: "auto",
                  "& input": { padding: "16px 14px" },
                }}
                required
              />
              <TextField
                label="Address"
                InputLabelProps={{
                  shrink: true,
                }}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.location}
                name="location"
                error={Boolean(touched.location) && Boolean(errors.location)}
                helperText={touched.location && errors.location}
                sx={{
                  gridColumn: "span 4",
                  height: "auto",
                  "& input": { padding: "16px 14px" },
                }}
              />
              <TextField
                label="Occupation"
                InputLabelProps={{
                  shrink: true,
                }}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.occupation}
                name="occupation"
                error={
                  Boolean(touched.occupation) && Boolean(errors.occupation)
                }
                helperText={touched.occupation && errors.occupation}
                sx={{
                  gridColumn: "span 4",
                  height: "auto",
                  "& input": { padding: "16px 14px" },
                }}
              />
              <TextField
                label="Email"
                InputLabelProps={{
                  shrink: true,
                }}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={Boolean(touched.email) && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                sx={{
                  gridColumn: "span 4",
                  height: "auto",
                  "& input": { padding: "16px 14px" },
                }}
              />
              <TextField
                label="Password"
                variant="outlined"
                type="password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={Boolean(touched.password) && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 4" }}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
              <TextField
                label="Confirm password"
                variant="outlined"
                type="password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.confirmPassword}
                name="confirmPassword"
                error={
                  Boolean(touched.confirmPassword) &&
                  Boolean(errors.confirmPassword)
                }
                helperText={touched.confirmPassword && errors.confirmPassword}
                sx={{ gridColumn: "span 4" }}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Box>
            <Box display="grid" gap="30px">
              <Button
                fullWidth
                type="submit"
                sx={{
                  m: "2rem 0",
                  p: "1rem",
                  backgroundColor: palette.primary.main,
                  color: palette.background.alt,
                  "&:hover": { color: palette.primary.main },
                  display: "flex",
                  flexDirection: "row",
                  gap: "1rem",
                }}
                disabled={appLoading}
              >
                {appLoading ? (
                  <div className="h-full aspect-square animate-spin rounded-full border-2 border-[#fff] border-solid border-l-pMain" />
                ) : null}
                SIGN UP
              </Button>
            </Box>
            <Typography
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.dark,
                },
              }}
              onClick={() => {
                router.push("/auth");
              }}
            >
              {"Already have an account? Sign in here."}
            </Typography>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default RegisterPage;
