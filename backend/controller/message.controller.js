import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../util/cloudinary.js";
export const getUsersForSidebar = async(req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id : {ne: loggedInUserId}}).select("-password");
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in getUsersForSidebar", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};
export const getMessages= async(req, res) => {
    try {
        const {id: userToChat} = req.params;
        const myId = req.user._id;
        const messages = await Message.find({$or: [
                                                { senderId: myId, receiverId: userToChat },
                                                { senderId: userToChat, receiverId: myId},
                                            ]});
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in the getMessages message controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};
export const sendMessage= async (req, res) => {
   try {
        const {text, image} = req.body;
        const {id: userToChat} =  req.params;
        const senderId = req.user._id;
        let imageUrl;
        if(senderId == userToChat) {
            return res.status(400).json({error : "Unable to send message to yourself"});
        }
        if(image){
            const uploadResponse =  await cloudinary.uploader.upload(image)
            imageUrl= uploadResponse.secure_url;
        }
        const newMessage = await Message({
            senderId,
            receiverId: userToChat,
            text,
            image: imageUrl,
        });
        await newMessage.save()
        res.status(200).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage message controller", error.message);
        res.status(500).json({error: 'Internal Server Error'})
    }
}