import {createSlice} from '@reduxjs/toolkit';
import RemnantStorageApi from "../storageApi";
import {sendLoadoutSwitchEvent, sendSaveLoadoutEvent} from "../constants";


export const saveLoadouts = (data) => {
    RemnantStorageApi.saveLocalLoadOuts(data);
    sendSaveLoadoutEvent();
}

const loadoutReducer = createSlice({
    name: "loadouts",
    initialState: RemnantStorageApi.getLocalLoadOuts(),
    reducers: {
        setCurrentLoadOutIndex: (state, action) => {
            state.currentLoadoutIndex = action.payload;
            sendLoadoutSwitchEvent(state.currentLoadoutIndex, action.payload);
            saveLoadouts(state);
        },

        setLoadoutName: (state, action) => {
            state.loadouts[state.currentLoadoutIndex].loadoutName = action.payload;
            saveLoadouts(state);
        },

        setLoadOutRings: (state, action) => {
            state.loadouts[state.currentLoadoutIndex].rings = action.payload;
            saveLoadouts(state);
        },

        setLoadoutAmulet: (state, action) => {
            state.loadouts[state.currentLoadoutIndex].amulet = action.payload;
            saveLoadouts(state);
        },

        setLoadoutRelic: (state, action) => {
            state.loadouts[state.currentLoadoutIndex].relic = action.payload;
            saveLoadouts(state);
        },

        setLoadoutLongGunMutator: (state, action) => {
            state.loadouts[state.currentLoadoutIndex].longGunMutator = action.payload;
            saveLoadouts(state);
        },

        setLoadoutHandGunMutator: (state, action) => {
            state.loadouts[state.currentLoadoutIndex].handGunMutator = action.payload;
            saveLoadouts(state);
        },

        setLoadoutMeleeMutator: (state, action) => {
            state.loadouts[state.currentLoadoutIndex].meleeMutator = action.payload;
            saveLoadouts(state);
        },

        setLongGunWeaponMod: (state, action) => {
            state.loadouts[state.currentLoadoutIndex].weaponMod = action.payload;
            saveLoadouts(state);
        },

        setLongGun: (state, action) => {
            state.loadouts[state.currentLoadoutIndex].longGun = action.payload;
            saveLoadouts(state);
        },

        setHandGun: (state, action) => {
            state.loadouts[state.currentLoadoutIndex].handGun = action.payload;
            saveLoadouts(state);
        },

        setHandGunWeaponMod: (state, action) => {
            state.loadouts[state.currentLoadoutIndex].handGunWeaponMod = action.payload;
            saveLoadouts(state);
        },

        setMeleeWeapon: (state, action) => {
            state.loadouts[state.currentLoadoutIndex].meleeWeapon = action.payload;
            saveLoadouts(state);
        },

        setMeleeWeaponMod: (state, action) => {
            state.loadouts[state.currentLoadoutIndex].meleeWeaponMod = action.payload;
            saveLoadouts(state);
        },

        overwriteBuild: (state, action) => {
            console.log("Action",action)
            const {index, buildData} = action.payload;
            state.loadouts[index] = buildData;
            saveLoadouts(state);
        },

        overwriteAllBuilds: (state, action) => {
            state = {...action};
            saveLoadouts(state);
        }
    }
});


export const {actions, reducer} = loadoutReducer;



