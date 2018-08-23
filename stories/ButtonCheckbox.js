import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withNotes } from '@storybook/addon-notes';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';

import ButtonCheckbox from '../src/components/ButtonCheckbox'

import 'bootstrap/dist/css/bootstrap.min.css'

// Setup Stories
const stories = storiesOf('ButtonCheckbox', module);
stories.addDecorator(withKnobs)

stories.add('Example', () => {
	return (
		<ButtonCheckbox text={text("Text", "My Button")} toggleState={boolean("ToggleState", false)} onClick={action("button-click")} />
	)
});