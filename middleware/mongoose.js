const mongoose = require("mongoose");

// Connecting to DB
const connectDb = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("Connected to mongodb");
	} catch (error) {
		console.log("Error connecting to mongodb");
		console.error(error);
	}
};

module.exports = connectDb;
