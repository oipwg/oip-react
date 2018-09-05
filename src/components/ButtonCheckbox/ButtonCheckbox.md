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
			<ButtonCheckbox />
		);
	}
}
;<ButtonCheckboxExample />
```