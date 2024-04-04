import { createSlice } from "@reduxjs/toolkit";

const PhoneSlice = createSlice({
    name: 'PhoneSlice',
    initialState: {
        phone: null
    },
    reducers: {
        setPhone: (state, action) => {
            state.phone = action.payload
        }
    }
})

export default PhoneSlice.reducer
export const { setPhone } = PhoneSlice.actions