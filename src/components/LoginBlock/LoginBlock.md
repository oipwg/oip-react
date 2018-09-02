### Basic Example
Here is a simple example of how to hook up the LoginBlock to a Provider in order to have access to the logged in state, and fire off [oip-state](https://github.com/oipwg/oip-state) Actions. Using this, you can easily let the user log into their Account to pay for content, or to manage their Wallet.

```js
const { Provider } = require('react-redux')
const state = require('oip-state').default

require('bootstrap/dist/css/bootstrap.min.css')

const store = state.createStore()

class LoginBlockExample extends React.Component {
	render() {
		return (
			<Provider store={store}>
				<LoginBlock />
			</Provider>
		)
	}
}
;<LoginBlockExample />
```