import * as Flex from '@twilio/flex-ui';
import { connect } from 'react-redux';

const WorkerAttributeWatcher = ({desiredFilters}) => {

  Flex.QueuesStats.setFilter((queue) =>
    desiredFilters.includes(queue.friendly_name)
  );

  return null;
};

const mapStateToProps = (state) => ({
  desiredFilters: state['flex'].worker.attributes['queues-view-filters'],
});

export default connect(mapStateToProps, null)(WorkerAttributeWatcher);
