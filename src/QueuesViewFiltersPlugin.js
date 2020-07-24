import React from 'react';
import { VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';

import WorkerAttributeWatcher from './components/WorkerAttributeWatcher/WorkerAttributeWatcher.jsx'

const PLUGIN_NAME = 'QueuesViewFiltersPlugin';

export default class QueuesViewFiltersPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {
    flex.RootContainer.Content.add(<WorkerAttributeWatcher key="workerAttributeWatcher"/>);
  }
}
