import React from 'react'
import { shallow } from 'enzyme'

import { QueuesStats, Actions } from '@twilio/flex-ui'
import { QueueSelector } from './QueueSelector'

jest.mock('@twilio/flex-ui', () => {
  return {
    Actions: {
      invokeAction: jest.fn(),
    },
    QueuesStats: {
      setFilter: jest.fn(),
    },
    Icon: jest.fn(),
  }
})

describe('QueueSelector', () => {
  let props
  let subject

  beforeEach(() => {
    props = {
      isHidden: false,
      selectedValues: [],
    }
  })

  it('does not call QueueStats.setFilter when component mounts without selectedValues', () => {
    subject = shallow(<QueueSelector {...props} />)
    expect(QueuesStats.setFilter).not.toHaveBeenCalled()
  })

  it('does not call QueueStats.setFilter when component mounts with undefined selectedValues', () => {
    props.selectedValues = undefined
    subject = shallow(<QueueSelector {...props} />)
    expect(QueuesStats.setFilter).not.toHaveBeenCalled()
  })

  it('does call QueueStats.setFilter when component mounts with selectedValues', () => {
    props.selectedValues = ['Test Queue']
    subject = shallow(<QueueSelector {...props} />)
    expect(QueuesStats.setFilter).toHaveBeenCalled()
  })

  it('calls invoke action when clicking on the filter', () => {
    subject = shallow(<QueueSelector {...props} />)
    subject.find('.button').at(0).simulate('click')
    expect(Actions.invokeAction).lastCalledWith('SetComponentState', {
      name: 'QueueFilter',
      state: { isHidden: !props.isHidden },
    })
  })
})
