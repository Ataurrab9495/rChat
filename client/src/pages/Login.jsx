import { Avatar, Button, Container, IconButton, Paper, Stack, TextField, Typography } from '@mui/material'
import { CameraAlt } from '@mui/icons-material'
import { VisuallyHidden } from '../components/styles/styledComponents'
import React from 'react'
import { useFileHandler, useInputValidation } from '6pp'
import { usernameValidator } from '../utils/validators'
import { useDispatch } from 'react-redux'
import { serverConnection } from '../constants/Configuration'
import toast from 'react-hot-toast'
import axios from 'axios'
import { UserIfExists } from '../Redux/Reducers/auth'

const Login = () => {
    const [isLogin, setIsLogin] = React.useState(true);

    const toggleLogin = () => setIsLogin(prev => !prev);

    const name = useInputValidation("");
    const username = useInputValidation("", usernameValidator);
    const password = useInputValidation("");
    const bio = useInputValidation("");

    const avatar = useFileHandler("single");
    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("i am in");

        // Handle login logic here
        try {
            const { data } = await axios.post(`${serverConnection}/api/v1/user/login`,
                {
                    username: username.value,
                    password: password.value,
                }, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                }
            }
            );
            console.log("i am here too");
            console.log(data);

            dispatch(UserIfExists(true));
            toast.success(data?.message);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Login failed")
        }
    }

    const handleSignUp = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("avatar", avatar.file);
        formData.append("name", name.value);
        formData.append("bio", bio.value);
        formData.append("username", username.value);
        formData.append("password", password.value);


        try {
            const { data } = await axios.post(`${serverConnection}/api/v1/user/new`, formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            dispatch(UserIfExists(true));
            toast.success(data.message);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    };



    return (
        <Container component={"main"} maxWidth="xs"
            sx={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                {isLogin ? (
                    <>
                        <Typography variant="h5">Login</Typography>
                        <form
                            onSubmit={handleLogin}
                        >
                            <TextField
                                required
                                fullWidth
                                label="Username"
                                margin="normal"
                                variant="outlined"
                                value={username.value}
                                onChange={username.changeHandler}
                            />
                            <TextField
                                required
                                fullWidth
                                label="Password"
                                margin="normal"
                                variant="outlined"
                                type="password"
                                value={password.value}
                                onChange={password.changeHandler}
                            />
                            <Button
                                sx={{
                                    marginTop: "1rem",
                                }}
                                variant='contained'
                                fullWidth
                                type="submit"
                                color="primary"
                            >
                                Login
                            </Button>
                            <Typography textAlign={"center"} m={"1rem"}>Or</Typography>
                            <Button
                                fullWidth
                                onClick={toggleLogin}
                            >
                                Register
                            </Button>
                        </form>
                    </>
                ) : (
                    <>
                        <Typography variant="h5">Sign Up</Typography>
                        <form
                            style={{
                                width: '100%',
                                marginTop: '1rem',
                            }}
                            onSubmit={handleSignUp}
                        >
                            <Stack
                                position={"relative"}
                                width={"10rem"}
                                margin={"auto"}
                            >
                                <Avatar
                                    sx={{
                                        width: "10rem",
                                        height: "10rem",
                                        objectFit: "contain",
                                    }}
                                    src={avatar.preview}
                                />
                                <IconButton
                                    sx={{
                                        position: "absolute",
                                        bottom: 0,
                                        right: 0,
                                        backgroundColor: "secondary.main",
                                        color: "white",
                                        '&:hover': {
                                            backgroundColor: "primary.dark",
                                        },
                                    }}
                                    component="label"
                                >
                                    <>
                                        <CameraAlt />
                                        <VisuallyHidden type="file" onChange={avatar.changeHandler} />
                                    </>
                                </IconButton>
                            </Stack>
                            {avatar.error && (
                                <Typography
                                    m={"1rem auto"}
                                    width={"fit-content"}
                                    display={"block"}
                                    color="error"
                                    variant='caption'
                                >
                                    {avatar.error}
                                </Typography>
                            )}

                            <TextField
                                required
                                fullWidth
                                label="Name"
                                margin="normal"
                                variant="outlined"
                                value={name.value}
                                onChange={name.changeHandler}
                            />
                            <TextField
                                required
                                fullWidth
                                label="Bio"
                                margin="normal"
                                variant="outlined"
                                value={bio.value}
                                onChange={bio.changeHandler}
                            />
                            <TextField
                                required
                                fullWidth
                                label="Username"
                                margin="normal"
                                variant="outlined"
                                value={username.value}
                                onChange={username.changeHandler}
                            />
                            {
                                username.error &&
                                <Typography color="error" variant="caption">
                                    {username.error}
                                </Typography>
                            }
                            <TextField
                                required
                                fullWidth
                                label="Password"
                                margin="normal"
                                variant="outlined"
                                type="password"
                                value={password.value}
                                onChange={password.changeHandler}
                            />
                            <Button
                                sx={{
                                    marginTop: "1rem",
                                }}
                                variant='contained'
                                fullWidth
                                type="submit"
                                color="primary"
                            >
                                Register
                            </Button>
                            <Typography textAlign={"center"} m={"1rem"}>Or</Typography>
                            <Button
                                fullWidth
                                onClick={toggleLogin}
                            >
                                Login
                            </Button>
                        </form>
                    </>
                )}
            </Paper>
        </Container>
    )
}

export default Login