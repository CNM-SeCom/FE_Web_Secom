import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { FriendInterface, MessageInterface } from "../interface/Interface";


interface CurrentChatState {
    chatId: string,
    receiver: FriendInterface,
    messages: MessageInterface[]
}

const initialState: CurrentChatState = {
    chatId: '',
    receiver: {
        avatar: '',
        idUser: '',
        name: '',
    },
    messages: []
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
        }
    }
})

export default CurrentChatSlice.reducer
export const { setCurrentChatId, setCurrentReceiver, setCurrentMessage } = CurrentChatSlice.actions