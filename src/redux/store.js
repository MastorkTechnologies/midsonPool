import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"
import newUserReducer from "./newUserSlice"

export const store = configureStore({
    reducer: {
        user: userReducer,
        newUser: newUserReducer,

    }

})