import { Button, Dialog, DialogTitle, Stack, Typography } from '@mui/material';
import React, { use, useState } from 'react'
import { sampleChat } from '../../constants/SampleData';
import UserItem from "../shared/UserItem"

const AddMemberDialog = ({addMember, isLoadingMember, chatId}) => {
    const [members,setMembers] = useState(sampleChat);
    const [addMembers,setAddMembers] = useState([]);

    const addFriendHandler = (id) => {
        console.log(id,chatId);      
    }

    const closeHandler = () => {}
    const addMemberSubmitHandler = () => {}

    const addMemberHandler = (id) =>{
        setAddMembers((prev)=>
            prev.includes(id) ? prev.filter((currElement) => currElement !== id) : [...prev, id]
        )
    }

  return (
    <Dialog open>
        <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
            <DialogTitle textAlign={"center"}>Add Member</DialogTitle>
            <Stack spacing={"1rem"}>
                {sampleChat.length > 0 ? (
                    sampleChat.map((member, idx)=> (
                        <UserItem 
                        key={idx} 
                        user={member} 
                        handler={addMemberHandler}
                        isAdded={addMembers.includes(member._id)}
                        />
                    ))
                ):(
                    <Typography textAlign={"center"}>No Friends</Typography>
                )
                }
            </Stack>
            <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"space-evenly"}
            >
                <Button color="error" onClick={closeHandler}>Cancel</Button>
                <Button onClick={addMemberSubmitHandler} variant="contained" disabled={isLoadingMember}>Submit</Button>
            </Stack>
        </Stack>
    </Dialog>
  )
}

export default AddMemberDialog;