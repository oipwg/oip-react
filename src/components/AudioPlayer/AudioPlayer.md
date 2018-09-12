### Basic Example
How a audio file renders in AudioPlayer

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
Lockfile being set to true will render audio non-playable

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
When the Artifact is accessed but has multiple files within (Album, Playlist) you are able to switch by swapping out the file that is to be rendered in the state. In this example, the second song within the album is being loaded once the Next Song button is clicked.

```js
const { Index } = require('oip-index')

const index = new Index()

class AudioPlayerExample extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            file: undefined
        }
        this.onButtonClick = this.onButtonClick.bind(this)
    }
    componentDidMount(){
        index.getArtifact("061951").then((artifact) => {
            let files = artifact.getFiles()

            this.setState({
                artifact: artifact,
                file: files[0]
            })
        }).catch((e) => { })
    }
     onButtonClick(file_index){
        let files = this.state.artifact.getFiles()

         this.setState({
            file: files[file_index]
        })
     }
	render() {
		return (
			<div>  
            <button className="btn btn-primary" onClick={() => { this.onButtonClick(0) }}>Previous Song</button>
            <button className="btn btn-primary" style={{margin: "10px"}} onClick={() => { this.onButtonClick(1) }}>Next Song</button>
            <AudioPlayer ArtifactFile={this.state.file} />
            </div>
		)
	}
}
;<AudioPlayerExample />
```