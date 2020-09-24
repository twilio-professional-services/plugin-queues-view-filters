import React from 'react'
import { shallow } from 'enzyme'

import FormControlLabel from '@material-ui/core/FormControlLabel'

import { QueueFilter } from './QueueFilter'
import { getWorkerClient, getFlexState } from '../../helpers/manager'

jest.mock('../../helpers/manager')
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
  let setAttributesSpy

  beforeEach(() => {
    props = {
      queueValues: ['Queue 1', 'Queue 2', 'Queue 3', 'Queue 4'],
      selectedValues: [],
      isHidden: false,
      classes: {
        contained: '',
      },
    }

    setAttributesSpy = jest.fn()

    getWorkerClient.mockImplementation(() => {
      return {
        setAttributes: setAttributesSpy,
      }
    })

    getFlexState.mockImplementation(() => {
      return {
        worker: {
          attributes: {},
        },
      }
    })
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

  it('clicking on apply will attempt to update worker attributes', () => {
    subject = shallow(<QueueFilter {...props} />)
    const apply = subject.find('#applyButton')
    apply.at(0).simulate('click', {
      preventDefault: () => {},
    })
    expect(setAttributesSpy).toHaveBeenCalledWith({
      queues_view_filters: [],
    })
  })
})
