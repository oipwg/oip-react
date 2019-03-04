import React from 'react';

import { storiesOf } from '@storybook/react';
import { withNotes } from '@storybook/addon-notes';
import { withKnobs } from '@storybook/addon-knobs';

import SearchComp from '../src/components/SearchComp/SearchComp.js'

// Setup Stories
const stories = storiesOf('SearchComp', module);
stories.addDecorator(withKnobs)


stories.add('Example', () => {
	return (
		<SearchComp />
	)
});