import React, { Component } from 'react';
import { connect } from 'react-redux';

import { logout } from 'oip-state/src/actions/Account/actions'
import { accountLogin } from 'oip-state/src/actions/Account/thunks'

class AccountButton extends Component {
	constructor(props){
		super(props)

		this.onButtonClick = this.onButtonClick.bind(this)
	}
	onButtonClick(){
		this.props.accountLogin("sarah@gmail.com", "sarah")
	}
	render(){
		let loginText = "Login";

		if (this.props.isLoggedIn)
			loginText = "Logged In!"

    	return (
            <button type="button" className="btn btn-outline-dark border-0">Login</button>
        )
	}
}

const mapDispatchToProps = {
    accountLogin,
    logout
}

function mapStateToProps(state) {
    return {
        isLoggedIn: state.Account.isLoggedIn,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountButton)