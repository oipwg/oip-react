import { configure } from '@storybook/react';
import { addDecorator } from '@storybook/react';
import { withConsole, setConsoleOptions } from '@storybook/addon-console';
import { withNotes } from '@storybook/addon-notes';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import stories from '../stories/index.js'

addDecorator((storyFn, context) => withConsole({ panelExclude: [/[HMR]/g, /bip32-utils/g, /color/g] })(storyFn)(context));
addDecorator(withNotes);

Enzyme.configure({ adapter: new Adapter() })

function loadStories() {
    stories
}

configure(loadStories, module);