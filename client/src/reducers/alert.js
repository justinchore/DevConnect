import { SET_ALERT, REMOVE_ALERT } from '../actions/types';
const initialState = [];
//Each object in this array will have an
//id, msg, alertType

export default function foo(state = initialState, action) {
  //actions will have type, payload
  const { type, payload } = action;
  switch (type) {
    case SET_ALERT: //we need to return changes to the state
      return [...state, payload]; //state is immutable, so include any state present
    case REMOVE_ALERT:
      return state.filter(alert => alert.id !== payload); //we control payload in dispatch
    default:
      return state;
  }
}
