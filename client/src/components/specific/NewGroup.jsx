import { Button, Dialog, DialogTitle, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react';
import UserItem from '../shared/UserItem';
import { userInputValidation } from '6pp';

const NewGroup = () => {
  const groupName = userInputValidation("");
  const [members, setMembers] = useState(users);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const users =[1,2,3,4,5,6,7,8,9,10];
  const selectMemberHandle = () => {
    setSelectedMembers((prev) => prev.includes(id) ? prev.filter((current) => current !== id):[...prev, id]);
  }

  const submitHandler = () => {

  }

  const closeHandler = () => {

  }


  return (
    <Dialog open onClose={closeHandler}>
      <Stack p={{xs:"1rem", sm:"2rem"}} width={"25rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"} variant="h4">New Group</DialogTitle>
        <TextField label="Group Name" value = {groupName.value} onChange={groupName.changeHandler}/>
        <Typography variant="body1">Members</Typography>
        <Stack>
          {users.map((data) => (
            <UserItem user={data} key={data._id} handler={selectMemberHandle} isAdded = {selectedMembers.includes(data._id)}/>
          ))}
        </Stack>
        <Stack direction={"row"} justifyContent={"space-evenly"}>
          <Button variant="text" color="error">
            cancel
          </Button>
          <Button variant="contained" onClick={submitHandler}>create</Button>
        </Stack>
      </Stack>
    </Dialog>
  )
}

export default NewGroup