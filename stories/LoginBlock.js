import React from 'react';

import { storiesOf } from '@storybook/react';
import { withNotes } from '@storybook/addon-notes';

import { specs, describe, it } from 'storybook-addon-specifications'
import {mount, shallow, render} from "enzyme";
import expect from "expect";

import { Provider } from 'react-redux'
import { createStore, loginSuccess, logout, accountLogin } from 'oip-state'

import LoginBlock from '../src/components/LoginBlock/LoginBlock'

import 'bootstrap/dist/css/bootstrap.min.css'

import StoreDebugHelper from './StoreDebugHelper'

// Setup Stories
const stories = storiesOf('LoginBlock', module);

// Setup Store
const store = createStore()

stories.add('Example', () => {
	let login_block

	const story =
		<Provider store={store}>
			<div>
				<LoginBlock />

				<hr />
				
				<button onClick={() => { store.dispatch(accountLogin("email@example.com", "password")) }} className="btn m-1 btn-sm btn-outline-secondary">
					Dispatch Login
				</button>
				<button onClick={() => { store.dispatch(loginSuccess({_username: "demo_username"})) }} className="btn m-1 btn-sm btn-outline-secondary">
					Dispatch Login Success
				</button>
				<button onClick={() => { store.dispatch(logout()) }} className="btn m-1 btn-sm btn-outline-secondary">
					Dispatch Logout
				</button>
				<StoreDebugHelper path={['Account', 'loginFetching']} />
				<StoreDebugHelper path={['Account', 'isLoggedIn']} />
				<StoreDebugHelper path={['Account', 'loginFailure']} />
				<StoreDebugHelper path={['Account', 'Account', '_username']} />
			</div>
		</Provider>
	
	specs(() => describe("LoginBlock", () => {
		let output = mount(story);

		// --------------- Test Validation States ---------------

		// --------------- Test Validation for Email ---------------
		it("Should start empty", () => {
			expect(output.find('#email').text()).toBe("")
			expect(output.find('#password').text()).toBe("")
		})
		it ("Should show no validation state on email blank", () => {
			// Value of nothing should not show an error
			output.find("#email").simulate('change', {target: {value: ""}})
			expect(output.find("#email.is-invalid").length).toBe(0)
			expect(output.find("#email.is-valid").length).toBe(0)
			expect(output.find("#feedback_email").length).toBe(0)
		})
		it ("Should show validation error on invalid email (email)", () => {
			// Set to a known invalid email
			output.find('#email').simulate('change', {target: {value: "email"}})

			expect(output.find("#email.is-invalid").length).toBe(1)
			expect(output.find("#email.is-valid").length).toBe(0)
			expect(output.find("#feedback_email").length).toBe(1)
		})
		it ("Should show validation error on invalid email (email@example.c)", () => {
			// Set to another known invalid email
			output.find("#email").simulate('change', {target: {value: "email@example.c"}})
			expect(output.find("#email.is-invalid").length).toBe(1)
			expect(output.find("#email.is-valid").length).toBe(0)
			expect(output.find("#feedback_email").length).toBe(1)
		})
		it ("Should show validation error on invalid email (@example.com)", () => {
			// Set to another known invalid email
			output.find("#email").simulate('change', {target: {value: "@example.com"}})
			expect(output.find("#email.is-invalid").length).toBe(1)
			expect(output.find("#email.is-valid").length).toBe(0)
			expect(output.find("#feedback_email").length).toBe(1)
		})
		it ("Should show validation success on valid email (email@example.com)", () => {
			// Set to a valid email
			output.find("#email").simulate('change', {target: {value: "email@example.com"}})
			expect(output.find("#email.is-invalid").length).toBe(0)
			expect(output.find("#email.is-valid").length).toBe(1)
			expect(output.find("#feedback_email").length).toBe(0)
		})

		// --------------- Test Validation for Password ---------------

		it ("Should show no validation state on password blank", () => {
			// Value of nothing should not show an error
			output.find("#password").simulate('change', {target: {value: ""}})
			expect(output.find("#password.is-invalid").length).toBe(0)
			expect(output.find("#password.is-valid").length).toBe(0)
			expect(output.find("#feedback_password").length).toBe(0)
		})

		it ("Should show valid state on password inputted", () => {
			// Value of nothing should not show an error
			output.find("#password").simulate('change', {target: {value: "pass"}})
			expect(output.find("#password.is-invalid").length).toBe(0)
			expect(output.find("#password.is-valid").length).toBe(1)
			expect(output.find("#feedback_password").length).toBe(0)
		})

		// --------------- Test Logging In ---------------

		let testLoginError = () => {
			it("Should show Invalid Password on Password being wrong", (done) => {
				output.find("#email").simulate('change', {target: {value: "email@example.com"}})
				output.find("#password").simulate('change', {target: {value: "not_the_password"}})
				output.find("#login_button").simulate('click')

				expect(output.find("#login_button").text()).toBe("Logging in...")
				expect(output.text()).toContain("Account.loginFetching: true")
				expect(output.text()).toContain("Account.isLoggedIn: false")
				expect(output.text()).toContain("Account.Account._username: undefined")


				let checker_error = setInterval(() => {
					let login_button_text = output.find("#login_button").text()
					if (login_button_text !== "Logging in..."){
						clearInterval(checker_error)

						try {
							expect(login_button_text).toBe("Login")
							expect(output.text()).toContain("Invalid Password")
							expect(output.text()).toContain("Account.loginFetching: false")
							expect(output.text()).toContain("Account.isLoggedIn: false")
							expect(output.text()).toContain("Account.loginFailure: true")
							expect(output.text()).toContain("Account.Account._username: undefined")
						} catch (e) {
							store.dispatch(logout())

							done(e)
						}

						store.dispatch(logout())

						done()
					}
				}, 20)
			})
		}
		it ("Should be able to Login", (done) => {
			output.find("#email").simulate('change', {target: {value: "email@example.com"}})
			output.find("#password").simulate('change', {target: {value: "password"}})
			output.find("#login_button").simulate('click')

			expect(output.find("#login_button").text()).toBe("Logging in...")
			expect(output.text()).toContain("Account.loginFetching: true")
			expect(output.text()).toContain("Account.isLoggedIn: false")
			expect(output.text()).toContain("Account.Account._username: undefined")

			let checker_success = setInterval(() => {
				let login_button_text = output.find("#login_button").text()
				if (login_button_text !== "Logging in..."){
					clearInterval(checker_success)
					expect(login_button_text).toBe("Logged In")
					expect(output.text()).toContain("Account.loginFetching: false")
					expect(output.text()).toContain("Account.isLoggedIn: true")
					expect(output.text()).toContain("Account.Account._username: email@example.com")

					store.dispatch(logout())

					testLoginError()

					done()
				}
			}, 20)
		})
	}))

	return story
});