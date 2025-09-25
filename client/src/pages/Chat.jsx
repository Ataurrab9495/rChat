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




  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  const members = chatDetails.data?.chat?.members;



  const messageSubmitHandler = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    console.log("data has been emitted from here...");
    
    // Sending message to the server
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };

  useEffect(() => {
    console.log("this is so good");
    
    const testHandler = (data, ack) => {
      console.log("Message received in chat page:- ", data);
      console.log("acknowledgment from server:- ", typeof ack);
      if(ack){
        ack("Message received at client")
      }
    };

    socket.on(NEW_MESSAGE, testHandler);
    return () => {
      socket.off(NEW_MESSAGE, testHandler);
    }
  },[socket]);
  

  /* const newMessageHandler = useCallback((data, ack) => {
    console.log(data);
    try {
      if (ack) {
        ack({
          status: "received",
          message: data,
          timestamp: Date.now()
        })
      }
    } catch (err) {
      console.error("Error processing message:", err);
      if (ack) {
        ack({
          status: "error",
          error: err.message
        });
      }
    }
  }, []); */

  // const eventHandler = { [NEW_MESSAGE]: newMessageHandler };

  /* useEffect(() => {
    console.log("Socket in chat page:- ",socket);
    
    socket.on(NEW_MESSAGE, newMessageHandler);

     return () => {
      socket.off(NEW_MESSAGE, newMessageHandler); // Clean up the event listener on unmount
    }
  },[]) */

  //useCallback:- will return a memoized version of the callback that only changes if one of the inputs has changed.
  /* const newMessageHandler = useCallback((data) => {
    setMessages((prev) => [...prev, data.message]); 
    console.log("hii i am here");
  },[]); */

  //const eventHandler = {[NEW_MESSAGE]: newMessageHandler};


  // Use the socket events hook to handle the NEW_MESSAGE event
  //useSocketEventHandler(socket, eventHandler);

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