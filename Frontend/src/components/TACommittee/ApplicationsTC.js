import React, { useEffect } from "react";
import { useState } from "react";
import {
	Button,
	Container,
	Typography,
	Paper,
	Chip,
	TableRow,
	TableCell,
	TableBody,
	TableHead,
	Table,
	TableContainer,
	Box,
	Grid,
	CircularProgress,
} from "@mui/material";
import axios from "axios";
import { LeftMenu } from "./Utils";

const ApplicationsTC = ({ setUser }) => {
	const [applications, setApplications] = useState([]);
	const [loading, setLoading] = useState(true);

	const fillApplications = (apps) => {
		const newApplications = [];
		apps.forEach((app) => {
			app.eligibleCourses.forEach((course, index) => {
				if (app.status[index] === "In Review") {
					newApplications.push({
						...app,
						DSCourses: [course],
						index,
					});
				}
			});
		});

		setApplications(newApplications);
	};

	const handleApprove = async (id, index, i) => {
		try {
			const response = await axios.post("/api/updateStatus", {
				applicantId: id,
				index,
				newStatus: "Approved",
			});

			if (response.status === 200) {
				alert("Status updated successfully");
				const newApplications = [...applications];
				newApplications[i].status = "Approved";
				setApplications(newApplications);
			}
		} catch (err) {
			alert("Failed to update status");
			console.error("Error updating status:", err);
		}
	};

	useEffect(() => {
		const fetchApplicants = async () => {
			try {
				const response = await axios.get("/api/getApplicants");
				fillApplications(response.data);
				setLoading(false);
			} catch (error) {
				console.error("There was an error fetching the applicants:", error);
			}
		};

		fetchApplicants();
	}, []);

	return (
		<Box>
			<Grid container>
				<LeftMenu setUser={setUser} />
				<Grid item xs className="px-4" style={{ overflow: "auto" }}>
					<Typography variant="h4" className="fw-bold my-4">
						Welcome, TA Committee Member
					</Typography>
					{loading ? (
						<Container>
							<CircularProgress />
						</Container>
					) : (
						<Box>
							<Typography variant="h6" className="my-4 ms-3">
								{
									applications.filter((application) =>
										application.status.includes("In Review")
									).length
								}{" "}
								Applications
							</Typography>
							<Box
								className="px-2"
								style={{ height: "75vh", overflow: "auto" }}
							>
								<TableContainer component={Paper} className="shadow">
									<Table aria-label="simple table">
										<TableHead>
											<TableRow>
												<TableCell>Name</TableCell>
												<TableCell align="right">Email</TableCell>
												<TableCell align="right">Selected Courses</TableCell>
												<TableCell align="right">Previous Courses</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{applications
												.filter((application) =>
													application.status.includes("In Review")
												)
												.map((application, index) => (
													<TableRow key={index}>
														<TableCell component="th" scope="row">
															{application.name}
														</TableCell>
														<TableCell align="right">
															{application.email}
														</TableCell>
														<TableCell align="right">
															{application.DSCourses.map((course, index) => {
																return (
																	<Chip
																		label={course}
																		className="m-1"
																		key={index}
																	/>
																);
															})}
														</TableCell>
														<TableCell align="right">
															{application.previousTACourses.map(
																(course, index) => {
																	return (
																		<Chip
																			label={course}
																			className="m-1"
																			key={index}
																		/>
																	);
																}
															)}
														</TableCell>
														<TableCell>
															<Button
																variant="contained"
																color="success"
																onClick={() =>
																	handleApprove(
																		application.id,
																		application.index,
																		index
																	)
																}
															>
																Approve
															</Button>
														</TableCell>
													</TableRow>
												))}
										</TableBody>
									</Table>
								</TableContainer>
							</Box>
						</Box>
					)}
				</Grid>
			</Grid>
		</Box>
	);
};

export default ApplicationsTC;
