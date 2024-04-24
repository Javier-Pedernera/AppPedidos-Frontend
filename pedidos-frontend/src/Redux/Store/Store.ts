import { configureStore } from '@reduxjs/toolkit';
import user from "../Actions/UserSlice"
import zonas from "../Actions/ZonasSlice"
import cadetes from '../Actions/CadetesSlice';
import params from '../Actions/ParamsSlice';
export const store = configureStore({
    reducer: {
       user: user,
       zonas: zonas,
       cadetes: cadetes,
       params: params
    //    clientes: clientes,
       
    },
});
// Documentacion Redux
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch




// export default store;