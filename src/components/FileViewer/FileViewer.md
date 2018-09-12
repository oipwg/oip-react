### Audio Example
An example of how a Audio File renders into FileViewer

```js
const { Provider } = require('react-redux')
const { createStore, loadActiveArtifact } = require('oip-state')

const store = createStore()

class FileViewerExample extends React.Component {
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
                <FileViewer ArtifactFile={this.state.file} />
            </Provider>
		)
	}
}
;<FileViewerExample />
```

### Image Example 

```js
const { Index } = require('oip-index')

const index = new Index()
    
class FileViewerExample extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            file: undefined
        }
    }
    componentDidMount(){
        index.getArtifact("2c6d08").then((artifact) => {
            let files = artifact.getFiles()

            this.setState({
                file: files[0]
            })
        }).catch((e) => {
            // Error
        })
    }
	render() {
		return (
			<FileViewer ArtifactFile={this.state.file} />
		)
	}
}
;<FileViewerExample />
```
### Video Example
An example of how a Video File renders into FileViewer

```js
const { Index } = require('oip-index')

const index = new Index()

class FileViewerExample extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            file: undefined
        }
    }
    componentDidMount(){
        index.getArtifact("21252c").then((artifact) => {
            let files = artifact.getFiles()

            this.setState({
                file: files[0]
            })
        }).catch((e) => {
            // Error
        })
    }
	render() {
		return (
			<FileViewer ArtifactFile={this.state.file} />
		)
	}
}
;<FileViewerExample />
```
