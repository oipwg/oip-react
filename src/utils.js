import { Artifact, ArtifactFile} from 'oip-index'

let formatPriceString = function(price){
	// This function assumes the scale has already been applied, and you are passing it a float value
	var priceStr = parseFloat(price.toFixed(3));

	if (isNaN(priceStr)){
		return 0;
	}

	let priceDecimal = priceStr - parseInt(priceStr);

	if (priceDecimal.toString().length === 3){
		priceStr = priceStr.toString() + "0";
	}

	return priceStr.toString();
}

const buildIPFSShortURL = (location, fileName) => {
	if (!location || !fileName)
		return "";

	return location + "/" + fileName;
};

const buildIPFSURL = (hash, fname) => {
	let trailURL = "";
	if (!fname) {
		let parts = hash.split('/');
		if (parts.length == 2) {
			trailURL = parts[0] + "/" + encodeURIComponent(parts[1]);
		} else {
			trailURL = hash;
		}
	} else {
		trailURL = hash + "/" + encodeURIComponent(fname);
	}
	return "https://gateway.ipfs.io/ipfs/" + trailURL;
};

const getFileExtension = (file) => {
	let splitFilename = file.getFilename().split(".");
	let indexToGrab = splitFilename.length - 1;
	let extension = splitFilename[indexToGrab].toLowerCase();
	return extension
};

const getIPFSImage = (artifact) => {
	if (artifact instanceof Artifact) {
		return buildIPFSURL(buildIPFSShortURL(artifact.getLocation(), artifact.getThumbnail().getFilename()))
	} else return "error: invalid Artifact[File]"
};

const getIPFSURL = (artifact, artifactFile) => {
	if (artifact instanceof Artifact && artifactFile instanceof ArtifactFile) {
		return buildIPFSURL(buildIPFSShortURL(artifact.getLocation(), artifactFile.getFilename()))
	} else return "error: invalid Artifact[File]"
};

const getIPFSURLAndImage = (artifact, artifactFile) => {
	let image = getIPFSImage(artifact);
	let url = getIPFSURL(artifact, artifactFile);
	return {image, url}
};


module.exports = {
	formatPriceString,
	getFileExtension,
	buildIPFSShortURL,
	buildIPFSURL,
	getIPFSImage,
	getIPFSURL,
	getIPFSURLAndImage
}