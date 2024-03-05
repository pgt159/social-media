"use client";

import { authLogout } from "@/lib/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { FormControl, InputBase, MenuItem, Select } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

const DesktopHeaderDropdown = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const fullName = `${auth.user?.firstName || "Loading..."} ${
    auth.user?.lastName || ""
  }`;
  const router = useRouter();

  const handleLogout = () => {
    dispatch(authLogout({}));
    router.push("/auth");
  };

  return (
    <FormControl>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={fullName}
        className="bg-nLight"
        sx={{
          flex: 1,
          width: "150px",
          borderRadius: "0.25rem",
          textAlign: "left",
          padding: "0.25rem 1rem",
          border: "none",

          "& .MuiSelect-select": {
            padding: "4px 0 5px",
          },
        }}
        input={<InputBase />}
      >
        <MenuItem value={fullName || ""} disabled>
          {fullName || ""}
        </MenuItem>
        <MenuItem onClick={handleLogout}>Log out</MenuItem>
      </Select>
    </FormControl>
  );
};

export default DesktopHeaderDropdown;
