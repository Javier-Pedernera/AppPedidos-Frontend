import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import User from "../../Models/User";


export interface UserState {
    userData: User | {};
    accessToken: string | null;
}

const initialState: UserState = {
    userData: {},
    accessToken: null
};
const Slice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginUser: (state, action: PayloadAction<User>) => {
            const { token, ...userData } = action.payload;
            return {
                ...state,
                userData: userData,
                accessToken: token
            };
        },
        // signupUser: (state, action: PayloadAction<User>) => {
        //     state.userData = action.payload;
        // },
        logOut: (state, action: PayloadAction<{}>) => {
            state.userData = action.payload;
            state.accessToken = null;
        },

    }
});

export const { loginUser, logOut } = Slice.actions;
export default Slice.reducer;
