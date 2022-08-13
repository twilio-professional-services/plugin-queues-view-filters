import { Manager } from '@twilio/flex-ui';

import {
  fetchJsonWithReject,
  sortArrayOfObjectsByStringProperty
} from '../helpers/utils';
import { Actions as StateActions } from '../states/State';

class TaskRouterService {
  manager = Manager.getInstance();

  serverlessDomain = process.env.REACT_APP_SERVERLESS_DOMAIN;

  buildBody(encodedParams){
    return Object.keys(encodedParams).reduce((result, paramName,idx) => {
      if(encodedParams[paramName] === undefined) {
          return result;
      }
      if(idx > 0){
          return `${result}&${paramName}=${encodedParams[paramName]}`;
      }
      return `${paramName}=${encodedParams[paramName]}`;
    }, '')
  }

  // does a one time fetch for workflows per session
	// since workflow configuration seldom changes

  populateTaskQueues() {
    return new Promise(async (resolve, reject) => {
      const credentials = Buffer.from(`token:${this.manager.user.token}`).toString('base64');
      const workspaceSid = this.manager.workerClient.workspaceSid;
      const pageSize = 100;
      let nextPageUri = `https://taskrouter.twilio.com/v1/Workspaces/${workspaceSid}/TaskQueues?PageSize=${pageSize}`;
      let result = [];

      try {
        while (nextPageUri) {
          // eslint-disable-next-line no-await-in-loop
          const res = await fetchJsonWithReject(nextPageUri, {
            method: 'GET',
            headers: {
              'Authorization': `Basic ${credentials}`,
            }
          });
          if (res?.meta?.key) {
            nextPageUri = res?.meta?.next_page_url
            result = [...result, ...res[res.meta.key]];
          }
        }
        
        const sortedTaskQueues = sortArrayOfObjectsByStringProperty(result, 'friendly_name');

        this.manager.store.dispatch(StateActions.updateAllQueues(sortedTaskQueues));
        resolve();
      } catch (error) {
        console.error('Error populating TaskQueues.', error);
        reject(error);
      }
    });
  }
}

export default new TaskRouterService();