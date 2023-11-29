const express = require("express");
const multer = require("multer");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const db = require("./db/connect");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './Frontend/build')));

const port = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

const uploadsDir = "./uploads";
fs.existsSync(uploadsDir) || fs.mkdirSync(uploadsDir, { recursive: true });

app.get("/api/getUser", async (req, res) => {
	try {
		const { token } = req.cookies;
		if (!token) {
			return res.status(401).send("Unauthorized");
		}
		const decoded = jwt.verify(token, JWT_SECRET);
		const uid = decoded.uid;

		const userRef = db.collection("users").doc(uid);
		const user = await userRef.get();
		if (!user.exists) {
			return res.status(404).send("User not found.");
		}

		res.status(200).send({
			username: user.data().username,
			role: user.data().role,
		});
	} catch (error) {
		console.error("Error fetching user:", error);
		res.status(500).send("Error fetching user");
	}
});

app.post("/api/signup", async (req, res) => {
	const { username, password, role } = req.body;
	console.log(req.body);

	const usersRef = db.collection("users");
	const snapshot = await usersRef.where("username", "==", username).get();
	if (!snapshot.empty) {
		return res.status(400).send("User already exists.");
	}

	const newUserRef = usersRef.doc();
	await newUserRef.set({ username, password, role });

	const token = jwt.sign({ uid: newUserRef.id }, JWT_SECRET, {
		expiresIn: "24h",
	});

	await newUserRef.update({ token });

	console.log("HERE");

	res.cookie("token", token, { httpOnly: true });
	res
		.status(201)
		.send({ username, role, message: "User created successfully." });
});

app.post("/api/login", async (req, res) => {
	const { username, password } = req.body;

	const usersRef = db.collection("users");
	const snapshot = await usersRef.where("username", "==", username).get();
	if (snapshot.empty) {
		return res.status(400).send("User not found.");
	}

	const user = snapshot.docs[0].data();
	if (user.password !== password) {
		return res.status(400).send("Invalid password.");
	}

	const token = jwt.sign({ uid: snapshot.docs[0].id }, JWT_SECRET, {
		expiresIn: "24h",
	});

	await snapshot.docs[0].ref.update({ token });

	res.cookie("token", token, { httpOnly: true });
	res
		.status(200)
		.send({ username, role: user.role, message: "Login successful." });
});

app.post("/api/logout", async (req, res) => {
	const { token } = req.cookies;
	const decoded = jwt.verify(token, JWT_SECRET);
	const uid = decoded.uid;

	const userRef = db.collection("users").doc(uid);
	await userRef.update({ token: "" });

	res.clearCookie("token");
	res.status(200).send("Logout successful.");
});

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, uploadsDir); // Use the uploadsDir variable
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + "-" + file.originalname);
	},
});

const upload = multer({ storage: storage });

app.post(
	"/api/submitApplication",
	upload.single("resume"),
	async (req, res) => {
		try {
			const {
				username,
				name,
				email,
				phoneNumber,
				joiningDate,
				previousCourses,
				eligibleCourses,
			} = req.body;
			const resume = req.file ? req.file.path : null;

			const previousCoursesArray = JSON.parse(previousCourses);
			const eligibleCoursesArray = JSON.parse(eligibleCourses);

			const pendingArray = [];
			for (let i = 0; i < eligibleCoursesArray.length; i++) {
				pendingArray.push("Pending");
			}

			const docRef = db.collection("applicants").doc();
			await docRef.set({
				username,
				name,
				email,
				phoneNumber,
				joiningDate,
				eligibleCourses: eligibleCoursesArray,
				previousTACourses: previousCoursesArray,
				DSCourses: [],
				resume,
				status: pendingArray,
			});

			res.status(200).send({
				message: "Application submitted successfully",
				docId: docRef.id,
			});
		} catch (error) {
			console.error("Error submitting application:", error);
			res.status(500).send({ error: "Internal server error" });
		}
	}
);

