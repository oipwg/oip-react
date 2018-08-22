import React from 'react';
import { storiesOf } from '@storybook/react';
import { withNotes } from '@storybook/addon-notes';
import artifact from './TestArtifacts'
import { amsterdam } from './TestArtifacts'
import { withKnobs, object} from '@storybook/addon-knobs/react';
import ImageViewer from '../src/components/ImageViewer/ImageViewer.js'

const stories = storiesOf('ImageViewer', module);
stories.addDecorator(withKnobs)

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