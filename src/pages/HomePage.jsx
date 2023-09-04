/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import Info from "../components/Info";
import Post from "../components/Post";
import Feeds from "../components/Feeds";
import FriendList from "../components/FriendList";
import NavBar from "../components/NavBar";

const HomePage = () => {
  const mediaQuery = useMediaQuery("(max-width:800px)");
  const mediaQueryMobile = useMediaQuery("(max-width:500px)");
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    marginBottom: "10px",
    color: theme.palette.text.secondary,
  }));

  const [currentUser, setCurrentUser] = useState({});
  const [numOfFriends, setNumOfFriends] = useState(0);
  const [friends, setFriends] = useState([]);
  const [posts, setposts] = useState([]);
  const friend = useSelector((state) => state.friend);
  const comment = useSelector((state) => state.comment);

  const renderFriends = useCallback(() => {
    axios
      .get("https://helmy-social-media-api.onrender.com/api/v1/users/friends", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setFriends(res.data.data.friends))
      .catch((err) => err);
  }, []);

  const renderInfo = useCallback(() => {
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
        setCurrentUser(res.data.data.user);
        setNumOfFriends(res.data.data.user.friends.length);
      })
      .catch((err) => err);
  }, []);

  const renderFeeds = useCallback(() => {
    axios
      .get(`https://helmy-social-media-api.onrender.com/api/v1/posts/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setposts(res.data.data.posts.reverse());
      })
      .catch((err) => err);
  }, []);

  useEffect(() => {
    renderInfo();
    renderFeeds();
    renderFriends();
  }, [friend, comment]);
  return (
    <>
      <NavBar />
      <div className="container" style={{ padding: "0px 10px" }}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={2}
            style={{
              gridColumns: "0 !important",
              justifyContent: "center",
            }}
          >
            {mediaQueryMobile ? (
              <>
                <Grid xs={10}>
                  <Item>
                    <Info user={currentUser} length={numOfFriends} />
                  </Item>
                </Grid>
                <Grid xs={10}>
                  <Item>
                    <FriendList friends={friends} />
                  </Item>
                </Grid>
                <Grid xs={10}>
                  <Item>
                    <Post user={currentUser} />
                  </Item>
                  {posts.map((post) => (
                    <Item key={post._id}>
                      <Feeds
                        post={post._id}
                        userName={`${post.user.firstName} ${post.user.lastName}`}
                        user={post.user._id}
                        userFriend={currentUser.friends}
                        userImage={post.user.picturePath}
                        createdAt={post.createdAt}
                        description={post.description}
                        image={post.photo}
                        numLikes={post.likes.length}
                        likes={post.likes}
                        numComments={post.comments.length}
                        comments={post.comments}
                      />
                    </Item>
                  ))}
                </Grid>
              </>
            ) : mediaQuery ? (
              <>
                <Grid xs={6}>
                  <Item>
                    <Info user={currentUser} length={numOfFriends} />
                  </Item>
                </Grid>
                <Grid xs={6}>
                  <Item>
                    <FriendList friends={friends} />
                  </Item>
                </Grid>
                <Grid xs={10}>
                  <Item>
                    <Post user={currentUser} />
                  </Item>
                  {posts.map((post) => (
                    <Item key={post._id}>
                      <Feeds
                        post={post._id}
                        userName={`${post.user.firstName} ${post.user.lastName}`}
                        user={post.user._id}
                        userFriend={currentUser.friends}
                        userImage={post.user.picturePath}
                        createdAt={post.createdAt}
                        description={post.description}
                        image={post.photo}
                        numLikes={post.likes.length}
                        likes={post.likes}
                        numComments={post.comments.length}
                        comments={post.comments}
                      />
                    </Item>
                  ))}
                </Grid>
              </>
            ) : (
              <>
                <Grid xs={3}>
                  <Item>
                    <Info user={currentUser} length={numOfFriends} />
                  </Item>
                </Grid>
                <Grid xs={6}>
                  <Item>
                    <Post user={currentUser} />
                  </Item>
                  {posts.map((post) => (
                    <Item key={post._id}>
                      <Feeds
                        post={post._id}
                        userName={`${post.user.firstName} ${post.user.lastName}`}
                        user={post.user._id}
                        userFriend={currentUser.friends}
                        userImage={post.user.picturePath}
                        createdAt={post.createdAt}
                        description={post.description}
                        image={post.photo}
                        numLikes={post.likes.length}
                        likes={post.likes}
                        numComments={post.comments.length}
                        comments={post.comments}
                      />
                    </Item>
                  ))}
                </Grid>
                <Grid xs={3}>
                  <Item>
                    <FriendList friends={friends} />
                  </Item>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </div>
    </>
  );
};

export default HomePage;
