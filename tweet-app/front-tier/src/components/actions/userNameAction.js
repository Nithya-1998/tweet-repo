import { USER_ID } from './actions';
const userNameAction = (email) => {
    console.log(email);
    return {
        type: USER_ID,
        payload: email
    }
}
export default userNameAction;