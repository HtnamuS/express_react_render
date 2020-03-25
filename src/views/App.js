import React from 'react';
import TasksContainerView from "./TasksContainerView";
import './../stylesheets/App.css'

class App extends React.Component {
	constructor(props) {
		super(props);
		let prevTaskContainerIds = JSON.parse(localStorage.getItem('TaskContainerIds'));
		if (!prevTaskContainerIds || prevTaskContainerIds.length === 0) {
			const newId = "TaskContainer_" + new Date().getTime();
			this.state = {
				taskContainerIds: ["TaskContainer_" + new Date().getTime()],
			};
			prevTaskContainerIds = [newId];
			localStorage.setItem('TaskContainerIds', JSON.stringify(prevTaskContainerIds))
		} else {
			this.state = {
				taskContainerIds: prevTaskContainerIds,
			}
		}
		if (this.state.taskContainerIds.length === 1) {
			this.state = Object.assign(this.state, {
				focusedTaskContainer: this.state.taskContainerIds[0],
				mouseOnTaskContainer: null
			})
		}
	}
	
	newListHandler = () => {
		const newTaskContainerId = "TaskContainer_" + new Date().getTime();
		this.setState((state) => {
			state.taskContainerIds.unshift(newTaskContainerId);
			state.focusedTaskContainer = newTaskContainerId;
			return state;
		});
		const prevTaskContainerIds = JSON.parse(localStorage.getItem('TaskContainerIds'));
		prevTaskContainerIds.unshift(newTaskContainerId);
		localStorage.setItem('TaskContainerIds', JSON.stringify(prevTaskContainerIds));
	};
	
	taskContainerOnClick = (taskContainerId, event) => {
		event.stopPropagation();
		this.setState({
			focusedTaskContainer: taskContainerId,
		})
	};
	
	taskContainerOnMouseEnter = (taskContainerId) => {
		this.setState({
			mouseOnTaskContainer: taskContainerId,
		})
	};
	
	taskContainerOnMouseExit = () => {
		this.setState({
			mouseOnTaskContainer: null,
		})
	};
	
	removeTaskList = (taskContainerId, event) => {
		event.stopPropagation();
		let newTaskContainerIds = this.state.taskContainerIds.slice();
		newTaskContainerIds.splice(newTaskContainerIds.indexOf(taskContainerId), 1);
		if (newTaskContainerIds.length === 0) {
			const newId = "TaskContainer_" + new Date().getTime();
			this.setState({
				taskContainerIds: [newId],
				focusedTaskContainer: newId,
				mouseOnTaskContainer: null,
			});
			localStorage.setItem('TaskContainerIds', JSON.stringify([newId]));
		} else {
			this.setState({
				taskContainerIds: newTaskContainerIds,
				focusedTaskContainer: null,
				mouseOnTaskContainer: null,
			});
		}
		localStorage.setItem('TaskContainerIds', JSON.stringify(newTaskContainerIds));
	};
	
	render() {
		return (
			<React.Fragment>
				<h1 className="appTitle">ToDo Recorder</h1>
				<div className="AddListDivision">
					<button
						className="AddListButton"
						onClick={this.newListHandler}
					>&#43; Add List
					</button>
				</div>
				<li className="TaskContainerList">{
					this.state.taskContainerIds.map(
						(taskContainerId) =>
							<TasksContainerView
								key={taskContainerId}
								id={taskContainerId}
								onFocus={this.state.focusedTaskContainer === taskContainerId || this.state.mouseOnTaskContainer === taskContainerId}
								onMouseEnter={this.taskContainerOnMouseEnter.bind(undefined, taskContainerId)}
								onMouseExit={this.taskContainerOnMouseExit.bind(undefined, taskContainerId)}
								onClickHandler={this.taskContainerOnClick.bind(undefined, taskContainerId)}
								removeTaskList={this.removeTaskList.bind(undefined, taskContainerId)}
							/>)
				}</li>
			
			
			</React.Fragment>
		)
	};
}

export default App;