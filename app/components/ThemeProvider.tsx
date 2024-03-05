// @ts-nocheck
"use client";
import { ThemeProvider, createTheme } from "@mui/material";
import { themeSettings } from "../theme";
import React, { useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function MuiThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const mode = "light";
  const theme = useMemo(() => createTheme(themeSettings(mode)), []);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
