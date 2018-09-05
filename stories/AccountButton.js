import React from 'react';

import { storiesOf } from '@storybook/react';
import { withNotes } from '@storybook/addon-notes';
import { withKnobs, button } from '@storybook/addon-knobs';
import { specs, describe, it } from 'storybook-addon-specifications'
import {mount} from "enzyme";
import expect from "expect";

import { Provider } from 'react-redux'
import { createStore } from 'oip-state'

import { loginSuccess, logout } from 'oip-state/src/actions/Account/actions'

import AccountButton from '../src/components/AccountButton/AccountButton.js'

import 'bootstrap/dist/css/bootstrap.min.css'

import StoreDebugHelper from './StoreDebugHelper'

// Setup Stories
const stories = storiesOf('AccountButton', module);
stories.addDecorator(withKnobs)

// Setup Store
const store = createStore()

stories.add('Example', () => {
	button("Dispatch Login", () => { store.dispatch(loginSuccess({_username: "demo_username"})) })
	button("Dispatch Logout", () => { store.dispatch(logout()) })

	const story = 
		<Provider store={store}>
			<div>
				<AccountButton />
				<hr />
				<StoreDebugHelper path={['Account', 'showLoginModal']} />
				<StoreDebugHelper path={['Account', 'isLoggedIn']} />
				<StoreDebugHelper path={['Account', 'Account', '_username']} />
			</div>
		</Provider>
	
	specs(() => describe("Login", () => {
		let output = mount(story)
		it('Should say Login', () => {
			expect(output.find("button").text()).toContain('Login')
		})
		it ('Should set showLoginModal on Click', () => {
			output.find("button").simulate('click')
			expect(output.text()).toContain('showLoginModal: true')
		})
		it ('Should show username after Login', () => {
			store.dispatch(loginSuccess({_username: "demo_username"}))
			expect(output.find("button").text()).toContain('demo_username')
		})
		it ('Should remove Username after Logout', () => {
			store.dispatch(logout())
			expect(output.find("button").text()).toContain('Login')
		})
	}))

	return story
});