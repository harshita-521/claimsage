import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { combineReducers } from '@reduxjs/toolkit';
import { userSlice } from './slices/userSlice';
import { chatSlice } from './slices/chatSlice';

// Persist config
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user', 'chat'], // Persist both user and chat slices
};

// Combine reducers
const rootReducer = combineReducers({
    user: userSlice.reducer,
    chat: chatSlice.reducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
});

// Create persistor
export const persistor = persistStore(store);

// Utility function to clear all persisted data
export const clearPersistedData = () => {
    persistor.purge();
};

