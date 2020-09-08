import * as Flex from '@twilio/flex-ui';
import { connect } from 'react-redux';

const WorkerAttributeWatcher = ({ desiredFilters }) => {
  
  if(!desiredFilters) {
    return null;
  }
  
  Flex.QueuesStats.setFilter((queue) => desiredFilters.includes(queue.friendly_name));

  return null;
};

const mapStateToProps = (state) => ({
  desiredFilters: state.flex.worker && state.flex.worker.attributes && state['flex'].worker.attributes['queues_view_filters']
});

export default connect(mapStateToProps, null)(WorkerAttributeWatcher);
