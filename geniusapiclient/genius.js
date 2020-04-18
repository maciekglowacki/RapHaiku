import axios from "axios";

export default class Genius {
  constructor() {
    // this.ApiUrl = "https://api.genius.com/songs/378195";
    this.apiUrl = "https://api.genius.com";
    this.apiKey = "VswyeqGtcogVXEqX31ZAYYtkHpKgyI9cO2Ka7p14Fi8fFZ7ho5TAhK09exMShT7E";
  }

  getSongById(id) {
    const fullApiUrl = `${this.apiUrl}/songs/${id}/?acess_token=${this.apiKey}`;
    axios
      .get(fullApiUrl)
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  }

  // async getArtistId(name) {
  //   const fullApiUrl = `${this.apiUrl}/search?q=Gucci%20Mane&access_token=${this.apiKey}`;
  //   await const data =  axios
  //     .get(fullApiUrl)
  //     .then((response) => {
  //       return response.data.response.hits[0].result.primary_artist.id;
  //     })
  //     .catch((error) => {
  //       console.log(error.response.data);
  //       console.log(error.response.status);
  //       console.log(error.response.headers);
  //     });
  // }

  async getArtistId(name) {
    let id;
    try {
      const fullApiUrl = `${this.apiUrl}/search?q=Gucci%20Mane&access_token=${this.apiKey}`;
      let result = await axios.get(fullApiUrl);
      id = result.data.response.hits[0].result.primary_artist.id;
    } catch {
      console.log("error");
    }
    return id;
  }
  async getArtistSongs(id) {
    try {
      const fullApiUrl = `${this.apiUrl}/artists/13/songs`;
      let result = await axios.get(fullApiUrl);
      console.log(result);
    } catch {
      console.log("error");
    }
  }
}
