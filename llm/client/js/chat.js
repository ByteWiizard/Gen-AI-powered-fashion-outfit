const query = (obj) =>
	Object.keys(obj)
		.map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(obj[k]))
		.join("&");
const url_prefix = document.querySelector("body").getAttribute("data-urlprefix");
const markdown = window.markdownit();
const message_box = document.getElementById(`messages`);
const message_input = document.getElementById(`message-input`);
const box_conversations = document.querySelector(`.top`);
const spinner = box_conversations.querySelector(".spinner");
const stop_generating = document.querySelector(`.stop-generating`);
const send_button = document.querySelector(`#send-button`);
const user_image = `<img src="${url_prefix}/assets/img/user.png" alt="User Avatar">`;
const gpt_image = `<img src="${url_prefix}/assets/img/gpt.png" alt="GPT Avatar">`;
const imageBook = document.getElementById('imageBook');
let prompt_lock = false;
hljs.addPlugin(new CopyButtonPlugin());

message_input.addEventListener("blur", () => {
	window.scrollTo(0, 0);
});

message_input.addEventListener("focus", () => {
	document.documentElement.scrollTop = document.documentElement.scrollHeight;
});

const delete_conversations = async () => {
	localStorage.clear();
	await new_conversation();
};

function scrollToBottom() {
	message_box.scrollTop = message_box.scrollHeight;
}


const predefinedQuestions = [
	"Hello! Welcome to the Fashion Outfit Generator. To start, are you looking for male clothing or female clothing? Could you also specify your age, please?",
	"Great! What type of clothing are you interested in? For instance, casuals, formals, party wear, or something else?",
	"Thanks! Now, could you let me know your preferred color?",
	"Got it! How about we go with red? Does that work for you?",
	"Excellent! What's the occasion you're buying the clothing for?",
	"Thanks for sharing. If applicable, could you tell me which festival or event you're preparing for?",
	"Understood. What's your preferred style? Feel free to mention Western, Indie, Desi, Aesthetic, or any other style you have in mind.",
	"Thank you for providing these details. Based on your preferences, I can offer two options. Would you like to see outfit images inspired by current Pinterest trends? Or would you prefer me to generate a fresh outfit for you using advanced GenAI techniques?"
];


const queries = [
	"No worries! Let's work together to refine the outfit. Would you like to adjust specific elements, or would you prefer to explore the alternative option?"
]

const userAnswers = new Map(); // Map to store user answers

const displayProducts = async (products) => {
	console.log(products);
}
const displayQuestion = async (question) => {
	// Display the question in the message box
	console.log(url_prefix);
	message_input.style.height = `80px`;
	// window.scrollTo(0, 0);
	scrollToBottom();
	message_input.value = question;
	message_input.dispatchEvent(new Event("input"));
	window.token = message_id();


	message_box.innerHTML += `
            <div class="message">
                <div class="avatar-container">
                    ${gpt_image}
                </div>
                <div class="content" id="gpt_${window.token}">
                    <div id="cursor"></div>
                </div>
            </div>
        `;


	document.getElementById(`gpt_${window.token}`).innerHTML = markdown.render(question);
	document.querySelectorAll(`code`).forEach((el) => {
		hljs.highlightElement(el);
	});
	scrollToBottom();


	message_input.value = ``
	let response = await new Promise((resolve) => {
		const interval = setInterval(() => {
			const userInput = userAnswers.get(window.token);
			if (userInput && userInput.trim() !== "") {
				clearInterval(interval);
				resolve(userInput);
			}
		}, 100);
	});

	window.token = message_id();
	message_box.innerHTML += `
            <div class="message">
                <div class="avatar-container">
                    ${user_image}
                </div>
                <div class="content" id="gpt_${window.token}">
                    <div id="cursor"></div>
                </div>
            </div>
        `;
	document.getElementById(`gpt_${window.token}`).innerHTML = markdown.render(response);
	document.querySelectorAll(`code`).forEach((el) => {
		hljs.highlightElement(el);
	});
	userAnswers.set(window.token, response);

};

message_input.addEventListener("keydown", async (evt) => {
	if (prompt_lock) return;

	if (evt.key === "Enter" && !evt.shiftKey) {
		evt.preventDefault();
		userAnswers.set(window.token, message_input.value); // Store the user's response
		message_input.value = ``; // Clear the input field
	}
});


