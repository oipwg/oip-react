import { configure } from '@storybook/react';
import { addDecorator } from '@storybook/react';
import { withConsole, setConsoleOptions } from '@storybook/addon-console';


addDecorator((storyFn, context) => withConsole({ panelExclude: [/[HMR]/g, /bip32-utils/g, /color/g] })(storyFn)(context));

function loadStories() {
    require('../stories/index.js')
}

configure(loadStories, module);