import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from './containers/login';
import Signup from './containers/signup';
import AllTweets from './containers/alltweets';
import EditTweet from './containers/editTweet';

class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <div>
                <Switch>
                    <Route exact path="/" component={Login}></Route>
                    <Route path="/login" component={Login}></Route>
                    <Route path="/signup" component={Signup}></Route>
                    <Route path="/allTweets" component={AllTweets}></Route>
                    <Route path="/allTweet" component={AllTweets}></Route>
                    <Route path="/edit" component={EditTweet}></Route>
                    {/* <Route path="/profile" component={Profile}></Route> */}
                </Switch>
            </div>
        );
    }
}

export default Content;