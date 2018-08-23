import { configure } from '@storybook/react';
import { addDecorator } from '@storybook/react';
import { withConsole, setConsoleOptions } from '@storybook/addon-console';
import { withNotes } from '@storybook/addon-notes';


addDecorator((storyFn, context) => withConsole({ panelExclude: [/[HMR]/g, /bip32-utils/g, /color/g] })(storyFn)(context));
addDecorator(withNotes);

function loadStories() {
    require('../stories/index.js')
}

configure(loadStories, module);