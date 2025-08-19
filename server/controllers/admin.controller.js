import { TryCatch } from '../middlewares/error.js';
import { Chat } from '../models/chat.js';
import { User } from '../models/user.js';
import { Message } from '../models/message.js';
import { ErrorHandler } from '../utils/utitlity.js';
import jwt from 'jsonwebtoken';

const getAllUsers = TryCatch(async (req, res, next) => {
    const users = await User.find({});

    const transformedUsers = await Promise.all(
        users.map(async ({ name, avatar, _id, username }) => {
            const [groups, friends] = await Promise.all([
                Chat.countDocuments({ groupChat: true, members: _id }),
                Chat.countDocuments({ groupChat: false, members: _id })
            ]);

            return {
                name,
                avatar: avatar.url,
                _id,
                username,
                groups,
                friends
            }
        })
    )

    return res.status(200).json({
        success: true,
        users: transformedUsers
    })
});

const getAllChats = TryCatch(async (req, res, next) => {
    const chats = await Chat.find({})
        .populate("members", "name avatar")
        .populate("creator", "name avatar");

    const transformedChats = await Promise.all(
        chats.map(async ({ members, _id, groupChat, name, creator }) => {

            const totalMessages = await Message.countDocuments({ chat: _id });
            return {
                _id,
                groupChat,
                name,
                avatar: members.slice(0, 3).map(member => member.avatar.url),
                members: members.map(({ _id, name, avatar }) => ({
                    _id,
                    name,
                    avatar: avatar.url
                })),
                creator: {
                    name: creator?.name || "None",
                    avatar: creator?.avatar?.url || "",
                },
                totalMembers: members.length,
                totalMessages
            }
        })
    )

    return res.status(200).json({
        success: true,
        chats: transformedChats
    })
});


const getAllMessages = TryCatch(async (req, res, next) => {
    const messages = await Message.find({})
        .populate("sender", "name avatar")
        .populate("chat", "groupChat");

    const transformedMessages = messages.map(({ content, attachments, _id, sender, createdAt, Chat }) => (
        {
            _id,
            attachments,
            content,
            createdAt,
            chat: Chat._id,
            groupChat: Chat.groupChat,
            sender: {
                _id: sender._id,
                name: sender.name,
                avatar: sender.avatar.url,
            },
        })
    );

    return res.status(200).json({
        success: true,
        messages: transformedMessages
    })
});

// Function to get dashboard statistics
const getDashboardStats = TryCatch(async (req, res, next) => {
    const [groupChatCount, usersCount, messagesCount, totalChatsCount] = await Promise.all([
        Chat.countDocuments({ groupChat: true }),
        Chat.countDocuments(),
        Message.countDocuments(),
        User.countDocuments()
    ]);

    // Get messages for the last 7 days
    // Assuming Message has a createdAt field that stores the timestamp of when the message was created
    const today = new Date();
    const last7days = new Date();
    last7days.setDate(today.getDate() - 7);

    // Fetch messages created in the last 7 days
    const recentMessagesCount = await Message.find({
        createdAt: { 
            $gte: last7days,
            $lte: today
         }
    }).select("createdAt");

    const messages = new Array(7).fill(0);
    const daysInMillisec = 1000 * 60 * 60 * 24;

    // Count messages for each of the last 7 days
    recentMessagesCount.forEach((message) => {
        // Calculate the index for the last 7 days
        // 0 for today, 1 for yesterday, ..., 6 for 6 days ago
       // Skip if createdAt is not defined
        const index = Math.floor((today.getTime() - message.createdAt.getTime()) / daysInMillisec);

        // Ensure index is within bounds
        messages[6 - index]++;
    });


    const stats = {
        groupChatCount,
        usersCount,
        messagesCount,
        totalChatsCount,
        messages: messages
    };



    return res.status(200).json({
        success: true,
        messages: stats
    })
});


const getAdminData = TryCatch(async (req, res, next) => {
    return res.status(200).json({
        admin: true,
        message: "Welcome to the admin dashboard Mr.Ataurrab . You have access to all the data."
    })
});



const adminLogin = TryCatch(async (req, res, next) => {
    const {secKey} = req.body;

    console.log(secKey);
    
    const adminSeckey = process.env.ADMIN_SECRET_KEY || "rchat@admin";

    const isMatched = secKey === adminSeckey;

    if(!isMatched) return next(new ErrorHandler("Invalid admin secret key", 401));

    const token = jwt.sign(secKey, process.env.JWT_TOKEN_SECRET);

    return res.status(200).cookie("Admin-Prab", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
        sameSite: "none",
        httpOnly: true,
        secure: true
    }).json({
        success: true,
        message: "Admin logged in successfully. Welcome Boss!",
    });
});

const adminLogout = TryCatch((req, res, next) => {
    return res.status(200).cookie("Admin-Prab", "", {
        maxAge: 0,
        sameSite: "none",                      
        httpOnly: true,
        secure: true
    }).json({
        success: true,
        message: "Admin logged out successfully.",
    });
});
// Exporting the functions
export { 
    getAllUsers, 
    getAllChats, 
    getAllMessages, 
    getDashboardStats, 
    adminLogin,
    adminLogout,
    getAdminData
};