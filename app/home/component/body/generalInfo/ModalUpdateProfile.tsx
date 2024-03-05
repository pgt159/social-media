"use client";
import { updateUser } from "@/app/home/store/service";
import { IUser } from "@/app/profile/type";
import updateSchema from "@/app/schemas/user/updateSchema";
import { authUpdateUser } from "@/lib/features/auth/authSlice";
import { useAppDispatch } from "@/lib/hooks";
import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { Formik, FormikHelpers, useFormikContext } from "formik";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "1rem",
  pt: 2,
  px: 4,
  pb: 3,
};

interface IUpdate {
  location?: string;
  occupation?: string;
  linkFb?: string;
  linkLinkedin?: string;
}

const ModalUpdateProfile = ({
  open,
  setOpen,
  user,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: IUser;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const onSubmit = async (
    values: IUpdate,
    formikHelpers: FormikHelpers<IUpdate>
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const result = await updateUser(values);
      if (result.status === 200) {
        dispatch(authUpdateUser(result.data.data));
        formikHelpers.resetForm({});
        toast.success("Update profile successfully", {
          toastId: "update_profile",
        });
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const { location, occupation, linkFb, linkLinkedin } = user || {};
  return (
    <Modal
      open={open}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <Box
        sx={{ ...style }}
        className="w-[80%] md:w-[500px] flex flex-col justify-center items-center gap-4 relative"
      >
        <IconButton
          sx={{
            position: "absolute",
            right: "1rem",
            top: "1rem",
          }}
          onClick={() => {
            setOpen(false);
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography
          fontSize={20}
          fontWeight={"700"}
          sx={{ marginBottom: "10px" }}
        >
          Update profile
        </Typography>

        <Formik
          initialValues={{
            location,
            occupation,
            linkFb,
            linkLinkedin,
          }}
          onSubmit={onSubmit}
          validationSchema={updateSchema}
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
                className="w-full mb-4"
                required
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
                className="w-full mb-4"
                required
              />
              <TextField
                label="Facebook"
                InputLabelProps={{
                  shrink: true,
                }}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.linkFb}
                name="linkFb"
                error={Boolean(touched.linkFb) && Boolean(errors.linkFb)}
                helperText={touched.linkFb && errors.linkFb}
                className="w-full mb-4"
                placeholder="Link Facebook"
              />
              <TextField
                label="Linkedin"
                InputLabelProps={{
                  shrink: true,
                }}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.linkLinkedin}
                name="linkLinkedin"
                error={
                  Boolean(touched.linkLinkedin) && Boolean(errors.linkLinkedin)
                }
                helperText={touched.linkLinkedin && errors.linkLinkedin}
                className="w-full mb-4"
                placeholder="Link Linkedin"
              />
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  className={`bg-pMain text-[#fff] text-[14px] p-4 rounded-md hover:opacity-80 transition-all ${
                    isLoading ? "opacity-70" : ""
                  } self-end`}
                  disabled={isLoading}
                  type="submit"
                >
                  {isLoading ? (
                    <div className=" h-full aspect-square border-solid border-2 border-[#fff] border-l-[rgba(0,0,0,0)] animate-spin rounded-full" />
                  ) : null}
                  Update
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default ModalUpdateProfile;
