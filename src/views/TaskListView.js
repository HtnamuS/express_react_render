import React from "react";
import {taskType,arrowDown,arrowRight} from "./../utils"
import "./../stylesheets/TaskList.css"


class TaskListView extends React.Component{
	constructor(props) {
		super(props);
		this.ActionBarView = generateActionBar(props.listType);
	}
	render() {
		return(
			<div className={this.props.listType===taskType.TODO?"TodoTaskListDivision":"CompletedTaskListDivision"}>
				<this.ActionBarView
					listDisplayActionHandler={this.props.listDisplayActionHandler}
					markAllActionHandler = {this.props.markAllActionHandler}
					clearAllHandler ={this.props.clearAllHandler}
					isCompressed={this.props.isCompressed}
					count={this.props.children.length}
				/>
				{!this.props.isCompressed && (
					<ul className={this.props.listType===taskType.TODO?"TodoTaskList":"CompletedTaskList"}>
						{this.props.children}
					</ul>
				)}
			</div>
		)
	}
	
}

function generateActionBar(actionBarType){
	let listHeadMessage, markAllText;
	if(actionBarType === taskType.TODO){
		listHeadMessage = "ToDo Tasks";
		markAllText = "Mark All Completed";
		
	}
	else{
		listHeadMessage = "Completed Tasks";
		markAllText = "Mark All ToDo";
	}
	return function ActionBarView(props) {
		return (
			<div className={actionBarType===taskType.TODO?"TodoActionBar":"CompletedActionBar"}>
				<span className={"TaskListHead " + (props.isCompressed?"CompressedListHead":'')} onClick={props.listDisplayActionHandler}>{
					(props.isCompressed?arrowRight:arrowDown) + '\t' +listHeadMessage + (props.isCompressed && props.count>0?': ' + props.count:'')
				}</span>
				<button
					className="ClearAllButton"
					onClick={props.clearAllHandler}
				>Clear All</button>
				<button
					className="MarkAllButton"
					onClick={props.markAllActionHandler}
				>{markAllText}</button>
				
			</div>
		)
	}
}

export default TaskListView