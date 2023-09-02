import React, { useEffect, useState } from "react";
import { Avatar, Badge } from "@mui/material";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import PeopleIcon from "@mui/icons-material/People";
import axios from "axios";

import { useDispatch } from "react-redux";
import { renderFriends } from "../store/slices/friendSlice";
import { useNavigate } from "react-router-dom";

const FriendList = ({ friends }) => {
  const navigate = useNavigate();
  const [friend, setFriend] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {}, [friend]);
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "5px",
          padding: "10px 0",
        }}
      >
        <p>Friend List</p>
        <Badge color="primary" badgeContent={friends.length} max={99}>
          <PeopleIcon />
        </Badge>
      </div>
      {friends.map((friend) => (
        <div
          key={friend._id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "20px 0",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "5px",
            }}
          >
            <Avatar
              alt={friend.firstName}
              src={
                friend.picturePath !== ""
                  ? `/img/users/${friend.picturePath}`
                  : ""
              }
            />

            <div
              style={{
                textAlign: "left",
              }}
            >
              <h4
                onClick={() => {
                  navigate(`/profile/${friend._id}`);
                }}
                style={{
                  cursor: "pointer",
                }}
              >
                {friend.firstName} {friend.lastName}
              </h4>
              <h6>{friend.email}</h6>
            </div>
          </div>
          <div
            className="add-container"
            style={{
              color: friend ? "#0755ff" : "black",
              background:
                localStorage.getItem("theme") === "light"
                  ? "#75757554"
                  : "white",
            }}
            onClick={(e) => {
              setFriend(!friend);
              axios
                .delete(`/api/v1/users/friends/${friend._id}`, {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                })
                .then((res) => {
                  dispatch(renderFriends());
                })
                .catch((err) => err);
            }}
          >
            <PersonRemoveIcon />
          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(FriendList);