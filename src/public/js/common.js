const $ = (selector, bindObj = document) => {
	return bindObj.querySelector(selector);
};
const $$ = (selector, bindObj = document) => {
	return bindObj.querySelectorAll(selector);
};

function validateEmail(email) {
	const re =
		/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email.trim());
}
