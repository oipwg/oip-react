import React from 'react';
import { storiesOf } from '@storybook/react';
import { withNotes } from '@storybook/addon-notes';

import ImageViewer from '../src/components/ImageViewer';


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