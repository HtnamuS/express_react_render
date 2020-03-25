import React from 'react';
import TodoInputView from "./TodoInputView";
import TaskItemView from "./TaskItemView";
import "./../stylesheets/TasksContainer.css"
import {taskType, setEndOfContentEditable} from "../utils";
import TaskListView from "./TaskListView";

class TaskContainerHeaderView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isTitleEditable: this.props.titleText.trim().length === 0,
		}
	}
	
	titleOnChangeHandler = (event) => {
		let newTitle;
		if (event.target.textContent) {
			newTitle = event.target.textContent;
		} else if (event.target.value) {
			newTitle = event.target.value;
		}
		this.props.changeTitle(newTitle);
	};
	titleOnBlurHandler = (event) => {
		if (event.target.textContent) {
			let newTitle = event.target.textContent;
			if (newTitle.trim().length === 0) {
				this.props.changeTitle("ToDo TaskList")
			} else {
				this.props.changeTitle(newTitle);
			}
		}
		this.setState({
			isTitleEditable: false,
		});
	};
	
	render() {
		let titleElement;
		if (this.state.isTitleEditable) {
			titleElement = <input
				value={this.props.titleText}
				ref={this.titleTextRef}
				placeholder="ToDo TaskList"
				className="TitleInput"
				onChange={(event) => this.titleOnChangeHandler(event)}
				onKeyDown={
					(event) => {
						if (event.key === 'Enter') {
							event.target.blur();
						}
					}
				}
				onBlur={this.titleOnBlurHandler}
			/>;
		} else {
			titleElement = <span
				className="TitleSpan"
				onClick={event => {
					event.target.contentEditable = 'true';
					event.target.focus();
					setEndOfContentEditable(event.target);
				}}
				onBlur={this.titleOnChangeHandler}
				onKeyDown={event => {
					if (event.key === 'Enter') {
						event.target.blur();
					}
				}}
			>
				{this.props.titleText}
			</span>
		}
		return (
			<div className="Title">
				{titleElement}
				<button
					className="DeleteListButton"
					onClick={this.props.removeTaskList}
				>Delete List
				</button>
			</div>
		)
	}
}

class TasksContainerView extends React.Component {
	constructor(props) {
		super(props);
		this.inputFieldRef = React.createRef();
		const prevState = JSON.parse(localStorage.getItem(this.props.id));
		if (prevState) {
			this.state = prevState
		} else {
			this.state = {
				titleText: '',
				data: {
					todoTasksData: [],
					completedTasksData: [],
				},
				listStatus: {
					isTodoListCompressed: false,
					isCompletedListCompressed: false,
					focusOnLatestElement: false,
				}
			};
		}
		
		this.titleTextRef = React.createRef();
	}
	
