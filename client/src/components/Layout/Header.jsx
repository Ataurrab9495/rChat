import { AppBar, Backdrop, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import React, { lazy, Suspense, useState } from 'react'
import { orange } from '../../constants/Color'
import { useNavigate } from 'react-router-dom';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Group as GroupIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { serverConnection } from '../../constants/Configuration';
import { userIfNotExists } from '../../Redux/Reducers/auth';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setIsMobileMenuFriend, setIsNotification, setIsSearch } from '../../Redux/Reducers/misc';

const SearchDialog = lazy(() => import('../specific/Search'));
const NotificationDialog = lazy(() => import('../specific/Notifications'));
const NewGroupDialog = lazy(() => import('../specific/NewGroup'));

const Header = () => {
  const {isSearch, isNotification} = useSelector(state => state.misc);

  //const [isNotification, setIsNotification] = useState(false);
  const [isNewGroup, setIsNewGroup] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleMobile = () => {
    dispatch(setIsMobileMenuFriend(true));
    console.log("yes i am here"); 
  }

  const openSearchDialog = () => {
    dispatch(setIsSearch(true))
  }

  const openNewGroup = () => {
    setIsNewGroup(prev => !prev);
    console.log("New group dialog opened");
  }

  const navigateToGroup = () => {
    navigate("/groups");
    console.log("Navigating to group management");
  }

  const openNotifications = () => {
    dispatch(setIsNotification(true));
  }

  const logoutHandler = async() => {
    try {
      const {data} = await axios.get(`${serverConnection}/api/v1/user/logout`, 
        {withCredentials: true}
      );

      dispatch(userIfNotExists())
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong")
    }
  }


  return (
    <>
      <Box sx={{ flexGrow: 1 }} height={"4rem"}>
        <AppBar position="static" sx={{
          bgColor: orange,
        }}>
          <Toolbar>
            <Typography
              variant="h6"
              sx={{
                display: { xs: 'none', sm: 'block' },
              }}>
              RChat
            </Typography>
            <Box
              sx={{
                display: { xs: "block", sm: "none" }
              }}>
              <IconButton color="inherit" onClick={handleMobile}>
                <MenuIcon />
              </IconButton>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box>
              <IconButtonComp title={"Search"} icon={<SearchIcon />} onClick={openSearchDialog} />
              <IconButtonComp title={"New Group"} icon={<AddIcon />} onClick={openNewGroup} />
              <IconButtonComp title={"Manage Groups"} icon={<GroupIcon />} onClick={navigateToGroup} />
              <IconButtonComp title={"Notifications"} icon={<NotificationsIcon />} onClick={openNotifications} />
              <IconButtonComp title={"Logout"} icon={<LogoutIcon />} onClick={logoutHandler} />
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      {
        isSearch && (
          <Suspense fallback={<Backdrop open/>}>
            <SearchDialog />
          </Suspense>
        )
      }
      {
        isNotification && (
          <Suspense fallback={<Backdrop open/>}>
            <NotificationDialog/>
          </Suspense>
        )
      }
      {
        isNewGroup && (
          <Suspense fallback={<Backdrop open/>}>
            <NewGroupDialog/>
          </Suspense>
        )
      }
    </>
  )
}

export default Header;

const IconButtonComp = ({ tooltip, icon, onClick }) => {
  return (
    <Tooltip title={tooltip}>
      <IconButton color="inherit" size="large" onClick={onClick}>
        {icon}
      </IconButton>
    </Tooltip>
  )
}