import React, { useEffect, useState } from "react";
import {
	TextField,
	Button,
	Box,
	MenuItem,
	InputLabel,
	FormControl,
	Select,
	Typography,
	Grid,
	Container,
	Checkbox,
} from "@mui/material";
import axios from "axios";
import { LeftMenu } from "./Utils";
import { allPreviousCourses } from "./Variables";

const ApplicationForm = ({ setUser, user }) => {
	const [preCourse, setPreCourse] = useState(false);
	const [availableCourses, setAvailableCourses] = useState([]);
	const [formData, setFormData] = useState({
		username: user.username,
		name: "",
		email: "",
		phoneNumber: "",
		joiningDate: "",
		previousCourses: [],
		eligibleCourses: [],
		resume: null,
	});

	useEffect(() => {
		const fetchCourseNames = async () => {
			try {
				const response = await axios.get("/api/get-all-courses");

				if (response.status === 200) {
					setAvailableCourses(response.data.courseNames);
				}
			} catch (err) {
				console.error("Error fetching courses:", err);
			}
		};

		fetchCourseNames();
	}, []);

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleMultiSelectChange = (event) => {
		setFormData({
			...formData,
			[event.target.name]: event.target.value,
		});
	};

	const handleFileChange = (event) => {
		setFormData((prevState) => ({
			...prevState,
			resume: event.target.files[0],
		}));
	};

	function validateForm() {
		if (!formData.name) {
			return "Name is required";
		}

		if (!formData.email) {
			return "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			return "Invalid email address";
		}

		if (!formData.phoneNumber) {
			return "Phone number is required";
		} else if (!/^\d{10}$/.test(formData.phoneNumber)) {
			return "Invalid phone number format";
		}

		if (!formData.joiningDate) {
			return "Joining date is required";
		}

		if (formData.eligibleCourses.length === 0) {
			return "Eligible courses are required";
		}

		if (!formData.resume) {
			return "Resume is required";
		}

		return "";
	}

	const handleSubmit = async (event) => {
		event.preventDefault();

		const errorMsg = validateForm();
		if (errorMsg !== "") {
			alert(errorMsg);
			return;
		}

		const data = new FormData();
		data.append("username", formData.username);
		data.append("name", formData.name);
		data.append("email", formData.email);
		data.append("phoneNumber", formData.phoneNumber);
		data.append("joiningDate", formData.joiningDate);
		data.append("previousCourses", JSON.stringify(formData.previousCourses));
		data.append("eligibleCourses", JSON.stringify(formData.eligibleCourses));
		if (formData.resume) {
			data.append("resume", formData.resume);
		}

		try {
			const response = await axios({
				method: "post",
				url: "/api/submitApplication",
				data: data,
				headers: { "Content-Type": "multipart/form-data" },
			});

			console.log(response.data);
			alert(response.data.message);
			setFormData({
				username: user.username,
				name: "",
				email: "",
				phoneNumber: "",
				joiningDate: "",
				previousCourses: [],
				eligibleCourses: [],
				resume: null,
			});
		} catch (error) {
			console.error("Error submitting form:", error);
		}
	};

	return (
		<Box>
			<Grid container>
				<LeftMenu setUser={setUser} />
				<Grid item xs>
					<Container className="container">
						<Typography variant="h4" className="fw-bold my-3">
							Welcome, Student
						</Typography>
						<Typography variant="h6" className="fw-bold my-3">
							Application Form
						</Typography>
						<form onSubmit={handleSubmit}>
							<Grid container>
								{/* Username */}
								<Grid item xs={5}>
									<TextField
										label="Username"
										variant="outlined"
										name="username"
										value={formData.username}
										className="mb-3 me-3"
										style={{ width: "100%" }}
										disabled
									/>
								</Grid>
								{/* Name */}
								<Grid item xs={5}>
									<TextField
										label="Name"
										variant="outlined"
										name="name"
										value={formData.name}
										onChange={handleChange}
										className="mb-3 ms-3"
										style={{ width: "100%" }}
									/>
								</Grid>
								{/* Email */}
								<Grid item xs={5}>
									<TextField
										label="Email"
										variant="outlined"
										name="email"
										value={formData.email}
										onChange={handleChange}
										className="mb-3 me-3"
										style={{ width: "100%" }}
									/>
								</Grid>
								{/* Phone Number */}
								<Grid item xs={5}>
									<TextField
										label="Phone Number"
										variant="outlined"
										name="phoneNumber"
										value={formData.phoneNumber}
										onChange={handleChange}
										className="mb-3 ms-3"
										style={{ width: "100%" }}
									/>
								</Grid>
								{/* Joining Date */}
								<Grid item xs={5}>
									<TextField
										label="Joining Date"
										variant="outlined"
										name="joiningDate"
										type="date"
										value={formData.joiningDate}
										onChange={handleChange}
										className="mb-3 me-3"
										InputLabelProps={{ shrink: true }}
										style={{ width: "100%" }}
									/>
								</Grid>
								{/* Previous Courses */}
								<Grid item xs={8} className="d-flex align-items-center">
									<Checkbox
										checked={preCourse}
										onChange={() => setPreCourse(!preCourse)}
										inputProps={{ "aria-label": "controlled" }}
									/>
									<Typography variant="body1">Previous Course</Typography>
								</Grid>
								{preCourse && (
									<Grid item xs={8}>
										<FormControl className="mb-3" fullWidth>
											<InputLabel>Previous Courses</InputLabel>
											<Select
												label="Previous Courses"
												multiple
												name="previousCourses"
												value={formData.previousCourses}
												onChange={handleMultiSelectChange}
												renderValue={(selected) => selected.join(", ")}
											>
												{allPreviousCourses?.map((course) => (
													<MenuItem key={course} value={course}>
														{course}
													</MenuItem>
												))}
											</Select>
										</FormControl>
									</Grid>
								)}
								{/* Eligible Courses */}
								<Grid item xs={8}>
									<FormControl className="mb-3" fullWidth>
										<InputLabel>Eligible Courses</InputLabel>
										<Select
											label="Eligible Courses"
											multiple
											name="eligibleCourses"
											value={formData.eligibleCourses}
											onChange={handleMultiSelectChange}
											renderValue={(selected) => selected.join(", ")}
										>
											{availableCourses.map((course) => (
												<MenuItem key={course} value={course}>
													{course}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>
								{/* Resume */}
								<Grid item xs={8}>
									<input
										type="file"
										name="resume"
										onChange={handleFileChange}
										className="mb-3"
										accept=".pdf"
									/>
								</Grid>
							</Grid>
							<Button type="submit" variant="contained" color="primary">
								Submit
							</Button>
						</form>
					</Container>
				</Grid>
			</Grid>
		</Box>
	);
};

export default ApplicationForm;
