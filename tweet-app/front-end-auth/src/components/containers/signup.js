import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import sendUserAction from '../actions/allUserAction';
import './login.css';
import Axios from 'axios';
import { REST_API_USER_SERVICE } from './restapiPath';
const emailRegex = RegExp(
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);
const passwordRegex = RegExp(
    /^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/
);
const phnNumRegex = RegExp(/^[0-9]+$/);

const formValid = ({ formErrors, ...rest }) => {
    let valid = true;
    Object.values(formErrors).forEach(val => {
        val.length > 0 && (valid = false);
    });
    Object.values(rest).forEach(val => {
        val === null && (valid = false);
    });
    return valid;
};
class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allUser: [],
            loginId: null,
            emailId: null,
            password: null,
            confirmPwd: null,
            firstName: null,
            lastName: null,
            phnNum: null,
            checkStatus: false,
            userCheck: [],
            role: ["USER"],
            formErrors: {
                emailId: "",
                password: "",
                confirmPwd: "",
                loginId: "",
                phnNum: "",
                firstName: "",
                lastName: ""
            },
            errorMsg: '',
            isExist: true,
            existMsg: '',
            pwdCheck: false,
            pwdMsg: '',
            buttonStatus: false,
            emailValid: false,
            passwordValid: false,
            passwordMatch: false
        }
        this.getAllUsers();
    }
    // getAllUsers = () => {
    //     console.log(this.props.allUser);
    //     this.setState({ allUser: this.props.allUser });
    // }
    getAllUsers = () => {
        Axios.get(REST_API_USER_SERVICE + 'users/all').then((response) => {
            this.setState({ allUser: response.data });
            this.props.sendAllUser(response.data);
            return response.data;
        }, (error) => {
            console.log(error.data);
        })
    }
    handleChange = e => {
        e.preventDefault();
        const { name, value } = e.target;
        let formErrors = { ...this.state.formErrors };

        switch (name) {
            case "emailId":
                formErrors.emailId = emailRegex.test(value)
                    ? ""
                    : "Invalid email address";
                this.setState({ emailId: value })
                break;
            case "password":
                formErrors.password =
                    passwordRegex.test(value) ? "" :
                        `Min 8 characaters required.
                 Atleast 1 Special Character,
                 1 Uppercase,
                 1 number required`
                break;
            case "confirmPwd":
                console.log(this.state.password);
                formErrors.confirmPwd =
                    (value === this.state.password) ? "" : "Password does not match";
                break;
            case "firstName":
                console.log(this.state.firstName);
                formErrors.firstName =
                    (value.length >= 4) ? "" : "Min 4 characters required";
                break;
            case "lastName":
                console.log(this.state.lastName);
                formErrors.lastName =
                    (value.length >= 1) ? "" : "Min 1 character required";
                break;
            case "phnNum":
                console.log(this.state.phnNum);
                formErrors.phnNum =
                    (value.length >= 10 && phnNumRegex.test(value)) ? "" : "Min 10 digits required";
                break;

            default:
                break;
        }
        this.setState({ formErrors, [name]: value }, () => console.log(this.state));
    };
    userExist() {

        let newUser = {
            "emailId": this.state.emailId,
            "password": this.state.password,
            "loginId": this.state.loginId,
            "firstName": this.state.firstName,
            "lastName": this.state.lastName,
            "phnNum": this.state.phnNum,
            "isLogIn": true,
            "role": this.state.role
        }

        Axios.post(REST_API_USER_SERVICE + 'register', newUser).then((res) => {
            console.log(res.data);
            this.props.history.push('/');
        }, (error) => {
            this.setState({ errorMsg: "LoginId Already Exist..Try new!", checkStatus: true })
            console.log(error.data + "User Already Exist");
        })


    }
    intervaltime = () => {
        setTimeout(() => {
            this.setState({ checkStatus: false })
        }, 3000)
    }
    checkStatus = () => {
        if (this.state.password === this.state.confirmPwd) {
            this.setState({ pwdCheck: false })
        } else {
            this.setState({ pwdCheck: true, pwdMsg: "Password Does Not Match" })
            this.intervaltimestatus();
        }
        this.userExist();
    }
    intervaltimestatus = () => {
        setTimeout(() => {
            this.setState({ pwdCheck: false })
        }, 3000)
    }
    handleSubmit = (e) => {
        e.preventDefault();
        if (formValid(this.state)) {
            this.checkStatus();
            console.log(`
            Email: ${this.state.emailId}
            Password: ${this.state.password}
          `);
        } else {
            console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
        }

    };
    render() {
        const { formErrors } = this.state;
        return (
            <div>
                <form onClick={this.handleSubmit} noValidate>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-sm-12 col-lg-7">
                                <div className="card mt-4 mb-5">
                                    <div className="card-title h1 ml-4 mt-4">SignUp</div>
                                    {this.state.pwdCheck &&
                                        <div className="alert alert-danger mt-2  ml-4 mr-4" role="alert">
                                            {this.state.pwdMsg}
                                        </div>}
                                    {this.state.checkStatus &&
                                        <div className="alert alert-danger mt-2  ml-4 mr-4" role="alert">
                                            {this.state.errorMsg}
                                        </div>}
                                    <div className="mt-2 ml-4 mr-4">
                                        <div className="col-sm-12 col-md-12 col-lg-12">
                                            <label for="loginId"><b>Login Id : </b></label>
                                            <input type="text" id="loginId" name="loginId" className={formErrors.loginId.length > 0 ? "error" : null} onChange={this.handleChange} noValidate
                                                placeholder="Enter Login Id" required />
                                            {formErrors.loginId.length > 0 && (
                                                <div className="alert alert-danger mt-2  ml-4 mr-4" role="alert">
                                                    <span className="errorMessage">
                                                        {formErrors.loginId}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-sm-12 col-md-12 col-lg-12">
                                            <label for="firstName"><b>First Name : </b></label>
                                            <input type="text" id="firstName" name="firstName" className={formErrors.firstName.length > 0 ? "error" : null} onChange={this.handleChange} noValidate
                                                placeholder="Enter First Name" required />
                                            {formErrors.firstName.length > 0 && (
                                                <div className="alert alert-danger mt-2  ml-4 mr-4" role="alert">
                                                    <span className="errorMessage">
                                                        {formErrors.firstName}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-sm-12 col-md-12 col-lg-12">
                                            <label for="lastName"><b>Last Name : </b></label>
                                            <input type="text" id="lastName" name="lastName" className={formErrors.lastName.length > 0 ? "error" : null} onChange={this.handleChange} noValidate
                                                placeholder="Enter Last Name" required />
                                            {formErrors.lastName.length > 0 && (
                                                <div className="alert alert-danger mt-2  ml-4 mr-4" role="alert">
                                                    <span className="errorMessage">
                                                        {formErrors.lastName}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-sm-12 col-md-12 col-lg-12">
                                            <label for="emailId"><b>Email Id : </b></label>
                                            <input type="text" id="emailId" name="emailId" className={formErrors.emailId.length > 0 ? "error" : null} onChange={this.handleChange} noValidate placeholder="Enter Email-id.." required ></input>
                                            {formErrors.emailId.length > 0 && (
                                                <div className="alert alert-danger mt-2  ml-4 mr-4" role="alert">
                                                    <span className="errorMessage">{formErrors.emailId}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-sm-12 col-md-12 col-lg-12">
                                            <label for="password"><b>Password : </b></label>
                                            <input type="password" id="password" name="password" className={formErrors.password.length > 0 ? "error" : null} onChange={this.handleChange} noValidate
                                                placeholder="Enter Password" required />
                                            {formErrors.password.length > 0 && (
                                                <div className="alert alert-danger mt-2  ml-4 mr-4" role="alert">
                                                    <span className="errorMessage">
                                                        {formErrors.password}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-sm-12 col-md-12 col-lg-12">
                                            <label><b>Confirm Password : </b></label>
                                            <input type="password" id="confirmPwd" name="confirmPwd" className={formErrors.confirmPwd === formErrors.password ? "error" : null} noValidate
                                                onChange={this.handleChange} placeholder="Confirm Password" required ></input>
                                            {(formErrors.confirmPwd.length > 0) && (
                                                <div className="alert alert-danger mt-2  ml-4 mr-4" role="alert">
                                                    <span className="errorMessage">{formErrors.confirmPwd}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-sm-12 col-md-12 col-lg-12">
                                            <label for="phnNum"><b>Contact No : </b></label>
                                            <input type="text" id="phnNum" name="phnNum" className={formErrors.phnNum.length > 0 ? "error" : null} onChange={this.handleChange} noValidate placeholder="Enter Contact-No." required ></input>
                                            {formErrors.phnNum.length > 0 && (
                                                <div className="alert alert-danger mt-2  ml-4 mr-4" role="alert">
                                                    <span className="errorMessage">{formErrors.phnNum}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-sm-12 col-md-12 col-lg-12">
                                            <div className="btn-group mb-4 mt-4">
                                                <button type="button" disabled={!formValid(this.state)} onClicl={this.handleSubmit}
                                                    className="btn btn-success font-weight-bold">
                                                    SignUp
                                                </button>
                                            </div>
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
    return {
        allUser: store.allUser
    }
}
function dispatchToaction(dispatch) {
    return bindActionCreators({
        sendAllUser: sendUserAction,
    }, dispatch);
}

export default connect(storeToprops, dispatchToaction)(SignUp);