import React from 'react';
import { connect } from 'react-redux';
import {
  Actions,
  Button,
  Icon,
  QueuesStats,
} from '@twilio/flex-ui';

import './styles.css';

export class QueueSelector extends React.Component {
  toggleQueueFilterView = () => {
    Actions.invokeAction('SetComponentState', {
      name: 'QueueFilter',
      state: { isHidden: !this.props.isHidden },
    });
  }

  componentDidMount() {
    Actions.invokeAction('SetComponentState', {
      name: 'QueueFilter',
      state: { isHidden: typeof this.props.isHidden === 'undefined' ? true : this.props.isHidden },
    });

    if (this.props.selectedValues && this.props.selectedValues.length) {
      QueuesStats.setFilter((queue) => this.props.selectedValues.includes(queue.friendly_name));
      QueuesStats.setSubscriptionFilter((queue) =>
        this.props.selectedValues.includes(queue.friendly_name)
      );
    }
  }

  render() {
    return (
      <div className="queuesViewFilterButtonContainer">
        <Button
          className="queuesViewFilterButton"
          onClick={this.toggleQueueFilterView}
          roundCorners={false}
          variant="secondary"
          themeOverride={this.props.theme?.Supervisor.FilterButton}
          endIcon={<Icon icon="FilterTrigger" />}
        >
          Filter
        </Button>
      </div>
      // <div className="wrapper">
      //   <div className="button" onClick={this.toggleQueueFilterView}>
      //     Filter <Icon icon="Filter" />
      //   </div>
      // </div>
    )
  }
}

const mapStateToProps = (state) => {
  const componentViewStates = state.flex.view.componentViewStates;
  const QueueFilterState = componentViewStates && componentViewStates.QueueFilter;
  const isHidden = QueueFilterState && QueueFilterState.isHidden;
  const selectedValues = state['queues-filter']?.filterQueues?.selectedQueues || [];

  return {
    isHidden,
    selectedValues,
  }
}

export default connect(mapStateToProps)(QueueSelector)
