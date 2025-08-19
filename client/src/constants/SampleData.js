export const sampleChat = [
    {
        avatar: [''],
        name: "Md Ataurrab",
        _id: "1",
        groupChat: false,
        members: ["1", "2"],
    },
    {
        avatar: ['https://www.w3schools.com/howto/img_avatar.png'],
        name: "Roman Reigns",
        _id: "2",
        groupChat: false,
        members: ["1", "2"],
    }
];

export const sampleMessage = [
    {
        attachments: [
            {
                public_id: "asdsad",
                url: "https://www.w3schools.com/howto/img_avatar.png",
            }
        ],
        _id: "1",
        content: "Hello, how are you?",
        sender: {
            _id: "user._id",
            name: "Lunatic",
        },
        chat: "chatId",
        createdAt: new Date(),
    },
    {
        attachments: [
            {
                public_id: "asdsad",
                url: "https://www.w3schools.com/howto/img_avatar.png",
            }
        ],
        _id: "2",
        content: "I am fine, thank you!",
        sender: {
            _id: "asdasd",
            name: "Lunatic fringe",
        },
        chat: "chatId",
        createdAt: new Date(),
    }
];

export const dashboardData = {
    users: [
        {
            name: "Seth Rollins",
            avatar: 'https://www.w3schools.com/howto/img_avatar.png',
            _id: "1",
            username: "theArchitect",
            friends: 20,
            groups: 5,
        },
        {
            name: "Roman Reigns",
            avatar: 'https://www.w3schools.com/howto/img_avatar.png',
            _id: "2",
            username: "tribalchief",
            friends: 25,
            groups: 4,
        }
    ],

    chats: [
        {
            name: "Shield",
            avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
            _id: "1",
            groupChat: false,
            members: [
                { _id: "1", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
                { _id: "2", avatar: "https://www.w3schools.com/howto/img_avatar.png" }
            ],
            totalMembers: 2,
            totalMessages: 20,
            creator: {
                name: "Roman Reigns",
                avatar: "https://www.w3schools.com/howto/img_avatar.png",
            }
        },
        {
            name: "BloodLine",
            avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
            _id: "2",
            groupChat: true,
            members: [
                { _id: "1", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
                { _id: "2", avatar: "https://www.w3schools.com/howto/img_avatar.png" }
            ],
            totalMembers: 2,
            totalMessages: 20,
            creator: {
                name: "Solo Sikoa",
                avatar: "https://www.w3schools.com/howto/img_avatar.png",
            }
        }
    ],
    messages: [
        {
            attachments: [
                {
                    public_id: "asdsad",
                    url: "https://www.w3schools.com/howto/img_avatar.png",
                }
            ],
            _id: "1",
            content: "Hello, how are you?",
            sender: {
                _id: "user._id",
                avatar: "https://www.w3schools.com/howto/img_avatar.png",
                name: "Lunatic",
            },
            chat: "chatId",
            groupChat: false,
            createdAt: new Date(),
        },
        {
            attachments: [
                {
                    public_id: "asdsad",
                    url: "https://www.w3schools.com/howto/img_avatar.png",
                }
            ],
            _id: "2",
            content: "I am fine, thank you!",
            sender: {
                _id: "asdasd",
                avatar: "https://www.w3schools.com/howto/img_avatar.png",
                name: "Lunatic fringe",
            },
            chat: "chatId",
            groupChat: true,
            createdAt: new Date(),
        }
    ]
};