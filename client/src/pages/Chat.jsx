import { IconButton, Stack } from '@mui/material'
import React, { useRef } from 'react'
import { grayColor, orange } from '../constants/Color';
import { AttachFile as AttachFileIcon, Send as SendIcon} from '@mui/icons-material';
import { InputBox } from '../components/styles/styledComponents';
import AppLayout from '../components/Layout/AppLayout';

const Chat = () => {
  const containerRef = useRef(null);
  return (
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
        {/* Chat messages will go here, Message will render here */}
        asdgf
      </Stack>
      <form
        style={{
          height:"10%",
        }}
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
              left:"1.5rem",
              rotate: "30deg",
            }}
          >
            <AttachFileIcon/>
          </IconButton>
          <InputBox placeholder="bachaaaa tu likh de bs..."/>
          <IconButton 
            type="submit"
            sx={{
              bgcolor: orange,
              color:"white",
              marginLeft:"1rem",
              padding:"0.5rem",
              "&:hover":{
                bgcolor: "error.dark"
              }
            }}
          >
            <SendIcon/>
          </IconButton>
        </Stack>
      </form>
    </>
  )
}

export default AppLayout()(Chat)