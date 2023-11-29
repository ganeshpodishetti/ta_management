import React, { useState } from "react";
import {
	Container,
	TextField,
	Button,
	Grid,
	Typography,
	Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
		<Container maxWidth="xs" className="mt-4">
			<Typography variant="h4" component="h1" gutterBottom className="text-center fw-bold py-3">
				TA Management
			</Typography>
			<Grid container spacing={3} direction="column" alignItems="center">
				<Grid item xs={12}>
					<Typography variant="h4" component="h1" gutterBottom>
						Sign In
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<TextField
						label="Username"
						variant="outlined"
						fullWidth
						name="username"
						value={credentials.username}
						onChange={handleChange}
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						label="Password"
						variant="outlined"
						fullWidth
						type="password"
						name="password"
						value={credentials.password}
						onChange={handleChange}
					/>
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
						onClick={handleSignIn}
					>
						Sign In
					</Button>
				</Grid>
				<Grid item xs={12}>
					<Button
						variant="outlined"
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

export default Login;
