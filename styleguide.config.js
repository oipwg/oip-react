module.exports = {
	webpackConfig: require('./config/webpack.dev.js'),

	title: "OIP React",

	styleguideDir: "docs",

	// Use exampleMode "expand" to auto-expand Code demo blocks!
	// https://react-styleguidist.js.org/docs/configuration.html#examplemode
	exampleMode: "expand",

	// Use usageMode "expand" to auto-expand Props blocks!
	// https://react-styleguidist.js.org/docs/configuration.html#usagemode
	usageMode: 'expand',

	// Use `pagePerSection: true` to give each Component its own Page!
	// https://react-styleguidist.js.org/docs/configuration.html#pagepersection
	pagePerSection: true,

	// Sections allow grouping of Components together on the docs page!
	// https://react-styleguidist.js.org/docs/components.html#sections
	sections: [
		{
			name: 'Getting Started',
			content: 'styleguide/introduction.md',
			sectionDepth: 1,
			sections: [
				{
					name: 'Installation',
					pagePerSection: true,
					content: 'styleguide/installation.md',
					description: 'The description for the installation section'
				},
				{
					name: 'Configuration',
					content: 'styleguide/configuration.md'
				}
			]
		},
		{
			name: 'Cookbook',
			content: "styleguide/cookbook.md",
			sectionDepth: 1,
			sections: [
				{
					name: "Movie Recipe",
					content: 'styleguide/cookbook/movie-and-trailer.md'
				},
				{
					name: "Album Recipe",
					content: 'styleguide/cookbook/album.md'
				}
			]
		},
		{
			name: 'Components',
			content: "styleguide/components.md",
			sectionDepth: 2,
			sections: [
				{
					name: "Account Components",
					content: "styleguide/account/components.md",
					components: [
						'src/components/AccountButton/AccountButton.js',
						'src/components/LoginBlock/LoginBlock.js',
						'src/components/RegisterBlock/RegisterBlock.js',
						'src/components/LoginModal/LoginModal.js',
						'src/components/ButtonCheckbox/ButtonCheckbox.js'
					]
				},
				{
					name: "Artifact Components",
					content: "styleguide/artifacts/Artifact.md",
					components: [
						'src/components/ArtifactPieces/pieces/ArtifactTitle.js',
						'src/components/ArtifactPieces/pieces/ArtifactDescription.js',
						'src/components/ArtifactPieces/pieces/ArtifactArtist.js',
					]
				},
				{
					name: "ArtifactFile Components",
					content: "styleguide/artifacts/ArtifactFile.md",
					components: [
						'src/components/VideoPlayer/VideoPlayer.js',
						'src/components/AudioViewer/AudioViewer.js',
						'src/components/AudioPlayer/AudioPlayer.js',
						'src/components/ImageViewer/ImageViewer.js',
						'src/components/FileViewer.js'
					]
				},
				{
					name: "Payment Components",
					content: "styleguide/artifacts/components.md",
					components: [
						'src/components/PaymentButton/PaymentButton.js',
						'src/components/FilePlaylist/FilePlaylist.js',
						'src/components/FilePaymentWrapper.js',
						'src/components/CoinbaseModal.js',
						'src/components/CoinbaseWrapper.js'
					]
				}
			]
		}
	]
}