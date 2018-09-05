### Basic Example
An example of how a ButtonCheckbox could be utilized

```js

const { Component } = require('react');

class ButtonCheckboxExample extends Component {
	constructor(props){
		super(props)

		this.state = {
			checked: false
		}

		this._onClick = this._onClick.bind(this);
	}
	_onClick(){
		let new_checked_state = !this.state.checked

		this.setState({ checked: new_checked_state })

		if (this.props.onChange){
			this.props.onChange(new_checked_state)
		}
	}
	render() {
		return (
			<span className="button-checkbox">
				<button 
					type="button" 
					className={"btn btn" + (this.state.checked ? "-success" : "-danger btn-outline-danger") } 
					onClick={this._onClick}>
					{this.props.text}
				</button>
			</span>
		);
	}
}
;<ButtonCheckboxExample />
```