function getUniqueWordsAsString(inputString) {
	const words = inputString.toLowerCase().split(/\W+/); // Split by non-word characters
	const uniqueWordsSet = new Set(words);
	const uniqueWordsArray = Array.from(uniqueWordsSet);
	const uniqueWordsString = uniqueWordsArray.join(' ');
	return uniqueWordsString;
}

const handle_ask = async () => {
	// Iterate over predefined questions
	for (const question of predefinedQuestions) {
		await displayQuestion(question);
	}

	let msg = " ";
	for (const [questionToken, userAnswer] of userAnswers) {
		msg = msg.concat(` ${userAnswer}`)
	}
	msg = getUniqueWordsAsString(msg);
	let message = `Create a prompt about ${msg} dress`;
	console.log(msg);
	ask_gpt(message);

};

const remove_cancel_button = async () => {
	stop_generating.classList.add(`stop-generating-hiding`);

	setTimeout(() => {
		stop_generating.classList.remove(`stop-generating-hiding`);
		stop_generating.classList.add(`stop-generating-hidden`);
	}, 300);
};


const ask_again = async (path) => {
	window.text = ``;
	window.token = message_id();

	message_box.innerHTML += `
		    <div class="message">
		        <div class="avatar-container">
		            ${gpt_image}
		        </div>
		        <div class="content" id="gpt_${window.token}">
		            <div id="cursor"></div>
					<div>
		        </div>
		    </div>
		`;
	stop_generating.classList.remove(`stop-generating-hidden`);
	const text = `Here's an outfit I've generated according to your choices. Does it resonate with your fashion taste?`
	document.getElementById(`gpt_${window.token}`).innerHTML = markdown.render(text);
	document.querySelectorAll(`code`).forEach((el) => {
		hljs.highlightElement(el);
	});

	message_input.value = ``
	let response = await new Promise((resolve) => {
		const interval = setInterval(() => {
			const userInput = userAnswers.get(window.token);
			if (userInput && userInput.trim() !== "") {
				clearInterval(interval);
				resolve(userInput);
			}
		}, 100);
	});

	window.token = message_id();

	message_box.innerHTML += `
		    <div class="message">
		        <div class="avatar-container">
		            ${user_image}
		        </div>
		        <div class="content" id="gpt_${window.token}">
		            <div id="cursor"></div>
					<div>
		        </div>
		    </div>
		`;

	if (response === "No" || response === "no") {
		document.getElementById(`gpt_${window.token}`).innerHTML = markdown.render(response);
		document.querySelectorAll(`code`).forEach((el) => {
			hljs.highlightElement(el);
		});
		for (const question of queries) {
			await displayQuestion(question);
		}
	}

	// if(response === "Yes"){
	// 	const products = await fetch(`${url_prefix}/recommend-api/v2/recommend`,{
	// 		method:'POST',
	// 		signal:window.controller.signal,
	// 		headers:{
	// 			'content-type':'application/json',
	// 			accept:'application/json',
	// 		},
	// 		body: JSON.stringify({
	// 			image_path:path,
	// 		})

	// 	});

	// 	if(products.ok){
	// 		await displayProducts(products);
	// 	}
	// 	else{
	// 		console.log('Error occured at our end please try again in sometime');
	// 	}
	// }


}

