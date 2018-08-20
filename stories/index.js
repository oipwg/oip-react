import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withNotes } from '@storybook/addon-notes';


storiesOf('Button', module)
    .add('with text', withNotes("My first story")(() => (
        <button onClick={action('clicked')}>Hello Button</button>
    )))
