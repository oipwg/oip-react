import React from 'react';
import { storiesOf } from '@storybook/react';
import { withNotes } from '@storybook/addon-notes';
<<<<<<< HEAD
import { amsterdam } from './TestArtifact'
=======
import artifact from './TestArtifacts'
>>>>>>> 44643fffc0fbabdf99f72844856389392d44e1d4
import ImageViewer from '../src/components/ImageViewer/ImageViewer.js'

const stories = storiesOf('ImageViewer', module);

stories.add('width: 300px', withNotes('Hardcoded options and no props')( () => (
	<div style={{width: "300px"}}>
		<ImageViewer />
    </div>
)))

stories.add('width: 600px', withNotes('Hardcoded options and no props')( () => (
	<div style={{width: "600px"}}>
		<ImageViewer />
    </div>
)))

stories.add('width: 900px', withNotes('Hardcoded options and no props')( () => (
	<div style={{width: "900px"}}>
		<ImageViewer />
    </div>
)))

stories.add('height: 300px', withNotes('Hardcoded options and no props')( () => (
	<div style={{height: "200px"}}>
		<ImageViewer />
    </div>
)))

stories.add('IV with artifact prop', withNotes('Using oip-index to pull in a live artifact to pass down as a prop')( () => (
	<div style={{width: "500px"}}>
		<ImageViewer artifact={amsterdam} artifactFile={amsterdam.getFiles()[0]} />
	</div>
)))