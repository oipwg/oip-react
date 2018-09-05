### Basic Example
An example of how a Audio File renders into AudioPlayer through pulling it from an artifact that was loaded through OIP-Index.

```js
const { Index } = require('oip-index')

const index = new Index()

class AudioPlayerExample extends React.Component {
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
			<AudioPlayer ArtifactFile={this.state.file} />
		)
	}
}
;<AudioPlayerExample />
```

### LockFile Example
When an Audio File is suppossed to be paid for, Audio Player will lock it and render it non-playable. User may be able to use the controls but will not be able to play or download, Autoplays once payment has been verified.

```js
const { Index } = require('oip-index')

const index = new Index()
    
class AudioPlayerExample extends React.Component {
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
			<AudioPlayer ArtifactFile={this.state.file} lockFile={true} />
		)
	}
}
;<AudioPlayerExample />
```
### Change Example
When the Artifact File is rendered but has multiple within the Artifact (Album, Playlist, etc...) you are able to switch between each one that is manifested by switching out the file that is to be rendered in the state.

```js
const { Index } = require('oip-index')

const index = new Index()

class AudioPlayerExample extends React.Component {
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
                file: files[1]
            })
        }).catch((e) => {
            // Error
        })
    }
	render() {
		return (
			<AudioPlayer ArtifactFile={this.state.file} />
		)
	}
}
;<AudioPlayerExample />
```