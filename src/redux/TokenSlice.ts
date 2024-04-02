import { createSlice } from "@reduxjs/toolkit";

const tokenSlice = createSlice({
    name: 'token',
    initialState: {
        token: null
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload
        }
    }
})

export default tokenSlice.reducer
export const { setToken } = tokenSlice.actions