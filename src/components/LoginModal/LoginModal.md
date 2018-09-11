### Basic Example
Modal for users to access content and their wallets on confirmation of the AccountButton being triggered

```js
const { Provider } = require('react-redux')
const { createStore } = require('oip-state')

require('bootstrap/dist/css/bootstrap.min.css')

const store = createStore()

class LoginModalExample extends React.Component {
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
;<LoginModalExample />
```