import "./App.css";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import HomePage from "./pages/HomePage";
import Profile from "./pages/Profile";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import UpdatePassword from "./pages/UpdatePassword";

export const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
};
export const configMultiPart = {
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
};

function App() {
  const theme = useSelector((state) => state.theme);
  const darkTheme = createTheme({
    palette: {
      mode: theme,
    },
  });
  useEffect(() => {}, []);
  return (
    <BrowserRouter>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />

        <div
          style={{
            background:
              localStorage.getItem("theme") === "light" ? "#eee" : "#242424",
            minHeight: "100vh",
            maxHeight: "100%",
            transition: "0.3s",
          }}
        >
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/home"
              element={
                window.localStorage.getItem("token") &&
                window.localStorage.getItem("token") !== "undefined" ? (
                  <HomePage />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route path="/profile">
              <Route
                path=":userId"
                element={
                  window.localStorage.getItem("token") &&
                  window.localStorage.getItem("token") !== "undefined" ? (
                    <Profile />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
            </Route>
            <Route
              path="/profile/me"
              element={
                window.localStorage.getItem("token") &&
                window.localStorage.getItem("token") !== "undefined" ? (
                  <Profile />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/profile/me/update-password"
              element={
                window.localStorage.getItem("token") &&
                window.localStorage.getItem("token") !== "undefined" ? (
                  <UpdatePassword />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
          </Routes>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
