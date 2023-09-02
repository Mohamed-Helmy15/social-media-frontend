import { Avatar } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const Info = ({ user, length }) => {
  const navigate = useNavigate();
  const date = new Date(user.createdAt);
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();
  const formattedDate = `${month} ${day}, ${year}`;

  return (
    <div>
      <div>User Information</div>
      <div className="info-container">
        <Avatar
          sx={{ width: 70, height: 70 }}
          src={
            user.picturePath !== ""
              ? `https://helmy-social-media-api.onrender.com/img/users/${user.picturePath}`
              : ""
          }
        />
        <h4
          onClick={() => {
            navigate(`/profile/me`);
          }}
          style={{
            cursor: "pointer",
          }}
        >
          {user.firstName} {user.lastName}
        </h4>

        <p>{length} friends</p>
        <p>Joined At: {formattedDate}</p>
      </div>
    </div>
  );
};

export default Info;
