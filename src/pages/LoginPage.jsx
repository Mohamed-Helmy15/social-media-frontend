/* eslint-disable react-hooks/exhaustive-deps */
import { Alert, Box, Button, Stack, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../components/Loading/Loading";
import axios from "axios";
import { useSignIn } from "react-auth-kit";

const LoginPage = () => {
  const signIn = useSignIn();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [state, setState] = useState("success");
  const navigate = useNavigate();
  useEffect(() => {}, [loading, alert]);

  const loginSchema = yup.object().shape({
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required("required"),
  });

  const initialValuesLogin = {
    email: "",
    password: "",
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    setLoading(true);
    axios
      .post(
        "https://helmy-social-media-api.onrender.com/api/v1/users/login",
        values
      )
      .then((res) => {
        signIn({
          token: res.data.token,
          expiresIn: 100000,
          tokenType: "Bearer",
          authState: { userName: "helmy" },
        });

        localStorage.setItem("currentUser", res.data.data.user._id);
        if (!localStorage.getItem("theme")) {
          localStorage.setItem("theme", "light");
        }
        navigate("/home");
        // window.location.reload();
      })

      .catch((err) => {
        setState("error");
        setMessage(err.response.data.message);
        setLoading(false);
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
        }, 5000);
      });
  };

  return !loading ? (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValuesLogin}
      validationSchema={loginSchema}
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
        <div className="form-wrapper ">
          {alert && (
            <Stack sx={{ width: "100%" }} spacing={2}>
              <Alert variant="filled" severity={state}>
                {message}
              </Alert>
            </Stack>
          )}

          <div className="overlay">
            <p>Social Media</p>
            <div className="animate__animated animate__bounceInUp animate__fast animate__delay-1s wrap-form">
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
                  <TextField
                    label="Password"
                    type="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    name="password"
                    error={
                      Boolean(touched.password) && Boolean(errors.password)
                    }
                    helperText={touched.password && errors.password}
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
                    LOGIN
                  </Button>
                </Box>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Link to="/register">Don't have an account?</Link>
                  <Link to="/forgot-password">Forgot the Password?</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </Formik>
  ) : (
    <Loading />
  );
};

export default LoginPage;
