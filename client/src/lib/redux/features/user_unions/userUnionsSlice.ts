import { createSlice } from "@reduxjs/toolkit"
interface UserUnion {
    unions: null | object[]
}
export const userUnionSlice = createSlice({
    name: 'user_union',
    initialState: {
        unions: null,
    },
    reducers: {
        setUserUnions: (state, action) => {
            state.unions = action.payload.unions
        }
    }
});

export type { UserUnion as UserUnionType }
export const { setUserUnions } = userUnionSlice.actions
export default userUnionSlice.reducer