import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withNotes } from '@storybook/addon-notes';
import { withKnobs, button } from '@storybook/addon-knobs';

import { Provider } from 'react-redux'
import { createStore } from 'oip-state'

import { promptCoinbaseModal, setCoinbaseInfo } from 'oip-state/src/actions/Payment/actions'

import CoinbaseWrapper from '../src/components/CoinbaseWrapper'

import 'bootstrap/dist/css/bootstrap.min.css'

import StoreDebugHelper from './StoreDebugHelper'

// Setup Stories
const stories = storiesOf('CoinbaseWrapper', module);
stories.addDecorator(withKnobs)

// Setup Store
const store = createStore()

stories.add('Example', () => {
	button("Dispatch Set Coinbase Info", () => { 
		store.dispatch(setCoinbaseInfo({
			address: "LbpjYYPwYBjoPQ44PrNZr7nTq7HkYgcoXN",
			currency: "litecoin",
			amount: 1
		})) 
	})
	button("Dispatch Show Coinbase Modal", () => { store.dispatch(promptCoinbaseModal()) })
	button("Dispatch Hide Coinbase Modal", () => { store.dispatch(promptCoinbaseModal(false)) })
	return (
		<Provider store={store}>
			<div>
				<CoinbaseWrapper />
				<hr />
				<StoreDebugHelper path={['Payment', 'showCoinbaseModal']} />
				<StoreDebugHelper path={['Payment', 'coinbaseInfo']} />
			</div>
		</Provider>
	)
});
