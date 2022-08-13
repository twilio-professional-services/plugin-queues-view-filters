const UPDATE_ALL_QUEUES = "UPDATE_ALL_QUEUES"
const UPDATE_SELECTED_QUEUES = "UPDATE_SELECTED_QUEUES";

const initialState = {
    allQueues: [],
    selectedQueues: [],
  };
  
  export class Actions {
    static updateAllQueues = (allQueues) => ({
      type: UPDATE_ALL_QUEUES,
      payload: allQueues
    })
    static updatedSelectedQueues = (selectedValues) => ({
      type: UPDATE_SELECTED_QUEUES,
      payload: selectedValues,
    });
  }

  export function reduce(state = initialState, action) {
    switch (action.type){
      case UPDATE_ALL_QUEUES: {
        return {
          ...state,
          allQueues: action.payload
        }
      }
      case UPDATE_SELECTED_QUEUES: {
        return {
          ...state,
          selectedQueues: action.payload,
        };
      }
      default:
        return state;      
    }
  }
