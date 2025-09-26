import { createContext, useContext, useMemo, useEffect } from "react";
import io from "socket.io-client";
import { serverConnection } from "./constants/Configuration";


const SocketContext = createContext();

const getSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
    const socket = useMemo(() => io(serverConnection, {
        timeout: 30000, // 30 seconds
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        withCredentials: true,
        transports: ['websocket', 'polling']
    }), []);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('connect_error');
        };
    }, [socket]);

    return (
        <SocketContext.Provider value={socket} >
            {children}
        </SocketContext.Provider>
    );
};

export { SocketProvider, getSocket };