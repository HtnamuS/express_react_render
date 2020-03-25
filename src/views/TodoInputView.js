import React from "react";
import "./../stylesheets/TodoInput.css"
function TodoInputView(props){
	return (
		<div className="TodoInputDivision">
			<span className="NewTodoPlusSymbol">&#43;</span>
			<input
				className="TodoInputField"
				autoComplete="off"
				placeholder="Add ToDo..."
				value=''
				onChange={props.onChangeHandler}
				ref={props.inputFieldRef}
			/>
		</div>
	)
}

export default TodoInputView;