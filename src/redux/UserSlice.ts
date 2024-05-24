import { createSlice } from "@reduxjs/toolkit";
import { UserInterface } from "../interface/Interface";

interface UserState {
    userInfo: UserInterface,
}

const initialState: UserState = {
    userInfo: {
        idUser: '',
        coverImage: '',
        address: '',
        avatar: '',
        email: '',
        gender: 0,
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
        },
        setNameUser: (state, action) => {
            state.userInfo.name = action.payload
        },
        setAvatarUser: (state, action) => {
            state.userInfo.avatar = action.payload
        },
        setCoverUser: (state, action) => {
            state.userInfo.coverImage = action.payload
        }
    }
})

export default UserSlice.reducer
export const { setUser, setNameUser, setAvatarUser, setCoverUser} = UserSlice.actions