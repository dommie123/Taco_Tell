import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cmCoords: { x: 0, y: 0 },    // the current position of the context menu
    cmOpen: false
}

const globalSlice = createSlice({
    name: "global",
    initialState,
    reducers: {
        setCMCoords: (state, action) => {
            return {
                ...state,
                cmCoords: action.payload
            }
        },
        setCMOpen: (state, action) => {
            return {
                ...state,
                cmOpen: action.payload
            }
        }
    }
})

export const { 
    setCMCoords,
    setCMOpen
} = globalSlice.actions;

export default globalSlice.reducer;