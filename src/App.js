import React from 'react';

export default class extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			count : 0,
		}
	}
	increment(){
		console.log(this.state.count);
		this.setState({
			count: this.state.count+1,
		})
	}
	render() {
		return(
			<div>
				<p>{this.state.count}</p>
				<button onClick={this.increment.bind(this)}>
					click me
				</button>
			</div>
		);
	}
}