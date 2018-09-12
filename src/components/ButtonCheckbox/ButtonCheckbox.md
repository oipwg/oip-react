### Basic Example

```js
class ButtonCheckboxExample extends React.Component {
	constructor(props){
		super(props)

		this.onButtonChange = this.onButtonChange.bind(this);
	}
	onButtonChange(new_value){
		console.log("Button Has changed! " + new_value)
	}
	render() {
		return (
			<ButtonCheckbox text="my button" onChange={this.onButtonChange} />
		);
	}
}
;<ButtonCheckboxExample />
```

### Test Example
```js
<ButtonCheckbox text="my text" onChange={(new_value) => { console.log("Changed! " + new_value) } } />
```