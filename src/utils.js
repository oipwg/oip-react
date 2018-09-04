import { Artifact, ArtifactFile} from 'oip-index'

export const formatPriceString = function(price){
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

export const buildIPFSShortURL = (location, fileName) => {
	if (!location || !fileName)
		return "";

	return location + "/" + fileName;
};

export const buildIPFSURL = (hash, fname) => {
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
	return "https://ipfs-dev.alexandria.io/ipfs/" + trailURL;
};

export const getFileExtension = (file) => {
	let splitFilename = file.getFilename().split(".");
	let indexToGrab = splitFilename.length - 1;
	return splitFilename[indexToGrab].toLowerCase();
};

export const getIPFSImage = (artifactFile) => {
	let artifact;
	if (artifactFile.parent){
		artifact = artifactFile.parent;
	} else {return {error: true, errorMessage: 'ArtifactFile.parent is undefined'}}
	if (artifact instanceof Artifact && artifact.getThumbnail()) {
		return buildIPFSURL(buildIPFSShortURL(artifact.getLocation(), artifact.getThumbnail().getFilename()))
	} else return {error: true, errorMessage: `Artifact instanceof Artifact: ${artifact instanceof Artifact} -- 
	Artifact has thumbnail: ${!!artifact.getThumbnail()}`}
};

export const getIPFSURL = (artifactFile) => {
	let artifact;
	if (artifactFile.parent){
		artifact = artifactFile.parent;
	} else {return {error: true, errorMessage: 'ArtifactFile.parent is undefined'}}
	if (artifactFile instanceof ArtifactFile) {
		return buildIPFSURL(buildIPFSShortURL(artifact.getLocation(), artifactFile.getFilename()))
	} else return {error: true, errorMessage: `Artifact is instanceof Artifact: ${artifact instanceof Artifact} -- 
	ArtifactFile is instanceof ArtifactFile: ${artifactFile instanceof ArtifactFile}`}
};

export const getIPFSURLAndImage = (artifactFile) => {
	let image = getIPFSImage(artifactFile);
	let url = getIPFSURL(artifactFile);
	return {image, url}
};