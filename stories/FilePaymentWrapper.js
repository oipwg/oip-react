import React from 'react';
import { storiesOf } from '@storybook/react';
import {withKnobs, select, boolean} from '@storybook/addon-knobs';
import { Provider } from 'react-redux'
import state from 'oip-state'

import FilePaymentWrapper from '../src/components/FilePaymentWrapper';
import {amsterdam, apocalypse, barbershop, barbershop_paid, CorMetallicum, scout, dweb, sintel} from './TestArtifacts'
import { getArtifactOptions, getFileOptions } from './util';
import {setActiveArtifact} from "oip-state/src/actions/ActiveArtifact/thunks";
import {setActiveFile} from "oip-state/src/actions/ActiveArtifactFiles/thunks";


const stories = storiesOf("FilePaymentWrapper", module);
stories.addDecorator(withKnobs);

const store = state.createStore()

const artifacts = getArtifactOptions([apocalypse, barbershop, barbershop_paid, amsterdam, scout, CorMetallicum, dweb, sintel]);

const isPaidLabel = "isPaid";
const hasPaidLabel = "hasPaid";
const ownedLabel = "owned";

const isPaidOptions = {
	"true": "true",
	"false": "false"
};

const hasPaidOptions = {
	"true": "true",
	"false": "false"
};

const ownedOptions = {
	"true": "true",
	"false": "false"
};

const isPaidDefault = "false";
const hasPaidDefault = "false";
const ownedDefault = "false";

const widthLabel = "Parent Div Width";
const widthOptions = {
	"100": "100px",
	"200": "200px",
	"300": "300px",
	"400": "400px",
	"500": "500px",
	"600": "600px",
	"700": "700px",
	"800": "800px",
	"900": "900px",
	"1000": "1000px",
	"1100": "1100px",
	"100%": "100%"
};
const widthDefault = '100%';

const posterLabel = "Load with poster";
const posterDefault = true;

stories.add("Test payment state", () => {
	const artifact_value = select(artifacts.title, artifacts.options, "Sintel - Third Open Movie by Blender Foundation");
	const artifact = artifacts.map[artifact_value];

	const artifact_files = getFileOptions(artifact);
	const file_value = select(artifact_files.title, artifact_files.options, artifact_files.default_file);
	const artifact_file = artifact_files.map[file_value];

	const width_value = select(widthLabel, widthOptions, widthDefault)
	const loadWithPoster = boolean(posterLabel, posterDefault);

	store.dispatch(setActiveArtifact(artifact));
	store.dispatch(setActiveFile(artifact_file));
	return (
		<Provider store={store}>
			<div style={{width: width_value}}>
				<FilePaymentWrapper usePosterFile={loadWithPoster}/>
			</div>
		</Provider>
	)
}, {notes: 'The FilePaymentWrapper is a wrapper component that decides whether or not to "lock" the file if it is a paid artifact. For the VideoPlayer, ' +
		'this means removing the playback controls. Based on whether or not the file is a paid artifact, has been paid for, or is owned, ' +
		'the wrapper passes down a lockFile variable that the FileViewer component then receives and passes down to a Viewer component.'});