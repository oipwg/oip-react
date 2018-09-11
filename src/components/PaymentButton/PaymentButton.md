### View Example
Button that communicates with the redux store for validating purchases

```js
const { connect, Provider } = require('react-redux')
const { createStore, loadActiveArtifact } = require('oip-state')

const store = createStore()

class PaymentButtonExample  extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            file: undefined
        }
    }
    componentDidMount(){
        store.dispatch(loadActiveArtifact("b4e6c9", (artifact) => {
            this.setState({
                file: artifact.getFiles()[0]
            })
        }))
    }
	render() {
		return (
            <Provider store={store}>
                <PaymentButton 
				    ArtifactFile={this.state.file} 
				    type={"view"}
                />
            </Provider>
		)
	}
}

;<PaymentButtonExample />
```

### Buy Example
Button that communicates with the redux store for validating purchases

```js
const { connect, Provider } = require('react-redux')
const { createStore, loadActiveArtifact } = require('oip-state')

const store = createStore()

class PaymentButtonExample  extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            file: undefined
        }
    }
    componentDidMount(){
        store.dispatch(loadActiveArtifact("b4e6c9", (artifact) => {
            this.setState({
                file: artifact.getFiles()[0]
            })
        }))
    }
	render() {
		return (
            <Provider store={store}>
                <PaymentButton 
				    ArtifactFile={this.state.file} 
				    type={"buy"}
                />
            </Provider>
		)
	}
}

;<PaymentButtonExample />
```