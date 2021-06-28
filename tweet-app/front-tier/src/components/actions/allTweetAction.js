import { ALL_TWEETS } from './actions';
const allTweetAction = (allTweets) => {
    console.log(allTweets);
    return {
        type: ALL_TWEETS,
        payload: allTweets
    }
}
export default allTweetAction;