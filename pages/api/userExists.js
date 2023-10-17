import connectDb from "@/middleware/mongoose";
import User from "@/models/User";

export default async function handler(req, res) {
	try {
		await connectDb();
		const { email } = req.body;
		const user = await User.findOne({ email }).select("_id");
		res.json({ user });
		console.log("user: ", user);
	} catch (error) {
		console.log(error);
	}
}
