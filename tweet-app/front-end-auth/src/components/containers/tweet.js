import React from 'react';
import axios from 'axios';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import './login.css';
import './styles.css';
import './alltweets';
import allTweetAction from '../actions/allTweetAction';
import userTweetAction from '../actions/usertweetAction';
import { REST_API_TWEET_SERVICE } from './restapiPath';
class Tweet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props._id,
            tweet: this.props.tweet,
            message: this.props.message,
            loginId: this.props.loginId,
            emailId: this.props.emailId,
            postDTTM: this.props.postDTTM,
            postLikeCount: this.props.postLikeCount,
            replyTweets: this.props.replyTweets,
            replyMsg: false,
            liked: true,
            unlike: false,
            allTweets: [],
            isEdit: false,
            isSubmit: false,
            replymessage: "",
            replyTweetSize: this.props.replyTweets.length,
            deleteTweetById: this.props.deleteTweetById,
            isViewMore: false,
            isViewLess: true,
            isPrivate: false,
            myhashtag: this.props.myhashtag
        }
    }

    handleEditMessage = (event) => {
        window.localStorage.setItem("message", event.target.value);
        this.setState({ message: event.target.value });
    }

    editTweet = (event) => {
        event.preventDefault();
        let tweet = {
            "_id": this.state.id,
            "message": this.state.message,
            "loginId": this.state.loginId,
            "emailId": this.state.emailId,
            "postLikeCount": this.state.postLikeCount,
            "replyTweets": this.state.replyTweets,
            "replyTweetSize": this.state.replyTweets.length
        };
        this.setState({ tweet: tweet })
        this.props.sendCurUserTweet(tweet);
        axios.put(REST_API_TWEET_SERVICE + this.state.loginId + '/update/' + this.state.id, tweet).then((response) => {
            this.setState({ isSubmit: true, isEdit: false });
            this.setState({ tweet: response.data });
            axios.get(REST_API_TWEET_SERVICE + 'all').then((response) => {
                this.props.sendAllTweets(response.data);
                return response.data;
            }, (error) => {
                console.log(error.data);
            })
        }, (error) => {
            console.log(error.data);
        })
    }

    editMsg = (event) => {
        this.setState({ message: event.target.value });
    }
    handleReplyMessage = (event) => {
        this.setState({ replymessage: event.target.value });
    }
    onSaveReplyTweet = (event) => {
        event.preventDefault();
        let replyTweet = {
            "loginId": window.localStorage.getItem("loginId"),
            "repliedMessage": this.state.replymessage,
            "replyMsglike": 0,
            "liked": false,
            "_id": ""
        }
        axios.post(REST_API_TWEET_SERVICE + 'reply/' + this.state.id, replyTweet).then((response) => {
            this.setState({ tweet: response.data, replyMsg: false, replyTweets: response.data.replyTweets })
            this.props.sendCurUserTweet(response.data);
        }, (error) => {
            console.log(error.data);
        })
    }
    onDelete = (event) => {
        event.preventDefault();
        this.props.deleteTweetById(this.state.id);
    }

    likeUpdate = (count) => {
        let likeCountDto = {
            "id": "",
            "liked": this.state.liked,
            "count": count
        }
        axios.put(REST_API_TWEET_SERVICE + this.state.loginId + '/like/' + this.state.id, likeCountDto).then((response) => {
            this.setState({ tweet: response.data });
        }, (error) => {
            console.log(error.data);
        })
    }
    handleLike = (event) => {
        event.preventDefault();
        this.setState({ liked: false, postLikeCount: (this.state.postLikeCount + 1) });
        this.likeUpdate(this.state.postLikeCount + 1);
    }
    handleUnlike = (event) => {
        event.preventDefault();
        this.setState({ liked: true, unlike: true, postLikeCount: (this.state.postLikeCount - 1) })
        this.likeUpdate(this.state.postLikeCount - 1);
    }
    handleShare = (event) => {
        event.preventDefault();
        this.setState({ isPrivate: true });
        setTimeout(() => {
            this.setState({ isPrivate: false });
        }, 3000);
    }

    render() {
        return (
            <div>
                <div className="col-sm-12 col-md-6 col-lg-3">
                    <div className="card mb-4 border-grey" style={{ width: "20rem" }}>
                        {/* <img src="" className="card-image-top" style={{ height: '10rem', width: '16.9rem' }} /> */}
                        <div className="card-body">
                            <div className="card-title font-weight-bold">
                                <div className="d-flex">
                                    {!this.state.myhashtag &&
                                        <div className="flex-shrink-1">
                                            @{this.state.loginId}
                                        </div>}
                                    {this.state.myhashtag &&
                                        <div className="flex-shrink-1">
                                            #{this.state.myhashtag}
                                        </div>}
                                    <div className="flex-grow-1">
                                        <div className="text-danger font-weight-bold text-right">
                                            <div class="btn-group dropleft">
                                                <a className="btn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{ textDecoration: "none", cursor: "pointer" }}>
                                                    <i className="material-icons text-dark font-weight-bold">more_vert</i>
                                                </a>
                                                <div className="dropdown-menu">
                                                    {this.props.tweet.loginId === window.localStorage.getItem("loginId") &&
                                                        <div>
                                                            <button className="btn dropdown-item" style={{ float: "left", cursor: "pointer" }} onClick={() => this.setState({ isEdit: true, message: this.state.tweet.message })}>
                                                                <small className="font-weight-bold">Edit</small>
                                                            </button>
                                                            <button className="btn dropdown-item" onClick={this.onDelete} style={{ float: "right", cursor: "pointer" }}>
                                                                <small className="font-weight-bold">Delete</small>
                                                            </button>
                                                        </div>}
                                                    <button className="btn dropdown-item" onClick={this.handleShare} style={{ float: "right", cursor: "pointer" }}>
                                                        <small className="font-weight-bold">Share</small>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-subtitle mt-2 text-muted">
                                <div className="d-flex">
                                    <div className="flex-shrink-1">
                                        <i className="material-icons text-dark">message</i>
                                        {!this.state.isEdit && this.state.message}
                                        {this.state.isEdit && !this.state.isSubmit &&
                                            <textarea type="text" onChange={this.editMsg} value={this.state.message} rows="3" cols="30" maxLength="144" placeholder="Max 144 characters allowed"></textarea>
                                        }
                                        {!this.state.isSubmit && this.state.isEdit &&
                                            <button onClick={this.editTweet} className="btn btn-info"><small>Save</small></button>
                                        }
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="text-dark font-weight-bold text-right">
                                            {this.state.liked &&
                                                <button onClick={this.handleLike} className="btn">
                                                    <i className="material-icons text-dark font-weight-bold">favorite_border</i>
                                                </button>
                                            }
                                            {!this.state.liked &&
                                                <button onClick={this.handleUnlike} className="btn">
                                                    <i className="material-icons text-danger font-weight-bold">favorite</i>
                                                </button>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-text mb-2">
                                <div className="card-subtitle mb-2 text-muted">
                                    <div className="d-flex">
                                        <div className="flex-shrink-1">
                                            <button onClick={() => this.setState({ replyMsg: true })} className="btn">
                                                <i className="material-icons text-danger">reply</i>
                                            </button>

                                            {this.state.replyMsg &&
                                                <textarea type="text" onChange={this.handleReplyMessage} value={this.state.replymessage} rows="3" cols="30" maxLength="50" placeholder="Max 50 characters allowed"></textarea>
                                            }
                                            {this.state.replyMsg &&
                                                <button onClick={this.onSaveReplyTweet} className="btn btn-info"><small>Reply</small></button>
                                            }
                                            {this.state.replyTweets.length === 0 &&
                                                <small className="text-grey">No replies yet</small>
                                            }
                                            {this.state.replyTweets.length !== 0 && this.state.isViewLess &&
                                                <span onClick={() => { this.setState({ isViewMore: true, isViewLess: false }) }}
                                                    style={{ textDecoration: "none", cursor: "pointer" }}>
                                                    <small className="text-grey font-weight-bold">View all {this.state.replyTweets.length} replies</small>
                                                </span>
                                            }
                                            {this.state.replyTweets.length !== 0 && this.state.isViewMore &&
                                                <span onClick={() => { this.setState({ isViewMore: false, isViewLess: true }) }}
                                                    style={{ textDecoration: "none", cursor: "pointer" }}>
                                                    <small className="text-grey font-weight-bold">View less</small>
                                                </span>
                                            }

                                            {this.state.replyTweets.length !== 0 && this.state.isViewMore &&
                                                this.state.replyTweets.map((reply) => {
                                                    return (
                                                        <div>
                                                            <span>
                                                                <span className="font-weight-bold">@{reply.loginId}</span>
                                                                <span className="ml-3">{reply.repliedMessage}</span>
                                                            </span>
                                                            <div className="ml-5">{<PostDate postDTTM={reply.repliedDTTM}></PostDate>} </div>
                                                        </div>
                                                    );

                                                })
                                            }

                                        </div>
                                        <div className="flex-grow-1">
                                            <div className="text-dark font-weight-bold text-right mr-3">
                                                {this.state.postLikeCount}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {this.state.isPrivate && this.props.tweet.loginId !== window.localStorage.getItem("loginId") &&
                                    <div className="alert alert-danger mt-2  ml-4 mr-4" role="alert">
                                        Private Account
                                    </div>}
                                {this.state.isPrivate && this.props.tweet.loginId === window.localStorage.getItem("loginId") &&
                                    <div className="alert alert-danger mt-2  ml-4 mr-4" role="alert">
                                        Service down!
                                    </div>}
                                <div className="text-danger font-weight-bold" style={{ float: "right" }}>
                                    <PostDate postDTTM={this.state.postDTTM}></PostDate>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

function storeToprops(store) {
    return {
        allUser: store.allUser,
        allTweets: store.allTweets
    }
}
function dispatchToaction(dispatch) {
    return bindActionCreators({
        sendCurUserTweet: userTweetAction,
        sendAllTweets: allTweetAction
    }, dispatch);
}

export function PostDate(props) {

    let currentDate = new Date();
    let oldDate = new Date(props.postDTTM);

    const totalSeconds = Math.floor(Math.abs((oldDate.getTime() - currentDate.getTime()) / 1000));

    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);
    let postTime;
    if (totalDays > 0) {
        postTime = totalDays + "d ago";
    } else {
        if (totalHours <= 24) {
            if (totalMinutes >= 60) {
                postTime = totalHours + "h ago";
            } else if (totalMinutes < 60 && totalMinutes > 0) {
                postTime = totalMinutes + "m ago";
            } else if (totalMinutes == 0 && totalSeconds < 60 && totalSeconds >= 0) {
                postTime = "Just now";
            }
        }
    }
    console.log("post time: " + postTime);
    return (<small className="font-weight-bold ml-5">{postTime}</small>);

}

export default connect(storeToprops, dispatchToaction)(Tweet);
