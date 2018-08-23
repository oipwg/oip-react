import React from 'react';
import { storiesOf } from '@storybook/react';
import { withNotes } from '@storybook/addon-notes';
import { withKnobs, select} from '@storybook/addon-knobs';

import VideoPlayer from '../src/components/VideoPlayer/VideoPlayer'
import { apocalypse, barbershop } from './TestArtifacts'
import { getArtifactOptions, getFileOptions } from './util'


const stories = storiesOf('VideoPlayer', module);
stories.addDecorator(withKnobs);

const artifacts = getArtifactOptions([apocalypse, barbershop]);

const widthLabel = "Parent Div Width";
const widthOptions = {
	"100px": "100px",
	"200px": "200px",
	"300px": "300px",
	"400px": "400px",
	"500px": "500px",
	"600px": "600px",
};
const widthDefault = '500px';

stories.add('Test against multiple artifacts', () => {
	const width_value = select(widthLabel, widthOptions, widthDefault)

	const artifact_value = select(artifacts.title, artifacts.options, artifacts.default_artifact);
	const artifact = artifacts.map[artifact_value];

	const artifact_files = getFileOptions(artifact);
	const file_value = select(artifact_files.title, artifact_files.options, artifact_files.default_file);
	const artifact_file = artifact_files.map[file_value];

	return (
		<div style={{width: width_value}}>
			<VideoPlayer Artifact={artifact} ArtifactFile={artifact_file} />
		</div>
	)
}, {notes: 'Use knobs to switch between live artifacts & parent div widths!'})