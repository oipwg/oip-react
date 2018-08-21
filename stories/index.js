import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withNotes } from '@storybook/addon-notes';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/react';

import VideoPlayer from '../src/components/VideoPlayer/VideoPlayer'

storiesOf('Button', module)
    .add('with text', withNotes("My first story")(() => (
        <button onClick={action('clicked')}>Hello Button</button>
    )))

const stories = storiesOf('VideoPlayer', module);
stories.addDecorator(withKnobs)
stories.add('width: 300px', withNotes('Hardcoded options and no props')( () => (
	<div style={{width: "300px"}}>
		<VideoPlayer artifact={null} artifactFile={null}/>
	</div>
)))

stories.add('width: 600px', withNotes('Hardcoded options and no props')( () => (
	<div style={{width: "600px"}}>
		<VideoPlayer artifact={null} artifactFile={null}/>
	</div>
)))

stories.add('width: 900px', withNotes('Hardcoded options and no props')( () => (
	<div style={{width: "900px"}}>
		<VideoPlayer artifact={null} artifactFile={null}/>
	</div>
)))

stories.add('height: 300px', withNotes('For height to be set, it has to be done as a property of the object prop, options. Fluid must be set to false for height to take affect.')( () => (
	<div style={{height: "200px"}}>
		<VideoPlayer artifact={null} artifactFile={null} />
	</div>
)))

storiesOf('Test', module)
	.add('Test story', () => (
		<div><h1>Ryan rocks!</h1></div>
	))
