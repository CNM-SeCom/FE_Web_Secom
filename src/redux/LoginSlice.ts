import { createSlice } from "@reduxjs/toolkit"

interface LoginState {
    isLogin: boolean
}

const initialState: LoginState = {
    isLogin: false
}

export const LoginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        changeLoginState: (state, action) => {
            state.isLogin = action.payload
        },
    }
})

export default LoginSlice.reducer
export const { changeLoginState } = LoginSlice.actions