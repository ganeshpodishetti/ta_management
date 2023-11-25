import React, { useEffect, useState } from "react";
import axios from "axios";
import {
	Box,
	Button,
	CircularProgress,
	Container,
	Grid,
	List,
	ListItem,
	Typography,
} from "@mui/material";
import { LeftMenu } from "./Utils";

const ApplicationList = ({ setUser, user }) => {
	const [applications, setApplications] = useState([]);
	const [loading, setLoading] = useState(true);

	const fillApplications = (apps) => {
		const newApps = [];
		apps.forEach((app) => {
			app.eligibleCourses.forEach((course, index) => {
				newApps.push({
					course,
					status: app.status[index],
					index,
					id: app.id,
				});
			});
		});

		setApplications(newApps);
	};

	useEffect(() => {
		const fetchApplications = async () => {
			try {
				const response = await axios.get(
					`/api/getApplicants?user=${user.username}`
				);
				if (response.status === 200) {
					fillApplications(response.data);
					setLoading(false);
				}
			} catch (error) {
				console.error("Error fetching applications:", error);
			}
		};

		fetchApplications();
	}, [user.username]);

	const getStatusBGColor = (status) => {
		switch (status) {
			case "Pending":
				return "bg-warning";
			case "In Review":
				return "bg-info";
			case "Accepted":
				return "bg-success";
			case "Approved":
				return "bg-primary";
			case "Rejected":
				return "bg-danger";
			default:
				return "bg-secondary";
		}
	};

	const handleAccept = async (id, index, i) => {
		try {
			const response = await axios.post("/api/updateStatus", {
				applicantId: id,
				index,
				newStatus: "Accepted",
			});

			if (response.status === 200) {
				alert("Status updated successfully");
				const newApplications = [...applications];
				newApplications[i].status = "Accepted";
				setApplications(newApplications);
			}
		} catch (err) {
			alert("Failed to update status");
			console.error("Error updating status:", err);
		}
	};

	if (loading) {
		return (
			<Box>
				<Grid container>
					<LeftMenu setUser={setUser} />
					<Grid item xs>
						<Container className="container mt-4">
							<Typography variant="h4" gutterBottom>
								Applications
							</Typography>
							<CircularProgress />
						</Container>
					</Grid>
				</Grid>
			</Box>
		);
	}

	return (
		<Box>
			<Grid container>
				<LeftMenu setUser={setUser} />
				<Grid item xs>
					<Container className="container mt-4">
						<Typography variant="h4" gutterBottom>
							Applications
						</Typography>
						<List>
							{applications.length === 0 ? (
								<Typography>No Applications Yet</Typography>
							) : (
								applications.map((application, index) => (
									<ListItem key={index} className="border">
										<Container className="d-flex justify-content-between align-items-center">
											<Typography className={`px-3`}>
												Course: {application.course}
											</Typography>
											<Box className="d-flex align-items-center">
												<Typography
													className={`fw-bold px-3 border ${getStatusBGColor(
														application.status
													)}`}
												>
													Status: {application.status}
												</Typography>
												{application.status === "Approved" && (
													<Button
														variant="contained"
														color="primary"
														onClick={() =>
															handleAccept(
																application.id,
																application.index,
																index
															)
														}
													>
														Accept
													</Button>
												)}
											</Box>
										</Container>
									</ListItem>
								))
							)}
						</List>
					</Container>
				</Grid>
			</Grid>
		</Box>
	);
};

export default ApplicationList;
