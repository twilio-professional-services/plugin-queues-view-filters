import React, { Component } from 'react'

import { connect } from 'react-redux'
import { QueuesStats, Actions, SidePanel } from '@twilio/flex-ui'
import * as Flex from '@twilio/flex-ui'
import { Actions as StateActions} from '../../states/State';


import Button from '@material-ui/core/Button'
import { Input, Tooltip } from '@material-ui/core';

import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import { withStyles } from '@material-ui/core/styles'

import { localStorageSave,localStorageGet } from '../../helpers/manager'

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
    selectedQueues: [],
    input: ''
  }

  dispatch = (f) => Flex.Manager.getInstance().store.dispatch(f);

  componentDidMount() {
    this.setQueuesDefaults()
  }

  onChangeHandler(e){
    this.setState({
      input: e.target.value,
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedValues !== this.props.selectedValues && this.props.selectedValues) {
      QueuesStats.setFilter((queue) => this.props.selectedValues.includes(queue.friendly_name))
      
      QueuesStats.setSubscriptionFilter((queue) =>
         this.props.selectedValues.includes(queue.friendly_name)
       );
    }
  }

  setQueuesDefaults = () => {
    const { selectedValues, queueValues } = this.props
    const selectedQueues = selectedValues ? selectedValues : queueValues
    this.setState({
      selectedQueues,
    })
  }

  handleCloseClick = () => {
    Actions.invokeAction('SetComponentState', {
      name: 'QueueFilter',
      state: { isHidden: !this.props.isHidden },
    })
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
      selectedQueues: newSelectionArray,
    })
  }

  checkBulk = (all) => {
    this.setState({
      selectedQueues: all ? this.props.queueValues.filter(d => this.state.input === '' || d.toLowerCase().includes(this.state.input.toLowerCase())) : [],
    })

  }

  handleSubmit = (event) => {
    event.preventDefault()

    localStorageSave("queues_view_filters",this.state.selectedQueues);
    this.dispatch(StateActions.updatedQueues(localStorageGet("queues_view_filters")));
  }

  render() {
    const { isHidden, classes, queueValues } = this.props


    return (
      <SidePanel
        displayName="QueueSelectorPanel"
        className="queueSelectorPanel"
        title={<div>QUEUES</div>}
        isHidden={isHidden}
        handleCloseClick={this.handleCloseClick}
      >
        <div className="header">
          <div className="header-description">
            <div id="allLink" className="link" onClick={() => this.checkBulk(true)}>
              All
            </div>{' '}
            |
            <div id="noneLink" className="link" onClick={() => this.checkBulk(false)}>
              None
            </div>
  
          </div>
          <div className="header-button-wrapper">
          <div className="header-button-description">
          <form className={classes.root} noValidate autoComplete="off">
            <Input placeholder="Search" value={this.state.input} type="text" onChange={this.onChangeHandler.bind(this)} />

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
              >
                Apply
              </Button>
            </div>
      
          </div>
        </div>
        <div className="queueViewer">
          {queueValues.filter(d => this.state.input === '' || d.toLowerCase().includes(this.state.input.toLowerCase())).sort().map((queue, index)=> {
            return (
              <Tooltip                 
              key={index}
              title={queue}>
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    name={queue}
                    className="label"
                    color="primary"
                    value={queue}
                    checked={this.state.selectedQueues.indexOf(queue) !== -1}
                    onChange={this.handleCheckBox}
                  />
                }
                label={queue}
              />
              </Tooltip>
            )
          })}
        </div>
      </SidePanel>
    )
  }
}


const mapStateToProps = (state) => {
  const componentViewStates = state.flex.view.componentViewStates
  const QueueFilterViewState = componentViewStates && componentViewStates.QueueFilter
  let isHidden = QueueFilterViewState && QueueFilterViewState.isHidden
  const selectedValues = state['queues-filter'].filterQueues.selectedQueues

  const queueValues =
    state.flex.realtimeQueues && state.flex.realtimeQueues.queuesList
      ? Object.values(state.flex.realtimeQueues.queuesList).map((queue) => queue.friendly_name)
      : []

  if (isHidden === undefined) {
    isHidden = true
  }

  return {
    queueValues,
    selectedValues,
    isHidden,
  }
}

export default connect(mapStateToProps)(withStyles(styles)(QueueFilter))
