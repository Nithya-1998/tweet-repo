import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './header.css';
import Tweet from './tweet';
import { REST_API_TWEET_SERVICE, REST_API_USER_SERVICE } from './restapiPath';


function Profile(props) {
    const [myProfile, setMyProfile] = useState([]);
    const [myTweets, setMyTweets] = useState([]);
    const [message, setMessage] = useState(null);
    const [deleteTweetById, setDeleteById] = useState(null);

    useEffect(() => {
        axios.get(REST_API_TWEET_SERVICE + 'find/' + window.localStorage.getItem("loginId")).then((response) => {
            setMyTweets(response.data);
        }, (error) => {
            setMessage(error.data);
            setTimeout(() => {
                setMessage(null);
            }, 3000);
        })
    }, []);
    useEffect(() => {
        axios.get(REST_API_USER_SERVICE + "user/search/" + window.localStorage.getItem("loginId")).then((response) => {
            setMyProfile(response.data);
        }, (error) => {
            console.log(error.data);
        })
    }, []);
    const deleteTweet = (id) => {
        return axios.delete(REST_API_TWEET_SERVICE + window.localStorage.getItem("loginId") + '/delete/' + id).then((response) => {
            axios.get(REST_API_TWEET_SERVICE + 'find/' + window.localStorage.getItem("loginId")).then((response) => {
                setMyTweets(response.data);
            }, (error) => {
                setMessage(error.data);
                setTimeout(() => {
                    setMessage(null);
                }, 3000);
            })
        }, (error) => {
            console.log(error.data);
        })
    }

    const renderMyTweets = () => {
        return myTweets.map((tweet) => {
            return (
                <div>
                    <Tweet
                        key={tweet._id}
                        tweet={tweet}
                        _id={tweet._id}
                        message={tweet.message}
                        loginId={tweet.loginId}
                        emailId={tweet.emailId}
                        myhashtag={tweet.message}
                        replyTweets={tweet.replyTweets}
                        postDTTM={tweet.postDTTM}
                        postLikeCount={tweet.postLikeCount}
                        deleteTweetById={deleteTweet}
                    >
                    </Tweet>
                </div>)
        })
    }
    const handleRedirection = () => {
        return props.history.push("/allTweets");
    }
    return (
        <div>
            < div className="container-fluid">
                <div className="row mt-3">
                    <div class="col-md-12 col-lg-12 col-sm-12 mb-2">
                        <span className="d-flex text-center">
                            <img class="rounded-circle z-depth-5" width="70" height="70" alt="profile picture" src="https://www.donkey.bike/wp-content/uploads/2020/12/user-member-avatar-face-profile-icon-vector-22965342-e1608640557889.jpg"
                                data-holder-rendered="true" />
                            <span className="flex-shrink-1 mt-3">
                                <span className="mr-2">{myTweets.length} posts</span>
                            </span>
                            <span className="flex-shrink-1 mt-3">
                                <span className="mr-2">0 following</span>
                            </span>
                            <span className="flex-shrink-1 mt-3">
                                <span className="mr-2"> 0 followers</span>
                            </span>
                        </span>
                    </div>
                    {message === undefined &&
                        <div>
                            <div className="alert alert-info mt-2  ml-4 mr-4" role="alert">
                                <h3>No Tweets yet! Enjoy tweeting with friends...</h3>
                            </div>
                        </div>
                    }
                    {message === "Redirecting" &&
                        handleRedirection()
                    }

                    {message !== undefined && message !== "Redirecting" &&

                        <div className="container-fluid">
                            <b className="ml-3">{myProfile.loginId}</b>
                            <div className="row mt-3">
                                {renderMyTweets()}
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div >
    );
}
export default Profile;