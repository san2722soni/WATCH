import connectDb from "@/middleware/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";
const { v4: uuidv4 } = require("uuid");
import { identicon } from "@dicebear/collection";

export default async function handler(req, res) {
	try {
		const { name, email, password } = req.body;
		const hashedPassword = await bcrypt.hash(password, 10);
		const randomSeed = uuidv4();

		await connectDb();
		await User.create({
			name,
			email,
			password: hashedPassword,
			profilePic: { style: identicon, randomSeed: randomSeed },
		});

		res.status(201).json({ message: "user registered" });
	} catch (error) {
		res.status(500).json({
			message: "an occured while registering the user.",
		});
	}
}
