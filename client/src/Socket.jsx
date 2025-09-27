import { createContext, useContext, useMemo, useEffect } from "react";
import io from "socket.io-client";
import { serverConnection } from "./constants/Configuration";


const SocketContext = createContext();

const getSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
    const socket = useMemo(() => io(serverConnection, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
        timeout: 30000,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        reconnection: true,
        forceNew: true
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
        
        socket.on('reconnect', (attemptNumber) => {
            console.log('Socket reconnected after', attemptNumber, 'attempts');
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('connect_error');
            socket.off('reconnect');
        };
    }, [socket]);

    return (
        <SocketContext.Provider value={socket} >
            {children}
        </SocketContext.Provider>
    );
};

export { SocketProvider, getSocket };