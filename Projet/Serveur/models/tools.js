exports.safeStringSQL = (str) => {
	if (str){
		return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, 
	  	function (char) {
		    	switch (char) {
		      case "\0":
		        return "\\0";
		      case "\x08":
		        return "\\b";
		      case "\x09":
		        return "\\t";
		      case "\x1a":
		        return "\\z";
		      case "\n":
		        return "\\n";
		      case "\r":
		        return "\\r";
		      case "\"":
		      case "'":
		      case "\\":
		      case "%":
		        return "\\"+char;
		      default:
		        return char;
		  	}
			}
		)
	}
};

exports.isFloat = (n) => {
	if (n === null) return false;
	return Number(n) === n && n % 1 !== 0 || n % 1 === 0;
}


exports.roundedFloat = (n) => {
	if (n.toString().indexOf('.') != -1) {
		return n.toFixed(2);
	} else {
		return n;
	}
}