import React from 'react';
import { storiesOf, addDecorator } from '@storybook/react';
import { withNotes } from '@storybook/addon-notes';
import { withKnobs, object, select} from '@storybook/addon-knobs';
import AudioPlayer from '../src/components/AudioPlayer.js'
import { getFileOptions, getArtifactOptions} from './util.js'
import { CorMetallicum } from './TestArtifacts'


const stories = storiesOf('AudioPlayer', module);
    stories.addDecorator(withKnobs)
    stories.addDecorator(withNotes)

    const artifacts = getArtifactOptions([CorMetallicum])
    stories.add('Single Song', () => {


    const artifact_value = select(artifacts.title, artifacts.options, artifacts.default_artifact)
	const artifact = artifacts.map[artifact_value]

	const artifact_files = getFileOptions(artifact)

	const file_value = select(artifact_files.title, artifact_files.options, artifact_files.default_file)

    const artifact_file = artifact_files.map[file_value]
    
return (
	<div>
		<AudioPlayer Artifact={artifact} ArtifactFile={artifact_file} />
	</div>
	)}, { notes: 'Testing of a single song artifact playing' })