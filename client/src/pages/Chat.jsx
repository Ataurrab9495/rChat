import { AttachFile as AttachFileIcon, Send as SendIcon } from '@mui/icons-material';
import { IconButton, Skeleton, Stack } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import { NEW_MESSAGE } from '../constants/events';
import AppLayout from '../components/Layout/AppLayout';
import MessageComponent from '../components/shared/MessageComponent';
import { InputBox } from '../components/styles/styledComponents';
import { grayColor, orange } from '../constants/Color';
import { useChatDetailsQuery } from '../Redux/api/api';
import { getSocket } from '../Socket';
import { useSocketEventHandler } from '../hooks/hooks';


const Chat = ({ chatId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const containerRef = useRef(null);
  const socket = getSocket();
  const { user } = useSelector(state => state.auth);

  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  const members = chatDetails.data?.chat?.members;

  const messageSubmitHandler = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    console.log("Emitting message:", { chatId, members, message });
    
    // Sending message to the server
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };

  const newMessageHandler = useCallback((data) => {
    console.log("New message received:", data);
    
    if (data.chatId !== chatId) {
      console.log("Message not for current chat, ignoring");
      return;
    }
    
    setMessages((prev) => [...prev, data.message]);
  }, [chatId]);

  useEffect(() => {
    console.log("Setting up socket listeners");
    
    socket.on(NEW_MESSAGE, newMessageHandler);

    return () => {
      console.log("Cleaning up socket listeners");
      socket.off(NEW_MESSAGE, newMessageHandler);
    }
  }, [socket, newMessageHandler]);

  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
    <>
      <Stack
        ref={containerRef}
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        bgcolor={grayColor}
        height={"90%"}
        sx={{
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        {messages.map((i) => (
          <MessageComponent key={i._id} message={i} user={user} />
        ))}
      </Stack>
      <form
        style={{
          height: "10%",
        }}
        onSubmit={messageSubmitHandler}
      >
        <Stack
          direction={"row"}
          height={"100%"}
          padding={"1rem"}
          alignItems={"center"}
          position={"relative"}
        >
          <IconButton
            sx={{
              position: "absolute",
              left: "1.5rem",
              rotate: "30deg",
            }}
          >
            <AttachFileIcon />
          </IconButton>
          <InputBox placeholder="bachaaaa tu likh de bs..." value={message} onChange={(e) => setMessage(e.target.value)} />
          <IconButton
            type="submit"
            sx={{
              bgcolor: orange,
              color: "white",
              marginLeft: "1rem",
              padding: "0.5rem",
              "&:hover": {
                bgcolor: "error.dark"
              }
            }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </form>
    </>
  )
}

export default AppLayout()(Chat)