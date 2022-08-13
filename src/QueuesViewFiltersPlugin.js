import React from 'react'
import { FlexPlugin } from '@twilio/flex-plugin'
import reducers, { namespace } from './states';
import { Actions as StateActions } from './states/State';

import QueueSelector from './components/QueueSelector/QueueSelector.jsx'
import QueueFilter from './components/QueueFilter/QueueFilter.jsx'
import {
  getLocalQueuesViewFilters,
  setQueuesStatsFilter
} from './helpers/manager';
import TaskRouterService from './services/TaskRouterService';


const PLUGIN_NAME = 'QueuesViewFiltersPlugin'

export default class QueuesViewFiltersPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME)
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {
    this.registerReducers(manager);

    TaskRouterService.populateTaskQueues().then(() => {
      console.log('QueuesViewFiltersPlugin, TaskQueues populated');
    });

    // Read selected queues from local storage and push to Redux
    const localQueuesViewFilters = getLocalQueuesViewFilters();
    const defaultOutboundQueueSid = manager.serviceConfiguration.outbound_call_flows?.default?.queue_sid;

    if (Array.isArray(localQueuesViewFilters) && localQueuesViewFilters.length > 0) {
      manager.store.dispatch(StateActions.updatedSelectedQueues(localQueuesViewFilters));
      setQueuesStatsFilter(localQueuesViewFilters);
    } else if (defaultOutboundQueueSid) {
      // Setting a default subscription filter, using outbound queue since it's available without
      // querying any other endpoint and it will reliably be available in realtime stats cache.
      // Critical to set a filter at Flex UI load, otherwise the realtime queue view will
      // attempt to subscribe to all queues initially which creates significant performance
      // issues when 100+ queues exist on TaskRouter
      flex.QueuesStats.setSubscriptionFilter(q => q.sid === defaultOutboundQueueSid);
    }

    flex.QueuesStatsView.Content.add(<QueueSelector key="queueSelector" />, {
      align: 'start',
      sortOrder: 0,
    })
    flex.QueuesStatsView.Content.add(<QueueFilter key="queueFilter" />, { sortOrder: -1 })
  }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  registerReducers(manager) {
    if (!manager.store.addReducer) {
      // eslint-disable-next-line
      console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`);
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }
}
