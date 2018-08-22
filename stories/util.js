let getArtifactOptions = function(artifact_array){
	let title = "Artifact"
	let options = {}
	let map = {}
	let default_artifact = ""

	for (let i = 0; i < artifact_array.length; i++){
		let title = artifact_array[i].getTitle()

		options[title] = title
		map[title] = artifact_array[i]

		if (i === 0)
			default_artifact = title
	}

	options["None"] = "None"
	map["None"] = undefined

	return {
		title,
		options,
		map,
		default_artifact
	}
}

let getFileOptions = function(Artifact){
	let title = "ArtifactFiles"
	let options = {}
	let map = {}
	let default_file = ""

	if (Artifact){
		let files = Artifact.getFiles()
		for (let i = 0; i < files.length; i++){
			let displayName = files[i].getDisplayName()

			options[displayName] = displayName
			map[displayName] = files[i]

			if (i === 0)
				default_file = displayName
		}
	}

	options["None"] = "None"
	map["None"] = undefined

	return {
		title,
		options,
		map,
		default_file
	}
}

module.exports = {
	getArtifactOptions,
	getFileOptions
}