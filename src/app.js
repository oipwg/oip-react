import { Component } from 'react'
import ReactDOM from 'react-dom';
import imageViewer from './components/ImageViewer.js'

class App extends Component {
	render(){
		return(
			<div>Hello World!</div>
		)
	}
}

<Route exact path="imgTest" Component={imageViewer} />
ReactDOM.render(<App/>, document.getElementById('main'));

export default App;