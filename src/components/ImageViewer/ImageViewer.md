### Basic Example
An example of how a Image renders into ImageViewer through pulling it from an artifact loaded from OIP-Index. 

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
When an Image is supposed to be payment locked ImageViewer will blur and render it useless until the user pays for the ArtifactFile, or blur will dissipate upon verification that the user owns this particular ArtifactFile already. Lockfile will toggle to false upon either one of these realizations.

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