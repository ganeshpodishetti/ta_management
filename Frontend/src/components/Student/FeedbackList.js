import {
	Container,
	Typography,
	Box,
	Grid,
	Chip,
	Rating,
	Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { LeftMenu } from "./Utils";
import axios from "axios";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";

const FeedbackList = ({ setUser, user }) => {
	const [feedbacks, setFeedbacks] = useState([]);
	const [open, setOpen] = useState(-1);

	useEffect(() => {
		const fetchAllFeedbacks = async () => {
			try {
				const response = await axios.get(`/api/getFeedbacks/${user.username}`);

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
	}, [user]);

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
							All Feedbacks
						</Typography>
						{feedbacks.length === 0 ? (
							<Typography className="mt-4" style={{ fontFamily: "Poppins" }}>
								No Feedbacks Yet
							</Typography>
						) : (
							<Box>
								{feedbacks.map((feedback, index) => (
									<Box
										key={index}
										className="my-4 shadow p-3 rounded"
										style={{ backgroundColor: "white" }}
									>
										<Box className="d-flex align-items-center justify-content-between">
											<Typography
												variant="body1"
												gutterBottom
												style={{ fontFamily: "Poppins" }}
												className="me-5"
											>
												{feedback.username}
											</Typography>
											<Typography
												variant="body1"
												gutterBottom
												style={{ fontFamily: "Poppins" }}
												className="fw-bold me-5"
											>
												{feedback.name}
											</Typography>
											<Typography
												variant="subtitle2"
												gutterBottom
												style={{ fontFamily: "Poppins" }}
												className="fw-bold"
											>
												{feedback.email}
											</Typography>
											<Button
												variant="text"
												color="primary"
												onClick={() =>
													open === index ? setOpen(-1) : setOpen(index)
												}
											>
												{open === index ? <ArrowDropUp /> : <ArrowDropDown />}
											</Button>
										</Box>
										{open === index && (
											<Box>
												<Chip
													label={feedback.course}
													style={{ fontFamily: "Poppins" }}
													className="me-3 my-2"
													color="primary"
												/>
												<Box>
													<Rating
														name="rating"
														value={feedback.rating}
														readOnly
														className="my-2"
													/>
												</Box>
												<Typography
													variant="body1"
													gutterBottom
													style={{ fontFamily: "Poppins" }}
													className="border p-2 mt-2"
												>
													{feedback.feedback}
												</Typography>
											</Box>
										)}
									</Box>
								))}
							</Box>
						)}
					</Container>
				</Grid>
			</Grid>
		</Box>
	);
};

export default FeedbackList;
