import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Axios from 'axios';
import sendUserAction from '../actions/allUserAction';
import './login.css';
import { Link } from 'react-router-dom';
import userNameAction from '../actions/userNameAction';
import loginAction from '../actions/loginAction';
import allTweetAction from '../actions/allTweetAction';
import { REST_API_TWEET_SERVICE, REST_API_USER_SERVICE } from './restapiPath';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loginUser: [],
            loginId: '',
            password: '',
            newPassword: '',
            oldUser: [],
            isExist: true,
            emailError: '',
            passwordError: '',
            errorMsg: '',
            buttonStatus: false,
            forgetPwd: false,
            user: [],
            allTweets: [],
            isLogingIn: false
        }
        this.getAllUsers();
        this.getAllTweets();
    }
    componentDidMount() {
        this.getAllUsers();
    }
    getAllTweets = () => {
        Axios.get(REST_API_TWEET_SERVICE + 'all').then((response) => {
            this.setState({ allTweets: response.data });
            this.props.allTweets(response.data);
            return response.data;
        }, (error) => {
            console.log(error.data);
        })
    }
    getAllUsers = () => {
        Axios.get(REST_API_USER_SERVICE + 'users/all').then((response) => {
            this.setState({ loginUser: response.data });
            this.props.sendAllUser(response.data);
            return response.data;
        }, (error) => {
            console.log(error.data);
        })
    }
    handleNewUserExist = () => {
        let exist = false;
        let olduser = this.props.allUser.filter((user) => {
            return ((user.loginId === this.state.loginId) && (user.password === this.state.password));
        })
        if (olduser.length === 0) {
            this.setState({ errorMsg: "Invalid UserId/Password", isExist: false });
        } else {
            this.setState({ oldUser: olduser, isExist: true, buttonStatus: true, isLogingIn: true });
            exist = true;
            this.props.loginClicked(exist);
            this.props.sendUserName(this.state.loginId);
            this.props.history.push('/alltweets');
        }
        if (exist) {
            console.log(this.props.loginClicked(exist))
        }
    }
    handleUpdatePwd = () => {
        let userDto = {
            "loginId": this.state.loginId,
            "password": this.state.newPassword,
            "isLogin": true
        }
        Axios.put(REST_API_USER_SERVICE + 'forgot', userDto).then((response) => {
            this.setState({ forgetPwd: false });
            this.props.history.push('/login');
        }, (error) => {
            this.setState({ isExist: false, errorMsg: "New Password should not be same as Old Password" });
            this.intervaltime();
            console.log(error.data);
        })
    }
    handleLoginIdChange = (event) => {
        this.setState({ loginId: event.target.value })
    }
    handlePwdChange = (event) => {
        this.setState({ password: event.target.value })
    }
    handleNewPwdChange = (event) => {
        this.setState({ newPassword: event.target.value });
    }
    intervaltime = () => {
        setTimeout(() => {
            this.setState({ isExist: true })
        }, 3000)
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let userDto = {
            "loginId": this.state.loginId,
            "password": this.state.password,
            "isLogin": true
        }
        Axios.post(REST_API_USER_SERVICE + 'login', userDto).then((response) => {
            window.localStorage.setItem("emailId", response.data.emailId);
            this.setState({ user: response.data });
            this.props.loginClicked(this.state.isExist);
            this.props.sendUserName(this.state.loginId);
            this.props.history.push('/allTweets');
            return response.data;
        }, (error) => {
            this.setState({ isExist: false, errorMsg: "Invalid Username/Password" });
            this.intervaltime();
            console.log(error.data);
        })
        window.localStorage.setItem("loginId", this.state.loginId);

    }
    handleForgetPwd = (event) => {
        event.preventDefault();
        this.handleUpdatePwd();
        this.intervaltime();
    }
    render() {
        return (
            <div>
                <form>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-sm-12 col-lg-7">
                                <div className="card mt-4 mb-5">
                                    <div className="card-title h1 ml-4 mt-4">Login</div>
                                    {!this.state.isExist &&
                                        <div className="alert alert-danger mt-2  ml-4 mr-4" role="alert">
                                            {this.state.errorMsg}
                                        </div>}
                                    {this.state.isLogingIn &&
                                        <div className="alert alert-danger mt-2  ml-4 mr-4" role="alert">
                                            Hello, {this.state.loginId}
                                        </div>}
                                    <div className="mt-2 ml-4 mr-4">
                                        <div className="col-sm-12 col-md-12 col-lg-12">
                                            <label for="loginId"><b>Login Id : </b></label>
                                            <input type="text" data-testid="loginId" id="loginId" className="loginId" value={this.state.loginId} onChange={this.handleLoginIdChange} placeholder="Enter Login-id.." required ></input>
                                        </div>

                                        {!this.state.forgetPwd &&
                                            <div className="col-sm-12 col-md-12 col-lg-12">

                                                <label for="password"><b>Password : </b></label>
                                                <input type="password" data-testid="password" id="password" className="password" value={this.state.password} onChange={this.handlePwdChange}
                                                    placeholder="Enter Password" />
                                                <span className='float-left mb-4'><Link to='/' onClick={() => this.setState({ forgetPwd: true })}>Forget Password?</Link></span>
                                            </div>}

                                        {this.state.forgetPwd &&
                                            <div className="col-sm-12 col-md-12 col-lg-12">

                                                <label for="password"><b>New Password : </b></label>
                                                <input type="password" data-testid="password" id="password" className="password" value={this.state.newPassword} onChange={this.handleNewPwdChange}
                                                    placeholder="Enter New Password" />

                                            </div>}
                                        <span className='float-right mb-4'><Link to='/signup'>NewUser?SignUp</Link></span>
                                        <div className="col-sm-12 col-md-12 col-lg-12 mb-5 mt-5">

                                            {!this.state.forgetPwd &&
                                                <div className="btn-group mb-4 mt-5 ml-5 float-right">
                                                    <button type="button" onClick={this.handleSubmit} className="btn btn-success font-weight-bold">
                                                        Login
                                                    </button>
                                                </div>}
                                            {this.state.forgetPwd &&
                                                <div className="btn-group mb-1 mt-3 float-left">
                                                    <button type="button" onClick={this.handleForgetPwd} className="btn btn-success font-weight-bold">
                                                        Submit
                                                    </button>
                                                </div>}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}
function storeToprops(store) {
    console.log(store.allUser);
    return {
        allUser: store.allUser
    }
}
function dispatchToaction(dispatch) {
    return bindActionCreators({
        sendAllUser: sendUserAction,
        sendUserName: userNameAction,
        loginClicked: loginAction,
        allTweets: allTweetAction
    }, dispatch);
}

export default connect(storeToprops, dispatchToaction)(Login);