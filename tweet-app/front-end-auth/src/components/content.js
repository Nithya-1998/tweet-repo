import React, { Profiler } from 'react';
import { Switch, Link } from 'react-router-dom';
import Login from './containers/login';
import { GuardProvider, GuardedRoute } from 'react-router-guards';
import { connect } from 'react-redux';
import Signup from './containers/signup';
import AllTweets from './containers/alltweets';
import EditTweet from './containers/editTweet';
import Friends from './containers/friends';
import Profile from './containers/profile';
const requireLogin = (to, from, next, isLoggedIn) => {
    if (to.meta.auth) {
        console.log(to.meta.isLoggedIn);
        if (to.meta.isLoggedIn != null) {
            next();
        }
    } else {
        next();
    }
};

class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <div>
                <GuardProvider guards={[requireLogin]}>
                    <Switch>
                        <GuardedRoute exact path="/" component={Login}></GuardedRoute>
                        <GuardedRoute path="/login" component={Login}></GuardedRoute>
                        <GuardedRoute path="/signup" component={Signup}></GuardedRoute>
                        <GuardedRoute path="/allTweets" component={AllTweets} meta={{ auth: true, isLoggedIn: this.props.isLoggedIn }} isLoggedIn={this.props.isLoggedIn}></GuardedRoute>
                        <GuardedRoute path="/allTweet" component={AllTweets} meta={{ auth: true, isLoggedIn: this.props.isLoggedIn }} isLoggedIn={this.props.isLoggedIn}></GuardedRoute>
                        <GuardedRoute path="/edit" component={EditTweet} meta={{ auth: true, isLoggedIn: this.props.isLoggedIn }} isLoggedIn={this.props.isLoggedIn}></GuardedRoute>
                        <GuardedRoute path="/allFriends" component={Friends} meta={{ auth: true, isLoggedIn: this.props.isLoggedIn }} isLoggedIn={this.props.isLoggedIn}></GuardedRoute>
                        <GuardedRoute path="/profile" component={Profile} meta={{ auth: true, isLoggedIn: this.props.isLoggedIn }} isLoggedIn={this.props.isLoggedIn}></GuardedRoute>
                        <GuardedRoute path="*" component={NotFound} meta={{ auth: true, isLoggedIn: this.props.isLoggedIn }} isLoggedIn={this.props.isLoggedIn}></GuardedRoute>

                        {/* <GuardedRoute path="/dashboard" component={Dashboard} meta={{ auth: true, isLoggedIn: this.props.isLoggedIn }} isLoggedIn={this.props.isLoggedIn} /> */}
                    </Switch>
                </GuardProvider>
            </div>
        );
    }
}
export function NotFound() {
    return (
        <div>
            <h3>404 Not found</h3>
            <Link to="/">Please Click here to login</Link>
        </div>);
}

function storeToprops(store) {
    console.log(store.userName);
    return {
        isLoggedIn: window.localStorage.getItem("loginId")
    }
}

export default connect(storeToprops, null)(Content);