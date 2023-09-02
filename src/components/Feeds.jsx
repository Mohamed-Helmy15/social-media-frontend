import React, { useEffect, useState } from "react";
import {
  Avatar,
  Backdrop,
  Button,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { addComment } from "../store/slices/commentSlice";
import { useDispatch } from "react-redux";
import { renderFriends } from "../store/slices/friendSlice";
import { useNavigate } from "react-router-dom";
import { renderProfile } from "../store/slices/profileSlice";

const Feeds = ({
  userName,
  user,
  userImage,
  userFriend,
  createdAt,
  description,
  image,
  numLikes,
  likes,
  numComments,
  comments,
  post,
}) => {
  const dispatch = useDispatch();
  const [comment, SetComment] = useState("");
  const [like, setLike] = useState(true);
  const [unlike, setUnLike] = useState(true);
  const [friend, setFriend] = useState(true);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const date = new Date(createdAt);
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedDate = `${month} ${day}, ${year} at ${hours}:${minutes}`;
  const isLiked = likes.filter(
    (like) => like.user._id === localStorage.getItem("currentUser")
  );
  useEffect(() => {}, [like, unlike, friend]);
  return (
    <div>
      <div
        className="feed-container"
        style={{
          textAlign: "left",
        }}
      >
        <div className="header-post">
          <div className="avatar-info">
            <Avatar
              alt=""
              src={
                userImage !== ""
                  ? `https://helmy-social-media-api.onrender.com/img/users/${userImage}`
                  : ""
              }
            />
            <div>
              <h4
                onClick={() => {
                  if (localStorage.getItem("currentUser") === user) {
                    navigate(`/profile/me`);
                  }
                  navigate(`/profile/${user}`);
                }}
                style={{
                  cursor: "pointer",
                }}
              >
                {userName}{" "}
                {localStorage.getItem("currentUser") === user ? "(You)" : null}
              </h4>
              <h5>{formattedDate}</h5>
            </div>
          </div>
          {window.location.pathname.includes("profile/me") ||
          localStorage.getItem("currentUser") === user ? (
            <div
              className="icon delete-friend"
              style={{
                cursor: "pointer",
                background:
                  localStorage.getItem("theme") === "dark"
                    ? "#000000c2"
                    : "#d1d1d1",
              }}
              onClick={() => {
                handleOpen();
                axios
                  .delete(
                    `https://helmy-social-media-api.onrender.com/api/v1/posts/${post}`,
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                          "token"
                        )}`,
                      },
                    }
                  )
                  .then((res) => {
                    handleClose();
                    if (window.location.pathname.includes("profile")) {
                      dispatch(renderProfile());
                    } else {
                      dispatch(renderFriends());
                    }
                  })
                  .catch((err) => err);
              }}
            >
              <DeleteIcon />
            </div>
          ) : userFriend.includes(user) ? (
            <div
              className="icon delete-friend"
              style={{
                color: "#0755ff",
                background:
                  localStorage.getItem("theme") === "dark"
                    ? "#000000c2"
                    : "#d1d1d1",
              }}
              onClick={() => {
                axios
                  .delete(
                    `https://helmy-social-media-api.onrender.com/api/v1/users/friends/${user}`,
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                          "token"
                        )}`,
                      },
                    }
                  )
                  .then((res) => {
                    setFriend(false);
                    if (window.location.pathname.includes("profile")) {
                      dispatch(renderProfile());
                    } else {
                      dispatch(renderFriends());
                    }
                  })
                  .catch((err) => err);
              }}
            >
              <PersonRemoveIcon />
            </div>
          ) : (
            <div
              className="icon add-friend"
              style={{
                color:
                  localStorage.getItem("theme") === "dark" ? "white" : "black",
                background:
                  localStorage.getItem("theme") === "dark"
                    ? "#000000c2"
                    : "#d1d1d1",
              }}
              onClick={() => {
                axios
                  .post(
                    `https://helmy-social-media-api.onrender.com/api/v1/users/friends`,
                    {
                      newFriend: user,
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
                    setFriend(true);
                    if (window.location.pathname.includes("profile")) {
                      dispatch(renderProfile());
                    } else {
                      dispatch(renderFriends());
                    }
                  })
                  .catch((err) => err);
              }}
            >
              <PersonAddAlt1Icon />
            </div>
          )}
        </div>
        <div
          style={{
            marginBottom: "10px",
          }}
        >
          <p
            style={{
              fontSize: "17px",
              padding: "10px 0px",
            }}
          >
            {description}
          </p>
        </div>
        {image !== "" ? (
          <div
            style={{
              marginBottom: "15px",
            }}
          >
            <img
              src={`https://helmy-social-media-api.onrender.com/img/posts/${image}`}
              alt="img"
              style={{
                width: "100%",
              }}
            />
          </div>
        ) : null}
        <div className="love-post">
          <Tooltip
            title={
              <div>
                {comments.map((comment) => (
                  <p key={comment._id}>
                    {comment.user.firstName} {comment.user.lastName}
                  </p>
                ))}
              </div>
            }
            placement="top"
          >
            <p>{numComments} comments</p>
          </Tooltip>
          <div className="p">
            <Tooltip
              title={
                <div>
                  {likes.map((like) => (
                    <p key={like._id}>
                      {like.user.firstName} {like.user.lastName}
                    </p>
                  ))}
                </div>
              }
              placement="top"
            >
              <span>{numLikes}</span>
            </Tooltip>
            {(isLiked.length > 0 && like) || unlike === false ? (
              <div className="red-icon">
                <FavoriteIcon
                  style={{
                    cursor: "pointer",
                    color: like ? "red" : "grey",
                  }}
                  onClick={(e) => {
                    e.target.style.setProperty("pointer-events", "none");
                    axios
                      .delete(
                        `https://helmy-social-media-api.onrender.com/api/v1/posts/${post}/likes`,
                        {
                          headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                              "token"
                            )}`,
                          },
                        }
                      )
                      .then((res) => {
                        e.target.style.removeProperty("pointer-events");
                        e.target.classList.remove("animate__heartBeat");
                        setLike(!like);
                        setUnLike(true);
                        if (window.location.pathname.includes("profile")) {
                          dispatch(renderProfile());
                        } else {
                          dispatch(renderFriends());
                        }
                      })
                      .catch((err) => err);
                  }}
                />
              </div>
            ) : (
              <div
                className="grey-icon "
                onClick={(e) => {
                  e.target.style.setProperty("pointer-events", "none");
                  axios
                    .post(
                      `https://helmy-social-media-api.onrender.com/api/v1/posts/${post}/likes`,
                      {},
                      {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem(
                            "token"
                          )}`,
                        },
                      }
                    )
                    .then((res) => {
                      e.target.style.removeProperty("pointer-events");
                      e.target.classList.add("animate__heartBeat");
                      setUnLike(!unlike);
                      setLike(true);
                      if (window.location.pathname.includes("profile")) {
                        dispatch(renderProfile());
                      } else {
                        dispatch(renderFriends());
                      }
                    })
                    .catch((err) => err);
                }}
              >
                <FavoriteIcon
                  style={{
                    cursor: "pointer",
                    color: unlike ? "grey" : "red",
                  }}
                />
              </div>
            )}
          </div>
        </div>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="comment-post">
              <Avatar
                src={
                  comment.user.picturePath !== ""
                    ? `https://helmy-social-media-api.onrender.com/img/users/${comment.user.picturePath}`
                    : ""
                }
                style={{
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (
                    localStorage.getItem("currentUser") === comment.user._id
                  ) {
                    navigate("/profile/me");
                  } else {
                    navigate(`/profile/${comment.user._id}`);
                  }
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <p
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <span
                    style={{
                      fontSize: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      if (
                        localStorage.getItem("currentUser") === comment.user._id
                      ) {
                        navigate("/profile/me");
                      } else {
                        navigate(`/profile/${comment.user._id}`);
                      }
                    }}
                  >
                    {comment.user.firstName} {comment.user.lastName}
                  </span>
                  {comment.comment}
                </p>
                {comment.user._id === localStorage.getItem("currentUser") ||
                window.location.pathname.includes("me") ? (
                  <div
                    style={{
                      display: "flex",
                    }}
                    onClick={() => {
                      handleOpen();
                      axios
                        .delete(
                          `https://helmy-social-media-api.onrender.com/api/v1/posts/${post}/comments/${comment._id}`,
                          {
                            headers: {
                              Authorization: `Bearer ${localStorage.getItem(
                                "token"
                              )}`,
                            },
                          }
                        )
                        .then((res) => {
                          if (window.location.pathname.includes("profile")) {
                            dispatch(renderProfile());
                          } else {
                            dispatch(addComment());
                          }
                          setTimeout(() => {
                            handleClose();
                          }, 1500);
                        })
                        .catch((err) => handleClose());
                    }}
                  >
                    <DeleteIcon
                      style={{
                        cursor: "pointer",
                      }}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          ))
        ) : (
          <div className="comment-post">
            <h3>There are no comments for this post</h3>
          </div>
        )}
        <div className="write-post">
          <input
            type="text"
            name="post"
            id="post"
            placeholder="write a comment"
            value={comment}
            onChange={(e) => SetComment(e.target.value)}
            style={{
              background:
                localStorage.getItem("theme") === "dark" ? "#3e4247" : "white",
              color:
                localStorage.getItem("theme") === "dark" ? "white" : "black",
            }}
          />
          <Button
            onClick={() => {
              handleOpen();
              axios
                .post(
                  `https://helmy-social-media-api.onrender.com/api/v1/posts/${post}/comments`,
                  { comment },
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  }
                )
                .then((res) => {
                  if (window.location.pathname.includes("profile")) {
                    dispatch(renderProfile());
                  } else {
                    dispatch(addComment());
                  }
                  setTimeout(() => {
                    handleClose();
                  }, 1500);
                })
                .catch((err) => handleClose());
            }}
          >
            Publish
          </Button>
        </div>
      </div>
      <Backdrop sx={{ color: "#fff", zIndex: "7000" }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default Feeds;
