import { Add as AddIcon } from '@mui/icons-material'
import { Avatar, Button, Dialog, DialogTitle, IconButton, ListItem, Skeleton, Stack, Typography } from '@mui/material'
import React, { memo } from 'react'
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from '../../Redux/api/api';
import { useErrors } from '../../hooks/hooks';
import { setIsNotification } from '../../Redux/Reducers/misc';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const Notifications = () => {
  const { isNotification } = useSelector((state) => state.misc);
  const { isLoading, data, error, isError } = useGetNotificationsQuery();

  const dispatch = useDispatch();


  const [acceptFriendRequest] = useAcceptFriendRequestMutation();
  const friendRequestHandler = async({ _id, accept }) => {
    // add friend request handler

    dispatch(setIsNotification(false));
    try {
      const res = await acceptFriendRequest({requestId: _id, accept});
      console.log(res);
      
      if(res.data?.success){
        console.log("using socket.");
        console.log(res.data);
        
        toast.success(res.data?.message);        
      }else toast.error(res.data?.error || "Something went wrong.")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong.");
    }
  }


  
  const notificationCloseHandler = () => {
    dispatch(setIsNotification(false));
  }

  useErrors([{ isError, error }]);

  return (
    <Dialog open={isNotification} onClose={notificationCloseHandler}>
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
        <DialogTitle>Notifications</DialogTitle>

        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            {
              data?.requests.length > 0 ? (
                data?.requests?.map(({ sender, _id }) => (
                  <NotificationItem
                    sender={sender}
                    _id={_id}
                    handler={friendRequestHandler}
                    key={_id}
                  />
                ))
              ) : (
                <Typography textAlign={"center"}>0 notifications</Typography>
              )
            }
          </>
        )}
      </Stack>
    </Dialog>
  )
}

export default Notifications;

const NotificationItem = memo(({ sender, _id, handler }) => {
  const { name, avatar } = sender;

  return (
    <ListItem>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
      >
        <Avatar src={avatar} />

        <Typography
          variant="body1"
          sx={{
            flexGrow: 1,
            display: "-webkit-box",
            webkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
          }}
        >
          {`${name} sent you a friend request.`}
        </Typography>

        <Stack
          direction={{
            xs: "column",
            sm: "row"
          }}
        >
          <Button onClick={() => handler({ _id, accept: true })}>Accept</Button>
          <Button onClick={() => handler({ _id, accept: false })}>Reject</Button>
        </Stack>
      </Stack>
    </ListItem>
  )
});