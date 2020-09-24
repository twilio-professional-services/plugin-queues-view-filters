import React from 'react'
import { shallow } from 'enzyme'

import { QueuesStats, Actions } from '@twilio/flex-ui'
import FormControlLabel from '@material-ui/core/FormControlLabel'

import { QueueFilter } from './QueueFilter'

jest.mock('@twilio/flex-ui', () => {
  return {
    Actions: {
      invokeAction: jest.fn(),
    },
    QueuesStats: {
      setFilter: jest.fn(),
    },
    SidePanel: jest.fn(),
  }
})

describe('QueueFilter', () => {
  let props
  let subject

  beforeEach(() => {
    props = {
      queueValues: ['Queue 1', 'Queue 2', 'Queue 3', 'Queue 4'],
      selectedValues: [],
      isHidden: false,
      classes: {
        contained: '',
      },
    }
  })

  it('renders form control for each value in queueValues', () => {
    subject = shallow(<QueueFilter {...props} />)
    const labels = subject.find(FormControlLabel)
    expect(labels.length).toEqual(props.queueValues.length)
  })

  it('clicking all puts all queues into component state', () => {
    subject = shallow(<QueueFilter {...props} />)
    const all = subject.find('#allLink')
    all.at(0).simulate('click')
    expect(subject.state('selectedQueues')).toEqual(props.queueValues)
  })

  it('clicking none erases all selected queues in component state', () => {
    subject = shallow(<QueueFilter {...props} />)
    const none = subject.find('#noneLink')
    none.at(0).simulate('click')
    expect(subject.state('selectedQueues')).toEqual([])
  })
})
