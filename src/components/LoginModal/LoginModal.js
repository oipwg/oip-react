import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';

import { promptLogin, promptRegister } from 'oip-state';

import LoginBlock from '../LoginBlock/LoginBlock.js';
import RegisterBlock from '../RegisterBlock/RegisterBlock.js';

class LoginModal extends Component {
	constructor(props){
		super(props);

		this.onRegisterClick = this.onRegisterClick.bind(this);
		this.onLoginClick = this.onLoginClick.bind(this);
		this.onCancel = this.onCancel.bind(this);
	}

	onRegisterClick(){
		this.props.promptRegister()
	}

	onLoginClick(){
		this.props.promptLogin()
	}

	onCancel(){
		this.props.promptLogin(false)
		this.props.promptRegister(false)
	}

	render() {
		// show_modal will be true if either prop is true
		let show_modal = this.props.show_login_modal || this.props.show_register_modal

		return (
			<div>
				{show_modal ?
				<Modal isOpen={show_modal} toggle={this.onCancel} className={this.props.className}>
					<ModalBody style={{margin: "auto", width: "90%"}} className="text-center">
						{this.props.show_login_modal ? <LoginBlock onRegisterClick={this.onRegisterClick} /> : null }
						{this.props.show_register_modal ? <RegisterBlock onLoginClick={this.onLoginClick} /> : null }
					</ModalBody>
					<ModalFooter>
						<Button color="secondary" onClick={this.onCancel}>Cancel</Button>
					</ModalFooter>
				</Modal> 
				: 
				null}
			</div>
		);
	}
}

function mapStateToProps(state) {
    return {
        show_login_modal: state.Account.showLoginModal,
        show_register_modal: state.Account.showRegisterModal
    }
}

const mapDispatchToProps = {
    promptLogin,
    promptRegister
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal);