
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

module.exports = {
	formatPriceString
}