import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    // generating a token
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn:"7d",
    }) 

    //sending the token via http cookie
    res.cookie("jwt_token",{
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, // prevent XSS attacks
        sameSite: "strict", // CSRF attacks cross-site forgery attacks
        secure: process.env.NODE_ENV !== "development"
    });

    return token;
}