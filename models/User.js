const mongoose = require("mongoose");

// User Schema
const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		currentRoom: {
			type: String,
			default: null,
		},
		profilePic: {
			type: Object,
		},
	},
	{
		timestamps: true,
	}
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

module.exports = User;
