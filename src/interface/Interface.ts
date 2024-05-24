export interface UserInterface {
    coverImage: string | undefined ,
    idUser: string,
    address: string,
    avatar: string,
    email: string,
    gender: number,
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
export interface MessageInterface{
    chatId: string,
    createdAt: string,
    image: string,
    text: string,
    type: string,
    user: FriendInterface,
    video: string,
    _id: number
}
export interface TokenInterface {
    accessToken: string,
    refreshToken: string,
}
export interface ReqAddFriendInterface {
    avatarFromUser: string,
    createdAt: string,
    fromUser: string,
    id: string,
    nameFromUser: string,
    nameToUser: string,
    status: string,
    toUser: string,
    type: string,
}

export interface SentAddFriendInterface {
    avatarFromUser: string,
    avatarToUser: string,
    createdAt: string,
    fromUser: string,
    id: string,
    nameFromUser: string,
    nameToUser: string,
    status: string,
    toUser: string,
    type: string,
}