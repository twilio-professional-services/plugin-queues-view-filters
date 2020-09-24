import { Manager } from '@twilio/flex-ui'

export const getInstance = () => {
  return Manager.getInstance()
}

export const getWorkerClient = () => {
  return getInstance().workerClient
}

export const getFlexState = () => {
  return getInstance().store.getState().flex
}
