### Basic Example
Showcasing of multiple audio Artifact Files in the format of a playlist or album 

```js
const { Provider } = require('react-redux')
const { createStore } = require('oip-state')
const { loadActiveArtifact } = require('oip-state/src/actions/ActiveArtifact/thunks')


require('bootstrap/dist/css/bootstrap.min.css')
const store = createStore()

class FilePlaylistExample  extends React.Component {
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
                <div>
                    <FilePlaylist Files={this.state.file} />
                </div>
            </Provider>
		)
	}
}
;<FilePlaylistExample />
```