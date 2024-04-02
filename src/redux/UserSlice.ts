import { createSlice } from "@reduxjs/toolkit";
import { UserInterface } from "../interface/Interface";

interface UserState {
    userInfo: UserInterface,
}

const initialState: UserState = {
    userInfo: {
        idUser: '',
        address: '',
        avatar: '',
        email: '',
        gender: '',
        listBlock: [],
        listChat: [],
        listFriend: [],
        name: '',
        phone: '',
        refreshToken: '',
    },
}

const UserSlice = createSlice({
    name: 'UserSlice',
    initialState: initialState,
    reducers: {
        setUser: (state, action) => {
            state.userInfo = action.payload
        }
    }
})

export default UserSlice.reducer
export const { setUser } = UserSlice.actions