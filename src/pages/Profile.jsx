import React, { useEffect, useState } from "react";
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
import NavBar from "../components/NavBar";
import { useNavigate, useParams } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import axios from "axios";
import Feeds from "../components/Feeds";
import { Avatar, Tooltip } from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { useDispatch, useSelector } from "react-redux";
import Post from "../components/Post";
import { renderProfile } from "../store/slices/profileSlice";
import useMediaQuery from "@mui/material/useMediaQuery";
const Profile = () => {
  const mediaQuery = useMediaQuery("(max-width:500px)");
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    marginBottom: "10px",
    color: theme.palette.text.secondary,
  }));

  const profile = useSelector((state) => state.profile);
  const [message, setMessage] = useState("");
  const [alert, setAlert] = useState(false);
  const [state, setState] = useState("success");
  const [edit, setEdit] = useState(false);
  const [posts, setposts] = useState([]);
  const [friends, setFriends] = useState([]);
  const [currentUserFriends, setCurrentUserFriends] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [numOfFriends, setNumOfFriends] = useState(0);
  const { userId } = useParams();
  const [joinedAt, setJoinedAt] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const registerSchema = yup.object().shape({
    firstName: yup.string(),
    lastName: yup.string(),
    email: yup.string().email("invalid email"),
    photo: yup.string(),
  });

  const initialValuesRegister = {
    firstName: "",
    lastName: "",
    email: "",
    photo: "",
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    handleOpen();
    const formData = new FormData();
    if (values.lastName) {
      formData.append("lastName", values.lastName);
    }
    if (values.email) {
      formData.append("email", values.email);
    }
    if (values.firstName) {
      formData.append("firstName", values.firstName);
    }
    if (values.photo) {
      formData.append("picturePath", values.photo);
    }
    axios
      .patch(
        `https://helmy-social-media-api.onrender.com/api/v1/users`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        handleClose();
        setMessage("Profile has been edited successfully");
        setAlert(true);
        setState("success");
        setEdit(false);
        setTimeout(() => {
          setAlert(false);
        }, 5000);
      })
      .catch((err) => {
        handleClose();
        setMessage("Sometheing went wrong, Profile has not been edited");
        setAlert(true);
        setState("error");
        setTimeout(() => {
          setAlert(false);
        }, 5000);
      });
  };
  useEffect(() => {
    axios
      .get(
        `https://helmy-social-media-api.onrender.com/api/v1/users/${localStorage.getItem(
          "currentUser"
        )}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setCurrentUserFriends(res.data.data.user.friends);
      })
      .catch((err) => err);
    if (window.location.pathname.includes("me")) {
      axios
        .get(
          `https://helmy-social-media-api.onrender.com/api/v1/users/${localStorage.getItem(
            "currentUser"
          )}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          const date = new Date(res.data.data.user.createdAt);
          const month = date.toLocaleString("default", { month: "long" });
          const day = date.getDate();
          const year = date.getFullYear();
          setJoinedAt(`${month} ${day}, ${year}`);
          setCurrentUser(res.data.data.user);
          setNumOfFriends(res.data.data.user.friends.length);
        })
        .catch((err) => err);
      axios
        .get(
          `https://helmy-social-media-api.onrender.com/api/v1/posts/my-posts`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          setposts(res.data.data.posts.reverse());
        })
        .catch((err) => err);
      axios
        .get(
          `https://helmy-social-media-api.onrender.com/api/v1/users/friends/users/${window.localStorage.getItem(
            "currentUser"
          )}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          setFriends(res.data.data.friends);
        })
        .catch((err) => err);
    } else {
      axios
        .get(
          `https://helmy-social-media-api.onrender.com/api/v1/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          const date = new Date(res.data.data.user.createdAt);
          const month = date.toLocaleString("default", { month: "long" });
          const day = date.getDate();
          const year = date.getFullYear();
          setJoinedAt(`${month} ${day}, ${year}`);
          setCurrentUser(res.data.data.user);
          setNumOfFriends(res.data.data.user.friends.length);
        })
        .catch((err) => err);
      axios
        .get(
          `https://helmy-social-media-api.onrender.com/api/v1/posts/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          setposts(res.data.data.posts.reverse());
        })
        .catch((err) => err);
      axios
        .get(
          `https://helmy-social-media-api.onrender.com/api/v1/users/friends/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          setFriends(res.data.data.friends);
        })
        .catch((err) => err);
    }
  }, [open, profile, userId]);

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
          <Grid
            container
            spacing={2}
            style={{
              justifyContent: "center",
            }}
          >
            <Grid xs={10}>
              <Item>
                {edit ? (
                  <div>
                    <div>
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
                            <div>
                              <label
                                htmlFor="img"
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  display: "flex",
                                  borderRadius: "50%",
                                  justifyContent: "center",
                                  background: "#cccccc",
                                  alignItems: "center",
                                  margin: "auto",
                                  cursor: "pointer",
                                }}
                              >
                                <AddAPhotoIcon
                                  style={{
                                    fontSize: "50px",
                                  }}
                                />
                              </label>
                              <input
                                type="file"
                                name="img"
                                id="img"
                                accept="image/*"
                                variant="standard"
                                label="image"
                                style={{
                                  width: "0px",
                                }}
                                onChange={(e) => {
                                  values.photo = e.target.files[0];
                                }}
                              />
                            </div>
                            <Box
                              display="grid"
                              gap="30px"
                              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                            >
                              <TextField
                                label="First Name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.firstName}
                                name="firstName"
                                sx={{ gridColumn: "span 4" }}
                              />
                              <TextField
                                label="Last Name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.lastName}
                                name="lastName"
                                sx={{ gridColumn: "span 4" }}
                              />
                              <TextField
                                label="Email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.email}
                                name="email"
                                error={
                                  Boolean(touched.email) &&
                                  Boolean(errors.email)
                                }
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
                                Edit my profile
                              </Button>
                              <Button
                                fullWidth
                                onClick={() => setEdit(false)}
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
                  </div>
                ) : (
                  <>
                    <div className="profile-info-container">
                      <div className="profile-info-img">
                        <Avatar
                          sx={{ width: 200, height: 200 }}
                          alt=""
                          variant="rounded"
                          src={
                            currentUser.picturePath !== ""
                              ? `https://helmy-social-media-api.onrender.com/img/users/${currentUser.picturePath}`
                              : ""
                          }
                        />
                      </div>
                      <div className="profile-info">
                        <div className="user-info">
                          <p
                            style={{
                              background:
                                localStorage.getItem("theme") === "dark"
                                  ? "#757575"
                                  : "rgb(189 189 189)",
                            }}
                          >
                            {currentUser.firstName} {currentUser.lastName}
                          </p>
                          <p
                            style={{
                              background:
                                localStorage.getItem("theme") === "dark"
                                  ? "#757575"
                                  : "rgb(189 189 189)",
                            }}
                          >
                            {currentUser.email}
                          </p>
                          <p
                            style={{
                              background:
                                localStorage.getItem("theme") === "dark"
                                  ? "#757575"
                                  : "rgb(189 189 189)",
                            }}
                          >
                            {numOfFriends} friends
                          </p>
                          <p
                            style={{
                              background:
                                localStorage.getItem("theme") === "dark"
                                  ? "#757575"
                                  : "rgb(189 189 189)",
                            }}
                          >
                            Joined At {joinedAt}
                          </p>
                          <Button></Button>
                        </div>
                        <div
                          className="edit-icon"
                          style={{
                            cursor: "pointer",
                            alignSelf: "flex-start",
                          }}
                        >
                          {window.location.pathname.includes("me") && (
                            <Tooltip title="Edit">
                              <ModeEditIcon onClick={() => setEdit(true)} />
                            </Tooltip>
                          )}
                        </div>
                      </div>
                    </div>
                    {window.location.pathname.includes("me") && (
                      <Button
                        onClick={() => {
                          navigate("/profile/me/update-password");
                        }}
                      >
                        Change your password
                      </Button>
                    )}
                  </>
                )}
              </Item>
            </Grid>
            <Grid xs={10}>
              <Item>
                <div className="profile-friends">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <h3
                      style={{
                        flex: 1,
                        padding: "10px 20px",
                        textAlign: "center",
                        background:
                          localStorage.getItem("theme") === "dark"
                            ? "#121212"
                            : "#bdbdbd",
                        borderRadius: "10px",
                        border: "1px solid",
                      }}
                    >
                      Friends ({numOfFriends})
                    </h3>
                    {!window.location.pathname.includes("me") && (
                      <Button
                        style={{
                          background:
                            localStorage.getItem("theme") === "light"
                              ? " #bdbdbd"
                              : "#121212",
                          padding: "10px 8px",
                          borderRadius: "10px",
                          border: "1px solid",
                        }}
                        onClick={() => {
                          if (currentUserFriends.includes(userId)) {
                            axios
                              .delete(
                                `https://helmy-social-media-api.onrender.com/api/v1/users/friends/${userId}`,
                                {
                                  headers: {
                                    Authorization: `Bearer ${localStorage.getItem(
                                      "token"
                                    )}`,
                                  },
                                }
                              )
                              .then((res) => {
                                dispatch(renderProfile());
                              })
                              .catch((err) => err);
                          } else {
                            axios
                              .post(
                                `https://helmy-social-media-api.onrender.com/api/v1/users/friends`,
                                {
                                  newFriend: userId,
                                },
                                {
                                  headers: {
                                    Authorization: `Bearer ${localStorage.getItem(
                                      "token"
                                    )}`,
                                  },
                                }
                              )
                              .then((res) => {
                                dispatch(renderProfile());
                              })
                              .catch((err) => err);
                          }
                        }}
                      >
                        {currentUserFriends.includes(userId)
                          ? "- Remove From Friends"
                          : "+ Add To Friends"}
                      </Button>
                    )}
                  </div>
                  <div className="profile-friends-container">
                    {friends.map((friend) =>
                      friend._id === localStorage.getItem("currentUser") ? (
                        <div key={friend._id} className="profile-friend-card">
                          <Avatar
                            onClick={() => navigate(`/profile/me`)}
                            sx={{
                              width: "200px",
                              height: "200px",
                              cursor: "pointer",
                            }}
                            variant="rounded"
                            src={`https://helmy-social-media-api.onrender.com/img/users/${friend.picturePath}`}
                          />

                          <h3
                            style={{
                              cursor: "pointer",
                            }}
                            onClick={() => navigate(`/profile/me`)}
                          >
                            {friend.firstName} {friend.lastName} (You)
                          </h3>
                        </div>
                      ) : (
                        <div key={friend._id} className="profile-friend-card">
                          <Avatar
                            onClick={() => navigate(`/profile/${friend._id}`)}
                            sx={{
                              width: "200px",
                              height: "200px",
                              cursor: "pointer",
                            }}
                            variant="rounded"
                            src={`https://helmy-social-media-api.onrender.com/img/users/${friend.picturePath}`}
                          />

                          <h3
                            style={{
                              cursor: "pointer",
                            }}
                            onClick={() => navigate(`/profile/${friend._id}`)}
                          >
                            {friend.firstName} {friend.lastName}
                          </h3>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </Item>
            </Grid>
            {window.location.pathname.includes("profile/me") && (
              <Grid xs={10}>
                <Item>
                  <Post user={currentUser} />
                </Item>
              </Grid>
            )}
            <Grid xs={mediaQuery ? 10 : 7}>
              {posts.length === 0 ? (
                <Item>
                  <h3>
                    {currentUser.firstName} {currentUser.lastName} has no posts
                    yet
                  </h3>
                </Item>
              ) : (
                posts.map((post) => (
                  <Item key={post._id}>
                    <Feeds
                      post={post._id}
                      userName={`${post.user.firstName} ${post.user.lastName}`}
                      user={post.user._id}
                      userFriend={currentUserFriends}
                      userImage={currentUser.picturePath}
                      createdAt={post.createdAt}
                      description={post.description}
                      image={post.photo}
                      numLikes={post.likes.length}
                      likes={post.likes}
                      numComments={post.comments.length}
                      comments={post.comments}
                    />
                  </Item>
                ))
              )}
            </Grid>
          </Grid>
        </Box>
        <Backdrop sx={{ color: "#fff", zIndex: "7000" }} open={open}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    </>
  );
};

export default React.memo(Profile);
