import React from 'react';

import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

import AdvancedSearchForm from '../src/components/SearchComp/AdvancedSearchForm.js'

// Setup Stories
const stories = storiesOf('SearchComp', module);
stories.addDecorator(withKnobs)


stories.add('Example', () => {
	return (
		<AdvancedSearchForm />
	)
});
