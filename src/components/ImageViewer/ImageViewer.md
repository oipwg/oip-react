### Basic Example
How images render in ImageViewer

```js
const { Index } = require('oip-index')

const index = new Index()
    
class ImageViewerExample extends React.Component {
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
			<ImageViewer ArtifactFile={this.state.file} />
		)
	}
}
;<ImageViewerExample />
```

### LockFile Example
Lockfile being set to true will render images non-viewable through an applied blur

```js
const { Index } = require('oip-index')

const index = new Index()
    
class ImageViewerExample extends React.Component {
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
			<ImageViewer ArtifactFile={this.state.file} lockFile={true} />
		)
	}
}
;<ImageViewerExample />
```