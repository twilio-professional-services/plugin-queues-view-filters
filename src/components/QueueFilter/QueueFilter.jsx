import * as Flex from '@twilio/flex-ui'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import './styles.css'
import Button from '@material-ui/core/Button'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import { withStyles } from '@material-ui/core/styles'

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

class QueueFilter extends Component {
  state = {
    selectedQueues: [],
  }

  componentDidMount() {
    this.setQueuesDefaults()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedValues !== this.props.selectedValues && this.props.selectedValues) {
      Flex.QueuesStats.setFilter((queue) => this.props.selectedValues.includes(queue.friendly_name))
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
    Flex.Actions.invokeAction('SetComponentState', {
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
      selectedQueues: all ? this.props.queueValues : [],
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()

    //Get all worker attributes
    var workerAttributes = Flex.Manager.getInstance().store.getState().flex.worker.attributes

    //Update Worker Attributes
    Flex.Manager.getInstance().workerClient.setAttributes({
      ...workerAttributes,
      queues_view_filters: this.state.selectedQueues,
    })
  }

  render() {
    const { isHidden, classes, queueValues } = this.props

    return (
      <Flex.SidePanel
        displayName="QueueSelectorPanel"
        className="queueSelectorPanel"
        title={<div>QUEUES</div>}
        isHidden={isHidden}
        handleCloseClick={this.handleCloseClick}
      >
        <div className="header">
          <div className="header-description">
            <div className="link" onClick={() => this.checkBulk(true)}>
              All
            </div>{' '}
            |
            <div className="link" onClick={() => this.checkBulk(false)}>
              None
            </div>
          </div>
          <div className="header-button-wrapper">
            <div className="header-button-description">
              <Button
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
          {queueValues.map((queue, index) => {
            return (
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
            )
          })}
        </div>
      </Flex.SidePanel>
    )
  }
}

const mapStateToProps = (state) => {
  const componentViewStates = state.flex.view.componentViewStates
  const QueueFilterViewState = componentViewStates && componentViewStates.QueueFilter
  let isHidden = QueueFilterViewState && QueueFilterViewState.isHidden
  const selectedValues = state['flex'].worker.attributes['queues_view_filters']
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
