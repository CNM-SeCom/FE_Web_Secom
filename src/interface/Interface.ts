export interface UserInterface {
    idUser: string,
    address: string,
    avatar: string,
    email: string,
    gender: string,
    listBlock: [],
    listChat: [],
    listFriend: [],
    name: string,
    phone: string,
    refreshToken: string,
}   

export interface FriendInterface {
    avatar: string,
    idUser: string,
    name: string,
}

export interface ChatInterface {
    createdAt: string,
    id: string,
    type: string,
    lastMessage: string,
    lastMessageTime: string,
    lastSenderName: string,
    lastMessageRead: boolean,
    lastSenderId: string,
    participants: FriendInterface[],
}