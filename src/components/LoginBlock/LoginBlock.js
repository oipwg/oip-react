import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import validator from 'validator';

import ButtonCheckbox from '../ButtonCheckbox/ButtonCheckbox.js';

import { accountLogin } from "oip-state/src/actions/Account/thunks";

const STATUS = {
	NO_INPUT: "NO_INPUT",
	VALID: "VALID",
	INVALID: "INVALID"
}

/**
 * The LoginBlock allows users to easily login on any page simply.
 *
 * There is full validation of Email states, as well as a button to allow the user to be remembered later.
 */
class LoginBlock extends Component {
	constructor(props){
		super(props);

		this.state = {
			User: {},
			emailState: STATUS.NO_INPUT,
			passwordState: STATUS.NO_INPUT,
			confirmState: STATUS.NO_INPUT,
			rememberMe: false,
			email: "",
			password: ""
		}

		this.login = this.login.bind(this);
		this.updateEmail = this.updateEmail.bind(this);
		this.updatePassword = this.updatePassword.bind(this);
		this.updateRememberMe = this.updateRememberMe.bind(this);
	}

	login(){
	    this.props.accountLogin(this.state.email, this.state.password, { rememberMe: this.state.rememberMe })
    }

	updateEmail(event){
		let new_email = event.target.value

		let isEmail = validator.isEmail(new_email);

		let newState = isEmail ? STATUS.VALID : STATUS.INVALID;

		if (new_email === "")
			newState = STATUS.NO_INPUT;

		this.setState({email: new_email, emailState: newState});
	}

	updatePassword(event){
		let new_password = event.target.value

		let newState = STATUS.VALID;

		if (new_password === "")
			newState = STATUS.NO_INPUT;

		this.setState({password: new_password, passwordState: newState});
	}

	updateRememberMe(remember_me_status){
		this.setState({rememberMe: remember_me_status });
	}

	render() {
		return (
			<div style={{width: "100%", textAlign: "center"}} id="login-block">
                <h2>Please Login</h2>
				<hr className="" />
				<div className="form-group">
					<input onChange={this.updateEmail}
						   value={this.state.email} type="text" 
                           name="email" id="email" className={"form-control input-lg" + 
                           (this.state.emailState === STATUS.INVALID ? " is-invalid" : "") + 
                           (this.state.emailState === STATUS.VALID ? " is-valid" : "")} 
                           placeholder="Email/Identifier" 
                    />
                    
					{this.state.emailState === STATUS.INVALID ? 
						<div className="invalid-feedback" id="feedback_email">
							Email/Identifier is invalid. Please provide your identifier or your account Email.
						</div> 
						: 
						""
					}
				</div>
				<div className="form-group">
					<input  onChange={this.updatePassword}
							value={this.state.password}
							id="password" name="password" type="password" className={"form-control input-lg" + 
                            (this.state.passwordState === STATUS.INVALID ? " is-invalid" : "") + 
                            (this.state.passwordState === STATUS.VALID ? " is-valid" : "")} 
                            placeholder="Password" 
                    />
                    {this.state.passwordState === STATUS.INVALID ? 
                    <div className="invalid-feedback" id="feedback_password">
                        Invalid Password.
                    </div> : ""
					}
				</div>
				<ButtonCheckbox onChange={this.updateRememberMe} text={"Remember Me"} />
				<hr className="" />
				<div className="row">
					<div className="col-12 col-sm-5 col-md-5 order-2 order-sm-1">
						<button className="btn btn-lg btn-outline-secondary btn-block" 
                                onClick={this.props.onRegisterClick}>Register
                        </button>
					</div>
					<div className="col-12 col-sm-7 col-md-7 order-1 order-sm-2">
                       {this.props.Account.loginFailure ? this.props.Account.loginErrorMessage : null}
                        <button id="login_button" className={"btn btn-lg btn" + (this.props.Account.loginFailure ? "-danger" : "-success") + " btn-block"}
                                onClick={this.login}>{this.props.Account.loginFetching ? "Logging in..." : this.props.Account.loginFailure ? "Login Error" : "Login"}</button>
					</div>
				</div>
			</div>
		);
	}
}

LoginBlock.propTypes = {
	/** 
	 * This function is run when the "Register" button inside the LoginBlock is clicked (so that you can handle switching to a new page/component)
	 * @type {Function}
	 * @param {Event} event - The Register Button onClick event
	 */
	onRegisterClick: PropTypes.func
}
LoginBlock.defaultProps = {
	onRegisterClick: (event) => {
		console.warn("oip-react | No onRegisterClick prop is being passed to the LoginBlock component. Please check your code.")
	}
}

const mapDispatchToProps = {
    accountLogin
}
function mapStateToProps(state) {
    return {
        Account: state.Account,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginBlock);