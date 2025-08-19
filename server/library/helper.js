export const getOtherMember = (members, userId) => 
    members.find((member) => member._id.toString() !== userId.toString());

export const getSocketUserId = (users=[]) =>
    users.map(user => userSocketIDs.get(user._id.toString())); 


export const getBase64 = (file) => 
    `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;