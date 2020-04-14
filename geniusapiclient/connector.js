import axios from "axios";

export default class Connector {
  constructor() {
    this.ApiUrl = "https://api.genius.com/songs/378195";
    this.apiKey = "VswyeqGtcogVXEqX31ZAYYtkHpKgyI9cO2Ka7p14Fi8fFZ7ho5TAhK09exMShT7E";
  }

  getSongById() {
    const fullApiUrl = `${this.ApiUrl}?acess_token=${this.apiKey}`;
    axios
      .get(fullApiUrl)
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  }

  getArtistId() {
    const fullApiUrl =
      "https://api.genius.com/search?q=Gucci%20Mane&access_token=VswyeqGtcogVXEqX31ZAYYtkHpKgyI9cO2Ka7p14Fi8fFZ7ho5TAhK09exMShT7E";
    axios
      .get(fullApiUrl)
      .then((response) => console.log(response))
      .then(() => console.log(fullApiUrl))
      .catch((error) => console.log(error));
  }
}
