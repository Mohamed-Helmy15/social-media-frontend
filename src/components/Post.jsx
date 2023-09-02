import {
  Avatar,
  Backdrop,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import React, { useEffect } from "react";
import axios from "axios";
import { configMultiPart } from "../App";
import { renderProfile } from "../store/slices/profileSlice";
import { useDispatch } from "react-redux";
import { renderFriends } from "../store/slices/friendSlice";

const Post = ({ user }) => {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const registerSchema = yup.object().shape({
    description: yup.string().required("required"),
    photo: yup.string(),
  });

  const initialValuesRegister = {
    description: "",
    photo: "",
  };
  const handleFormSubmit = async (values, onSubmitProps) => {
    handleOpen();
    const formData = new FormData();

    formData.append("description", values.description);
    formData.append("photo", values.photo);
    axios
      .post("/api/v1/posts", formData, configMultiPart)
      .then((res) => {
        values.description = "";
        values.photo = "";
        if (window.location.pathname.includes("profile/me")) {
          dispatch(renderProfile());
        } else {
          dispatch(renderFriends());
        }
        handleClose();
      })
      .catch((err) => {
        handleClose();
        return err;
      });
  };
  useEffect(() => {}, []);
  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValuesRegister}
      validationSchema={registerSchema}
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
          <div className="post-container">
            <div className="avatar-post">
              <Avatar
                alt={user.firstName}
                src={
                  user.picturePath !== ""
                    ? `/img/users/${user.picturePath}`
                    : null
                }
              />
              <TextField
                label="What is on your mind..."
                onChange={handleChange}
                value={values.description}
                name="description"
                error={
                  Boolean(touched.description) && Boolean(errors.description)
                }
                helperText={touched.description && errors.description}
              />
            </div>
            <div className="post-image">
              <label
                className="img-post"
                htmlFor="img"
                style={{
                  background:
                    localStorage.getItem("theme") === "light"
                      ? "#eee"
                      : "transparent",
                  border:
                    localStorage.getItem("theme") === "light"
                      ? "1px solid #0755ff"
                      : "1px solid white",
                  color:
                    localStorage.getItem("theme") === "light"
                      ? "#0755ff"
                      : "white",
                }}
              >
                Upload a Photo
              </label>
              <input
                type="file"
                name="img"
                id="img"
                accept="image/*"
                variant="standard"
                label="image"
                onChange={(e) => {
                  values.photo = e.target.files[0];
                }}
              />
            </div>
            <div className="btn-submit">
              <Button type="submit">publish</Button>
            </div>
          </div>
          <Backdrop sx={{ color: "#fff", zIndex: "7000" }} open={open}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </form>
      )}
    </Formik>
  );
};

export default React.memo(Post);
