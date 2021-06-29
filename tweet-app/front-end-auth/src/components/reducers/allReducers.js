import { combineReducers } from "redux";
import allTweetReducer from "./allTweetReducer";
import allUserReducer from "./allUserReducer";
import userNameReducer from "./nameReducer";
const allReducers = combineReducers({
    allTweets:allTweetReducer,
    allUser: allUserReducer,
    userName: userNameReducer,
    isLoggedIn:allUserReducer,
    tweet:allTweetReducer
});
export default allReducers;