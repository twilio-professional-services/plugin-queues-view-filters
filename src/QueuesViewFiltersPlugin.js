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

    /*flex.QueuesStatsView.Content.add(<TeamFiltersPanel key="TeamFiltersPanel"/>, 
    {
      sortOrder: -1
    });*/

    // Remove the original agents column
    Flex.QueuesStats.QueuesDataTable.Content.remove("agents");

    // Create a new column with custom formatting
    Flex.QueuesStats.QueuesDataTable.Content.add(
    <ColumnDefinition
      key="offline-agents"
      header="Offline Agents"
      content={(queue) => {
        
        const offlineAgents = queue.activity_statistics
        .filter((activity) =>  activity.friendly_name === "Offline")
        .reduce((acc, activity) => acc + activity.workers, 0);
        // Return the element to render
        return <span>{offlineAgents}</span>;
      }}/>,
    { sortOrder: 10 } // Put this after the second column
  );
  }
}
