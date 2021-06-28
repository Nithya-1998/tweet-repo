import { DELETE_TWEET } from './actions';
const deleteAction = (deteteTweet) => {
    console.log(deteteTweet);
    return {
        type: DELETE_TWEET ,
        payload: deteteTweet
    }

}
export default deleteAction;