import React, { useEffect, useState } from "react";
import axios from "axios";
import {
	Alert,
	Badge,
	Box,
	Button,
	Chip,
	CircularProgress,
	Container,
	Grid,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import { LeftMenu } from "./Utils";
import { Notifications } from "@mui/icons-material";
import "../../styles/ApplicationList.css";

const ApplicationList = ({ setUser, user }) => {
	const [applications, setApplications] = useState([]);
	const [notifOpen, setNotifOpen] = useState(false);
	const [notifs, setNotifs] = useState([]);
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
				const response2 = await axios.get(
					`/api/notifications/${user.username}`
				);
				if (response2.status === 200) {
					setNotifs(response2.data);
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
				return "warning";
			case "In Review":
				return "info";
			case "Accepted":
				return "success";
			case "Approved":
				return "secondary";
			case "Rejected":
				return "error";
			default:
				return "secondary";
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

	const handleNotifClose = async (id) => {
		const resp = await axios.delete(`/api/notifications/${id}`);
		if (resp.status === 200) {
			const newNotifs = notifs.filter((notif) => notif.id !== id);
			setNotifs(newNotifs);
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
							<Box className="text-center">
								<CircularProgress />
							</Box>
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
						<Box className="notifContainer">
							<Badge badgeContent={1} color="primary">
								<Notifications
									onClick={() => {setNotifOpen(!notifOpen)}}
									color="primary"
									className="fs-2"
									style={{ cursor: "pointer" }}
								/>
							</Badge>
							{notifOpen && notifs?.map((notif, index) => (
								<Alert
									key={index}
									severity={"info"}
									className="mt-2 notifAlert"
									style={{ fontFamily: "Poppins" }}
									onClose={() => handleNotifClose(notif.id)}
								>
									{notif.message}
								</Alert>
							))}
						</Box>
						<Typography
							variant="h4"
							gutterBottom
							className="fw-bold"
							style={{ fontFamily: "Poppins" }}
						>
							Applications
						</Typography>
						<Box>
							{applications.length === 0 ? (
								<Typography>No Applications Yet</Typography>
							) : (
								<TableContainer component={Paper} className="mb-4">
									<Table>
										<TableHead>
											<TableRow>
												<TableCell>
													<Typography
														variant="h6"
														style={{ fontFamily: "Poppins" }}
														className="fw-bold"
													>
														Course
													</Typography>
												</TableCell>
												<TableCell>
													<Typography
														variant="h6"
														style={{ fontFamily: "Poppins" }}
														className="fw-bold"
													>
														Status
													</Typography>
												</TableCell>
												<TableCell>
													<Typography
														variant="h6"
														style={{ fontFamily: "Poppins" }}
														className="fw-bold"
													>
														Action
													</Typography>
												</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{applications.map((application, index) => (
												<TableRow key={index}>
													<TableCell>
														<Typography
															variant="button"
															style={{ fontFamily: "Poppins" }}
															className="fs-6"
														>
															{application.course}
														</Typography>
													</TableCell>
													<TableCell>
														<Chip
															label={application.status.toUpperCase()}
															className="text-white fw-bold"
															color={`${getStatusBGColor(application.status)}`}
														/>
													</TableCell>
													<TableCell>
														{application.status === "Approved" && (
															<Button
																variant="contained"
																color="success"
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
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</TableContainer>
							)}
						</Box>
					</Container>
				</Grid>
			</Grid>
		</Box>
	);
};

export default ApplicationList;
