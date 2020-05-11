import GeniusService from "./geniusService";
import HaikuService from "./haikuService";

class Main {
  constructor() {
    this.geniusService = new GeniusService();
    this.haikuService = new HaikuService();

    this.loadingElement = document.querySelector(".loading-element");
    this.searchBtn = document.querySelector(".search-btn");

    this.searchInput = document.querySelector(".search-input");
    this.searchForm = document.querySelector(".form-content");

    this.resultContainer = document.querySelector(".artist-info p");
  }

  async assignHaiku() {
    const rapperName = this.searchInput.value;
    this.searchInput.value = "";
    this.resultContainer.textContent = "";
    this.startLoading();
    const lyrics = await this.geniusService.getLyrics(rapperName);
    const response = this.haikuService.generateHaiku(lyrics);
    const haikuDiv = [...document.querySelectorAll(".haiku p")];
    haikuDiv.map((node, idx) => (node.innerText = response[idx]));
    this.resultContainer.textContent = `by ${rapperName}`;
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
    this.loadingElement.classList.add('loading');
  }

  stopLoading() {
    this.loadingElement.classList.remove('loading');
  }
}

const main = new Main();
main.init();
