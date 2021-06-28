import axios from "axios";
import { ALL_TWEETS, ADD_TWEET, UPDATE_TWEET, DELETE_TWEET, REPLY_TWEET, USER_ID, USER_TWEET } from '../actions/actions';
import { REST_API_TWEET_SERVICE } from "../containers/restapiPath";
var initialState = axios.get(REST_API_TWEET_SERVICE + 'all').then((response) => {
    console.log(response.data)
}, (error) => {
    console.log(error.data);
})
const allTweetReducer = (state = initialState, action) => {

    switch (action.type) {
        case ALL_TWEETS:
            axios.get(REST_API_TWEET_SERVICE + 'all').then((response) => {
            }, (error) => {
                console.log(error.data);
            })
            return action.payload;
        case ADD_TWEET:
            axios.post(REST_API_TWEET_SERVICE + 'add', action.payload).then((response) => {
                return ([...state, response.data]);
            }, (error) => {
                console.log(error.data)
                return error.data;
            });
            break;
        case UPDATE_TWEET:
            let tweet = action.payload
            axios.put(REST_API_TWEET_SERVICE + tweet.loginId + "/update/" + tweet.id, tweet).then((response) => {
                return (state);
            }, (error) => {
                console.log(error.data)
            });
            break;
        case DELETE_TWEET:
            axios.delete(REST_API_TWEET_SERVICE + action.payload.loginId + '/delete/' + action.payload.id).then((response) => {
                axios.get(REST_API_TWEET_SERVICE + 'all').then((res) => {
                    state = res.data;
                })
                return (state);
            }, (error) => {
                console.log(error.data)
            });
            break;
        case REPLY_TWEET:
            axios.post(REST_API_TWEET_SERVICE + 'reply/' + action.payload.id, action.payload).then((response) => {
                return ([...state, response.data]);
            }, (error) => {
                console.log(error.data)
                return error.data;
            });
            break;
        case USER_TWEET:
            return ([...state, action.payload]);
        default:
            break;
    }
    return state;
}
export default allTweetReducer;