### Paid Audio file Example
An example of how a Paid Audio File renders from oip-state through redux

```js
const { Provider } = require('react-redux')
const { createStore, loadActiveArtifact } = require('oip-state')

const store = createStore()

class FilePaymentWrapperExample extends React.Component {
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
                <FilePaymentWrapper ArtifactFile={this.state.file} />
            </Provider>
		)
	}
}
;<FilePaymentWrapperExample />
```

### Free Audio file Example
An example of how a free Audio File renders from oip-state through redux

```js
const { Provider } = require('react-redux')
const { createStore, loadActiveArtifact } = require('oip-state')

const store = createStore()

class FilePaymentWrapperExample extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            file: undefined
        }
    }
    componentDidMount(){
        store.dispatch(loadActiveArtifact("061951", (artifact) => {
            this.setState({
                file: artifact.getFiles()[0]
            })
        }))
    }
	render() {
		return (
            <Provider store={store}>
                <FilePaymentWrapper ArtifactFile={this.state.file} />
            </Provider>
		)
	}
}
;<FilePaymentWrapperExample />
```
### Free Video file Example
An example of how a free Video File renders from oip-state through redux

```js
const { Provider } = require('react-redux')
const { createStore, loadActiveArtifact } = require('oip-state')

const store = createStore()

class FilePaymentWrapperExample extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            file: undefined
        }
    }
    componentDidMount(){
        store.dispatch(loadActiveArtifact("5533ce", (artifact) => {
            this.setState({
                file: artifact.getFiles()[0]
            })
        }))
    }
	render() {
		return (
            <Provider store={store}>
                <FilePaymentWrapper ArtifactFile={this.state.file} />
            </Provider>
		)
	}
}
;<FilePaymentWrapperExample />
```
### Paid Video file Example
An example of how a Paid Video File renders from oip-state through redux

```js
const { Provider } = require('react-redux')
const { createStore, loadActiveArtifact } = require('oip-state')

const store = createStore()

class FilePaymentWrapperExample extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            file: undefined
        }
    }
    componentDidMount(){
        store.dispatch(loadActiveArtifact("21252c", (artifact) => {
            this.setState({
                file: artifact.getFiles()[0]
            })
        }))
    }
	render() {
		return (
            <Provider store={store}>
                <FilePaymentWrapper ArtifactFile={this.state.file} />
            </Provider>
		)
	}
}
;<FilePaymentWrapperExample />
```