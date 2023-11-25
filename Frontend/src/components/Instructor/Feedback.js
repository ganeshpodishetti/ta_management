import {
	Box,
	Button,
	Container,
	Grid,
	List,
	ListItem,
	ListItemText,
	Modal,
	TextField,
	Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { LeftMenu } from "./Utils";
import axios from "axios";

const UserFeedbackModal = ({ user, open, onClose }) => {
	const [feedback, setFeedback] = useState("");

	const handleClose = () => {
		setFeedback("");
		onClose();
	};

	const handleSubmit = async () => {
    try {
      await axios.post('/api/createFeedback', {
        ...user,
        feedback,
      });

      alert('Feedback created successfully');
    } catch (error) {
      alert('Error creating feedback');
      console.error('Error creating feedback:', error);
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
					<Typography variant="h6">User Information</Typography>
					<Typography variant="body1">Username: {user.username}</Typography>
					<Typography variant="body1">Name: {user.name}</Typography>
					<Typography variant="body1">Email: {user.email}</Typography>
					<Typography variant="body1">Course: {user.course}</Typography>
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
				<Grid item xs>
					<Container className="container">
						<Typography variant="h4" gutterBottom>
							Users with Eligible Courses Accepted
						</Typography>
						<List>
							{acceptedApplications.map((user, index) => (
								<ListItem key={index} className="border p-3 mb-3">
									<ListItem key={user.id} className="border p-3 mb-3">
										<ListItemText
											primary={`Name: ${user.name} (${user.username})`}
											secondary={`Email: ${user.email} | Course: ${user.course}`}
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
