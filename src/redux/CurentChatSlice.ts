import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { FriendInterface } from "../interface/Interface";

interface CurrentChatState {
    chatId: string,
    receiver: FriendInterface,
}

const initialState: CurrentChatState = {
    chatId: '',
    receiver: {
        avatar: '',
        idUser: '',
        name: '',
    }
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
        }
    }
})

export default CurrentChatSlice.reducer
export const { setCurrentChatId, setCurrentReceiver } = CurrentChatSlice.actions