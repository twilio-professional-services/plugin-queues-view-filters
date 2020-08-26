import React from 'react';
import * as Flex from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';
import { ColumnDefinition } from "@twilio/flex-ui";

import WorkerAttributeWatcher from './components/WorkerAttributeWatcher/WorkerAttributeWatcher.jsx'
import QueueFilter from './components/QueueFilter/QueueFilter.jsx'


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
    Flex.QueuesStatsView.Content.add(<WorkerAttributeWatcher key="workerAttributeWatcher"/>,{
      sortOrder: 0
    });
    Flex.QueuesStatsView.Content.add(<QueueFilter key="queueFilter"/>, 
    {
      sortOrder: 0
    });


  }
}
