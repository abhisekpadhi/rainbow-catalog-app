//initial state
import {ADD_FARMER} from './action-types';

export type IFarmer = {
    id: number;
    farmerName: string;
    phone: string;
}

const initialState: IFarmer = {
    id: 0,
    farmerName: '',
    phone: '',
};

const farmerReducer = (
    state = initialState,
    action: any,
) => {
    switch (action.type) {
        case ADD_FARMER:
            console.log('adding farmer to store');
            return {
                ...state,
                ...action.data,
            };
        default:
            return state;
    }
};

export default farmerReducer;