	getTaskObj = (taskId, state) => {
		if (taskId.includes(taskType.TODO)) {
			let targetTask = state.data.todoTasksData.filter(taskObj => taskObj.id === taskId);
			if (targetTask.length !== 1) {
				throw new Error(targetTask.length + " task Objects found with id " + taskId);
			}
			return targetTask[0];
		} else if (taskId.includes(taskType.COMPLETED)) {
			let targetTask = state.data.completedTasksData.filter(taskObj => taskObj.id === taskId);
			if (targetTask.length !== 1) {
				throw new Error(targetTask.length + " task Objects found with id " + taskId);
			}
			return targetTask[0];
		}
	};
	newTodoRequest = (taskText) => {
		this.setState((state) => {
			const taskId = taskType.TODO + '_' + new Date().getTime();
			state.data.todoTasksData.push({id: taskId, text: taskText});
			state.listStatus.focusOnLatestElement = true;
			return state;
		});
	};
	updateTask = (taskId, newTaskText) => {
		if (newTaskText.trim().length === 0) {
			this.removeTask(taskId);
			return;
		}
		this.setState((state) => {
			const targetTask = this.getTaskObj(taskId, state);
			targetTask.text = newTaskText;
			state.listStatus.focusOnLatestElement = false;
			return state;
		});
		this.inputFieldRef.current.focus();
	};
	removeTask = (taskId) => {
		if (taskId.includes(taskType.TODO)) {
			this.setState((state) => {
				const targetTask = this.getTaskObj(taskId, state);
				state.data.todoTasksData.splice(state.data.todoTasksData.indexOf(targetTask), 1);
				return state;
			});
		} else if (taskId.includes(taskType.COMPLETED)) {
			this.setState((state) => {
				const targetTask = this.getTaskObj(taskId, state);
				state.data.completedTasksData.splice(state.data.todoTasksData.indexOf(targetTask), 1);
				return state;
			});
		}
	};
	markTask = (taskId) => {
		if (taskId.includes(taskType.TODO)) {
			this.setState((state) => {
				const targetTask = this.getTaskObj(taskId, state);
				state.data.todoTasksData.splice(state.data.todoTasksData.indexOf(targetTask), 1);
				targetTask.id = taskType.COMPLETED + '_' + taskId.split('_')[1];
				state.data.completedTasksData.push(targetTask);
				return state;
			});
		} else if (taskId.includes(taskType.COMPLETED)) {
			this.setState((state) => {
				const targetTask = this.getTaskObj(taskId, state);
				state.data.completedTasksData.splice(state.data.completedTasksData.indexOf(targetTask), 1);
				targetTask.id = taskType.TODO + '_' + taskId.split('_')[1];
				state.data.todoTasksData.push(targetTask);
				return state;
			});
		}
	};
	markAllActionHandler = (targetTaskType) => {
		console.log('hi');
		if (targetTaskType === taskType.TODO) {
			const todoTasksData = this.state.data.todoTasksData.slice();
			const newCompletedTasksData = this.state.data.completedTasksData.slice();
			for (let taskObj of todoTasksData) {
				taskObj.id = targetTaskType.COMPLETED + '_' + taskObj.id.split('_')[1];
				newCompletedTasksData.push(taskObj);
			}
			todoTasksData.length = 0;
			this.setState((state) => {
				state.data.todoTasksData = todoTasksData;
				state.data.completedTasksData = newCompletedTasksData;
				return state;
			});
		} else if (targetTaskType === taskType.COMPLETED) {
			const completedTasksData = this.state.data.completedTasksData.slice();
			const newTodoTasksData = this.state.data.todoTasksData.slice();
			for (let taskObj of completedTasksData) {
				taskObj.id = targetTaskType.TODO + "_" + taskObj.id.split('_')[1];
				newTodoTasksData.push(taskObj);
			}
			completedTasksData.length = 0;
			this.setState((state) => {
				state.data.todoTasksData = newTodoTasksData;
				state.data.completedTasksData = completedTasksData;
				return state;
			});
		}
	};
	clearAllHandler = (targetTaskType) => {
		if (targetTaskType === taskType.TODO) {
			this.setState((state) => {
				state.data.todoTasksData.length = 0;
				return state;
			})
		} else if (targetTaskType === taskType.COMPLETED) {
			this.setState((state) => {
				state.data.completedTasksData.length = 0;
				return state;
			})
		}
	};
	generateTasks = (taskType, tasksData, isFocusOnLatestTask) => {
		return tasksData.map((taskObj, index) => {
			return <TaskItemView
				text={taskObj.text}
				key={taskObj.id}
				taskType={taskType}
				hasFocus={isFocusOnLatestTask && index === tasksData.length - 1}
				updateTask={this.updateTask.bind(undefined, taskObj.id)}
				removeTask={this.removeTask.bind(undefined, taskObj.id)}
				markTask={this.markTask.bind(undefined, taskObj.id)}
			/>
		});
	};
	todoInputOnChangeHandler = (event) => {
		this.setState((state) => {
			state.listStatus.isTodoListCompressed = false;
			return state;
		});
		this.newTodoRequest(event.target.value);
		event.target.value = '';
	};
	toggleListCompress = (targetListType) => {
		if (targetListType === taskType.TODO) {
			this.setState((state) => {
				state.listStatus.isTodoListCompressed = !state.listStatus.isTodoListCompressed;
				return state;
			})
		} else if (targetListType === taskType.COMPLETED) {
			this.setState((state) => {
				state.listStatus.isCompletedListCompressed = !state.listStatus.isCompletedListCompressed;
				return state;
			})
		}
	};
	changeTitle = (newTitle) => {
		this.setState({
			titleText: newTitle
		});
	};
	
	componentDidMount() {
		if (this.titleTextRef.current) {
			this.titleTextRef.current.focus();
		}
	}
	
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.state !== prevState) {
			localStorage.setItem(this.props.id, JSON.stringify(this.state));
		}
	}
	
	render() {
		let todoItemViews = this.generateTasks(taskType.TODO, this.state.data.todoTasksData, this.state.listStatus.focusOnLatestElement);
		let completedItemViews = this.generateTasks(taskType.COMPLETED, this.state.data.completedTasksData, false);
		return (
			<div
				className="TasksContainer"
				onClick={this.props.onClickHandler}
				onMouseEnter={this.props.onMouseEnter}
				onMouseLeave={this.props.onMouseExit}
			>
				<TaskContainerHeaderView
					titleText={this.state.titleText}
					changeTitle={this.changeTitle}
					removeTaskList={this.props.removeTaskList}
				/>
				{this.state.data.todoTasksData.length > 0 && <TaskListView
					listType={taskType.TODO}
					isCompressed={this.state.listStatus.isTodoListCompressed}
					markAllActionHandler={this.markAllActionHandler.bind(undefined, taskType.TODO)}
					clearAllHandler={this.clearAllHandler.bind(undefined, taskType.TODO)}
					listDisplayActionHandler={this.toggleListCompress.bind(undefined, taskType.TODO)}
				>
					{todoItemViews}
				</TaskListView>}
				
				{this.props.onFocus &&
				<TodoInputView onChangeHandler={this.todoInputOnChangeHandler}
				               inputFieldRef={this.inputFieldRef}/>
				}
				
				{this.state.data.completedTasksData.length > 0 && <TaskListView
					listType={taskType.COMPLETED}
					isCompressed={this.state.listStatus.isCompletedListCompressed}
					markAllActionHandler={this.markAllActionHandler.bind(undefined, taskType.COMPLETED)}
					clearAllHandler={this.clearAllHandler.bind(undefined, taskType.COMPLETED)}
					listDisplayActionHandler={this.toggleListCompress.bind(undefined, taskType.COMPLETED)}
				>
					{completedItemViews}
				</TaskListView>}
			</div>
		)
	}
}

export default TasksContainerView;