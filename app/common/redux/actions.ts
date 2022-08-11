import {ADD_CREDS, ADD_FARM, ADD_FARMER, REMOVE_CREDS, RESET} from './action-types';
import {CredentialsState} from './credentialsReducer';

export const addFarm = (data: any) => ({
    type: ADD_FARM,
    data,
});

export const addFarmer = (data: any) => ({
    type: ADD_FARMER,
    data,
});

export const addCreds = (creds: CredentialsState) => ({
    type: ADD_CREDS,
    data: creds,
});

export const removeCreds = () => ({
    type: REMOVE_CREDS,
});

export const resetStore = () => ({
    type: RESET,
});
