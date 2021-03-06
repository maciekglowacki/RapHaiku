import GeniusService from "./geniusService";
import HaikuService from "./haikuService";
import { haikuTemplate } from "./haikuTemplate";

class Main {
	geniusService: GeniusService;
	haikuService: HaikuService;
	loadingElement: HTMLElement;
	searchBtn: HTMLButtonElement;
	searchInput: HTMLInputElement;
	searchForm: HTMLFormElement;
	resultContainer: HTMLElement;

	constructor() {
		this.geniusService = new GeniusService();
		this.haikuService = new HaikuService();

		this.loadingElement = document.querySelector(".loading-element");
		this.searchBtn = document.querySelector(".search-btn");

		this.searchInput = document.querySelector(".search-input");
		this.searchForm = document.querySelector(".form-content");

		this.resultContainer = document.querySelector(".haiku-container");
	}

	async assignHaiku() {
		const rapperName = this.searchInput.value;
		this.searchInput.value = "";
		this.resultContainer.innerHTML = "";
		this.startLoading();
		const { lyrics, photoUrl } = await this.geniusService.getArtistData(rapperName);
		const haiku = this.haikuService.generateHaiku(lyrics);
		this.resultContainer.innerHTML = haikuTemplate(haiku, photoUrl);
		this.stopLoading();
	}

	init() {
		this.searchBtn.addEventListener("click", () => this.assignHaiku());
		this.searchForm.addEventListener("submit", (event) => {
			event.preventDefault();
			this.assignHaiku();
		});
	}

	startLoading() {
		this.loadingElement.classList.add("loading");
	}

	stopLoading() {
		this.loadingElement.classList.remove("loading");
	}
}

const main = new Main();
main.init();
