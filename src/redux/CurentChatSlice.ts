import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { FriendInterface, MessageInterface } from "../interface/Interface";


interface CurrentChatState {
    chatId: string,
    receiver: FriendInterface,
    messages: MessageInterface[]
    currentTyping: boolean
}

const initialState: CurrentChatState = {
    chatId: '',
    receiver: {
        avatar: '',
        idUser: '',
        name: '',
    },
    messages: [],
    currentTyping: false
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
        }
    }
})

export default CurrentChatSlice.reducer
export const { setCurrentChatId, setCurrentReceiver, setCurrentMessage, setCurrentTyping } = CurrentChatSlice.actions