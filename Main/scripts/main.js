const operationBtn = document.querySelector(".operation");
const btn = document.querySelector(".send");
const sumDiv = document.querySelector(".sum");
const descriptionInput = document.querySelector(".description");
const expensesDiv = document.querySelector(".expenses");
const incomeDiv = document.querySelector(".income");
const equelDiv = document.querySelector(".equel");

const valueReg = /^[0-9]{0,10}$/;

const elements = [];
let income = true;
let equel = 0;

const storageCount = (params) => {
	let howManyElInStorage = 0;

	for (let index = 0; index < localStorage.length; index++) {
		let element = localStorage.getItem(`element${index}`);
		if (element != null) howManyElInStorage++;
	}
	return howManyElInStorage;
};

let elCount = storageCount();
localStorage.setItem("ItemCount", elCount);

//functions

const regTests = (params) => {
	let isTestPositive = false;

	if (
		valueReg.test(sumDiv.value) &&
		sumDiv.value !== "" &&
		descriptionInput.value !== ""
	)
		isTestPositive = true;

	return isTestPositive;
};

const changeEquel = (value, operator) => {
	if (operator) equel += Number(value);
	if (!operator) equel -= Number(value);

	equelDiv.innerText = `${equel}zł`;
	localStorage.setItem("equel", equel);
};

const sign = (params) => {
	if (income) {
		operationBtn.children[0].classList.remove("positive");
		income = false;
	} else {
		operationBtn.children[0].classList.add("positive");
		income = true;
	}
};

const createNewElement = (params) => {
	const valueForRemove = sumDiv.value;
	const sing = income;

	const elParams = {
		description: {
			type: "div",
			class: "elementDescription",
			text: `${descriptionInput.value}:`,
		},

		value: {
			type: "p",
			class: "",
			text: `${sumDiv.value}zł`,
		},

		removeButton: {
			type: "button",
			class: "removeButton",
			text: `<i class="fas fa-times"></i>`,
			action: [valueForRemove, !sing],
		},

		income: sing,
		index: elCount,
	};

	return elParams;
};

const createHtmlElement = (elParams) => {
	const el = document.createElement("div");
	el.classList.add("element");

	for (const value of Object.values(elParams)) {
		if (typeof value == "boolean") break;
		if (value == elParams.name) break;
		const elToel = document.createElement(value.type);
		if (value.class != "") elToel.classList.add(value.class);
		if (value.text != "") elToel.innerHTML = value.text;

		el.append(elToel);
	}

	let removeBynCount = elCount;

	if (elParams.name != undefined) {
		removeBynCount = elParams.name.match(/[0-9]{0,}$/);
		removeBynCount = Number([removeBynCount[0]]);
	}

	const removebtn = el.querySelector("button");
	removebtn.addEventListener("click", () => {
		changeEquel(
			elParams.removeButton.action[0],
			elParams.removeButton.action[1]
		);
		el.remove();
		localStorage.removeItem(`element${removeBynCount}`);
		elCount--;
		localStorage.setItem("ItemCount", elCount);
	});

	return el;
};

const showElement = (el) => {
	if (income) {
		incomeDiv.append(el);
	} else {
		expensesDiv.append(el);
	}
};

const addNewElement = (params) => {
	if (regTests()) {
		const elParams = createNewElement();
		const el = createHtmlElement(elParams);
		showElement(el);
		changeEquel(sumDiv.value, income);
		elToStorage(elParams);
	}
	sumDiv.value = "";
	descriptionInput.value = "";
};

//Storage

const elToStorage = (ob) => {
	const tab = [];
	const elementsNumbers = [];

	for (const [el, values] of Object.entries(localStorage)) {
		if (el.match(/^element/)) {
			const a = el.match(/[0-9]{0,}$/);
			elementsNumbers.push(Number(a[0]));
		}
	}

	elementsNumbers.sort();
	let lastNumber = 0;

	if (elementsNumbers.length > 0) {
		lastNumber = elementsNumbers[elementsNumbers.length - 1] + 1;
	}

	ob.name = `element${lastNumber}`;

	for (const item of Object.values(ob)) {
		tab.push(item);
	}

	localStorage.setItem(`element${lastNumber}`, JSON.stringify(tab));
	elCount++;

	localStorage.setItem("ItemCount", elCount);
	localStorage.setItem("equel", equel);
};

//Load Page section

window.addEventListener("load", () => {
	const h1 = document.querySelector("h1");

	const userName = sessionStorage.getItem("userName");

	h1.innerText = `Witaj ${userName}`;

	if (userName == null) location.href = "../SingIn/index.html";

	elCount = 0;

	equel = Number(localStorage.getItem("equel"));
	equelDiv.innerText = `${equel}zł`;

	for (const [el, values] of Object.entries(localStorage)) {
		let ob = {};

		if (el.match(/^element/)) {
			const elParams = JSON.parse(values);

			ob.description = elParams[0];
			ob.value = elParams[1];
			ob.removeButton = elParams[2];
			ob.income = elParams[3];
			ob.index = elParams[4];
			ob.name = elParams[5];

			income = ob.income;
			const el = createHtmlElement(ob);
			showElement(el);
			elCount++;
		}
	}
});

//listeners
operationBtn.addEventListener("click", sign);

btn.addEventListener("click", addNewElement);

window.addEventListener("keyup", (e) => {
	if (e.key == "Enter") addNewElement();
});
