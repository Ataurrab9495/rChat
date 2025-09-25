import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { serverConnection } from "../../constants/Configuration";

const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({ baseUrl: `${serverConnection}/api/v1` }),
    tagTypes: ["Chat", "Users"],
    endpoints: (builder) => ({
        myChats: builder.query({
            query: () => ({
                url: "chat/my-chats",
                credentials: "include"
            }),
            providesTags: ["Chat"],
        }),

        searchUser: builder.query({
            query: (name) => ({
                url: `user/search-user?name=${name}`,
                credentials: "include"
            }),
            providesTags: ["Users"]
        }),

        sendFriendRequest: builder.mutation({
            query: (data) => ({
                url: "/user/send-request",
                method: "PUT",
                body: data,
                credentials: "include"
            }),
            invalidatesTags: ["User"],
        }),

        getNotifications: builder.query({
            query: () => ({
                url: "/user/get-notifications",
                credentials: "include"
            }),
            keepUnusedDataFor: 0,
        }),

        acceptFriendRequest: builder.mutation({
            query: (data) => ({
                url: "/user/accept-request",
                method: "PUT",
                body: data,
                credentials: "include"
            }),
            invalidatesTags: ["Chat"],
        }),

        chatDetails: builder.query({
            query: ({chatId, populate = false}) => {
                let url = `chat/${chatId}`;
                if (populate) url += "?populate=true";

                return {
                    url,
                    credentials: "include"
                };
            },
            providesTags: ["Chat"],
        }), 
    }),
});

export default api;
export const {
    useMyChatsQuery,
    useLazySearchUserQuery,
    useSendFriendRequestMutation,
    useGetNotificationsQuery,
    useAcceptFriendRequestMutation,
    useChatDetailsQuery
} = api;