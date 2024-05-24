import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { FriendInterface} from "../interface/Interface";


interface CurrentChatState {
    chatId: string,
    receiver: FriendInterface,
    messages: any[]
    currentTyping: boolean
    listChat: []
    currentChatType: string
    listParticipant: [],
    groupName: string,
    avatarGroup: string
}

const initialState: CurrentChatState = {
    chatId: '',
    receiver: {
        avatar: '',
        idUser: '',
        name: '',
    },
    messages: [],
    currentTyping: false,
    listChat: [],
    currentChatType: 'single',
    listParticipant: [],
    groupName: '',
    avatarGroup: ''
}

const CurrentChatSlice = createSlice({
    name: 'CurrentChatSlice',
    initialState: initialState,
    reducers: {
        setCurrentChatId: (state, action) => {
            state.chatId = action.payload
        },
        setCurrentReceiver: (state, action: PayloadAction<FriendInterface>) => {
            state.receiver = action.payload
        },
        setCurrentMessage: (state, action: PayloadAction<[]>) => {
            state.messages = (action.payload)
        },
        setCurrentTyping: (state, action: PayloadAction<boolean>) => {
            state.currentTyping = action.payload
        },
        setListChat: (state, action: PayloadAction<[]>) => {
            state.listChat = action.payload
        },
        setCurrentChatType: (state, action: PayloadAction<string>) => {
            state.currentChatType = action.payload
        },
        setListParticipant: (state, action: PayloadAction<[]>) => {
            state.listParticipant = action.payload
        },
        setGroupName: (state, action: PayloadAction<string>) => {
            state.groupName = action.payload
        },
        setAvatarGroup: (state, action: PayloadAction<string>) => {
            state.avatarGroup = action.payload
        }
    }
})

export default CurrentChatSlice.reducer
export const { setCurrentChatId, setCurrentReceiver, setCurrentMessage, setCurrentTyping, setListChat, 
    setCurrentChatType, setListParticipant, setGroupName,
    setAvatarGroup
} = CurrentChatSlice.actions