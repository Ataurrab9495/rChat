import { compare } from "bcrypt";
import { User } from "../models/user.js";
import { Request } from "../models/request.js";
import { emitEvent, sendToken, uploadingFilesToCloudinary } from "../utils/features.js";
import { TryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utitlity.js";
import { NEW_FRIEND_REQUEST, REFETCH_CHATS } from "../constants/events.js";
import { getOtherMember } from "../library/helper.js";
import { Chat } from "../models/chat.js";

// This function is used to create a new user
// It takes the user details from the request body and creates a new user in the database
const newUser = TryCatch(async (req, res) => {
    const { name, username, password, bio } = req.body;
    const file = req.file;

    if(!file) return next(new ErrorHandler("Please provide your profile picture.", 400));

    const result = await uploadingFilesToCloudinary([file]);

    const avatar = {
        public_id: result[0].public_id,
        url: result[0].url,
    };

    const user = await User.create({
        name,
        username,
        password,
        bio,
        avatar,
    });

    sendToken(res, user, 201, "User Created Successfully");
});


// This function is used to login the user
const login = TryCatch(async (req, res, next) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username }).select("+password");
    if (!user) return next(new ErrorHandler("Invalid Credentials....", 404));


    const isPassMatch = await compare(password, user.password);
    if (!isPassMatch) return next(new ErrorHandler("Invalid crediantial hai Baccha...", 404));

    sendToken(res, user, 200, `Welcome back ${username}`)
});


// This function is used to get the profile of the logged-in user
const getMyProfile = TryCatch(async (req, res) => {
    const user = await User.findById(req.user);

    res.status(200).json({
        success: true,
        user
    })
});


// This function is used to logout the user by clearing the cookie
const logoutUser = (req, res) => {
    res.status(200).cookie("meri-pratyaksha", "", {
        maxAge: 0,
        sameSite: "none",
        httpOnly: true,
        secure: true
    }).json({
        success: true,
        message: "user logged out successfully."
    });
};


// This function is used to search for users except the ones I have chatted with
const searchUser = TryCatch(async (req, res, next) => {
    const { name = "" } = req.query;

    // Finding all my chats
    const myChats = await Chat.find({ groupChat: false, members: req.user });

    // All users from my chats means friends or people I have chatted with
    const allUsersFromMyChats = myChats.flatMap(chat => chat.members);

    // Finding all users except me and my friends
    const allUsersExceptMeAndFriends = await User.find({
        _id: { $nin: allUsersFromMyChats },
        name: { $regex: name, $options: "i" } // case-insensitive search
    });

    //Modifying the response to include only necessary fields
    const users = allUsersExceptMeAndFriends.map(({ _id, name, avatar }) => ({
        _id, name,
        avatar: avatar.url
    }));

    return res.status(200).json({
        success: true,
        users
    });
});



// This function is used to send a friend request to another user
const sendFriendRequest = TryCatch(async (req, res, next) => {
    const { userId } = req.body;

    const request = await Request.findOne({
        $or: [
            { sender: req.user, receiver: userId },
            { sender: userId, receiver: req.user }
        ]
    })

    if (request) return next(new ErrorHandler("Friend request already sent.", 400));

    await Request.create({
        sender: req.user,
        receiver: userId
    })

    emitEvent(req, NEW_FRIEND_REQUEST, [userId]);

    return res.status(200).json({
        success: true,
        message: "Friend request sent successfully."
    });
});


const acceptFriendRequest = TryCatch(async (req, res, next) => {
    const { requestId, accept } = req.body;

    const request = await Request.findById(requestId)
        .populate("sender", "name")
        .populate("receiver", "name");

        console.log(request);
        

    if (!request) return next(new ErrorHandler("Friend request not found.", 404));

    if (String(request.receiver._id) !== String(req.user)) {
        return next(new ErrorHandler("You are not authorized to accept this request.", 403));
    };

    if (!accept) {
        await request.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Friend request rejected."
        })
    }

    const members = [request.sender._id, request.receiver._id];

    await Promise.all([
        Chat.create({
            members,
            name: `${request.sender.name} - ${request.receiver.name}`,
        }),
        request.deleteOne(),
    ]);

    emitEvent(req, REFETCH_CHATS, members);

    return res.status(200).json({
        success: true,
        message: "Friend request accepted successfully.",
        senderId: request.sender._id,
    });
});


const getNotifications = TryCatch(async (req, res) => {
    const requests = await Request.find({receiver: req.user}).populate("sender", "name avatar");

    const allRequests = requests.map(({_id, sender}) => ({
        _id,
        sender: {
            _id: sender._id,
            name: sender.name,
            avatar: sender.avatar.url
        }
    }));

    return res.status(200).json({
        success:true,
        requests: allRequests
    })
});


// This function is used to get the friends of the logged-in user
// It retrieves all chats where the user is a member and filters out group chats
// It then maps the members of each chat to get the other member's details
// If a chatId is provided, it filters out friends who are already in that chat
const getMyFriends = TryCatch(async (req, res, next) => {
    const chatId = req.query.chatId;

    const chats = await Chat.find({
        members: req.user,
        groupChat: false,
    }).populate("members", "name avatar");

    const friends = chats.map(({members}) => {
        const otherMember = getOtherMember(members, req.user);

        return {
            _id: otherMember._id,
            name: otherMember.name,
            avatar: otherMember.avatar.url
        }
    })

    if(chatId){
        const chat = await Chat.findById(chatId);

        const availableFriends = friends.filter(friend => !chat.members.includes(friends._id));

        return res.status(200).json({
            success: true,
            friends: availableFriends
        })
    }else{
        return res.status(200).json({
            success: true,
            friends
        });
    };
});




// Exporting all the functions to be used in the routes
export {
    login,
    newUser,
    getMyProfile,
    logoutUser,
    searchUser,
    sendFriendRequest,
    acceptFriendRequest,
    getNotifications,
    getMyFriends
};