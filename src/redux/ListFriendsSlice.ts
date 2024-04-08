import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { FriendInterface } from "../interface/Interface";

interface FriendState {
    friends: FriendInterface[]
}

const initialState: FriendState = {
    friends: []
}

const ListFriendsSlice = createSlice({
    name: 'ListFriendSlice',
    initialState: initialState,
    reducers: {
        addToListFriends: (state, action: PayloadAction<FriendInterface>) => {
            state.friends.push(action.payload)
        }
    }
})

export default ListFriendsSlice.reducer
export const { addToListFriends } = ListFriendsSlice.actions