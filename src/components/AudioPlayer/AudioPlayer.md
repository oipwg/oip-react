### Basic Example
Here is a example of how the audio in OIP function.

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
When a sound is paid and has not been paid for, it will be locked. User may be able to scroll or turn sound off but will not be able to play or download.

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
When an sound artifact is loaded in, you are able to switch between the audio that is compiled by switching out the file that is rendered in the state.

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