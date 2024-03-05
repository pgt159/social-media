import React from "react";
import "./auth.scss";

import { Typography } from "@mui/material";
import FormLogin from "./components/formLogin/FormLogin";

const LoginPage = () => {
  return (
    <div className="my-[2rem] mx-auto md:w-[50%] w-[90%] rounded-xl bg-[#fff] p-[2rem] box-border">
      <Typography fontWeight={"500"} sx={{ mb: "1.5rem" }} fontSize={"16px"}>
        Welcome to Socipedia, the Social Media for Sociopaths!
      </Typography>
      <FormLogin />
    </div>
  );
};

export default LoginPage;
