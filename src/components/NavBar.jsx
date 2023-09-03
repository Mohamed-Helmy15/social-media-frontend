import { Avatar, Button, IconButton } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import LightModeIcon from "@mui/icons-material/LightMode";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toggle } from "../store/slices/themeSlice";
import axios from "axios";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useSignOut } from "react-auth-kit";
const NavBar = () => {
  const mediaQuery = useMediaQuery("(max-width:600px)");
  const signOut = useSignOut();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [allUsers, setAllUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [search, setSearch] = useState("");
  useEffect(() => {
    axios
      .get("https://helmy-social-media-api.onrender.com/api/v1/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setAllUsers(
          res.data.data.users.filter(
            (user) => user._id !== localStorage.getItem("currentUser")
          )
        );
        const user = res.data.data.users.filter(
          (user) => user._id === localStorage.getItem("currentUser")
        );
        setCurrentUser(user[0]);
      });
  }, []);

  const handleLogOut = () => {
    axios
      .get("https://helmy-social-media-api.onrender.com/api/v1/users/logout", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        signOut();
        localStorage.removeItem("currentUser");
        navigate("/");
      })
      .catch((err) => err);
  };

  return (
    <nav
      style={{
        position: mediaQuery ? "relative" : "sticky",
        top: "0px",
        zIndex: "5000",
        background:
          localStorage.getItem("theme") === "light" ? "white" : "black",
        display: "flex",
        justifyContent: mediaQuery ? "center" : "space-between",
        padding: "20px 10px",
        alignItems: "center",
        transition: "0.3s",
        marginBottom: "30px",
        boxShadow:
          "rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px",
        flexWrap: mediaQuery && "wrap",
        gap: mediaQuery && "15px",
      }}
    >
      <h1
        style={{
          color: "#0755ff",
          cursor: "pointer",
        }}
        onClick={() => navigate("/home")}
      >
        Social Media
      </h1>
      <div className="search-container">
        <input
          style={{
            background:
              localStorage.getItem("theme") === "dark" ? "#3e4247" : "white",
            color: localStorage.getItem("theme") === "dark" ? "white" : "black",
          }}
          type="text"
          name="search"
          placeholder="Search for users"
          id="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <div className="nav-icons">
          {search !== "" && (
            <>
              <ClearIcon
                style={{
                  cursor: "pointer",
                }}
                onClick={() => setSearch("")}
              />
              <div
                className="nav-search"
                style={{
                  background:
                    localStorage.getItem("theme") === "dark"
                      ? "black"
                      : "white",
                }}
              >
                {allUsers
                  .filter(
                    (user) =>
                      user.firstName.includes(search) ||
                      user.lastName.includes(search)
                  )
                  .map((user) => (
                    <div
                      key={user._id}
                      style={{
                        background:
                          localStorage.getItem("theme") === "dark"
                            ? "#3e4247"
                            : "#d4d4d4",
                      }}
                    >
                      <Avatar
                        src={`https://helmy-social-media-api.onrender.com/img/users/${user.picturePath}`}
                      />
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <p
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setSearch("");
                            navigate(`/profile/${user._id}`);
                          }}
                        >
                          {user.firstName} {user.lastName}
                        </p>
                        {currentUser.friends.includes(user._id) && (
                          <h6>friend</h6>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}
          <SearchIcon />
        </div>
      </div>
      <div className="nav-info-container">
        <div className="nav-img-name">
          <Avatar
            sx={{
              width: "56px",
              height: "56px",
            }}
            src={`https://helmy-social-media-api.onrender.com/img/users/${currentUser.picturePath}`}
          />
          <h3
            style={{
              cursor: "pointer",
            }}
            onClick={() => navigate("/profile/me")}
          >
            {currentUser.firstName} {currentUser.lastName}
          </h3>
        </div>
        <div>
          <Button endIcon={<LogoutIcon />} onClick={handleLogOut}>
            Log out
          </Button>
        </div>
      </div>
      <div>
        <IconButton
          sx={{ ml: 1 }}
          style={{
            backgroundColor:
              localStorage.getItem("theme") === "dark" ? "white" : "black",
          }}
          onClick={() => {
            dispatch(toggle());
          }}
        >
          {localStorage.getItem("theme") === "dark" ? (
            <LightModeIcon
              style={{
                color: "black",
              }}
            />
          ) : (
            <Brightness4Icon
              style={{
                color: "white",
              }}
            />
          )}
        </IconButton>
      </div>
    </nav>
  );
};

export default NavBar;
