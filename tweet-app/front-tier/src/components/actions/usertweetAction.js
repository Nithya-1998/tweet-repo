import { USER_TWEET } from './actions';
const userTweetAction = (tweet) => {
    console.log(tweet);
    return {
        type: USER_TWEET,
        payload: tweet
    }
}
export default userTweetAction;