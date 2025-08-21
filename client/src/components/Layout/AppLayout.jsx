import React from 'react'
import Header from './Header'
import Title from '../shared/Title'
import Grid from '@mui/material/Grid'
import ChatList from '../specific/ChatList'
import Profile from '../specific/Profile'
import { useParams } from 'react-router-dom'
import { useMyChatsQuery } from '../../Redux/api/api'
import { Drawer, Skeleton } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setIsMobileMenuFriend } from '../../Redux/Reducers/misc'
import { useErrors } from '../../hooks/hooks'

const AppLayout = () => (WrappedComponent) => {
    return (props) => {
        const dispatch = useDispatch();
        const params = useParams();
        const chatId = params.chatId;

        const { isMobileMenuFriend } = useSelector(state => state.misc);
        const {user} = useSelector(state => state.auth);

        console.log(isMobileMenuFriend);

        const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");

        console.log(data);


        useErrors([{ isError, error }]);

        const handleDeleteChat = (e, _id, groupchat) => {
            e.preventDefault();
            console.log("Delete Chat:- ", _id, groupchat);

        }

        const handleMobileClose = () => {
            dispatch(setIsMobileMenuFriend(false));
        }

        return (
            <>
                <Title />
                <Header />
                {isLoading ? (
                    <Skeleton />
                ) : (
                    <Drawer open={isMobileMenuFriend} onClose={handleMobileClose}>
                        <ChatList
                            w="70vw"
                            chats={data?.chats}
                            chatId={chatId}
                            handleDeleteChat={handleDeleteChat}
                        />
                    </Drawer>
                )}

                <Grid container height={"calc(100vh - 4rem)"}>
                    <Grid
                        size={{ sm: 4, md: 3 }}
                        sx={{
                            display: { xs: 'none', sm: 'block' },
                        }}
                        height="100%"
                    >
                        {isLoading ? (
                            <Skeleton />
                        ) : (
                            <ChatList
                                chats={data?.chats}
                                chatId={chatId}
                                handleDeleteChat={handleDeleteChat}
                            />
                        )}
                    </Grid>
                    <Grid size={{ xs: 12, sm: 8, md: 5, lg: 6 }} height={"100%"}>
                        <WrappedComponent {...props} chatId={chatId} user={user}/>
                    </Grid>
                    <Grid
                        size={{ md: 4, lg: 3 }}
                        sx={{
                            display: { xs: 'none', md: 'block' },
                            padding: "2rem",
                            backgroundColor: "#f0f0f0",
                        }}
                        height="100%"
                    >
                        <Profile user={user}/>
                    </Grid>
                </Grid>
            </>
        )
    }
}

export default AppLayout