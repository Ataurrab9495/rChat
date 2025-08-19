import React, { lazy, memo, Suspense, useEffect, useState } from 'react';
import { Backdrop, Box, Button, Drawer, Stack, TextField, Typography } from "@mui/material"
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { matBlack } from '../constants/Color';
import {
  KeyboardBackspace as KeyboardBackspaceIcon,
  Menu as MenuIcon,
  Edit as EditIcon,
  Done as DoneIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import AvatarCard from '../components/shared/AvatarCard';
import { Link } from '../components/styles/StyledComponents';
import { sampleChat } from '../constants/SampleData';
import UserItem from '../components/shared/UserItem';
const ConfirmDeleteDialog = lazy(() => import('../components/dialogs/ConfirmDeleteDialog'));
const AddMemberDialog = lazy(() => import('../components/dialogs/AddMemberDialog'));

let isAddMember = false;

const GroupManagement = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [updatedGroupName, setUpdatedGroupName] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const navigate = useNavigate();
  const chatId = useSearchParams()[0].get("group");

  const navigateBack = () => {
    navigate("/");
  }

  const handleMobile = () => {
    setIsMobileMenuOpen(prev => !prev)
  }

  const handleMobileClose = () => setIsMobileMenuOpen(false);

  const updateGroupName = () => {
    setIsEdit(false);
  }

  const DeleteConfirmationHandler = () => {
    setConfirmDelete(true);
  }

  const closeConfirmDeleteHandler = () => {
    setConfirmDelete(false);
  }

  const deleteHandler = () => {
    closeConfirmDeleteHandler();
  }

  const removeMemberHandler = () => { }

  const openAddMemberHandler = () => { }

  useEffect(() => {
    if (chatId) {
      setGroupName(`Group Name ${chatId}`);
      setUpdatedGroupName(`Group Name ${chatId}`);
    }

    return () => {
      setGroupName("");
      setUpdatedGroupName("");
      setIsEdit(false);
    }
  }, [chatId]);

  const IconBtns = (
    <>
      <Box
        sx={{
          display: {
            xs: "block",
            sm: "none",
            position: "fixed",
            right: "1rem",
            top: "1rem",
          }
        }}
      >
        <IconButton onClick={handleMobile}>
          <MenuIcon />
        </IconButton>
      </Box>
      <Tooltip title="back">
        <IconButton
          sx={{
            position: "absolute",
            top: "2rem",
            left: "2rem",
            bgcolor: matBlack,
            color: "white",
            ":hover": {
              bgcolor: "rgba(0,0,0,0.7)",
            },
          }}
          onClick={navigateBack}
        >
          <KeyboardBackspaceIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  const GroupName = (
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"center"}
      spacing={"1rem"}
      padding={"3rem"}
    >
      {isEdit ? (
        <>
          <TextField
            value={updateGroupName}
            onChange={e => setUpdatedGroupName(e.target.value)}
          />
          <IconButton onClick={updateGroupName}>
            <DoneIcon />
          </IconButton>
        </>
      ) : (
        <>
          <Typography variant="h4">Group Name</Typography>
          <IconButton onClick={() => setIsEdit(true)}>
            <EditIcon />
          </IconButton>
        </>
      )}
    </Stack>
  );

  const ButtonGroup = (
    <Stack
      direction={{
        xs: "column-reverse",
        sm: "row"
      }}
      spacing={"1rem"}
      p={{
        xs: "0",
        sm: "1rem",
        md: "1rem 4rem",
      }}
    >
      <Button size="medium" startIcon={<DeleteIcon />} onClick={DeleteConfirmationHandler}>Delete Group</Button>
      <Button size="medium" startIcon={<AddIcon />} onClick={openAddMemberHandler}>Add Member</Button>
    </Stack>
  );
  return (
    <Grid container height={"100vh"}>
      <Grid
        item
        sx={{
          display: {
            xs: 'none',
            sm: 'block'
          }
        }}
        sm={4}
      >
        <GroupsList myGroups={sampleChat} chatId={chatId} />
      </Grid>
      <Grid
        item
        xs={12}
        sm={8}
        sx={{
          display: 'flex',
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          padding: "1rem 3rem"
        }}
      >
        {IconBtns}

        {groupName && (
          <>
            {GroupName}
            <Typography
              margin={"2rem"}
              alignSelf={"flex-start"}
              variant="body1"
            >
              Members
            </Typography>

            <Stack
              maxWidth={"45rem"}
              width={"100%"}
              boxSizing={"border-box"}
              padding={{
                sm: "1rem",
                xs: "0",
                md: "1rem 4rem"
              }}
              spacing={"2rem"}
              bgcolor={"bisque"}
              height={"50vh"}
              overflow={"auto"}
            >
              {/* add members */}
              {sampleChat.map((i) => (
                <UserItem
                  user={i}
                  key={i._id}
                  isAdded
                  styling={{
                    boxShadow: "0 0 0.5rem rgba(0,0,0,0.2)",
                    padding: "1rem 2rem",
                    borderRadius: "1rem"
                  }}
                  handler={removeMemberHandler}
                />
              ))}

            </Stack>
            {ButtonGroup}
          </>
        )}
      </Grid>

      {
        isAddMember && (
          <Suspense fallback={<Backdrop open />}>
            <AddMemberDialog />
          </Suspense>
        )
      }
      {
        confirmDelete && (
          <Suspense fallback={<Backdrop open />}>
            <ConfirmDeleteDialog
              open={ConfirmDeleteDialog}
              handleClose={closeConfirmDeleteHandler}
              deleteHandler={deleteHandler}
            />
          </Suspense>
        )
      }
      <Drawer
        sx={{
          display: {
            xs: "block",
            sm: "none"
          },
        }}

        open={isMobileMenuOpen}
        onClose={handleMobileClose}
      >
        <GroupsList w={"50vw"} myGroups={sampleChat} chatId={chatId} />
      </Drawer>
    </Grid>
  )
};


const GroupsList = ({ w = "100%", myGroups = [], chatId }) => (
  <Stack>
    {myGroups.length > 0 ? (
      myGroups.map((group) => (
        <GroupListItem group={group} chatId={chatId} key={group._id} />
      ))
    ) : (
      <Typography textAlign={"center"} padding="1rem">
        No Groups form yet.
      </Typography>
    )}
  </Stack>
);

const GroupListItem = memo(({ group, chatId }) => {
  const { name, avatar, _id } = group;

  return (
    <Link
      to={`?group=${_id}`}
      onClick={(e) => {
        if (chatId === _id) e.preventDefault();
      }}
    >
      <Stack>
        <AvatarCard avatar={avatar} />
        <Typography>{name}</Typography>
      </Stack>
    </Link>
  )
})

export default GroupManagement