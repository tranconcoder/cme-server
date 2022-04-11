const hasPassword = JSON.parse($("#hasPassword").value);
const googleId = $("#googleId").value;
const authorName = $("#authorName").value;
const classInfoId = $("#classInfoId").value;
const classInfoName = $("#classInfoName").value;
const onlineFormUrl = $("#onlineFormUrl").value;

const HOST_LIST = ["http://localhost:3000", "https://cons-meeting-education.herokuapp.com"];
const HOST_INDEX = 1;
const HOST = HOST_LIST[HOST_INDEX];

// Slide 1
const inputPassword = $("#input-password");
const nextSlideButton = $("#next-slide-btn");

const handleClickNextSlideBtn = () => {
	const showErrorsMessageElm = $("#show-errors-message-password");

	const password = inputPassword.value;

	const checkPasswordUrl = `${HOST}/resources/class-info/check-form-password`;
	const checkPasswordOptions = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			googleId,
			classInfoId,
			classInfoPassword: password,
		}),
	};

	fetch(checkPasswordUrl, checkPasswordOptions)
		.then(res => res.json())
		.then(passwordIsValid => {
			if (!passwordIsValid) throw new Error("Sai mật khẩu");
		})
		.then(() => {
			const slideContainerElm = $("#slide-container");

			Object.assign(slideContainerElm.style, {
				transform: "translateX(-50%)",
			});
		})
		.catch(errors => {
			showErrorsMessageElm.textContent = errors;
			console.error(errors);
		});
};

nextSlideButton?.addEventListener("click", handleClickNextSlideBtn);

// Slide 2
const addStudentForm = $("#add-student-form");
const indexInput = $("#index-input");
const nameInput = $("#name-input");
const googleNameInput = $("#google-name-input");
const emailInput = $("#email-input");
const submitButton = $("#submit-button");

const handleFocusoutIndexInput = async ({ target }) => {
	const indexShowErrorMessageElm = $("#index-error-message");
	const { value: indexValue } = target;

	const checkUniqueInfoUrl = `${HOST}/resources/class-info/check-unique-info`;
	const checkUniqueInfoOptions = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			googleId,
			classInfoId,
			index: +indexValue,
		}),
	};

	const indexIsUsed = (
		await fetch(checkUniqueInfoUrl, checkUniqueInfoOptions).then(res => res.json())
	).includes("index");

	switch (true) {
		case indexValue === "": {
			indexShowErrorMessageElm.textContent = "Trường này là bắt buộc.";

			return false;
		}

		case indexValue <= 0: {
			indexShowErrorMessageElm.textContent = "Giá trị này không được âm hoặc bằng 0.";

			return false;
		}

		case indexIsUsed: {
			indexShowErrorMessageElm.textContent =
				"Đã có người sử dụng số thứ tự này, bạn có thể liên hệ chủ biểu mẫu để chỉnh sử nếu số thứ tự này là của bạn.";

			return false;
		}

		default: {
			indexShowErrorMessageElm.textContent = "";

			return true;
		}
	}
};
indexInput.addEventListener("focusout", handleFocusoutIndexInput);

const handleFocusoutNameInput = ({ target }) => {
	const nameShowErrorMessageElm = $("#name-error-message");
	const { value: nameValue } = target;

	switch (true) {
		case nameValue.trim() === "": {
			nameShowErrorMessageElm.textContent = "Trường này là bắt buộc.";

			return false;
		}

		default: {
			nameShowErrorMessageElm.textContent = "";

			return true;
		}
	}
};
nameInput.addEventListener("focusout", handleFocusoutNameInput);

const handleFocusoutGoogleNameInput = async ({ target }) => {
	const googleNameShowErrorMessageElm = $("#google-name-error-message");
	const { value: googleNameValue } = target;

	const checkUniqueGoogleNameUrl = `${HOST}/resources/class-info/check-unique-info`;
	const checkUniqueGoogleNameOptions = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			googleId,
			classInfoId,
			googleName: googleNameValue,
		}),
	};

	const googleNameIsUsed = (
		await fetch(checkUniqueGoogleNameUrl, checkUniqueGoogleNameOptions).then(res => res.json())
	).includes("googleName");

	switch (true) {
		case googleNameValue.trim() === "": {
			googleNameShowErrorMessageElm.textContent = "Trường này là bắt buộc.";

			return false;
		}

		case googleNameIsUsed: {
			googleNameShowErrorMessageElm.textContent =
				"Tên tài khoản trong Google Meet này đã được sử dụng, bạn có thể liên hệ chủ biểu mẫu để chỉnh sửa nếu thông tin này là của bạn.";

			return false;
		}

		default: {
			googleNameShowErrorMessageElm.textContent = "";

			return true;
		}
	}
};
googleNameInput.addEventListener("focusout", handleFocusoutGoogleNameInput);

const handleFocusoutEmailInput = async ({ target }) => {
	const emailShowErrorMessageElm = $("#email-error-message");
	const { value: emailValue } = target;

	const checkUniqueEmailUrl = `${HOST}/resources/class-info/check-unique-info`;
	const checkUniqueEmailOptions = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			googleId,
			classInfoId,
			email: emailValue,
		}),
	};

	const emailIsUsed = (
		await fetch(checkUniqueEmailUrl, checkUniqueEmailOptions).then(res => res.json())
	).includes("email");

	switch (true) {
		case emailValue.trim() === "": {
			emailShowErrorMessageElm.textContent = "Trường này là bắt buộc.";

			return false;
		}

		case !validateEmail(emailValue): {
			emailShowErrorMessageElm.textContent = "Không đúng định dạng của một Email.";

			return false;
		}

		case emailIsUsed: {
			emailShowErrorMessageElm.textContent =
				"Email này đã được sử dụng, bạn có thể liên hệ chủ biểu mẫu chỉnh sửa nếu email này là của bạn.";

			return false;
		}

		default: {
			emailShowErrorMessageElm.textContent = "";

			return true;
		}
	}
};
emailInput.addEventListener("focusout", handleFocusoutEmailInput);

submitButton.addEventListener("click", async e => {
	e.preventDefault();

	const checkIndexResult = await handleFocusoutIndexInput({ target: indexInput });
	const checkNameResult = handleFocusoutNameInput({ target: nameInput });
	const checkGoogleNameResult = await handleFocusoutGoogleNameInput({ target: googleNameInput });
	const checkEmailResult = await handleFocusoutEmailInput({ target: emailInput });

	if (checkIndexResult && checkNameResult && checkGoogleNameResult && checkEmailResult) {
		const studentIndex = +indexInput.value;
		const studentName = nameInput.value;
		const studentGoogleName = googleNameInput.value;
		const studentEmail = emailInput.value;

		const addNewStudentUrl = `${HOST}/resources/class-info/add-student`;
		const addNewStudentOptions = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				googleId,
				classInfoIdToAdd: classInfoId,
				studentInfoToAdd: {
					index: studentIndex,
					name: studentName,
					googleName: studentGoogleName,
					email: studentEmail,
				},
				passwordToAdd: inputPassword?.value || "",
			}),
		};

		fetch(addNewStudentUrl, addNewStudentOptions)
			.then(res => {
				const responseIsOk = res.ok;

				if (!responseIsOk) throw res.statusText;
			})
			.then(() => {
				const redirectUrl = `${window.location.origin}/resources/class-info/add-student-success?onlineFormUrl=${onlineFormUrl}`;

				window.location.href = redirectUrl;
			})
			.catch(alert);
	}
});

function validateEmail(email) {
	var re =
		/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email.trim());
}
