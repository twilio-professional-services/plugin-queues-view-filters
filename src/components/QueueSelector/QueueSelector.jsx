import React from 'react'
import { connect } from 'react-redux'
import { Actions, QueuesStats, Icon } from '@twilio/flex-ui'

import './styles.css'

export class QueueSelector extends React.Component {
  toggleQueueFilterView = () => {
    Actions.invokeAction('SetComponentState', {
      name: 'QueueFilter',
      state: { isHidden: !this.props.isHidden },
    })
  }

  componentDidMount() {
    Actions.invokeAction('SetComponentState', {
      name: 'QueueFilter',
      state: { isHidden: typeof this.props.isHidden === 'undefined' ? true : this.props.isHidden },
    })

    if (this.props.selectedValues && this.props.selectedValues.length) {
      QueuesStats.setFilter((queue) => this.props.selectedValues.includes(queue.friendly_name))
      QueuesStats.setSubscriptionFilter((queue) =>
      this.props.selectedValues.includes(queue.friendly_name)
    );

    }
  }

  render() {
    return (
      <div className="wrapper">
        <div className="button" onClick={this.toggleQueueFilterView}>
          Filter <Icon icon="Filter" />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const componentViewStates = state.flex.view.componentViewStates
  const QueueFilterState = componentViewStates && componentViewStates.QueueFilter
  const isHidden = QueueFilterState && QueueFilterState.isHidden
  const selectedValues = state['flex'].worker.attributes['queues_view_filters']

  return {
    isHidden,
    selectedValues,
  }
}

export default connect(mapStateToProps)(QueueSelector)
