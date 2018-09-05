### Basic Example
Here is a simple example of how to hook up the RegisterBlock to a Provider in order to have access to the logged in state, and fire off [oip-state](https://github.com/oipwg/oip-state) Actions. Using this, you can easily let the user create their Account to pay for content, or to manage their Wallet.

```js
const { Provider } = require('react-redux')
const { createStore } = require('oip-state')

require('bootstrap/dist/css/bootstrap.min.css')

const store = createStore()

class RegisterBlockExample extends React.Component {
	render() {
		return (
			<Provider store={store}>
				<RegisterBlock />
			</Provider>
		)
	}
}
;<RegisterBlockExample />
```