import React from 'react';

import { storiesOf } from '@storybook/react';
import { withNotes } from '@storybook/addon-notes';
import { withKnobs, button } from '@storybook/addon-knobs';

import { Provider } from 'react-redux'
import state from 'oip-state'

import { logout } from 'oip-state/src/actions/Account/actions'

import LoginBlock from '../src/components/LoginBlock'

import 'bootstrap/dist/css/bootstrap.min.css'

import StoreDebugHelper from './StoreDebugHelper'

// Setup Stories
const stories = storiesOf('LoginBlock', module);
stories.addDecorator(withKnobs)

// Setup Store
const store = state.createStore()

stories.add('Example', withNotes('')( () => {
	button("Dispatch Logout", () => { store.dispatch(logout()) })
	return (
		<Provider store={store}>
			<div>
				<LoginBlock />
				<hr />
				<StoreDebugHelper path={['Account', 'loginFetching']} />
				<StoreDebugHelper path={['Account', 'isLoggedIn']} />
				<StoreDebugHelper path={['Account', 'Account', '_username']} />
			</div>
		</Provider>
	)
}));