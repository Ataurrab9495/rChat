import { Drawer, Skeleton } from '@mui/material'
import Grid from '@mui/material/Grid'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useErrors } from '../../hooks/hooks'
import { useMyChatsQuery } from '../../Redux/api/api'
import { setIsMobileMenuFriend } from '../../Redux/Reducers/misc'
import Title from '../shared/Title'
import ChatList from '../specific/ChatList'
import Profile from '../specific/Profile'
import Header from './Header';
import { getSocket } from '../../Socket';

const AppLayout = () => (WrappedComponent) => {
    return (props) => {
        const dispatch = useDispatch();
        const params = useParams();
        const chatId = params.chatId;

        const socket = getSocket();

        const { isMobileMenuFriend } = useSelector(state => state.misc);
        const {user} = useSelector(state => state.auth);   

        const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");

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
                        <WrappedComponent {...props} chatId={chatId}/>
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

export default AppLayout;