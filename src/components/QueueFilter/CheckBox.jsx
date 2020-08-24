import React from "react";

const CheckBox = props => {
    return (
      <div>
        <label >
          {props.title}
        </label>
        <div>
          {props.options.map(option => {
            return (
              <label key={option} className="checkbox-inline">
                <input
                  id={props.name}
                  name={props.name}
                  checked={props.selectedOptions.indexOf(option) !== -1}
                  onChange={props.handleChange}
                  value={option}
                  type="checkbox"
                />
                {option}
              </label>
            );
          })}
        </div>
      </div>
    );
  };
  
  export default CheckBox;
  