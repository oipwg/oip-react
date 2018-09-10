### Audio Example
An example of how a Audio File renders into FileViewer

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
        index.getArtifact("061951").then((artifact) => {
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
