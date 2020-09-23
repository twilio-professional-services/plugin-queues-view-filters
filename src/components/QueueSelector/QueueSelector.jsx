import React from "react";
import "./styles.css";
import * as Flex from '@twilio/flex-ui';
import { connect } from 'react-redux';

class QueueSelector extends React.Component {

    toggleQueueFilterView = () => {
        
        Flex.Actions.invokeAction('SetComponentState', {
            name: 'QueueFilter',
            state: { isHidden: !this.props.isHidden }
        });

    }

    componentDidMount() {
        Flex.Actions.invokeAction('SetComponentState', {
            name: 'QueueFilter',
            state: { isHidden: (typeof this.props.isHidden === "undefined") ? true : this.props.isHidden  }
        });

        Flex.QueuesStats.setFilter((queue) => this.props.selectedValues.includes(queue.friendly_name));

    }   

    render () {

        return (
            <div className="wrapper">
                <div className="button" onClick={this.toggleQueueFilterView}>
                    Filter <Flex.Icon icon="Filter"  />
                </div>
            </div>
        )
    } 
       
    
}

const mapStateToProps = state => {
    const componentViewStates = state.flex.view.componentViewStates;
    const QueueFilterState = componentViewStates && componentViewStates.QueueFilter;
    const isHidden = QueueFilterState && QueueFilterState.isHidden;
    const selectedValues = state['flex'].worker.attributes['queues_view_filters'];

    return {
        isHidden,selectedValues
    }
};

export default connect(mapStateToProps)(QueueSelector);