document.addEventListener("DOMContentLoaded", () => {
	const navigation = document.querySelector("#cs-navigation");
	const menuToggle = document.querySelector("#mobile-menu-toggle");
	const menuWrapper = document.querySelector("#cs-ul-wrapper");
	const cartButton = document.querySelector("#cart-button");
	const cartCount = document.querySelector("#cart-count");
	const cartAnnouncement = document.querySelector("#cart-announcement");
	const buyButtons = document.querySelectorAll(".cs-buy");
	const mobileBreakpoint = 1023.5;

	let cartItems = 0;
	function isMobile() {
		return window.innerWidth <= mobileBreakpoint;
	}

	function setMenuState(open) {
		if (!navigation || !menuToggle || !menuWrapper) {
			return;
		}
		navigation.classList.toggle("cs-active", open);
		menuToggle.classList.toggle("cs-active", open);
		document.body.classList.toggle("cs-open", open);
		menuToggle.setAttribute("aria-expanded", String(open));

		if (isMobile()) {
			menuWrapper.inert = !open;
		} else {
			menuWrapper.inert = false;
		}
	}

	function toggleMenu() {
		if (!menuToggle) {
			return;
		}

		const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
		setMenuState(!isOpen);
	}

	function closeMenu() {
		setMenuState(false);
	}

	function updateMenuForScreenSize() {
		if (!isMobile()) {
			setMenuState(false);
		} else if (menuWrapper && !navigation?.classList.contains("cs-active")) {
			menuWrapper.inert = true;
		}
	}

	if (menuToggle) {
		menuToggle.addEventListener("click", toggleMenu);
	}

	/* Close the menu when clicking outside it */
	document.addEventListener("click", (event) => {
		if (!isMobile() || !navigation || !navigation.classList.contains("cs-active")) {
			return;
		}

		if (!navigation.contains(event.target)) {
			closeMenu();
		}
	});

	/* Close the menu after selecting a navigation link */
	const navigationLinks = document.querySelectorAll("#cs-navigation a");

	navigationLinks.forEach((link) => {
		link.addEventListener("click", () => {
			if (isMobile()) {
				closeMenu();
			}
		});
	});

	/* Close the menu with Escape */
	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape" && navigation?.classList.contains("cs-active")) {
			closeMenu();
			menuToggle?.focus();
		}
	});

	/* Update navigation when the screen changes size */
	window.addEventListener("resize", updateMenuForScreenSize);


	updateMenuForScreenSize();
	function updateCart() {
		if (cartCount) {
			cartCount.textContent = cartItems;
		}

		if (cartButton) {
			const itemText = cartItems === 1 ? "item" : "items";

			cartButton.setAttribute(
				"aria-label",
				`Cart, ${cartItems} ${itemText}`
			);
		}
	}

	function announceCart(message) {
		if (!cartAnnouncement) {
			return;
		}
		cartAnnouncement.textContent = "";
		window.setTimeout(() => {
			cartAnnouncement.textContent = message;
		}, 50);
	}

	function addToCart(button) {
		cartItems += 1;
		updateCart();
		const product = button.closest(".cs-item");
		const productName = product?.querySelector(".cs-name")?.textContent.trim();
		const itemText = cartItems === 1 ? "item" : "items";

		announceCart(
			`${productName || "Item"} added to cart. Cart now has ${cartItems} ${itemText}.`
		);

		/* Visual feedback */
		button.classList.remove("cs-added");
		void button.offsetWidth;

		button.classList.add("cs-added");
		window.setTimeout(() => {
			button.classList.remove("cs-added");
		}, 900);
	}

	buyButtons.forEach((button) => {
		button.addEventListener("click", () => {
			addToCart(button);
		});
	});


	if (cartButton) {
		cartButton.addEventListener("click", () => {
			const itemText = cartItems === 1 ? "item" : "items";
			announceCart(
				`Your cart currently has ${cartItems} ${itemText}.`
			);
		});
	}
	updateCart();
});