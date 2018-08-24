import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, select} from '@storybook/addon-knobs';

import VideoPlayer from '../src/components/VideoPlayer/VideoPlayer'
import { apocalypse, barbershop, barbershop_paid, amsterdam, scout, CorMetallicum, dweb } from './TestArtifacts'
import { getArtifactOptions, getFileOptions } from './util'


const stories = storiesOf('VideoPlayer', module);
stories.addDecorator(withKnobs);

const artifacts = getArtifactOptions([apocalypse, barbershop, barbershop_paid, amsterdam, scout, CorMetallicum, dweb]);

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
const widthDefault = '500px';

stories.add('Test against multiple artifacts', () => {
	const artifact_value = select(artifacts.title, artifacts.options, artifacts.default_artifact);
	const artifact = artifacts.map[artifact_value];

	const artifact_files = getFileOptions(artifact);
	const file_value = select(artifact_files.title, artifact_files.options, artifact_files.default_file);
	const artifact_file = artifact_files.map[file_value];

	const width_value = select(widthLabel, widthOptions, widthDefault)

	return (

		<div style={{width: width_value}}>
			<VideoPlayer Artifact={artifact} ArtifactFile={artifact_file} />
		</div>
	)
}, {notes: 'Use knobs to switch between live artifacts & parent div widths!'});

stories.add('Render from None', () => {
	const artifact_value = select(artifacts.title, artifacts.options, "None");
	const artifact = artifacts.map[artifact_value];

	const artifact_files = getFileOptions(artifact);
	const file_value = select(artifact_files.title, artifact_files.options, artifact_files.default_file);
	const artifact_file = artifact_files.map[file_value];

	const width_value = select(widthLabel, widthOptions, widthDefault)

	return (

		<div style={{width: width_value}}>
			<VideoPlayer Artifact={artifact} ArtifactFile={artifact_file} />
		</div>
	)
}, {notes: 'Renders a VideoPlayer first with an undefined artifact. Test this.player functionality.'});
