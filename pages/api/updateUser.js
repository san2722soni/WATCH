import connectDb from "@/middleware/mongoose";
import User from "@/models/User";

export default async function handler(req, res) {
	try {
		await connectDb();
		const { user } = req.body;
		await User.updateOne({ email: user.email }, { $set: user });
		res.status(201).json({ message: "user updated successfully." });
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: "failed to update the user." });
	}
}
