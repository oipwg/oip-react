### Basic Example
Button that communicates with the redux store for validating purchases

```js
const { Provider } = require('react-redux')
const { createStore } = require('oip-state')
const { loginSuccess, logout } = require('oip-state/src/actions/Account/actions')
const { Index } = require('oip-index')
require('bootstrap/dist/css/bootstrap.min.css')

const index = new Index()

require('bootstrap/dist/css/bootstrap.min.css')
const store = createStore()

class PaymentButtonExample  extends React.Component {
    componentDidMount(){
        index.getArtifact("21252c").then((artifact) => {
            artifact.getFiles()

            this.setState({
                artifact: artifact,
                file: files[0]
            })
        }).catch((e) => {
            // Error
        })
}
	render() {
		return (
            <Provider store={store}>
                <div>
                  <PaymentButton 
				Artifact={artifact} 
				ArtifactFile={artifact_file} 
				type={type_value} 
                fileState={file_state} />
                </div>
            </Provider>
		)
	}
}
;<PaymentButtonExample />
```