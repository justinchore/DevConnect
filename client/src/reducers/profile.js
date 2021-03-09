import {
    GET_PROFILE,
    PROFILE_ERROR,
    CLEAR_PROFILE
} from '../actions/types';

const initialState = {
    profile: null, //any one profile
    profiles: [], //profile listings
    repos: [],
    loading: true, //we can use this to hold off rendering until requests are finished
    error: {} //errors
}

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case GET_PROFILE: 
            return {
                ...state,
                profile: payload, //payload will be the profile
                loading: false
            };
        case PROFILE_ERROR:
            return {
                ...state,
                error: payload, //payload will be error messages
                loading: false
            };
        case CLEAR_PROFILE:
            return {
                ...state,
                profile: null,
                repos: [],
                loading: false
            }
        default:
            return state;
    }
}