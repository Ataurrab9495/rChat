import { Stack } from '@mui/material'
import React from 'react'
import ChatItem from '../shared/ChatItem'

const ChatList = ({
    w = "100%",
    chats = [],
    chatId,
    onlineUsers = [],
    newMessagesAlert = [
        {
            chatId: "",
            count: 0
        }
    ],
    handleDeleteChat,
}) => {
  return (
    <Stack width={w} direction={"column"} overflow={"auto"} height={"100%"}>
        {chats?.map((data, idx) => {
            const {avatar, _id, name, groupChat, members} = data;

            const newMessageAlert = newMessagesAlert.find(
                ({chatId }) => chatId === _id
            )
            return <ChatItem 
                key={idx}
                _id={_id}
                name={name}
                avatar={avatar}
                newMessageAlert={newMessageAlert}
            />
        })}
    </Stack>
  )
}

export default ChatList