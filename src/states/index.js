import { combineReducers } from 'redux';

import { reduce as Reducer } from './State';

// Register your redux store under a unique namespace
export const namespace = 'queues-filter';

// Combine the reducers
export default combineReducers({
  filterQueues: Reducer
});


