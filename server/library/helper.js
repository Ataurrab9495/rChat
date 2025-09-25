import { userSocketIDs } from "../app.js";

export const getOtherMember = (members, userId) => 
    members.find((member) => member._id.toString() !== userId.toString());

export const getSocketUserId = (users=[]) =>{    
    const socket = users.map(user => userSocketIDs.get(user.toString())); 
    
    return socket;  // return array of socket IDs
}


export const getBase64 = (file) => 
    `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;