import React from 'react';
import { storiesOf, addDecorator } from '@storybook/react';
import { withNotes } from '@storybook/addon-notes';
import { withKnobs, object, select, boolean } from '@storybook/addon-knobs';
import ImageViewer from '../src/components/ImageViewer/ImageViewer.js'
import { getFileOptions, getArtifactOptions} from './util.js'
import { action } from '@storybook/addon-actions';
import { amsterdam, apocalypse, barbershop, scout } from './TestArtifacts'
import { specs, describe, it } from 'storybook-addon-specifications'
import {mount} from "enzyme";
import expect from "expect";

const stories = storiesOf('ImageViewer', module);
stories.addDecorator(withKnobs)
stories.addDecorator(withNotes)

const artifacts = getArtifactOptions([amsterdam, scout])

stories.add('IV-Test', () => {
	const width_value = select("Parent: div.width", {
		"300px": "300px",
		"500px": "500px",
		"900px": "900px"

	},"300px")

	const artifact_value = select(artifacts.title, artifacts.options, artifacts.default_artifact)
	const artifact = artifacts.map[artifact_value]

	const artifact_files = getFileOptions(artifact)

	const file_value = select(artifact_files.title, artifact_files.options, artifact_files.default_file)

	const artifact_file = artifact_files.map[file_value]

	const story = 	<div style={{width: width_value}}>
						<ImageViewer Artifact={artifact} ArtifactFile={artifact_file} lockFile={boolean("Lock File", false)} />
					</div>
		
			specs(() => describe("<ImageViewer />", () => {
				it("Blur on lockfile", () => {
					const wrapper = mount(story)
					wrapper.setProps({lockFile: true})
				expect(wrapper.props().lockFile).toBe(true);
		});
	}));

	return story
})