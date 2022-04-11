module.exports = function missingCredentialsCheck(
	keys = [],
	reqObj = {},
	res
) {
	const reqObjKeys = Object.keys(reqObj);
	const isMissingCredentials = keys.some(
		(key) => !reqObjKeys.includes(key)
	);

	if (isMissingCredentials) {
		res.status(401).send("Missing credentials!");
		return false;
	}

	return true;
};
