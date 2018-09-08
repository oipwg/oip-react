### Basic Example
Showcasing of multiple audio Artifact Files in the format of a playlist or album 

```js
const { Provider } = require('react-redux')
const { createStore } = require('oip-state')
const { loginSuccess, logout } = require('oip-state/src/actions/Account/actions')
const { Index } = require('oip-index')
const { getArtifactOptions, getFileOptions } = require('../../utils')
require('bootstrap/dist/css/bootstrap.min.css')

const index = new Index()

require('bootstrap/dist/css/bootstrap.min.css')
const store = createStore()

class FilePlaylistExample  extends React.Component {
    componentDidMount(){
        index.getArtifact("2c53dc").then((artifact) => {
            artifact.getFiles()

            this.setState({
                artifact: artifact,
                file: files[0]
            })
        }).catch((e) => {
            // Error
        })
}
	render() {
		return (
            <Provider store={store}>
            <div>
            <FilePlaylist Files={{artifact}} />
            </div>
            </Provider>
		)
	}
}
;<FilePlaylistExample />
```