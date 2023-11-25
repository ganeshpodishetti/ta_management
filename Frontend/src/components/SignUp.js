import React, { useState } from "react";
import {
	Container,
	TextField,
	Button,
	Grid,
	Typography,
	Alert,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
		<Container maxWidth="sm" className="mt-5">
			<Grid container spacing={3} direction="column" alignItems="center">
				<Grid item xs={12}>
					<Typography variant="h4" component="h1" gutterBottom>
						Sign Up
					</Typography>
				</Grid>
				{/* Username */}
				<Grid item xs={12}>
					<TextField
						label="Username"
						variant="outlined"
						fullWidth
						name="username"
						value={user.username}
						onChange={handleChange}
					/>
				</Grid>
				{/* Password */}
				<Grid item xs={12}>
					<TextField
						label="Password"
						variant="outlined"
						fullWidth
						type="password"
						name="password"
						value={user.password}
						onChange={handleChange}
					/>
				</Grid>
				{/* Confirm Password */}
				<Grid item xs={12}>
					<TextField
						label="Confirm Password"
						variant="outlined"
						fullWidth
						type="password"
						name="confirmPassword"
						value={user.confirmPassword}
						onChange={handleChange}
					/>
				</Grid>
				{/* Role */}
				<Grid item xs={12}>
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
				</Grid>

				{error && (
					<Grid item xs={12}>
						<Alert severity="error">{error}</Alert>
					</Grid>
				)}
				<Grid item xs={12}>
					<Button
						variant="contained"
						color="primary"
						fullWidth
						onClick={handleSignUp}
					>
						Sign Up
					</Button>
				</Grid>
			</Grid>
		</Container>
	);
};

export default Signup;
