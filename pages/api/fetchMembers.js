import connectDb from "@/middleware/mongoose";
import User from "@/models/User";

export default async function handler(req, res) {
	const { roomID } = req.body;
	await connectDb();
	const users = await User.find({
		currentRoom: { $exists: true, $ne: null, $eq: roomID },
	});
	res.status(201).json(users);
}
