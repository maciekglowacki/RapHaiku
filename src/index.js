import GeniusService from "./geniusService";
import HaikuService from "./haikuService";



class Main{
  constructor(){
    this.geniusService = new GeniusService();
    this.haikuService = new HaikuService();
    this.searchBtn = document.querySelector(".search-btn");
    this.searchInput = document.querySelector(".search-input");
    this.resultContainer = document.querySelector(".artist-info p");
  }

  async  assignHaiku() {
    const rapperName = this.searchInput.value;
    const lyrics = await this.geniusService.getArtistSongsLyrics(rapperName);
    const response =  this.haikuService.generateHaiku(lyrics);
    const haikuDiv = [...document.querySelectorAll(".haiku p")];
    haikuDiv.map((node, idx) => (node.innerText = response[idx]));
    this.resultContainer.textContent = `by ${rapperName}`;
  }

  init(){
    this.searchBtn.addEventListener("click", () => this.assignHaiku());
  }

}


const main = new Main();
main.init();



