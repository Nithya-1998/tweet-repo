import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { bindActionCreators } from 'redux';
import Tweet from './tweet';
import allTweetAction from '../actions/allTweetAction';
import { REST_API_TWEET_SERVICE } from './restapiPath';


class AllTweets extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allTweets: this.props.allTweets,
            allUser: this.props.allUser,
            edittweet: this.props.editTweet,
            deleteTweetById: "",
            _id: "",
            tweet: [],
            isAdd: false,
            message: "",
            loginId: "",
            emailId: "",
            postDTTM: "",
            postLikeCount: "",
            replyTweets: [],
            addmessage: ""
        }
        console.log("In constructor");
        console.log(this.props.allTweets);
        this.getAllTweets();
    }

    getAllTweets = () => {
        axios.get(REST_API_TWEET_SERVICE + 'all').then((response) => {
            console.log(response.data);
            this.setState({ allTweets: response.data });
            return response.data;
        }, (error) => {
            console.log(error.data);
        })
    }
    handleSearch = (event) => {
        event.preventDefault();
        console.log(event.target.value);
        let val = event.target.value;
        this.setState({ searchValue: val });
        if (val === '' || val.length === 0) {
            this.getAllTweets();
        }

        let searchUserTweet = this.state.allTweets.filter((tweet) => {
            return tweet.loginId.toLowerCase().match(val.toLowerCase());
        });
        console.log(searchUserTweet);
        this.setState({ allTweets: searchUserTweet });
    }
    intervaltimestatus = () => {
        setTimeout(() => {
            this.getAllTweets();
        }, 2000)
    }
    deleteTweetById = (id) => {
        axios.delete(REST_API_TWEET_SERVICE + window.localStorage.getItem("loginId") + '/delete/' + id).then((response) => {
            this.getAllTweets();
        }, (error) => {
            console.log(error.data);
        })
    }

    addTweet = (event) => {
        event.preventDefault();
        let addtweet = {
            "loginId": window.localStorage.getItem("loginId"),
            "emailId": window.localStorage.getItem("emailId"),
            "replyTweets": [],
            "postDTTM": "",
            "message": this.state.addmessage,
            "postLikeCount": 0
        };
        axios.post(REST_API_TWEET_SERVICE + 'add', addtweet).then((response) => {
            axios.get(REST_API_TWEET_SERVICE + 'all').then((response) => {
                this.props.sendAllTweets(response.data);
                this.setState({ allTweets: response.data });
                this.intervaltimestatus();
                return response.data;
            }, (error) => {
                console.log(error.data);
            })
        }, (error) => {
            console.log(error.data);
        })
        this.setState({ isAdd: true });
    }
    handleMessage = (event) => {
        this.setState({ addmessage: event.target.value });
    }
    renderAllTweets = () => {
        return (
            this.state.allTweets.map((tweet) => {
                return (
                    <div>
                        <Tweet
                            key={tweet._id}
                            tweet={tweet}
                            _id={tweet._id}
                            message={tweet.message}
                            loginId={tweet.loginId}
                            emailId={tweet.emailId}
                            replyTweets={tweet.replyTweets}
                            postDTTM={tweet.postDTTM}
                            postLikeCount={tweet.postLikeCount}
                            deleteTweetById={this.deleteTweetById}
                        >
                        </Tweet>
                    </div>)
            }))

    }

    render() {
        return (
            <div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12 col-md-6 col-lg-6">
                            <h1 className="display-4 text-dark mt-2 font-weight-bold" style={{ fontSize: "20px" }}>Search Friends</h1>
                            <div className="input-group" style={{ width: "250px" }} >
                                <div className="input-group-prepend mb-1">
                                    <span className="input-group-text" id="search"><i className="material-icons">search</i></span>
                                </div>
                                <input type="text" onChange={this.handleSearch} className="form-control" placeholder="Search user here..." />
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 mt-3 col-lg-4 mb-3">
                            <a >
                                <button type="button" className="btn btn-secondary" style={{ cursor: "pointer" }} data-toggle="modal" data-target="#myModal" >
                                    <i className="material-icons text-white" >add</i>
                                    <span className="text-light font-weight-bold">Post Tweet</span>
                                </button>
                            </a>
                        </div>
                    </div>
                    <div className="modal" id="myModal">
                        <div className="modal-dialog">
                            <div className="modal-content">

                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                                </div>

                                <div className="modal-body text-center">
                                    <label for="postmessage" className="mb-4">Post Message: </label>
                                    <textarea id="postmessage" type="textarea" value={this.state.addmessage} onChange={this.handleMessage}></textarea>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-dark mr-auto" onClick={this.addTweet} data-dismiss="modal">Save</button>
                                        <button type="button" className="btn btn-danger" data-dismiss="modal">Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid">
                    <div className="row">
                        {this.renderAllTweets()}
                    </div>
                </div>
            </div>
        );
    }
}
function storeToprops(store) {
    console.log(store);
    return {
        allTweets: store.allTweets,
        allUser: store.allUser,
        editTweet: store.tweet
    }
}
function dispatchToAction(dispatch) {
    return bindActionCreators({
        sendAllTweets: allTweetAction
    }, dispatch)
}

export default connect(storeToprops, dispatchToAction)(AllTweets);


