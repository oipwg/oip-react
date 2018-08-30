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

const store = state.createStore();

const artifacts = getArtifactOptions([apocalypse, barbershop, barbershop_paid, amsterdam, scout, CorMetallicum, dweb, sintel]);

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

stories.add("Test payment state via redux", () => {
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
}, {notes: 'This component is hooked up to redux and is loading files based on the active file'});