const ask_gpt = async (message) => {
	try {
		message_input.value = ``;
		message_input.innerHTML = ``;
		message_input.innerText = ``;

		add_conversation(window.conversation_id, message.substr(0, 16));
		// window.scrollTo(0, 0);
		scrollToBottom();
		window.controller = new AbortController();

		jailbreak = document.getElementById("jailbreak");
		model = document.getElementById("model");
		prompt_lock = true;
		window.text = ``;
		window.token = message_id();

		stop_generating.classList.remove(`stop-generating-hidden`);

		// add_user_message_box(message);

		message_box.scrollTop = message_box.scrollHeight;
		// window.scrollTo(0, 0);
		scrollToBottom();
		await new Promise((r) => setTimeout(r, 500));
		// window.scrollTo(0, 0);
		scrollToBottom();

		// message_box.innerHTML += `
		//     <div class="message">
		//         <div class="avatar-container">
		//             ${gpt_image}
		//         </div>
		//         <div class="content" id="gpt_${window.token}">
		//             <div id="cursor"></div>
		// 			<div>
		//         </div>
		//     </div>
		// `;

		message_box.scrollTop = message_box.scrollHeight;
		// window.scrollTo(0, 0);
		scrollToBottom();
		await new Promise((r) => setTimeout(r, 1000));
		// window.scrollTo(0, 0);
		scrollToBottom();

		const response = await fetch(`${url_prefix}/backend-api/v2/conversation`, {
			method: `POST`,
			signal: window.controller.signal,
			headers: {
				"content-type": `application/json`,
				accept: `text/event-stream`,
			},
			body: JSON.stringify({
				conversation_id: window.conversation_id,
				action: `_ask`,
				model: model.options[model.selectedIndex].value,
				jailbreak: jailbreak.options[jailbreak.selectedIndex].value,
				meta: {
					id: window.token,
					content: {
						conversation: await get_conversation(window.conversation_id),
						internet_access: document.getElementById("switch").checked,
						content_type: "text",
						parts: [
							{
								content: message,
								role: "user",
							},
						],
					},
				},
			}),
		});

		const reader = response.body.getReader();

		while (true) {
			const { value, done } = await reader.read();
			if (done) break;

			chunk = decodeUnicode(new TextDecoder().decode(value));

			if (
				chunk.includes(`<form id="challenge-form" action="${url_prefix}/backend-api/v2/conversation?`)
			) {
				chunk = `cloudflare token expired, please refresh the page.`;
			}

			text += chunk;

			// document.getElementById(`gpt_${window.token}`).innerHTML = markdown.render(text);
			// document.querySelectorAll(`code`).forEach((el) => {
			// 	hljs.highlightElement(el);
			// });


			const image_url = await fetch(`${url_prefix}/image-api/v2/image`, {
				method: 'POST',  // Change to POST
				signal: window.controller.signal,
				headers: {
					'content-type': 'application/json',
					accept: 'application/json',  // Change to accept JSON response
				},
				body: JSON.stringify({
					token: window.token,
					generatedPrompt: text,
				}),
			});

			// ${window.token}
			if (image_url.ok) {
				const respImage = `<img src="${url_prefix}/assets/images/7268642650677872444.png" alt="cloth"
				style="height: 400px; width: 400px;">`;

				message_box.innerHTML += `
            <div class="message">
                <div class="avatar-container">
                    ${gpt_image}
                </div>
                <div class="content" id="gpt_${window.token}">
                    <div id="cursor"></div>
					${respImage}
					<div>
                </div>
            </div>
        `;
				let path = "/images/7268642650677872444.png";
				ask_again(path);
			} else {
				console.error("Error generating image");
			}



			window.scrollTo(0, 0);
			message_box.scrollTo({ top: message_box.scrollHeight, behavior: "auto" });
		}

		if (text.includes(`instead. Maintaining this website and API costs a lot of money`)) {
			document.getElementById(`gpt_${window.token}`).innerHTML =
				"An error occurred, please reload / refresh cache and try again.";
		}

		add_message(window.conversation_id, "user", message);
		add_message(window.conversation_id, "assistant", text);

		message_box.scrollTop = message_box.scrollHeight;
		await remove_cancel_button();
		prompt_lock = false;

		await load_conversations(20, 0);
		window.scrollTo(0, 0);
	} catch (e) {
		add_message(window.conversation_id, "user", message);

		message_box.scrollTop = message_box.scrollHeight;
		await remove_cancel_button();
		prompt_lock = false;

		await load_conversations(20, 0);

		console.log(e);

		let cursorDiv = document.getElementById(`cursor`);
		if (cursorDiv) cursorDiv.parentNode.removeChild(cursorDiv);

		if (e.name != `AbortError`) {
			let error_message = `oops ! something went wrong, please try again / reload. [stacktrace in console]`;

			document.getElementById(`gpt_${window.token}`).innerHTML = error_message;
			add_message(window.conversation_id, "assistant", error_message);
		} else {
			document.getElementById(`gpt_${window.token}`).innerHTML += ` [aborted]`;
			add_message(window.conversation_id, "assistant", text + ` [aborted]`);
		}

		window.scrollTo(0, 0);
	}
};

