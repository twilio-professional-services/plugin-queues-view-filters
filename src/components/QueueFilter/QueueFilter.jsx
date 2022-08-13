import React, { Component } from 'react';
import {Theme} from '@twilio-paste/core/theme';
import { connect } from 'react-redux';
import { Actions, SidePanel } from '@twilio/flex-ui';
import * as Flex from '@twilio/flex-ui';
import {Input, Button,Checkbox} from '@twilio-paste/core';
import { withStyles } from '@material-ui/core/styles';

import { Actions as StateActions} from '../../states/State';
import {
  setLocalQueuesViewFilters,
  setQueuesStatsFilter
} from '../../helpers/manager';
import './styles.css'


const styles = {
  contained: {
    borderRadius: '0px',
    textTransform: 'uppercase',
    marginRight: '15px',
    padding: '4px 20px',
    fontWeight: 'bold',
    fontFamily: 'inherit',
    fontSize: '11px',
  },
}
export class QueueFilter extends Component {
  state = {
    input: '',
    isChangePending: false,
    selectedQueues: [],
  }

  dispatch = (f) => Flex.Manager.getInstance().store.dispatch(f);

  componentDidMount() {
    this.setQueuesDefaults();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedValues !== this.props.selectedValues && this.props.selectedValues) {
      setQueuesStatsFilter(this.props.selectedValues);
      this.setState({ isChangePending: false });
    }
  }

  setQueuesDefaults = () => {
    const { selectedValues, queueValues } = this.props
    const selectedQueues = selectedValues ? selectedValues : queueValues
    this.setState({ selectedQueues });
  }

  handleCloseClick = () => {
    Actions.invokeAction('SetComponentState', {
      name: 'QueueFilter',
      state: { isHidden: !this.props.isHidden },
    });
  }

  onChangeHandler(e){
    this.setState({
      input: e.target.value
    });
  }

  handleCheckBox = (event) => {
    const newSelection = event.target.value
    let newSelectionArray

    if (this.state.selectedQueues.indexOf(newSelection) !== -1) {
      newSelectionArray = this.state.selectedQueues.filter((s) => s !== newSelection)
    } else {
      newSelectionArray = [...this.state.selectedQueues, newSelection]
    }

    this.setState({
      isChangePending: true,
      selectedQueues: newSelectionArray,
    });
  }

  checkBulk = (all) => {
    this.setState({
      isChangePending: true,
      selectedQueues: all 
        ? this.props.queueValues.filter(d => 
            this.state.input === '' || d.toLowerCase().includes(this.state.input.toLowerCase())
          )
        : [],
    })

  }

  isApplyButtonDisabled = () => {
    const { isChangePending, selectedQueues } = this.state;
    const { selectedValues } = this.props;

    return !isChangePending && (
      Array.isArray(selectedQueues) && 
      Array.isArray(selectedValues) &&
      selectedQueues.length === selectedValues.length &&
      selectedQueues.every(q => selectedValues.includes(q))
    );
  }

  handleSubmit = (event) => {
    event.preventDefault()

    this.handleCloseClick();

    setLocalQueuesViewFilters(this.state.selectedQueues);
    this.dispatch(StateActions.updatedSelectedQueues(this.state.selectedQueues));
  }

  render() {
    const {
      classes,
      isHidden,
      queueValues,
      theme
    } = this.props;

    return isHidden ? null : (
      <Theme.Provider theme="default">
      <SidePanel
        displayName="QueueSelectorPanel"
        className="queueSelectorPanel"
        themeOverride={theme && theme.OutboundDialerPanel}
        title={<div>QUEUES</div>}
        isHidden={isHidden}
        handleCloseClick={this.handleCloseClick}
      >
        <div className="header">
          <div className="header-description">
            <div id="allLink" className="link" onClick={() => this.checkBulk(true)}>
              All
            </div>
            |
            <div id="noneLink" className="link" onClick={() => this.checkBulk(false)}>
              None
            </div>
  
          </div>
          <div className="header-button-wrapper">
          <div className="header-button-description">
          <form className={classes.root} noValidate autoComplete="off">
            <Input 
              placeholder="Search" 
              value={this.state.input} 
              type="text" 
              onChange={this.onChangeHandler.bind(this)}
            />
          </form>
            </div>
            <div className="header-button-description">
           
              <Button
                id="applyButton"
                variant="contained"
                color="primary"
                onClick={this.handleSubmit}
                classes={{
                  contained: classes.contained,
                }}
                disabled={this.isApplyButtonDisabled()}
              >
                Apply
              </Button>
            </div>
      
          </div>
        </div>
        <div className="queueViewer">
      
          {queueValues.filter(d => this.state.input === '' || d.toLowerCase().includes(this.state.input.toLowerCase())).sort().map((queue, index)=> {
            return (
            
              <div>                
                  <Checkbox
                    name={queue}
                    id={queue}
                    value={queue}
                    className="label"
                    checked={this.state.selectedQueues.indexOf(queue) !== -1}
                    onChange={this.handleCheckBox}
                  >
                    {queue}
                  </Checkbox>
              
              </div>
            
            )
          })}
        </div>
      </SidePanel>
      </Theme.Provider>
    )
  }
}


const mapStateToProps = (state) => {
  const componentViewStates = state.flex.view.componentViewStates;
  const QueueFilterViewState = componentViewStates && componentViewStates.QueueFilter;

  const isHidden = QueueFilterViewState?.isHidden === undefined
    ? true
    : QueueFilterViewState.isHidden;

  const selectedValues = state['queues-filter'].filterQueues.selectedQueues;
  const queueValues = state['queues-filter']?.filterQueues?.allQueues?.map(q => q.friendly_name) || [];

  return {
    isHidden,
    queueValues,
    selectedValues,
  }
}

export default connect(mapStateToProps)(withStyles(styles)(QueueFilter));
