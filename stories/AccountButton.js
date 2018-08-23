import React from 'react';

import { storiesOf } from '@storybook/react';
import { withNotes } from '@storybook/addon-notes';
import { withKnobs, button } from '@storybook/addon-knobs';

import { Provider } from 'react-redux'
import state from 'oip-state'

import { loginSuccess, logout } from 'oip-state/src/actions/Account/actions'

import AccountButton from '../src/components/AccountButton'

import 'bootstrap/dist/css/bootstrap.min.css'

import StoreDebugHelper from './StoreDebugHelper'

// Setup Stories
const stories = storiesOf('AccountButton', module);
stories.addDecorator(withKnobs)

// Setup Store
const store = state.createStore()

stories.add('Example', () => {
	button("Dispatch Login", () => { store.dispatch(loginSuccess({_username: "demo_username"})) })
	button("Dispatch Logout", () => { store.dispatch(logout()) })
	return (
		<Provider store={store}>
			<div>
				<AccountButton />
				<hr />
				<StoreDebugHelper path={['Account', 'showLoginModal']} />
				<StoreDebugHelper path={['Account', 'isLoggedIn']} />
				<StoreDebugHelper path={['Account', 'Account', '_username']} />
			</div>
		</Provider>
	)
}, { notes: "Trigger redux store action to showLoginModal" });