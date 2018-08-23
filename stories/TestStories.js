import {storiesOf} from "@storybook/react";
import {withNotes} from "@storybook/addon-notes";
import {action} from "@storybook/addon-actions";
import React from "react";

storiesOf('Button', module)
	.add('with text', () => (
		<button onClick={action('clicked')}>Hello Button</button>
	), {notes: "My first story"})

storiesOf('Test', module)
	.add('Test story', () => (
		<div><h1>Ryan rocks!</h1></div>
	))
