import axios from "axios";
import cheerio from "cheerio";

export default class Genius {
  constructor() {
    // this.ApiUrl = "https://api.genius.com/songs/378195";
    this.apiUrl = "https://api.genius.com";
    this.apiKey = "wfJNsgpQIH6cxE2-HwSHKTTahAkpqdsmSlnajzjheG_7z0yF9tolKhRBxWBaKVSq";
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
      const fullApiUrl = `${this.apiUrl}/search?q=${name}`;
      const result = await axios.get(fullApiUrl, { headers: { Authorization: `Bearer ${this.apiKey}` } });
      const id = result.data.response.hits[0].result.primary_artist.id;
      return id;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getArtistSongsPaths(name) {
    if (name === undefined) throw new Error("Name is required");
    try {
      const id = await this.getArtistId(name);
      const fullApiUrl = `${this.apiUrl}/artists/${id}/songs`;
      const result = await axios.get(fullApiUrl, { headers: { Authorization: `Bearer ${this.apiKey}` } });
      const songsPaths = result.data.response.songs.map((song) => song.path);
      return songsPaths;
    } catch (err) {
      if (typeof err === "object") {
        throw new Error(err);
      } else {
        throw new Error(JSON.stringify(err.toJSON(), null, 2));
      }
    }
  }
  async getArtistSongsLyrics(name) {
    try {
      const songsPaths = await this.getArtistSongsPaths(name);
      let songsLyrics = "XDDD";
      for (const songPath of songsPaths) {
        const fullSongPath = `https://genius.com${songPath}`;
        const { data } = await axios.get(fullSongPath);
        const $ = cheerio.load(data);
        const lyrics = $(".lyrics p").text();
        songsLyrics += lyrics;
      }
      return songsLyrics;
    } catch (err) {
      throw new Error(err);
    }
  }
}
