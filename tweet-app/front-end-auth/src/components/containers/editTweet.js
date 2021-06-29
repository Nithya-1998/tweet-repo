import React from 'react';
import axios from 'axios';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
class EditTweet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.tweet.id,
            tweet: this.props.tweet,
            editTweet:[]
        }
    }

    render() {
        return (
            <div>
                Edit Tweet
            </div>
            );
    }

}


function storeToprops(store) {
    console.log(store);
    return {
        allUser: store.allUser,
        allTweets: store.allTweets,
        tweet: store.tweet
    }
}
function dispatchToaction(dispatch) {
    return bindActionCreators({
       
    }, dispatch);
}
export default connect(storeToprops, dispatchToaction)(EditTweet);
