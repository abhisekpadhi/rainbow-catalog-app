//initial state
import {ADD_FARMER} from './action-types';

export type IFarm = {
    id: number;
    farmerId: number;
    farmName: string;
    farmLocation: string;
    providerId: string;
    supportPhone: string;
    supportEmail: string;
    rating: number;
    extraData: string;
};

const initialState: IFarm = {
    id: 0,
    farmerId: 0,
    farmName: '',
    farmLocation: '',
    providerId: '',
    supportPhone: '',
    supportEmail: '',
    rating: 0,
    extraData: '',
};

const farmReducer = (
    state = initialState,
    action: any,
) => {
    switch (action.type) {
        case ADD_FARMER:
            return {
                ...state,
                ...action.data,
            };
        default:
            return state;
    }
};

export default farmReducer;
