const googleId = $("#google-id").dataset.data;
const googleName = $("#google-name").dataset.data;
const name = $("#name").dataset.data;
const avatar = $("#avatar").dataset.data;
const email = $("#email").dataset.data;
const refreshToken = $("#refresh-token").dataset.data;

const messageContent = {
	googleId: JSON.parse(googleId),
	googleName: JSON.parse(googleName),
	name: JSON.parse(name),
	email: JSON.parse(email),
	refreshToken: JSON.parse(refreshToken),
	avatar: JSON.parse(avatar),
};

// Website
window.opener?.postMessage(messageContent, "http://localhost:5000");
window.opener?.postMessage(messageContent, "http://192.168.0.100:5000");
// Google Meet Extension
window.opener?.postMessage(messageContent, "https://meet.google.com");

// window.location.href = "http://localhost:3000";
window.location.href = "https://cons-meeting-education.herokuapp.com/";
