import {
	Box,
	Button,
	Container,
	Grid,
	List,
	ListItem,
	ListItemText,
	Modal,
	Rating,
	TextField,
	Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { LeftMenu } from "./Utils";
import axios from "axios";

const UserFeedbackModal = ({ user, open, onClose }) => {
	const [feedback, setFeedback] = useState("");
	const [rating, setRating] = useState(0);

	const handleClose = () => {
		setFeedback("");
		onClose();
	};

	const handleSubmit = async () => {
		try {
			await axios.post("/api/createFeedback", {
				...user,
				feedback,
				rating,
			});

			alert("Feedback created successfully");
		} catch (error) {
			alert("Error creating feedback");
			console.error("Error creating feedback:", error);
		}
		handleClose();
	};

	return (
		<Modal open={open} onClose={handleClose}>
			<Container maxWidth="sm">
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						bgcolor: "white",
						boxShadow: 24,
						p: 4,
						width: "80vw",
						maxWidth: "400px",
					}}
				>
					<Typography
						style={{ fontFamily: "Poppins" }}
						className="fw-bold"
						variant="h6"
					>
						User Information
					</Typography>
					<Typography style={{ fontFamily: "Poppins" }} variant="body1">
						Username: <strong>{user.username}</strong>
					</Typography>
					<Typography style={{ fontFamily: "Poppins" }} variant="body1">
						Name: <strong>{user.name}</strong>
					</Typography>
					<Typography style={{ fontFamily: "Poppins" }} variant="body1">
						Email: <strong>{user.email}</strong>
					</Typography>
					<Typography style={{ fontFamily: "Poppins" }} variant="body1">
						Course: <strong>{user.course}</strong>
					</Typography>
					<TextField
						label="Feedback"
						variant="outlined"
						fullWidth
						multiline
						rows={4}
						value={feedback}
						onChange={(e) => setFeedback(e.target.value)}
						className="mt-3"
					/>
					<Box>
						<Typography className="mt-3 fw-bold" style={{ fontFamily: "Poppins" }}>
							Rating
						</Typography>
						<Rating
							name="rating"
							value={rating}
							onChange={(event, newValue) => {
								setRating(newValue);
							}}
						/>
					</Box>
					<Button
						variant="contained"
						color="primary"
						onClick={handleSubmit}
						style={{ marginTop: "16px" }}
					>
						Submit Feedback
					</Button>
				</Box>
			</Container>
		</Modal>
	);
};

const Feedback = ({ setUser }) => {
	const [acceptedApplications, setAcceptedApplications] = useState([]);
	const [open, setOpen] = useState(false);

	const fillApplications = (apps) => {
		const newApplications = [];
		apps.forEach((app) => {
			app.eligibleCourses.forEach((course, index) => {
				if (app.status[index] === "Accepted") {
					newApplications.push({
						username: app.username,
						name: app.name,
						email: app.email,
						course,
					});
				}
			});
		});

		setAcceptedApplications(newApplications);
	};

	useEffect(() => {
		const fetchAcceptedApplications = async () => {
			try {
				const response = await axios.get("/api/getAcceptedApplications");
				fillApplications(response.data);
			} catch (error) {
				console.error("Error fetching accepted applications:", error);
			}
		};

		fetchAcceptedApplications();
	}, []);

	return (
		<Box>
			<Grid container>
				<LeftMenu setUser={setUser} />
				<Grid item xs className="my-4">
					<Container className="container">
						<Typography
							variant="h4"
							gutterBottom
							style={{ fontFamily: "Poppins" }}
							className="fw-bold"
						>
							Users with Eligible Courses Accepted
						</Typography>
						<List>
							{acceptedApplications.map((user, index) => (
								<ListItem
									key={user.id}
									className="p-3 mb-3 shadow rounded"
									style={{ backgroundColor: "white" }}
								>
									<ListItemText
										primary={`Name: ${user.name} (${user.username})`}
										secondary={`Email: ${user.email} | Course: ${user.course}`}
										primaryTypographyProps={{
											style: { fontFamily: "Poppins" },
											className: "fw-bold",
										}}
										secondaryTypographyProps={{
											style: { fontFamily: "Poppins" },
											className: "fw-bold",
										}}
									/>
									<Button
										variant="contained"
										color="primary"
										onClick={() => setOpen(true)}
									>
										Feedback
									</Button>
									<UserFeedbackModal
										user={user}
										open={open}
										onClose={() => setOpen(false)}
									/>
								</ListItem>
							))}
						</List>
					</Container>
				</Grid>
			</Grid>
		</Box>
	);
};

export default Feedback;
