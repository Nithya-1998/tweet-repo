import { ALL_USERS } from './actions';
const sendUserAction = (allUser) => {
    console.log(allUser);
    return {
        type: ALL_USERS,
        payload: allUser
    }
}
export default sendUserAction;