const add_user_message_box = (message) => {
	const messageDiv = createElement("div", { classNames: ["message"] });
	const avatarContainer = createElement("div", { classNames: ["avatar-container"], innerHTML: user_image });
	const contentDiv = createElement("div", {
		classNames: ["content"],
		id: `user_${token}`,
		textContent: message,
	});

	messageDiv.append(avatarContainer, contentDiv);
	message_box.appendChild(messageDiv);
};

const decodeUnicode = (str) => {
	return str.replace(/\\u([a-fA-F0-9]{4})/g, function (match, grp) {
		return String.fromCharCode(parseInt(grp, 16));
	});
};

const clear_conversations = async () => {
	const elements = box_conversations.childNodes;
	let index = elements.length;

	if (index > 0) {
		while (index--) {
			const element = elements[index];
			if (element.nodeType === Node.ELEMENT_NODE && element.tagName.toLowerCase() !== `button`) {
				box_conversations.removeChild(element);
			}
		}
	}
};

const clear_conversation = async () => {
	let messages = message_box.getElementsByTagName(`div`);

	while (messages.length > 0) {
		message_box.removeChild(messages[0]);
	}
};

const delete_conversation = async (conversation_id) => {
	localStorage.removeItem(`conversation:${conversation_id}`);

	if (window.conversation_id == conversation_id) {
		await new_conversation();
	}

	await load_conversations(20, 0, true);
};

const set_conversation = async (conversation_id) => {
	history.pushState({}, null, `${url_prefix}/chat/${conversation_id}`);
	window.conversation_id = conversation_id;

	await clear_conversation();
	await load_conversation(conversation_id);
	await load_conversations(20, 0, true);
};

const new_conversation = async () => {
	history.pushState({}, null, `${url_prefix}/chat/`);
	window.conversation_id = uuid();

	await clear_conversation();
	await load_conversations(20, 0, true);
};

const load_conversation = async (conversation_id) => {
	let conversation = await JSON.parse(localStorage.getItem(`conversation:${conversation_id}`));
	console.log(conversation, conversation_id);

	for (item of conversation.items) {
		if (is_assistant(item.role)) {
			message_box.innerHTML += load_gpt_message_box(item.content);
		} else {
			message_box.innerHTML += load_user_message_box(item.content);
		}
	}

	document.querySelectorAll(`code`).forEach((el) => {
		hljs.highlightElement(el);
	});

	message_box.scrollTo({ top: message_box.scrollHeight, behavior: "smooth" });

	setTimeout(() => {
		message_box.scrollTop = message_box.scrollHeight;
	}, 500);
};

const load_user_message_box = (content) => {
	const messageDiv = createElement("div", { classNames: ["message"] });
	const avatarContainer = createElement("div", { classNames: ["avatar-container"], innerHTML: user_image });
	const contentDiv = createElement("div", { classNames: ["content"] });
	const preElement = document.createElement("pre");
	preElement.textContent = content;
	contentDiv.appendChild(preElement);

	messageDiv.append(avatarContainer, contentDiv);

	return messageDiv.outerHTML;
};

const load_gpt_message_box = (content) => {
	return `
            <div class="message">
                <div class="avatar-container">
                    ${gpt_image}
                </div>
                <div class="content">
                    ${markdown.render(content)}
                </div>
            </div>
        `;
};

const is_assistant = (role) => {
	return role == "assistant";
};

const get_conversation = async (conversation_id) => {
	let conversation = await JSON.parse(localStorage.getItem(`conversation:${conversation_id}`));
	return conversation.items;
};

const add_conversation = async (conversation_id, title) => {
	if (localStorage.getItem(`conversation:${conversation_id}`) == null) {
		localStorage.setItem(
			`conversation:${conversation_id}`,
			JSON.stringify({
				id: conversation_id,
				title: title,
				items: [],
			})
		);
	}
};

const add_message = async (conversation_id, role, content) => {
	before_adding = JSON.parse(localStorage.getItem(`conversation:${conversation_id}`));

	before_adding.items.push({
		role: role,
		content: content,
	});

	localStorage.setItem(`conversation:${conversation_id}`, JSON.stringify(before_adding)); // update conversation
};

