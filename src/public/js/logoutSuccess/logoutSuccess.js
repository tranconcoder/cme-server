const postMesssage = {
	message: "Logout success!",
};

window.opener?.postMessage(postMesssage, "https://meet.google.com");

// window.location.href = "http://localhost:3000/";
window.location.href = "https://cons-meeting-education.herokuapp.com/";
