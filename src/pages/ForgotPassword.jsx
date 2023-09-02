import { Alert, Box, Button, Stack, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [message, setMessage] = useState("");
  const [alert, setAlert] = useState(false);
  const [state, setState] = useState("success");

  const ForgotPasswordSchema = yup.object().shape({
    email: yup.string().email("invalid email").required("required"),
  });

  const initialValuesForgotPassword = {
    email: "",
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    axios
      .post("/api/v1/users/forgot-password", values)
      .then((res) => {
        setState("success");
        setMessage(`The link was sent, Please check ${values.email}`);
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
        }, 5000);
      })
      .catch((err) => {
        setState("error");
        setMessage(err.response.data.message);
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
        }, 5000);
      });
  };
  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValuesForgotPassword}
      validationSchema={ForgotPasswordSchema}
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
        <div className="form-wrapper">
          {alert && (
            <Stack sx={{ width: "100%" }} spacing={2}>
              <Alert variant="filled" severity={state}>
                {message}
              </Alert>
            </Stack>
          )}
          <div className="overlay">
            <p>Forgot Password</p>
            <div className="animate__animated animate__bounceInUp animate__fast wrap-form">
              <form
                onSubmit={handleSubmit}
                style={{
                  background:
                    localStorage.getItem("theme") === "dark" && "black",
                }}
              >
                <Box
                  display="grid"
                  gap="30px"
                  gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                >
                  <TextField
                    label="Email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    name="email"
                    error={Boolean(touched.email) && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
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
                    Send the Verification Link to the E-mail
                  </Button>
                </Box>
              </form>
            </div>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default ForgotPassword;
