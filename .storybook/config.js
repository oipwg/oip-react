import { configure } from '@storybook/react';
import { addDecorator } from '@storybook/react';
import { withConsole, setConsoleOptions } from '@storybook/addon-console';
import { withNotes } from '@storybook/addon-notes';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

addDecorator((storyFn, context) => withConsole({ panelExclude: [/[HMR]/g, /bip32-utils/g, /color/g] })(storyFn)(context));
addDecorator(withNotes);

Enzyme.configure({ adapter: new Adapter() })

function loadStories() {
    require('../stories/index.js')
}

configure(loadStories, module);