// Route for getting all the applications
app.get("/api/getApplicants", async (req, res) => {
	try {
		const { user } = req.query;
		let applicantsSnapshot;
		if (user) {
			applicantsSnapshot = await db
				.collection("applicants")
				.where("username", "==", user)
				.get();
		} else {
			applicantsSnapshot = await db.collection("applicants").get();
		}
		const applicants = [];
		applicantsSnapshot.forEach((doc) => {
			applicants.push({ id: doc.id, ...doc.data() });
		});

		res.status(200).json(applicants);
	} catch (error) {
		console.error("Error fetching applicants:", error);
		res.status(500).send("Error fetching applicants");
	}
});

app.put("/api/updateApplicant/:id", async (req, res) => {
	const { id } = req.params;
	const updatedData = req.body;

	try {
		const applicantRef = db.collection("applicants").doc(id);
		await applicantRef.update(updatedData);
		res.status(200).send({ message: "Application updated successfully" });
	} catch (error) {
		console.error("Error updating application:", error);
		res.status(500).send({ message: "Failed to update application", error });
	}
});

// Route to update the status of an application
app.post("/api/updateStatus", async (req, res) => {
	try {
		const { applicantId, index, newStatus } = req.body;
		const applicationsRef = db.collection("applicants");
		const applicationSnapshot = await applicationsRef.doc(applicantId).get();

		if (!applicationSnapshot.exists) {
			return res.status(404).json({ error: "Application not found" });
		}

		const applicationData = applicationSnapshot.data();
		applicationData.status[index] = newStatus;

		await applicationsRef.doc(applicantId).set(applicationData);

		res.status(200).json({ message: "Status updated successfully" });
	} catch (error) {
		console.error("Error updating status:", error);
		res.status(500).json({ error: "Failed to update status" });
	}
});

// Route to get applications with "Accepted" status
app.get('/api/getAcceptedApplications', async (req, res) => {
  try {
    const applicationsSnapshot = await db
      .collection('applicants')
      .where('status', 'array-contains', 'Accepted')
      .get();

    const acceptedApplications = [];
    applicationsSnapshot.forEach((doc) => {
      acceptedApplications.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(acceptedApplications);
  } catch (error) {
    console.error('Error fetching accepted applications:', error);
    res.status(500).json({ error: 'Error fetching accepted applications' });
  }
});

// Route to add new course in the database
app.post("/api/add-course", async (req, res) => {
	try {
		const { courseName } = req.body;

		const courseRef = await db.collection("courses").add({
			courseName,
		});

		res
			.status(201)
			.json({ message: "Course added successfully", id: courseRef.id });
	} catch (error) {
		console.error("Error adding course:", error);
		res.status(500).json({ error: "Failed to add the course" });
	}
});

// Route to get all the available courses
app.get("/api/get-all-courses", async (req, res) => {
	try {
		const coursesSnapshot = await db.collection("courses").get();
		const courseNames = [];

		coursesSnapshot.forEach((doc) => {
			const courseData = doc.data();
			const courseName = courseData.courseName;
			courseNames.push(courseName);
		});

		res.status(200).json({ courseNames });
	} catch (error) {
		console.error("Error fetching courses:", error);
		res.status(500).json({ error: "Failed to fetch courses" });
	}
});

// Route to create feedback
app.post('/api/createFeedback', async (req, res) => {
  try {
    const { username, name, email, course, feedback } = req.body;

    const feedbackRef = await db.collection('Feedbacks').add({
      username,
      name,
      email,
      course,
      feedback,
    });

    res.status(201).json({ message: 'Feedback created successfully', id: feedbackRef.id });
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ error: 'Failed to create feedback' });
  }
});

// Route to get all feedbacks
app.get('/api/getAllFeedbacks', async (req, res) => {
  try {
    const feedbacksSnapshot = await db.collection('Feedbacks').get();

    const feedbacks = [];
    feedbacksSnapshot.forEach((doc) => {
      feedbacks.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
});

// Route for the frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './Frontend/build', 'index.html'));
});

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
