import React from 'react'
import * as Flex from '@twilio/flex-ui'
import { FlexPlugin } from '@twilio/flex-plugin'

import reducers, { namespace } from './states';
import { Actions } from './states/State';

import QueueSelector from './components/QueueSelector/QueueSelector.jsx'
import QueueFilter from './components/QueueFilter/QueueFilter.jsx'
import { localStorageGet } from './helpers/manager'


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

    // Read selected queues from local storage and push to Redux
    this.dispatch(Actions.updatedQueues(localStorageGet("queues_view_filters")));

    Flex.QueuesStatsView.Content.add(<QueueSelector key="queueSelector" />, {
      align: 'start',
      sortOrder: 0,
    })
    Flex.MainContainer.Content.add(<QueueFilter key="queueFilter" />)
  }

  dispatch = (f) => Flex.Manager.getInstance().store.dispatch(f);
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
