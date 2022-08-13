import { Manager, QueuesStats } from '@twilio/flex-ui'

const localQueuesViewFiltersKey = "queues_view_filters";

export const getInstance = () => {
  return Manager.getInstance()
}

export const getWorkerClient = () => {
  return getInstance().workerClient
}

export const getFlexState = () => {
  return getInstance().store.getState().flex
}

/**
 * Retrive an object from local storage.
 * @param  string key
 * @return mixed
 */
export function localStorageGet (key) {
  var item = localStorage.getItem(key);

  if ( ! item ) return;

  if ( item[0] === '{' || item[0] === '[' ) return JSON.parse(item);

  return item;
}

/**
 * Save some value to local storage.
 * @param string key    
 * @param string value
 */
export function localStorageSave (key, value) {
  if ( value === undefined ) $.error("Can't store undefinded value");

  if ( typeof(value) === 'object' || typeof(value) === 'array' ) {
    value = JSON.stringify(value);
  }

  if ( typeof(value) !== 'string' ) $.error("Can't store unrecognized format value");

  localStorage.setItem(key, value);
}

/**
 * Remove element from local storage.
 * @param string key 
 */
function localStorageRemove (key) {
  localStorage.removeItem(key);
}

export function getLocalQueuesViewFilters () {
  return localStorageGet(localQueuesViewFiltersKey);
}

export function setLocalQueuesViewFilters (selectedFilters) {
  return localStorageSave(localQueuesViewFiltersKey, selectedFilters);
}

export function setQueuesStatsFilter (selectedQueues) {
  if (!Array.isArray(selectedQueues)) {
    return;
  }
  
  QueuesStats.setFilter((q) => selectedQueues.includes(q.friendly_name))
  QueuesStats.setSubscriptionFilter((q) => selectedQueues.includes(q.friendly_name));
}
