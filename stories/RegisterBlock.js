import React from 'react';

import { storiesOf } from '@storybook/react';
import { withNotes } from '@storybook/addon-notes';
import { withKnobs, button } from '@storybook/addon-knobs';

import { Provider } from 'react-redux'
import { createStore } from 'oip-state'

import { logout } from 'oip-state/src/actions/Account/actions'

import RegisterBlock from '../src/components/RegisterBlock'

import 'bootstrap/dist/css/bootstrap.min.css'

import StoreDebugHelper from './StoreDebugHelper'

// Setup Stories
const stories = storiesOf('RegisterBlock', module);
stories.addDecorator(withKnobs)

// Setup Store
const store = createStore()

stories.add('Example', () => {
	button("Dispatch Logout", () => { store.dispatch(logout()) })
	return (
		<Provider store={store}>
			<div>
				<RegisterBlock />
				<hr />
				<StoreDebugHelper path={['Account', 'registerFetching']} />
				<StoreDebugHelper path={['Account', 'registerFailure']} />
				<StoreDebugHelper path={['Account', 'registerSuccess']} />
				<StoreDebugHelper path={['Account', 'isLoggedIn']} />
				<StoreDebugHelper path={['Account', 'Account', '_username']} />
			</div>
		</Provider>
	)
});