const load_conversations = async (limit, offset, loader) => {
	//console.log(loader);
	//if (loader === undefined) box_conversations.appendChild(spinner);

	let conversations = [];
	for (let i = 0; i < localStorage.length; i++) {
		if (localStorage.key(i).startsWith("conversation:")) {
			let conversation = localStorage.getItem(localStorage.key(i));
			conversations.push(JSON.parse(conversation));
		}
	}

	//if (loader === undefined) spinner.parentNode.removeChild(spinner)
	await clear_conversations();

	for (conversation of conversations) {
		box_conversations.innerHTML += `
            <div class="conversation-sidebar">
                <div class="left" onclick="set_conversation('${conversation.id}')">
                    <i class="fa-regular fa-comments"></i>
                    <span class="conversation-title">${conversation.title}</span>
                </div>
                <i onclick="delete_conversation('${conversation.id}')" class="fa-regular fa-trash"></i>
            </div>
        `;
	}

	document.querySelectorAll(`code`).forEach((el) => {
		hljs.highlightElement(el);
	});
};

document.getElementById(`cancelButton`).addEventListener(`click`, async () => {
	window.controller.abort();
	console.log(`aborted ${window.conversation_id}`);
});

function h2a(str1) {
	var hex = str1.toString();
	var str = "";

	for (var n = 0; n < hex.length; n += 2) {
		str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}

	return str;
}

const uuid = () => {
	return `xxxxxxxx-xxxx-4xxx-yxxx-${Date.now().toString(16)}`.replace(/[xy]/g, function (c) {
		var r = (Math.random() * 16) | 0,
			v = c == "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
};

const message_id = () => {
	random_bytes = (Math.floor(Math.random() * 1338377565) + 2956589730).toString(2);
	unix = Math.floor(Date.now() / 1000).toString(2);

	return BigInt(`0b${unix}${random_bytes}`).toString();
};

window.onload = async () => {
	load_settings_localstorage();

	conversations = 0;
	for (let i = 0; i < localStorage.length; i++) {
		if (localStorage.key(i).startsWith("conversation:")) {
			conversations += 1;
		}
	}

	if (conversations == 0) localStorage.clear();

	await setTimeout(() => {
		load_conversations(20, 0);
	}, 1);

	if (!window.location.href.endsWith(`#`)) {
		if (/\/chat\/.+/.test(window.location.href.slice(url_prefix.length))) {
			await load_conversation(window.conversation_id);
		}
	}


	send_button.addEventListener("click", async (event) => {
		event.preventDefault();
		if (prompt_lock) return;
		message_input.blur();
		await handle_ask();
	});

	register_settings_localstorage();
};

const register_settings_localstorage = async () => {
	settings_ids = ["switch", "model", "jailbreak"];
	settings_elements = settings_ids.map((id) => document.getElementById(id));
	settings_elements.map((element) =>
		element.addEventListener(`change`, async (event) => {
			switch (event.target.type) {
				case "checkbox":
					localStorage.setItem(event.target.id, event.target.checked);
					break;
				case "select-one":
					localStorage.setItem(event.target.id, event.target.selectedIndex);
					break;
				default:
					console.warn("Unresolved element type");
			}
		})
	);
};

const load_settings_localstorage = async () => {
	settings_ids = ["switch", "model", "jailbreak"];
	settings_elements = settings_ids.map((id) => document.getElementById(id));
	settings_elements.map((element) => {
		if (localStorage.getItem(element.id)) {
			switch (element.type) {
				case "checkbox":
					element.checked = localStorage.getItem(element.id) === "true";
					break;
				case "select-one":
					element.selectedIndex = parseInt(localStorage.getItem(element.id));
					break;
				default:
					console.warn("Unresolved element type");
			}
		}
	});
};

function clearTextarea(textarea) {
	textarea.style.removeProperty("height");
	textarea.style.height = `${textarea.scrollHeight + 4}px`;
	if (textarea.value.trim() === "" && textarea.value.includes("\n")) {
		textarea.value = "";
	}
}

function createElement(tag, { classNames, id, innerHTML, textContent } = {}) {
	const el = document.createElement(tag);
	if (classNames) {
		el.classList.add(...classNames);
	}
	if (id) {
		el.id = id;
	}
	if (innerHTML) {
		el.innerHTML = innerHTML;
	}
	if (textContent) {
		const preElement = document.createElement("pre");
		preElement.textContent = textContent;
		el.appendChild(preElement);
	}
	return el;
}


window.onload = async () => {
	// load_settings_localstorage();
	handle_ask();
}
