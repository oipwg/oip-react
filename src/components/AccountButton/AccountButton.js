import React, { Component } from 'react';
import { connect } from 'react-redux';

import { promptLogin } from 'oip-state'

class AccountButton extends Component {
	constructor(props){
		super(props)

		this.onButtonClick = this.onButtonClick.bind(this)
	}
	onButtonClick(){
		if (!this.props.isLoggedIn)
			this.props.promptLogin()
	}
	render(){
		let loginText = "Login";

		if (this.props.isLoggedIn){
			if (this.props.Account && this.props.Account._username)
				loginText = this.props.Account._username
			else
				loginText = "Logged In"
		}

    	return (
            <button type="button" className="btn btn-outline-dark border-0" style={this.props.style} onClick={this.onButtonClick}>{loginText}</button>
        )
	}
}

const mapDispatchToProps = {
    promptLogin
}

function mapStateToProps(state) {
    return {
        isLoggedIn: state.Account.isLoggedIn,
        Account: state.Account.Account
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountButton)