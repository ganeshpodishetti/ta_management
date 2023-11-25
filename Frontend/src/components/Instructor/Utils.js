import { Article, Logout } from "@mui/icons-material";
import { Avatar, Box, Button, Grid, Typography } from "@mui/material";
import axios from "axios";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const LeftMenu = ({ setUser }) => {
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			console.log("Logging out");
			await axios.post("/api/logout");
			console.log("Logged out");
			setUser(null);
			navigate("/");
		} catch (error) {
			console.error("There was a problem logging out:", error);
		}
	};

	return (
		<Grid item className="bg-primary dashColumn ps-3 pe-3 text-center">
			<Box className="d-flex justify-content-center p-3">
				<Avatar sx={{ width: 100, height: 100 }} />
			</Box>
			<Box className="d-flex align-items-center w-100">
				<NavLink
					to="/"
					className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
				>
					<Article className="fs-3 me-2" style={{ color: "white" }} />
					<Typography
						variant="overline"
						className="fw-bold fs-6"
						color={"white"}
					>
						All Feedbacks
					</Typography>
				</NavLink>
			</Box>
			<Box className="d-flex justify-content-start align-items-center w-100">
				<NavLink
					to="/feedback"
					className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
				>
					<Article className="fs-3 me-2" style={{ color: "white" }} />
					<Typography
						variant="overline"
						className="fw-bold fs-6"
						color={"white"}
					>
						Fill Feedback
					</Typography>
				</NavLink>
			</Box>
			<Box className="d-flex justify-content-start align-items-center w-100 ms-3">
				<Logout className="fs-3 me-2" style={{ color: "white" }} />
				<Button variant="text" color="inherit" onClick={handleLogout}>
					<Typography
						variant="overline"
						className="fw-bold fs-6"
						color={"white"}
					>
						Log Out
					</Typography>
				</Button>
			</Box>
		</Grid>
	);
};

export { LeftMenu };
