import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import LoginSlice from "./LoginSlice";
import TokenSlice from "./TokenSlice";
import UserSlice from "./UserSlice";

export const store = configureStore({
    reducer: {
        login: LoginSlice,
        token: TokenSlice,
        user: UserSlice,
    }
})

export type RootState = ReturnType<typeof store.getState>
export const useAppDispatch: () => typeof store.dispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector