### Paid Audio file Example
How a paid audio file renders from oip-state through redux

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
How a free audio file renders from oip-state through redux

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
How a free video file renders from oip-state through redux

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
How a Paid video file renders from oip-state through redux

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