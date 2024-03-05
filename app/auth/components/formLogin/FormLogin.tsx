"use client";
import { useQuery } from "@tanstack/react-query";
import loginSchema from "@/app/schemas/auth/loginSchema";
import {
  Box,
  Button,
  InputLabel,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect } from "react";
import { Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import { loginService } from "../../services";
import { ILoginProps } from "../../type";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { authLogin } from "@/lib/features/auth/authSlice";

const FormLogin = () => {
  const router = useRouter();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const appLoading = useAppSelector((state) => state.loading.loading);

  const initialValue: ILoginProps = {
    email: "",
    password: "",
  };

  const onLogin = async (
    values: ILoginProps,
    formikHelpers: FormikHelpers<ILoginProps>
  ): Promise<void> => {
    dispatch(
      authLogin({
        email: values.email?.toLowerCase(),
        password: values.password,
      })
    );
  };

  return (
    <Formik
      initialValues={initialValue}
      onSubmit={onLogin}
      validationSchema={loginSchema}
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
            />
          </Box>
          <Box display="grid" gap="30px">
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.background?.alt,
                "&:hover": { color: theme.palette.primary.main },
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: "1rem",
              }}
              disabled={appLoading}
            >
              {appLoading ? (
                <div className="h-full aspect-square animate-spin rounded-full border-2 border-[#fff] border-solid border-l-pMain" />
              ) : null}
              LOGIN
            </Button>
          </Box>
          <Typography
            sx={{
              textDecoration: "underline",
              color: theme.palette.primary.main,
              "&:hover": {
                cursor: "pointer",
                color: theme.palette.primary.dark,
              },
            }}
            onClick={() => {
              router.push("/auth/register");
            }}
          >
            {"Haven't got an account? Sign Up here."}
          </Typography>
        </form>
      )}
    </Formik>
  );
};

export default FormLogin;
