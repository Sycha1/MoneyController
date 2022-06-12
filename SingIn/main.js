const loginInput = document.querySelector(".login");
const passwordInput = document.querySelector(".password");
const btn = document.querySelector(".SingIn");
const divError = document.querySelectorAll(".animation");

const inputs = [loginInput, passwordInput];

let firstError = false;

const users = [
	{
		name: "Krzysiek",
		login: "krzysiek123",
		password: "haslo",
	},
];

//initial page values
sessionStorage.removeItem("userName");

//if doNotLogin then add listener for inputs
const removeInputError = (params) => {
	inputs.forEach((input, i) => {
		input.addEventListener("input", () => {
			divError[i].classList.remove("animationError");
			input.style.borderColor = "black";
		});
	});
};

//login functions
const log_in = (user) => {
	location.href = "../Main/index.html";
	sessionStorage.setItem("userName", JSON.stringify(user));
};

const doNotLogin = (params) => {
	divError.forEach((el) => {
		el.classList.add("animationError");
	});

	inputs.forEach((input) => {
		input.style.borderColor = "rgba(0, 0, 0, 0)";
	});
};

const checkLoginCorrect = (params) => {
	let loginStatus = false;
	let user = "";

	users.forEach((el) => {
		if (loginInput.value == el.login && passwordInput.value == el.password) {
			loginStatus = true;
			user = el;
		}
	});

	return {
		loginStatus,
		user,
	};
};

const tryLogin = (params) => {
	const status = checkLoginCorrect().loginStatus;
	const user = checkLoginCorrect().user;

	if (status) {
		log_in(user.name);
	} else {
		doNotLogin();
		if (!firstError) removeInputError();

		firstError = true;
	}
};

//listener
btn.addEventListener("click", tryLogin);

window.addEventListener("keyup", (e) => {
	if (e.key == "Enter") tryLogin();
});
