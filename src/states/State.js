const UPDATE_QUEUES = "UPDATE_QUEUES";

const initialState = {
    selectedQueues: [],
  };
  
  export class Actions {
    static updatedQueues = (selectedValues) => ({
      type: UPDATE_QUEUES,
      payload: selectedValues,
    });

  }

  export function reduce(state = initialState, action) {
    switch (action.type){
      case UPDATE_QUEUES: {
        return {
          ...state,
          selectedQueues: action.payload,
        };
      }
      default:
        return state;      
    }
  }
