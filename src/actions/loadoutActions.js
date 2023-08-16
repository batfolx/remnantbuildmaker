import { createSlice } from '@reduxjs/toolkit';
import RemnantStorageApi from "../storageApi";

const loadoutActions = createSlice({
    name: "loadouts",
    initialState: RemnantStorageApi.getLocalLoadOuts(),
    reducers: {

    }
});


export const {actions, reducer} = loadoutActions;



