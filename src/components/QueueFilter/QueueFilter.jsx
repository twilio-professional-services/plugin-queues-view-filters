import * as Flex from '@twilio/flex-ui';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import CheckBox from "./CheckBox";


class QueueFilter extends Component {
    constructor(props) {
      super(props);
      
      this.state = {
      selectedQueues: [],
      allQueues: []
      };
  
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleCheckBox = this.handleCheckBox.bind(this);

    }

    componentDidMount() {
      this.setQueuesDefaults();
   }

    setQueuesDefaults = () => {

      this.setState({
        selectedQueues: JSON.parse(this.props.selectedValues),
        allQueues: this.props.queueValues}
      );
      if(!this.state.selectedQueues) {
        this.setState({ selectedQueues: this.props.queueValues})}
    }

    handleCheckBox(event) {
      const newSelection = event.target.value;
      let newSelectionArray;
      
      if (this.state.selectedQueues.indexOf(newSelection) !== -1) {
        newSelectionArray = this.state.selectedQueues.filter(
          s => s !== newSelection
        );
      } else {
        newSelectionArray = [...this.state.selectedQueues, newSelection];
      }
      console.log('Your current selection: '+newSelectionArray);
  
      this.setState(prevState => ({
        selectedQueues: newSelectionArray }
      ));
      
    }

  handleSubmit(event) {
  event.preventDefault();

  //Get all worker attributes
  var workerAttributes = Flex.Manager.getInstance().store.getState().flex.worker.attributes;

  //Update Worker Attributes
  Flex.Manager.getInstance().workerClient
  .setAttributes({ ...workerAttributes, queues_view_filters: JSON.stringify(this.state.selectedQueues) });

  }
    
  render() {
  return (<div>
  <form onSubmit={this.handleSubmit}> 
  <CheckBox
          title={"Queues"}
          name={"queues"}
          options={this.state.allQueues}
          selectedOptions={this.state.selectedQueues}
          handleChange={this.handleCheckBox}
        />
        <button>Submit</button>
        </form>
      </div>);
  }
}

const mapStateToProps = (state) => {
  const selectedValues = state['flex'].worker.attributes['queues_view_filters'];
  const queueValues = state.flex.realtimeQueues && state.flex.realtimeQueues.queuesList ? 
  Object.values(state.flex.realtimeQueues.queuesList)
  .map(queue => queue.friendly_name) : [];
  
  return {
    queueValues, selectedValues
  }
};

export default connect(mapStateToProps)(QueueFilter);
