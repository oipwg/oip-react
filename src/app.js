import React,{ Component } from 'react'
import ReactDOM, {Route} from 'react-dom';
import ImageViewer from './components/ImageViewer.js'
import testimg from './oip.svg'

class App extends Component {
	render(){
		return(
			<div>
				<ImageViewer />
			</div>
		)
	}
}

ReactDOM.render(<App/>, document.getElementById('main'));

export default App;