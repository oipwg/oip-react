import React from 'react';
import { createStore } from 'oip-state'
import { Provider } from 'react-redux'

//audioPlayback controls and css for testing
import { PlayButton, PauseButton } from 'react-player-controls'
import '../src/components/AudioViewer/assets/styles/AudioViewer.scss'

//storybook addons
import { storiesOf } from '@storybook/react';
import { withKnobs, select} from '@storybook/addon-knobs';

//test components and functions
import AudioWaveSurfer from '../src/components/AudioViewer/AudioWaveSurfer'
import { apocalypse, barbershop, barbershop_paid, amsterdam, scout, CorMetallicum, dweb, sintel, eightbit} from './TestArtifacts'
import { getArtifactOptions, getFileOptions } from './util'
import {setActiveArtifact} from "oip-state/src/actions/ActiveArtifact/thunks";
import {playPauseAudioFile} from "oip-state/src/actions/ActiveArtifactFiles/actions";
import {fileToUID, setActiveFile} from "oip-state/src/actions/ActiveArtifactFiles/thunks";


const stories = storiesOf('AudioWaveSurfer', module);
stories.addDecorator(withKnobs);

const store = createStore();

const artifacts = getArtifactOptions([apocalypse, barbershop, barbershop_paid, amsterdam, scout, CorMetallicum, dweb, sintel, eightbit]);

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

const heightLabel = "Parent Div Height";
const heightOptions = {
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
const heightDefault = '400px';

stories.add('Artifact via Redux', () => {
	const artifact_value = select(artifacts.title, artifacts.options, "Cor Metallicum");
	const artifact = artifacts.map[artifact_value];

	const artifact_files = getFileOptions(artifact);
	const file_value = select(artifact_files.title, artifact_files.options, artifact_files.default_file);
	const artifact_file = artifact_files.map[file_value];

	const width_value = select(widthLabel, widthOptions, widthDefault);
	const height_value = select(heightLabel, heightOptions, heightDefault);

	store.dispatch(setActiveArtifact(artifact));
	store.dispatch(setActiveFile(artifact_file))

	let uid = fileToUID(artifact_file);
	return (
		<Provider store={store}>
			<div style={{width: width_value, height: height_value, backgroundColor: "black"}}>
				<div className={"d-flex p-3"}>
					<PlayButton isEnabled={true} onClick={() => {store.dispatch(playPauseAudioFile(uid, true))}}/>
					<PauseButton isEnabled={true} onClick={() => {store.dispatch(playPauseAudioFile(uid, false))}}/>
				</div>
				<AudioWaveSurfer />
			</div>
		</Provider>
	)
}, {notes: 'Use knobs to switch between live artifacts & parent div widths!'});

stories.add('Load Artifact via prop', () => {
	const artifact_value = select(artifacts.title, artifacts.options, "Cor Metallicum");
	const artifact = artifacts.map[artifact_value];

	const artifact_files = getFileOptions(artifact);
	const file_value = select(artifact_files.title, artifact_files.options, artifact_files.default_file);
	const artifact_file = artifact_files.map[file_value];

	const width_value = select(widthLabel, widthOptions, widthDefault);
	const height_value = select(heightLabel, heightOptions, heightDefault);

	store.dispatch(setActiveArtifact(artifact));

	let uid = fileToUID(artifact_file);
	return (
		<Provider store={store}>
			<div style={{width: width_value, height: height_value, backgroundColor: "black"}}>
				<div className={"d-flex p-3"}>
					<PlayButton isEnabled={true} onClick={() => {store.dispatch(playPauseAudioFile(uid, true))}}/>
					<PauseButton isEnabled={true} onClick={() => {store.dispatch(playPauseAudioFile(uid, false))}}/>
				</div>
				<AudioWaveSurfer ArtifactFile={artifact_file} />
			</div>
		</Provider>
	)
}, {notes: 'Use knobs to switch between live artifacts & parent div widths!'});