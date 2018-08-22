import React from 'react';
import { storiesOf, addDecorator } from '@storybook/react';
import { withNotes } from '@storybook/addon-notes';
import { withKnobs, object, select} from '@storybook/addon-knobs';
import ImageViewer from '../src/components/ImageViewer/ImageViewer.js'
import { getFileOptions, getArtifactOptions} from './util.js'
import { amsterdam, apocalypse, barbershop, scout } from './TestArtifacts'

const stories = storiesOf('ImageViewer', module);
stories.addDecorator(withKnobs)
stories.addDecorator(withNotes)

const artifacts = getArtifactOptions([amsterdam, scout])

stories.add('Knobs', withNotes('Passing kobs')( () => {

	const artifact_value = select(artifacts.title, artifacts.options, artifacts.default_artifact)
	const artifact = artifacts.map[artifact_value]

	const artifact_files = getFileOptions(artifact)

	const file_value = select(artifact_files.title, artifact_files.options, artifact_files.default_file)

	const artifact_file = artifact_files.map[file_value]

	return (
		<div style={{width: "500px"}}>
			<ImageViewer artifact={artifact} artifactFile={ artifact_file}/>
		</div>
	)
}))

stories.add('width: 300px', withNotes('Using oip-index to pull in a live artifact to pass down as a prop')( () => (
	<div style={{width: "300px"}}>
		<ImageViewer artifact={amsterdam} artifactFile={ amsterdam.getFiles()[0]}/>
    </div>
	
)))

stories.add('width: 600px', withNotes('Using oip-index to pull in a live artifact to pass down as a prop')( () => (
	<div style={{width: "600px"}}>
		<ImageViewer artifact={amsterdam} artifactFile={amsterdam.getFiles()[0]} />
    </div>
)))

stories.add('width: 900px Second File', withNotes('Using oip-index to pull in a live artifact to pass down as a prop')( () => (
	<div style={{width: "900px"}}>
		<ImageViewer artifact={amsterdam} artifactFile={amsterdam.getFiles()[1]} />
    </div>
)))

stories.add('height: 300px Second File', withNotes('Using oip-index to pull in a live artifact to pass down as a prop')( () => (
	<div style={{height: "200px"}}>
		<ImageViewer artifact={amsterdam} artifactFile={amsterdam.getFiles()[1]} />
    </div>
)))

stories.add('Art Prop Test', withNotes('Using oip-index to pull in a live artifact to pass down as a prop')( () => (
	<div style={{width: "500px"}}>
		<ImageViewer artifact={amsterdam} artifactFile={amsterdam.getFiles()[0]} />
	</div>
)))