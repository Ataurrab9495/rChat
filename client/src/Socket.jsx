import { createContext, useContext, useMemo } from "react";
import io from "socket.io-client";
import { serverConnection } from "./constants/Configuration";


const SocketContext = createContext();

const getSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
    const socket = useMemo(() => io(serverConnection, {withCredentials: true}), []);

    return (
        <SocketContext.Provider value = {socket} >
            {children}
        </SocketContext.Provider>
    );
};

export { SocketProvider, getSocket };