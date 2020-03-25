import React from "react";
import {setEndOfContentEditable, singleClickDelay, taskType} from "./../utils"
import "./../stylesheets/TaskItem.css"

export default class TaskItemView extends React.Component{
	constructor(props) {
		super(props);
		this.textRef = React.createRef();
	}
	componentDidMount() {
		if(this.props.hasFocus){
			this.editTaskText(this.textRef.current);
		}
	}
	blurHandler = (event) => {
		event.target.contentEditable = false;
		event.target.classList.remove('ContentEditingElement');
		this.props.updateTask(event.target.textContent);
		const taskElement = event.target.closest('li');
		taskElement.classList.remove("FocusTaskElement")
	};
	enterClickHandler = (event) => {
		event.target.blur();
	};
	editTaskText = () => {
		let taskTextElement = this.textRef.current;
		taskTextElement.contentEditable=true;
		taskTextElement.classList.add('ContentEditingElement');
		taskTextElement.focus();
		setEndOfContentEditable(taskTextElement);
		const taskElement =taskTextElement.closest('li');
		taskElement.classList.add("FocusTaskElement")
	};
	singleClickHandler = (event) => {
		const taskTextElement = event.target;
		this.timer = setTimeout(() => {
			if(!this.prevent && !(taskTextElement.contentEditable==="true")){
				this.props.markTask()
			}
		},singleClickDelay);
		this.prevent = false;
	};
	doubleClickHandler = () => {
		clearTimeout(this.timer);
		this.prevent = true;
		this.editTaskText();
	};
	render() {
		return (
			<li className="TaskListElement">
				<button
					className={"RemoveTaskButton"}
					onClick={this.props.removeTask}
				>{String.fromCharCode(0x2715)}</button>
				<span
					ref={this.textRef}
					onBlur={this.blurHandler}
					className={
						(this.props.taskType === taskType.TODO ? "TodoTaskListElementText " : "CompletedTaskListElementText ")
					}
					onKeyDown={
						(event)=>{
							if(event.key === "Enter"){
								this.enterClickHandler(event);
							}
						}
					}
					onDoubleClick={this.doubleClickHandler}
					onClick={this.singleClickHandler}
				>{this.props.text}</span>
			</li>)
	}
}