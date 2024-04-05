import { createSlice } from "@reduxjs/toolkit";

const OTPSlice = createSlice({
    name: 'OTPSlice',
    initialState: {
        isVerify: false,
    },
    reducers: {
        setStateVerify: (state, action) => {
            state.isVerify = action.payload
        }
    }
})

export default OTPSlice.reducer
export const { setStateVerify } = OTPSlice.actions