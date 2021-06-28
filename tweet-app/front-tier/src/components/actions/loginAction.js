import { LOGGED_IN } from './actions';
const loginAction = (isLoggedIn) => {
    console.log(isLoggedIn);
    return {
        type: LOGGED_IN,
        payload: isLoggedIn
    }

}
export default loginAction;