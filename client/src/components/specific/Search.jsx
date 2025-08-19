import { Dialog, DialogTitle, InputAdornment, List, ListItem, ListItemText, Stack, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import {useInputValidation} from "6pp";
import { Search as SearchIcon } from '@mui/icons-material';
import UserItem from '../shared/UserItem';
import { useDispatch, useSelector } from 'react-redux';
import { setIsSearch } from '../../Redux/Reducers/misc';
import { useLazySearchUserQuery, useSendFriendRequestMutation } from '../../Redux/api/api';
import { useAsyncMutation } from '../../hooks/hooks';


const Search = () => {
  const [users, setUsers] = useState([]);
  const search = useInputValidation("");

  const dispatch = useDispatch();
  const {isSearch} = useSelector(state => state.misc);

  const [searchUser] = useLazySearchUserQuery();

  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(useSendFriendRequestMutation);

  const addFriendHandler = async(id) => {
    await sendFriendRequest("Sending Friend Request", {userId: id});
  }

    const closeSearchDialogHandler = () => {
      dispatch(setIsSearch(false));
    }

    // searching users on input change
    useEffect(() => {
      const searchTimeOut = setTimeout(() => {
        searchUser(search.value)
        .then(({data}) => setUsers(data.users))
        .catch((err) => console.log(err));
      },500);

      return () => {
        clearTimeout(searchTimeOut);
      };
    },[search.value]);

  return (
    <Dialog open={isSearch} onClose={closeSearchDialogHandler}>
      <Stack padding={"2rem"} direction={"column"} width={"25rem"}>
        <DialogTitle textAlign={"center"}>Find People here</DialogTitle>
        <TextField 
        label="" 
        value={search.value} 
        onChange={search.changeHandler}
        variant="outlined"
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          )
        }}
        />

        <List>
          {users.map((data) => (
            <UserItem
              user={data}
              key={data._id}
              handler={addFriendHandler}
              handlerIsLoading={isLoadingSendFriendRequest}
            />
          ))}
        </List>
      </Stack>
    </Dialog>
  )
} 

export default Search