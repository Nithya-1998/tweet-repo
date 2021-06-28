import { USER_ID } from '../actions/actions';

const userNameReducer = (state = null, action) => {
    console.log(action);
    switch (action.type) {
        case USER_ID:
            console.log(action.payload);
            return action.payload;

        default:
            break;
    }
    return state;
}
export default userNameReducer;