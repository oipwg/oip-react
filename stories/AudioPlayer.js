import React from 'react';
import { storiesOf, addDecorator } from '@storybook/react';
import { withNotes } from '@storybook/addon-notes';
import { withKnobs, object, select, boolean} from '@storybook/addon-knobs';
import AudioPlayer from '../src/components/AudioPlayer.js'
import { getFileOptions, getArtifactOptions} from './util.js'
import { CorMetallicum } from './TestArtifacts'
import { specs, describe, it } from 'storybook-addon-specifications'
import sinon from 'sinon'
import {mount} from "enzyme";
import { shallow } from 'enzyme';
import expect from "expect";

const wrapper = shallow(<AudioPlayer />)
const stories = storiesOf('AudioPlayer', module);
    stories.addDecorator(withKnobs)
    stories.addDecorator(withNotes)

    const artifacts = getArtifactOptions([CorMetallicum])
    stories.add('Single Song', () => {
    const artifact_value = select(artifacts.title, artifacts.options, artifacts.default_artifact)
	const artifact = artifacts.map[artifact_value]

	const artifact_files = getFileOptions(artifact)

	const file_value = select(artifact_files.title, artifact_files.options, artifact_files.default_file)

	const artifact_file = artifact_files.map[file_value]
	const story = <AudioPlayer Artifact={artifact} ArtifactFile={artifact_file} lockFile={boolean("Lock File", false)} />

	specs(() => describe("Audio Player", () => {
		let output = mount(story)

		it("Should load initial artifact file", () => {
			console.log(output.find("AudioPlayer").children().get(0))
			expect(output.find("AudioPlayer").children().get(0).props.src).toBe("https://ipfs-dev.alexandria.io/ipfs/QmbedGAyepnPXXyVG7ZUityaG1CQLmWouzfgUbaj2E3SbD/01%20The%20Misadventure%20Begins.mp3" 
		)})

		it ("Should autoplay on lockFile change", () => {
			output.setProps({lockFile: true})
			console.log(output.props())
			output.setProps({lockFile: false})
			console.log(output.props())
			output.setProps({lockFile: true})
			console.log(output.props())
		})
	}));	
    
return story
})