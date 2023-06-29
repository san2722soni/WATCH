import connectDb from "@/middleware/mongoose";
import User from "@/models/User";
const CryptoJS = require('crypto-js')

let handler = async (req, res) => {
    if (req.method == 'POST'){
        const {name, email, password} = req.body;
        const user = new User({name, email, password: CryptoJS.AES.encrypt(password, "watch").toString()});
        await user.save();
        res.status(200).json({success: 'success'})
    }
    else{
        res.status(400).json({error: 'This method is not allowed!'})
    }

       
}

export default connectDb(handler)
