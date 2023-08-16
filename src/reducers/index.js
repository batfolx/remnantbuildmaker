import { combineReducers } from '@reduxjs/toolkit';
import { reducer } from './loadoutReducer';

export const rootReducer = combineReducers({
    loadouts: reducer,
});
