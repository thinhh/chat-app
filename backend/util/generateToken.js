import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '40m'
    })
    res.cookie("jwt", token , {
        maxAge: 40*60*1000, 
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== 'development',
    });
}

export default generateTokenAndSetCookie;