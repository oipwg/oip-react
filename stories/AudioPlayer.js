import React from 'react';
import { storiesOf, addDecorator } from '@storybook/react';
import { withNotes } from '@storybook/addon-notes';
import { withKnobs, object, select, boolean} from '@storybook/addon-knobs';
import AudioPlayer from '../src/components/AudioPlayer.js';
import { getFileOptions, getArtifactOptions} from './util.js';
import { CorMetallicum } from './TestArtifacts';
import { specs, describe, it } from 'storybook-addon-specifications';
import {mount} from "enzyme";
import { shallow } from 'enzyme';
import expect from "expect";

	const stories = storiesOf('AudioPlayer', module);
	const artifacts = getArtifactOptions([CorMetallicum]);
    stories.addDecorator(withKnobs);
	stories.addDecorator(withNotes);

    stories.add('Single Song', () => {
			const artifact_value = select(artifacts.title, artifacts.options, artifacts.default_artifact);
			const artifact = artifacts.map[artifact_value];

			const artifact_files = getFileOptions(artifact);

			const file_value = select(artifact_files.title, artifact_files.options, artifact_files.default_file);

			const artifact_file = artifact_files.map[file_value];
			const story = <AudioPlayer Artifact={artifact} ArtifactFile={artifact_file} lockFile={boolean("Lock File", true)} />;

	specs(() => describe('<AudioPlayer />', () => {
		it('Test lockfile on/off', () => {
			const wrapper = mount(story);

			wrapper.setProps({ lockFile: true });
			// lockFile is set to true 

			expect(wrapper.props().lockFile).toBe(true);
			// lockFile checked
			wrapper.setProps({ lockFile: false });
			// lockFile set to false

			expect(wrapper.props().lockFile).toBe(false);
			// autoplay off lockFile being set back to false 

			wrapper.setProps({ lockFile: true });
			// lockFile set back to true to stop autoplay during test
		});
		it('Audio Pause / Play', () => {
			const wrapper = mount(story);
			
			expect(wrapper.find('audio').getDOMNode().play)
			// Audio element play test
		});
		it('Autoplay switches on after lockfile = false', () => {
			const wrapper = mount(story);

			//Autoplay test through testing Props and not just lockFile being switched 
			wrapper.setProps({ autoPlay: false});
			wrapper.setProps({ lockFile: false });
			wrapper.setProps({ autoPlay: true});
			wrapper.setProps({ lockFile: true });

		
		}); 
	}));
    
return story
});