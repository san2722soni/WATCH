import connectDb from "@/middleware/mongoose";
import User from "@/models/User";
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

const handler = async (req, res) => {
    if(req.method == 'POST'){
        const user = await User.findOne({"email": req.body.email})
        const pass = await CryptoJS.AES.decrypt(user.password, "watch");
        const decryptedPass = pass.toString(CryptoJS.enc.Utf8);

        if (user){
            if (req.body.email == user.email && req.body.password == decryptedPass){

                let token = jwt.sign({email: req.body.email, name: req.body.email}, 'watch');
                res.status(200).json({success: true, token});
            }
            else{
                res.status(200).json({success: false, error: "Invalid credentials"})
            }
        }
        else{
            res.status(404).json({success: false, error: "User not found!"});
        }
    }
    else{
        res.status(400).json("This message is not allowed")
    }
}

export default connectDb(handler)