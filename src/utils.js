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

module.exports = {
	formatPriceString,
	buildIPFSShortURL,
	buildIPFSURL
}