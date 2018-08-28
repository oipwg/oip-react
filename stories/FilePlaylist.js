import React from 'react';
import { storiesOf } from '@storybook/react';
import {withKnobs, select, boolean} from '@storybook/addon-knobs';

import FilePlaylist from '../src/components/FilePlaylist/FilePlaylist'
import { apocalypse, barbershop, barbershop_paid, amsterdam, scout, CorMetallicum, dweb, sintel} from './TestArtifacts'
import { getArtifactOptions, getFileOptions } from './util'

const stories = storiesOf('FilePlaylist', module);
stories.addDecorator(withKnobs);

const artifacts = getArtifactOptions([apocalypse, barbershop, barbershop_paid, amsterdam, scout, CorMetallicum, dweb, sintel]);

stories.add('Basic FilePlaylist', () => {
	const artifact_value = select(artifacts.title, artifacts.options, artifacts.default_artifact);
	const artifact = artifacts.map[artifact_value];

	const artifact_files = getFileOptions(artifact);
	const file_value = select(artifact_files.title, artifact_files.options, artifact_files.default_file);
	const artifact_file = artifact_files.map[file_value];

	return (
		<div style={{}}>
			<FilePlaylist Artifact={artifact} ArtifactFile={artifact_file} />
		</div>
	)
}, {notes: 'Basic FilePlaylist. Use knobs to switch between Artifacts/Files'});