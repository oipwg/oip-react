import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withNotes } from '@storybook/addon-notes';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';

import { specs, describe, it } from 'storybook-addon-specifications'
import {mount} from "enzyme";
import expect from "expect";

import ButtonCheckbox from '../src/components/ButtonCheckbox/ButtonCheckbox.js'

import 'bootstrap/dist/css/bootstrap.min.css'

// Setup Stories
const stories = storiesOf('ButtonCheckbox', module);
stories.addDecorator(withKnobs)

stories.add('Example', () => {

	let button_text = text("Text", "My Button")

	const story = <ButtonCheckbox text={button_text} onChange={action("Button Textbox Change")} />
	
	specs(() => describe("Button Checkbox", () => {
		let output = mount(story)

		it("Should be default off", () => {
			expect(output.find(".btn-outline-danger").length).toBe(1)
			expect(output.find(".btn-success").length).toBe(0)
		})
		it("Should be toggle on", () => {
			output.find('button').simulate('click')
			expect(output.find(".btn-outline-danger").length).toBe(0)
			expect(output.find(".btn-success").length).toBe(1)
		})
		it("Should be toggle back off", () => {
			output.find('button').simulate('click')
			expect(output.find(".btn-outline-danger").length).toBe(1)
			expect(output.find(".btn-success").length).toBe(0)
		})
		it("Should use text prop", () => {
			let old_text = output.prop('text')

			output.setProps({"text": "Test"})
			expect(output.find("button").text()).toContain("Test")
			output.setProps({"text": old_text})
		})
	}))

	return story
});