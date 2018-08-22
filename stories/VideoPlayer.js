import React from 'react';
import {Artifact} from 'oip-index'
import { storiesOf } from '@storybook/react';
import { withNotes } from '@storybook/addon-notes';
import { withKnobs, select} from '@storybook/addon-knobs';

import VideoPlayer from '../src/components/VideoPlayer/VideoPlayer'
import { apocalypse, barbershop } from './TestArtifacts'

//21252c - apocalypse
//5533ce - barbershop

const stories = storiesOf('VideoPlayer', module);
stories.addDecorator(withKnobs);

const artifact_map = {
	apocalypse,
	barbershop
};

const file_map = {
	apocalypse: {
		"0": apocalypse.getFiles()[0],
		"1": apocalypse.getFiles()[1],
		"2": apocalypse.getFiles()[2]
	},
	barbershop: {
		"0": barbershop.getFiles()[0],
		"1": barbershop.getFiles()[1],
		"2": barbershop.getFiles()[2],
	}
};
let artifactKnobLabel = "Artifact";
let artifactFileKnobLabel = "ArtifactFile";

let artifactKnobOptions = {
	"Apocalypse": "apocalypse",
	"Barbershop": "barbershop"
};

let artifactFileKnobOptions = {
	"Apocalypse 0": "0",
	"Apocalypse 1": "1",
	"Apocalypse 2": "2",
	"Barbershop 0": "0",
	"Barbershop 1": "1",
	"Barbershop 2": "2"
};

let defaultArtifactKnob = "apocalypse";
let defaultArtifactFileKnob = "0";



stories.add('Test against multiple artifacts', withNotes('Use knobs to switch between live artifacts')( () => {
	const artifact_value = select(artifactKnobLabel, artifactKnobOptions, defaultArtifactKnob, "Artifacts");
	const file_value = select(artifactFileKnobLabel, artifactFileKnobOptions, defaultArtifactFileKnob, "Artifact Files");
	return (
		<div style={{width: "500px"}}>
			<VideoPlayer Artifact={artifact_map[artifact_value]} ArtifactFile={file_map.apocalypse[file_value]} />
		</div>
		)
	}
));

stories.add('live Artifact: barbershop', withNotes('Using oip-index to pull in a live Artifact to pass down as a prop')( () => (
	<div style={{width: "500px"}}>
		<VideoPlayer Artifact={barbershop} ArtifactFile={barbershop.getFiles()[0]} />
	</div>
)));
