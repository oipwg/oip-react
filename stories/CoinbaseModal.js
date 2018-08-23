import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withNotes } from '@storybook/addon-notes';
import { withKnobs, select, number, text, boolean } from '@storybook/addon-knobs';

import CoinbaseModal from '../src/components/CoinbaseModal'

import 'bootstrap/dist/css/bootstrap.min.css'

// Setup Stories
const stories = storiesOf('CoinbaseModal', module);
stories.addDecorator(withKnobs)

stories.add('Example', () => {
	let currency = select("Currency", {"Bitcoin": "bitcoin", "Litecoin": "litecoin"}, "bitcoin")

	let address_map = {
		"bitcoin": "19HuaNprtc8MpG6bmiPoZigjaEu9xccxps",
		"litecoin": "LbpjYYPwYBjoPQ44PrNZr7nTq7HkYgcoXN"
	}

	let address = text("Address", address_map[currency])
	let amount = number("Purchase Amount", 1)
	return (
		<CoinbaseModal 
			isOpen={boolean("Is Open", true)}
			currency={currency}
			address={address}
			amount={amount}

			onClose={action("On Close")}
			onCancel={action("On Cancel")}
			onSuccess={action("On Success")}
		/>
	)
});