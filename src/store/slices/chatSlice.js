import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userName : "" , 
    activePolicyName :"" , 
    activePolicyId : "",
    indexName : "",
    chatHistory: []


}
export const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setchatUserName: (state, action) => {
            state.userName = action.payload;
        },
        setActivePolicyName: (state, action) => {
            state.activePolicyName = action.payload.policyName;
            state.activePolicyId = action.payload.policyId; 
            state.indexName = action.payload.indexName; 
        },
        addChatMessage: (state, action) => {
            state.chatHistory.push(action.payload);
        },
        clearChatHistory: (state) => {
            state.chatHistory = [];
        },
        setChatHistory: (state, action) => {
            state.chatHistory = action.payload;
        },
        resetChatState: (state) => {
            return initialState;
        },
    },
}) ; 

export const { setchatUserName, setActivePolicyName, addChatMessage, clearChatHistory, setChatHistory, resetChatState } = chatSlice.actions;
export default chatSlice.reducer;
