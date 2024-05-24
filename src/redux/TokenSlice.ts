import { createSlice } from "@reduxjs/toolkit";

const tokenSlice = createSlice({
    name: 'token',
    initialState: {
        token: null,
        accessToken: null,
        stringeeToken: null
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload
        },
        setStringeeToken: (state, action) => {
            state.stringeeToken = action.payload
        },
        setAccessToken: (state, action) => {
            state.accessToken = action.payload
        }
    }
})

export default tokenSlice.reducer
export const { setToken, setStringeeToken, setAccessToken } = tokenSlice.actions