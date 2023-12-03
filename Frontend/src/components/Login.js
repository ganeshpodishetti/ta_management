import React, { useState } from "react";
import { TextField, Button, Typography, Alert, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";

const Login = ({ setUserGlobal }) => {
	const navigate = useNavigate();
	const [credentials, setCredentials] = useState({
		username: "",
		password: "",
	});

	const [error, setError] = useState("");

	const handleChange = (e) => {
		const { name, value } = e.target;
		setCredentials({
			...credentials,
			[name]: value,
		});
	};

	const handleSignIn = () => {
		axios
			.post("/api/login", {
				username: credentials.username,
				password: credentials.password,
			})
			.then((res) => {
				setUserGlobal({ username: res.data.username, role: res.data.role });
				navigate("/");
			})
			.catch((err) => {
				console.log(err);
				setError(err.response.data);
			});
		setError("");
		setCredentials({
			username: "",
			password: "",
		});
	};

	const handleSignUp = () => {
		navigate("/signup");
		console.log("Sign Up");
	};

	return (
		<Box className="login-container d-flex flex-column align-items-center m-0 p-0">
			<Typography
				variant="h4"
				component="h1"
				className="text-center py-3"
				style={{ fontFamily: "Holtwood One SC" }}
			>
				TA Management
			</Typography>
			<Box
				style={{ backgroundColor: "white" }}
				className="shadow py-2 px-5 signInContainer border mt-4 d-flex flex-column justify-content-center align-items-center"
			>
				<Box className="py-2">
					<Typography
						variant="h4"
						component="h1"
						gutterBottom
						className="fw-bold"
					>
						Sign In
					</Typography>
				</Box>
				<Box className="my-2">
					<TextField
						label="Username"
						variant="outlined"
						fullWidth
						name="username"
						value={credentials.username}
						onChange={handleChange}
					/>
				</Box>
				<Box className="my-2">
					<TextField
						label="Password"
						variant="outlined"
						fullWidth
						type="password"
						name="password"
						value={credentials.password}
						onChange={handleChange}
					/>
				</Box>
				{error && (
					<Box className="my-2">
						<Alert severity="error">{error}</Alert>
					</Box>
				)}
				<Box className="my-2">
					<Button
						variant="contained"
						color="primary"
						fullWidth
						onClick={handleSignIn}
					>
						Sign In
					</Button>
				</Box>
				<Box className="my-2">
					<Button
						variant="outlined"
						color="primary"
						fullWidth
						onClick={handleSignUp}
					>
						Sign Up
					</Button>
				</Box>
			</Box>
		</Box>
	);
};

export default Login;
