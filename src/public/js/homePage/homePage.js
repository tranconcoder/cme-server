const goToGoogleMeetBtn = $(".box-ctn .box-ctn__go-to-meet-bar button");

goToGoogleMeetBtn.addEventListener("click", (e) => {
	const meetLinkInputElm = $("input", e.target.parentNode);

	let meetLinkValue = meetLinkInputElm.value;

	if (!meetLinkValue.length) {
		return alert("Vui lòng nhập đường dẫn trước khi vào học!");
	}

	meetLinkValue = !meetLinkInputElm.value.includes("https")
		? `https://${meetLinkInputElm.value}`
		: meetLinkInputElm.value;

	window.open(meetLinkValue, "_blank");
});
