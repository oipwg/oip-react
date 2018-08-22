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

stories.add('Test against multiple artifacts', withNotes('Use knobs to switch between live artifacts')( () => {

	const artifact_value = select(artifacts.title, artifacts.options, artifacts.default_artifact);
	const artifact = artifacts.map[artifact_value];

	const artifact_files = getFileOptions(artifact);
	const file_value = select(artifact_files.title, artifact_files.options, artifact_files.default_file);
	const artifact_file = artifact_files.map[file_value];

	return (
		<div style={{width: "500px"}}>
			<VideoPlayer Artifact={artifact} ArtifactFile={artifact_file} />
		</div>
		)
	}
));

stories.add('width: 300px', withNotes('Testing responsive design')( () => (
	<div style={{width: "300px"}}>
		<VideoPlayer Artifact={barbershop} ArtifactFile={barbershop.getFiles()[0]} />
	</div>
)));

stories.add('width: 600px', withNotes('Testing responsive design')( () => (
	<div style={{width: "600px"}}>
		<VideoPlayer Artifact={barbershop} ArtifactFile={barbershop.getFiles()[0]} />
	</div>
)));

stories.add('width: 900px', withNotes('Testing responsive design')( () => (
	<div style={{width: "900px"}}>
		<VideoPlayer Artifact={barbershop} ArtifactFile={barbershop.getFiles()[0]} />
	</div>
)));