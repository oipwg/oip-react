### Basic Example
Communication to the Redux Store to prompt the LoginModal for users to access content and their wallets

```js
const { Provider } = require('react-redux')
const { createStore } = require('oip-state')

require('bootstrap/dist/css/bootstrap.min.css')

const store = createStore()

class AccountButtonExample extends React.Component {
	render() {
		return (
            <Provider store={store}>
                <div>
                    <AccountButton />
                    <LoginModal />
                </div>
            </Provider>
		)
	}
}
;<AccountButtonExample />
```