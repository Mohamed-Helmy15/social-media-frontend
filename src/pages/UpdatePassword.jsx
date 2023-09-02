import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import React, { useState } from "react";
import NavBar from "../components/NavBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const UpdatePassword = () => {
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    marginBottom: "10px",
    color: theme.palette.text.secondary,
  }));
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [alert, setAlert] = useState(false);
  const [state, setState] = useState("success");
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const updatePasswordSchema = yup.object().shape({
    oldPassword: yup.string().required("required"),
    newPassword: yup.string().required("required"),
    confirmNewPassword: yup.string().required("required"),
  });

  const initialValuesRegister = {
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    handleOpen();

    axios
      .post(`/api/v1/users/update-password`, values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        handleClose();
        setMessage("Password has been edited successfully");
        setAlert(true);
        setState("success");
        setTimeout(() => {
          navigate("/profile/me");

          setAlert(false);
        }, 1500);
      })
      .catch((err) => {
        handleClose();
        setMessage(err.response.data.message);
        setAlert(true);
        setState("error");
        setTimeout(() => {
          setAlert(false);
        }, 5000);
      });
  };
  return (
    <>
      <NavBar />
      <div className="container" style={{ padding: "0px 10px" }}>
        {alert && (
          <Stack sx={{ width: "100%" }} spacing={2}>
            <Alert variant="filled" severity={state}>
              {message}
            </Alert>
          </Stack>
        )}
        <Box sx={{ flexGrow: 1, justifyContent: "center" }}>
          <Grid container spacing={2}>
            <Grid xs={8}>
              <Item>
                <div>
                  <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={initialValuesRegister}
                    validationSchema={updatePasswordSchema}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleBlur,
                      handleChange,
                      handleSubmit,
                      setFieldValue,
                      resetForm,
                    }) => (
                      <form onSubmit={handleSubmit}>
                        <Box
                          display="grid"
                          gap="30px"
                          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                        >
                          <TextField
                            type="password"
                            label="Current Password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.oldPassword}
                            name="oldPassword"
                            error={
                              Boolean(touched.oldPassword) &&
                              Boolean(errors.oldPassword)
                            }
                            helperText={
                              touched.oldPassword && errors.oldPassword
                            }
                            sx={{ gridColumn: "span 4" }}
                          />
                          <TextField
                            type="password"
                            label="New Password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.newPassword}
                            name="newPassword"
                            error={
                              Boolean(touched.newPassword) &&
                              Boolean(errors.newPassword)
                            }
                            helperText={
                              touched.newPassword && errors.newPassword
                            }
                            sx={{ gridColumn: "span 4" }}
                          />
                          <TextField
                            type="password"
                            label="Confirm New Password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.confirmNewPassword}
                            name="confirmNewPassword"
                            error={
                              Boolean(touched.confirmNewPassword) &&
                              Boolean(errors.confirmNewPassword)
                            }
                            helperText={
                              touched.confirmNewPassword &&
                              errors.confirmNewPassword
                            }
                            sx={{ gridColumn: "span 4" }}
                          />
                        </Box>
                        <Box>
                          <Button
                            fullWidth
                            type="submit"
                            sx={{
                              m: "2rem 0",
                              p: "1rem",
                            }}
                          >
                            Submit
                          </Button>
                          <Button
                            fullWidth
                            onClick={() => navigate("/profile/me")}
                            sx={{
                              m: "2rem 0",
                              p: "1rem",
                            }}
                          >
                            Cancel
                          </Button>
                        </Box>
                      </form>
                    )}
                  </Formik>
                </div>
              </Item>
            </Grid>
          </Grid>
        </Box>
      </div>
      <Backdrop sx={{ color: "#fff", zIndex: "7000" }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default UpdatePassword;
