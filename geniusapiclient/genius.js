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
    if (name === undefined) throw new Error("Name is required");
    try {
      name = encodeURIComponent(name);
      const fullApiUrl = `${this.apiUrl}/search?q=${name}&access_token=${this.apiKey}`;
      const result = await axios.get(fullApiUrl);
      const id = result.data.response.hits[0].result.primary_artist.id;
      return id;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getArtistSongsByName(name) {
    try {
      let id = await this.getArtistId();
      const fullApiUrl = `${this.apiUrl}/artists/${id}/songs`;
      const result = await axios.get(fullApiUrl);
      console.log(result);
      return result;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
