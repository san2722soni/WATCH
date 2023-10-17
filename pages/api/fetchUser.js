import connectDb from "@/middleware/mongoose";
import User from "@/models/User";

export default async function handler(req, res) {
	const { email } = req.body;
	await connectDb();
	const user = await User.findOne({ email: email });
	res.status(201).json(user);
}
