import React, { useEffect, useState } from "react";
import {
	Typography,
	TextField,
	Button,
	Container,
	Grid,
	Box,
	List,
	ListItem,
	ListItemText,
} from "@mui/material";
import { LeftMenu } from "./Utils";
import axios from "axios";

const InputCourse = ({ setUser }) => {
	const [courseName, setCourseName] = useState("");
	const [availableCourses, setAvailableCourses] = useState([]);

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

		// Call the function to fetch course names when the component mounts
		fetchCourseNames();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post("/api/add-course", {
				courseName,
			});

			if (response.status === 201) {
				alert("Course added successfully");
        const newAvailableCourses = [...availableCourses, courseName];
        setAvailableCourses(newAvailableCourses);
        setCourseName("");
			}
		} catch (err) {
			alert("Failed to add the course");
			console.error("Error adding course:", err);
		}
		console.log(`Submitted course name: ${courseName}`);
	};

	return (
		<Box className="">
			<Grid container>
				<LeftMenu setUser={setUser} />
				<Grid item xs className="mx-5 pt-5">
					<Typography variant="h4" gutterBottom>
						Course Requirements
					</Typography>
					<form onSubmit={handleSubmit}>
						<Container className="mb-3">
							<TextField
								label="Course Name"
								variant="outlined"
								fullWidth
								value={courseName}
								onChange={(e) => setCourseName(e.target.value)}
							/>
						</Container>
						<Box className="d-flex justify-content-center">
							<Button variant="contained" color="primary" type="submit">
								Submit
							</Button>
						</Box>
					</form>
					{availableCourses.length !== 0 && (
						<Box className="container mt-4">
							<Typography variant="h4" gutterBottom>
								Course Names
							</Typography>
							<List>
								{availableCourses?.map((courseName, index) => (
									<ListItem key={index}>
										<ListItemText primary={courseName} />
									</ListItem>
								))}
							</List>
						</Box>
					)}
				</Grid>
			</Grid>
		</Box>
	);
};

export default InputCourse;
