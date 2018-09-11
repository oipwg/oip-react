import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import validator from 'validator';

import ButtonCheckbox from '../ButtonCheckbox/ButtonCheckbox.js';

import { clearAccountErrors } from "oip-state/src/actions/Account/actions";
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

		// If we have an error set, clear it since we are changing something
		if (this.props.Account.loginFailure){
			this.props.clearAccountErrors()
		}
	}

	updatePassword(event){
		let new_password = event.target.value

		let newState = STATUS.VALID;

		if (new_password === "")
			newState = STATUS.NO_INPUT;

		this.setState({password: new_password, passwordState: newState});

		// If we have an error set, clear it since we are changing something
		if (this.props.Account.loginFailure){
			this.props.clearAccountErrors()
		}
	}

	updateRememberMe(remember_me_status){
		this.setState({rememberMe: remember_me_status });
	}

	render() {
		// Build the Email Validation State
		let email_classes = "form-control input-lg"
		let email_extra_class = ""
		let email_feedback

		switch(this.state.emailState){
			case STATUS.INVALID:
				email_extra_class += "is-invalid"
				email_feedback = <div className="invalid-feedback" id="feedback_email">Email/Identifier is invalid. Please provide your identifier or your account Email.</div> 
				break;
			case STATUS.VALID:
				email_extra_class += "is-valid"
				break;
		}

		// Build the Password Validation State
		let password_classes = "form-control input-lg"
		let password_extra_class = ""
		let password_feedback

		switch(this.state.passwordState){
			case STATUS.VALID:
				password_extra_class += "is-valid"
				break;
		}

		// Build the Login Text
		let login_classes = "btn btn-lg btn-block"
		let login_extra_class = "btn-success"
		let login_text = "Login"
		let login_feedback

		if (this.props.Account.loginFetching) {
			login_text = "Logging in..." 
		}

		if (this.props.Account.loginFailure) {
			switch(this.props.Account.loginErrorType){
				case "InvalidPassword":
					password_extra_class = "is-invalid"
					password_feedback = <div className="invalid-feedback" id="feedback_password">Invalid Password</div>
					break;
				case "AccountNotFoundError":
					email_extra_class = "is-invalid"
					email_feedback = <div className="invalid-feedback" id="feedback_email">No Account for Email/Identifier found</div>
					break;
				default:
					login_feedback = <div className="alert alert-danger col-12">{this.props.Account.loginErrorMessage}</div>
					login_extra_class = "btn-danger"
					login_text = "Login Error"
					break;
			}
		}

		if (this.props.Account.isLoggedIn)
			login_text = "Logged In"

		// Build all the strings using the selected options
		// Add the class that was selected for use
		email_classes = email_classes + " " + email_extra_class
		password_classes = password_classes + " " + password_extra_class
		login_classes = login_classes + " " + login_extra_class

		return (
			<div style={{width: "100%", textAlign: "center"}} id="login-block">
				<h2>Please Login</h2>

				<hr className="" />

				{/* Email Input */}
				<div className="form-group">
					<input 
						type="text" 
						name="email" id="email"
						className={email_classes} 
						onChange={this.updateEmail}
						value={this.state.email}
						placeholder="Email/Identifier" 
					/>
					{email_feedback}
				</div>

				{/* Password Input */}
				<div className="form-group">
					<input  
						type="password"
						id="password" name="password" 
						className={password_classes} 
						onChange={this.updatePassword}
						value={this.state.password}
						placeholder="Password" 
					/>
					{password_feedback}
				</div>

				{/* Remember Me Checkbox */}
				<ButtonCheckbox onChange={this.updateRememberMe} text={"Remember Me"} />

				<hr className="" />

				{/* Login/Register Buttons */}
				<div className="row">
					{login_feedback}
					<div className="col-12 col-sm-5 col-md-5 order-2 order-sm-1">
						<button className="btn btn-lg btn-outline-secondary btn-block" onClick={this.props.onRegisterClick}>Register</button>
					</div>
					<div className="col-12 col-sm-7 col-md-7 order-1 order-sm-2">
						<button id="login_button" className={login_classes} onClick={this.login}>{login_text}</button>
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
	clearAccountErrors,
	accountLogin
}
function mapStateToProps(state) {
	return {
		Account: state.Account,
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginBlock);