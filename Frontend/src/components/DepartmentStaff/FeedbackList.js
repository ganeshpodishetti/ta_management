import {
	Container,
	Typography,
	Box,
	Grid,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { LeftMenu } from "./Utils";
import axios from "axios";

const FeedbackList = ({ setUser }) => {
	const [feedbacks, setFeedbacks] = useState([]);

	useEffect(() => {
		const fetchAllFeedbacks = async () => {
			try {
				const response = await axios.get("/api/getAllFeedbacks");

				if (response.status === 200) {
					setFeedbacks(response.data);
					console.log("Fetched feedbacks:", response.data);
				} else {
					console.error("Error fetching feedbacks:", response.statusText);
				}
			} catch (error) {
				console.error("Error fetching feedbacks:", error);
			}
		};

		fetchAllFeedbacks();
	}, []);

	return (
		<Box>
			<Grid container>
				<LeftMenu setUser={setUser} />
				<Grid item xs>
					<Container className="container">
						<Typography variant="h4" gutterBottom>
							All Feedbacks
						</Typography>
						{feedbacks.length === 0 ? (
							<Typography className="mt-4">No Feedbacks Yet</Typography>
						) : (
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Username</TableCell>
										<TableCell>Name</TableCell>
										<TableCell>Email</TableCell>
										<TableCell>Course</TableCell>
										<TableCell>Feedback</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{feedbacks.map((feedback, index) => (
										<TableRow key={index}>
											<TableCell>{feedback.username}</TableCell>
											<TableCell>{feedback.name}</TableCell>
											<TableCell>{feedback.email}</TableCell>
											<TableCell>{feedback.course}</TableCell>
											<TableCell>{feedback.feedback}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						)}
					</Container>
				</Grid>
			</Grid>
		</Box>
	);
};

export default FeedbackList;
