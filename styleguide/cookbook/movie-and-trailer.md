## Movie and Trailer Page

In this Recipe, we will build a full page that allows users to view a trailer, and purchase a Movie as well. While this sounds hard, you don't need to control a majority of the functionality, but rather to just use Components inside of the OIP React package to simply design your user interface.

### Finished Result
Here is an example of the finished result we will be building in this Recipe

```js
const { Provider, connect } = require('react-redux')
const { createStore } = require('oip-state')

const { loadActiveArtifact } = require('oip-state/src/actions/ActiveArtifact/thunks')
const { setActiveFile, fileToUID } = require('oip-state/src/actions/ActiveArtifactFiles/thunks')

const store = createStore()

class MoviePageRecipe extends React.Component {
	constructor(props){
		super(props)

		this.fileSet = false

		this.fetchArtifact = this.fetchArtifact.bind(this);
	}
	fetchArtifact(){
		// Sintel: d48f83
		this.props.loadActiveArtifact("d48f83", (artifact) => {
			this.props.setActiveFile(artifact.getFiles()[1])
			this.fileSet = true
		})
	}
	componentDidMount(){
		this.fetchArtifact()
	}
	render(){
		return(
			<div className="container">
				{/* LoginModal is used to provide a way for the user to Login */}
				<LoginModal />
				{/* CoinbaseWrapper is used to provide a way for the user to purchase extra funds from Coinbase */}
				<CoinbaseWrapper />

				{/* The AccountButton is used to provide a way for the User */}
				<div className="row justify-content-end">
					<AccountButton className="float-right" style={{marginRight: "20px"}} />
				</div>

				<div className="row">
					<h1 className="mx-auto">
						<ArtifactTitle/>
					</h1>
				</div>

				<div className="row">
					<div className="col-12 col-md-8 col-lg-9">
						<FilePaymentWrapper options={{usePosterFile: false}} />
					</div>
					<div className="d-none d-md-block col-md-4 col-lg-3">
						<PosterWrapper />
					</div>
				</div>

				<div className="row">
					<div className="card" style={{width: "100%", padding: "20px"}}>
						<div className="row">
							<div className="col-12 col-sm-6 col-md-8 col-lg-9">
								<div className="card-subtitle" style={{whiteSpace: "pre-wrap"}}>
									<ArtifactTitle />
								</div>
							</div>
							<div className="col-12 col-sm-6 col-md-4 col-lg-3">
							{
								this.props.ActiveArtifactFiles ?
									
								<div>
									<PaymentButton type="view" ArtifactFile={this.props.ActiveArtifactFiles[paid_file_uid].ArtifactFile} />
									<PaymentButton type="buy" ArtifactFile={this.props.ActiveArtifactFiles[paid_file_uid].ArtifactFile} />
								</div>

								: null
							}
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

var mapDispatchToProps = {
	loadActiveArtifact,
	setActiveFile
}

MoviePageRecipe = connect(undefined, mapDispatchToProps)(MoviePageRecipe)

class ProviderWrapper extends React.Component {
	render(){
		return(
			<Provider store={store}>
				<MoviePageRecipe />
			</Provider>
		)
	}
}
;<ProviderWrapper />
```