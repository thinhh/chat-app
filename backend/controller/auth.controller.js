import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../util/generateToken.js";
import bcryptjs from "bcryptjs";
import cloudinary from "../util/cloudinary.js";
export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		const isPasswordCorrect = await bcryptjs.compare(password, user?.password || "");

		if (!user || !isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid username or password" });
		}

		generateTokenAndSetCookie(user._id, res);

		res.status(200).json({
			_id: user._id,
			fullName: user.fullName,
			email: user.email,
			profilePic: user.profilePic,
		});
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const logout = async (req,res) =>{
    try {
      res.cookie('jwt', '', {maxAge: 0})
      res.status(200).json({message: "Logout successfully"})
    } catch (error) {
      console.log("Error in logout controller", error.message);
          res.status(500).json({error: 'Internal Server Error'})
    }
  };
export const signup = async (req, res) => {
  try {
    const {fullName, email, password} = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    const user = await User.findOne({email});
    if(user) {
        return res.status(400).json({error: "Email already existed"})
    }
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt)
    
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if(newUser) {
        generateTokenAndSetCookie(newUser._id, res)
        await newUser.save();
        res.status(201).json({
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          profilePic: newUser.profilePic,
        });
    }
    else{
        res.status(400).json({error: "Invalid User Data"})
    }
   
  } catch (error) {
    console.log(error.message);
    res.status(500).json({error: "Internal Server Error"})
  }
};

export const updateProfile = async(req, res) => {
  try {
    const {profilePic} = req.body;
    const userId = req.user._id;
   if(!profilePic) {
     return res.status(400).json({ message : "Profile Picture is required" })
   }
   const uploadResponse = await cloudinary.uploader.upload(profilePic);
   const updatedUser = await User.findByIdAndUpdate(
                                                    userId, 
                                                    { profilePic : uploadResponse.secure_url },
                                                    { new: true });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in updateProfile", error.message);
    res.status(500).json({error: "Internal Server Error"});
  }
};
export const checkAuth = async(req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("error in checkAuth", error.message)
    res.status(500).json({error: "Internal Server Error"});
  }
}