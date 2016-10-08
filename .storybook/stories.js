import React from 'react'
import { storiesOf } from '@kadira/storybook'
import ScrollLens from '../dist'

storiesOf('Button', module)
  .add('default view', () => (
    <ScrollLens>test</ScrollLens>
  ))