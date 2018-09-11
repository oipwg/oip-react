import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withNotes } from '@storybook/addon-notes';
import { withKnobs, button } from '@storybook/addon-knobs';

import { Provider } from 'react-redux'

import { createStore, promptCoinbaseModal, setCoinbaseInfo, coinbasePending, coinbaseComplete } from 'oip-state'

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
	button("Dispatch Coinbase Pending", () => { store.dispatch(coinbasePending()) })
	button("Dispatch Coinbase Success", () => { store.dispatch(coinbaseComplete()) })
	return (
		<Provider store={store}>
			<div>
				<CoinbaseWrapper />
				<hr />
				<button className="btn btn-outline-primary m-1" onClick={() => { store.dispatch(coinbasePending()) }}>Dispatch CoinbasePending</button>
				<button className="btn btn-outline-primary m-1" onClick={() => { store.dispatch(coinbaseComplete()) }}>Dispatch CoinbaseComplete</button>
				<StoreDebugHelper path={['Payment', 'coinbasePending']} />
				<StoreDebugHelper path={['Payment', 'showCoinbaseModal']} />
				<StoreDebugHelper path={['Payment', 'coinbaseInfo']} />
			</div>
		</Provider>
	)
});
