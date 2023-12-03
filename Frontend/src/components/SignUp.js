import React, { useState } from "react";
import {
	TextField,
	Button,
	Typography,
	Alert,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Box,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/SignUp.css";

const Signup = ({ setUserGlobal }) => {
	const navigate = useNavigate();

	const [user, setUser] = useState({
		username: "",
		password: "",
		confirmPassword: "",
		role: "",
	});
	const [error, setError] = useState("");

	const handleChange = (e) => {
		const { name, value } = e.target;
		setUser({
			...user,
			[name]: value,
		});
	};

	const handleSignUp = () => {
		if (user.password !== user.confirmPassword) {
			setError("Passwords don't match.");
			return;
		}

		axios
			.post("/api/signup", {
				username: user.username,
				password: user.password,
				role: user.role,
			})
			.then((res) => {
				console.log(res);
				setUserGlobal({ username: res.data.username, role: res.data.role });
				navigate("/");
			})
			.catch((err) => {
				console.log(err);
				setError(err.response.data);
			});

		console.log("Sign Up", user);
		setUser({
			username: "",
			password: "",
			confirmPassword: "",
			role: "",
		});
		setError("");
	};

	return (
		<Box className="signup-container d-flex flex-column align-items-center m-0 p-0">
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
						Sign Up
					</Typography>
				</Box>
				<Box className="my-2">
					<TextField
						label="Username"
						variant="outlined"
						fullWidth
						name="username"
						value={user.username}
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
						value={user.password}
						onChange={handleChange}
					/>
				</Box>
				<Box className="my-2">
					<TextField
						label="Confirm Password"
						variant="outlined"
						fullWidth
						type="password"
						name="confirmPassword"
						value={user.confirmPassword}
						onChange={handleChange}
					/>
				</Box>
				<Box className="my-2">
					<FormControl variant="outlined" fullWidth style={{ width: "300px" }}>
						<InputLabel id="role-label">Role</InputLabel>
						<Select
							labelId="role-label"
							label="Role"
							name="role"
							value={user.role}
							onChange={handleChange}
						>
							<MenuItem value="Student">Student</MenuItem>
							<MenuItem value="TA Committee Member">
								TA Committee Member
							</MenuItem>
							<MenuItem value="Department Staff">Department Staff</MenuItem>
							<MenuItem value="Instructor">Instructor</MenuItem>
						</Select>
					</FormControl>
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
						onClick={handleSignUp}
					>
						Sign Up
					</Button>
				</Box>
			</Box>
		</Box>
	);
};

export default Signup;
