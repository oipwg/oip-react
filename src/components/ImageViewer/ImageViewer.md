### Basic Example
Here is a example of how the images in OIP function.

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
When an image is paid and has not been paid for, A blur is applied so that unpurchased content may not be downloaded

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