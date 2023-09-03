import "./App.css";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, RequireAuth } from "react-auth-kit";
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
    <AuthProvider authType={"localStorage"} authName={"token"}>
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
                path="https://helmy-social-media.onrender.com/home"
                element={
                  <RequireAuth loginPath={"/"}>
                    <HomePage />
                  </RequireAuth>
                }
              />
              <Route path="/profile">
                <Route
                  path=":userId"
                  element={
                    <RequireAuth loginPath={"/"}>
                      <Profile />
                    </RequireAuth>
                  }
                />
              </Route>
              <Route
                path="/profile/me"
                element={
                  <RequireAuth loginPath={"/"}>
                    <Profile />
                  </RequireAuth>
                }
              />
              <Route
                path="/profile/me/update-password"
                element={
                  <RequireAuth loginPath={"/"}>
                    <UpdatePassword />
                  </RequireAuth>
                }
              />
            </Routes>
          </div>
        </ThemeProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
