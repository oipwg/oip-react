import React from 'react';

import { storiesOf } from '@storybook/react';
import { withNotes } from '@storybook/addon-notes';
import { withKnobs, select, boolean } from '@storybook/addon-knobs';

import { Provider } from 'react-redux'
import state from 'oip-state'

import { getArtifactOptions, getFileOptions } from './util'
import { apocalypse, barbershop, barbershop_paid, amsterdam } from './TestArtifacts'

import PaymentButton from '../src/components/PaymentButton'

import 'bootstrap/dist/css/bootstrap.min.css'

// Setup Stories
const stories = storiesOf('PaymentButton', module);
stories.addDecorator(withKnobs)

// Setup Knobs Variables
// Setup Type
const type_label = "Type"
const type_options = {
	"Buy": "buy",
	"Play": "play"
}
const type_default = "buy"

// Setup Artifact
const artifacts = getArtifactOptions([apocalypse, barbershop_paid, barbershop])

// Setup Store
const store = state.createStore()

stories.add('Buy Button', withNotes('Using oip-index to pull in a live artifact to pass down as a prop')( () => {
	let state = store.getState()

	const type_value = select(type_label, type_options, type_default)
	const artifact_value = select(artifacts.title, artifacts.options, artifacts.default_artifact)

	const artifact = artifacts.map[artifact_value]

	const artifact_files = getFileOptions(artifact)

	const file_value = select(artifact_files.title, artifact_files.options, artifact_files.default_file)

	const artifact_file = artifact_files.map[file_value]

	let file_state = {
		owned: boolean("File Owned", false),
		isPaid: artifact ? artifact.isPaid() : false,
		hasPaid: boolean("Paid for File", false),
	}

	if (type_value === "buy"){
		file_state.payInProgressBuy = boolean("Payment in Progress", false)
		file_state.payErrorBuy = boolean("Payment Error", false)
	}
	if (type_value === "play"){
		file_state.payInProgressPlay = boolean("Payment in Progress", false)
		file_state.payErrorPlay = boolean("Payment Error", false)
	}
	return (
		<Provider store={store}>
			<PaymentButton 
				Artifact={artifact} 
				ArtifactFile={artifact_file} 
				type={type_value} 
				fileState={file_state} 
			/>
		</Provider>
	)
}));