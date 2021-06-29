import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './header.css';
import { REST_API_TWEET_SERVICE } from './restapiPath';

function Friends() {
    const [myfriends, setMyFriends] = useState([]);
    const [follow, setFollow] = useState(true);
    useState(() => {
        axios.get(REST_API_TWEET_SERVICE + 'all').then((response) => {
            setMyFriends(response.data);
        }, (error) => {
            console.log(error.data);
        })
    })
    useEffect(() => {
        axios.get(REST_API_TWEET_SERVICE + 'all').then((response) => {
            setMyFriends(response.data);
        }, (error) => {
            console.log(error.data);
        })
    }, []);

    const renderFriends = () => {
        return myfriends.map((myfriend) => {
            return (
                <div key={myfriend._id} follow={follow} >
                    {
                        myfriend.loginId !== window.localStorage.getItem("loginId") &&
                        <div className="col-sm-6 col-md-6 col-lg-6">
                            <div className="card mb-2 border-grey bg-dark" style={{ width: "23rem", height: "7rem" }}>
                                <h6 className="icon-friend-button text-black btn-info">{myfriend.loginId[0].toUpperCase()}</h6>
                                <div className="card-text mb-1">
                                    <div className="card-subtitle mb-1 text-muted">
                                        <span className="d-flex">
                                            <span className="flex-shrink-1 text-white">
                                                {/* <h6 className="icon-friend-button text-white btn-info">{myfriend.loginId[0].toUpperCase()}</h6> */}
                                                @{myfriend.loginId}
                                            </span>
                                        </span>
                                        <Follow key={myfriend._id} follow={follow}>

                                        </Follow>
                                        {/* <img src="" className="card-image-top" style={{ height: '10rem', width: '16.9rem' }} /> */}
                                    </div>
                                </div>
                            </div>
                        </div>}

                </div>
            );
        })
    }

    return (
        <div>
            <div className="container-fluid">
                <div className="row mt-3">
                    {renderFriends()}
                </div>
            </div>
        </div>
    );
}
export function Follow(params) {
    const [follow, setFollow] = useState(params.follow);
    return (
        <div className="flex-grow-1">
            <div className="text-dark font-weight-bold text-right mr-3">
                {!follow &&
                    <button onClick={() => setFollow(true)} className="btn btn-info">
                        <small>Follow</small>
                    </button>}
                {follow &&
                    <button onClick={() => setFollow(false)} className="btn btn-info">
                        <small>Unollow</small>
                    </button>}

            </div>
        </div>
    );
}


export default Friends;