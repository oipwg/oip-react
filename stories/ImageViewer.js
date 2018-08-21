import React from 'react';
import { storiesOf } from '@storybook/react';
import { withNotes } from '@storybook/addon-notes';

import ImageViewer from '../src/components/ImageViewer';


const stories = storiesOf('Image Viewer', module);

stories.add('ImageViewer', withNotes('My First Image Viewer Story')( () => (
	
		<ImageViewer />

)))