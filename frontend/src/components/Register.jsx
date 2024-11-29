import React from "react";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import { firebaseLogin, firebaseRegister, signInWithGoogle } from '../auth/auth';
import axiosInstance from "../utils/AxiosInstance";

const Register = () => {

  const handleSubmit = async(event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    // Add your form submission logic here
    try {
        await firebaseRegister(email, password)
        await axiosInstance.post(`/api/user/`, { email: email, password: password })
        window.location.href = "/login"
    } catch(e) {
        console.log(e)
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          maxWidth: 400,
          width: "100%",
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          Register
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Email"
            name="email"
            type="email"
            required
            fullWidth
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            required
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
          >
            Register
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;
