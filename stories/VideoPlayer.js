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

const widthLabel = "Width";
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
};
const widthDefault = '500px';

stories.add('VideoPlayer', withNotes('Use knobs to switch between live artifacts')( () => {

	const artifact_value = select(artifacts.title, artifacts.options, artifacts.default_artifact);
	const artifact = artifacts.map[artifact_value];

	const artifact_files = getFileOptions(artifact);
	const file_value = select(artifact_files.title, artifact_files.options, artifact_files.default_file);
	const artifact_file = artifact_files.map[file_value];
	const width = select(widthLabel, widthOptions, widthDefault)

	return (
		<div style={{width: width}}>
			<VideoPlayer Artifact={artifact} ArtifactFile={artifact_file} />
		</div>
		)
	}
));
