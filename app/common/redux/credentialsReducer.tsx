import {ADD_CREDS, REMOVE_CREDS} from './action-types';

export interface CredentialsState {
    accessToken: string;
    refreshToken: string;
    accessTokenUpdatedAtMs: number;
    refreshTokenUpdatedAtMs: number;
}

//initial state
const initialState = {
    accessToken: '',
    refreshToken: '',
    accessTokenUpdatedAtMs: 0, //epoch timestamp
    refreshTokenUpdatedAtMs: 0,
};

const credentialsReducer = (
    state: CredentialsState = initialState,
    action: any,
) => {
    switch (action.type) {
        case ADD_CREDS:
            return {
                ...state,
                ...action.data,
            };
        case REMOVE_CREDS:
            return initialState;
        default:
            return state;
    }
};

export default credentialsReducer;
