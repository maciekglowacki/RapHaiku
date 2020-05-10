import axios from "axios";
import cheerio from "cheerio";
import config from "./config.js";

export default class GeniusService {
  constructor() {
    this.apiUrl = config.BASE_URL;
    this.apiKey = config.API_KEY;
    this.axiosConfig = config.AXIOS_CONFIG;
  }

  async getSongById(id) {
    if (id === undefined) throw new Error("Id is required");
    const fullApiUrl = `${this.apiUrl}/songs/${id}/?acess_token=${this.apiKey}`;
    try {
      const result = await axios.get(fullApiUrl);
      return result;
    } catch (err) {
      throw new Error(err.message);
    }
  } 

  async getArtistId(name) {
    console.log("SDDS");
    if (name === undefined || name === "") throw new Error("Name is required");
    try {
      name = encodeURIComponent(name);
      const fullApiUrl = `${this.apiUrl}/search?q=${name}&access_token=${this.apiKey}`;
      const result = await axios.get(fullApiUrl);
      console.log(fullApiUrl);
      const id = result.data.response.hits[0].result.primary_artist.id;
      return id;
    } catch (err) {
      throw new Error(`Error in get Artist id:${err.message}`);
    }
  }

  async getArtistSongsPaths(name) {
    console.log("GETIT")
    if (name === undefined || name === "") throw new Error("Name is required");
    try {
      const id = await this.getArtistId(name);
      const fullApiUrl = `${this.apiUrl}/artists/${id}/songs?access_token=${this.apiKey}`;
      const result = await axios.get(fullApiUrl);
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
    console.log("S");
    try {
      const songsPaths = await this.getArtistSongsPaths(name);
      console.log(songsPaths);
      const artistLyricsTags = [
        "[Intro]",
        "[Verse]",
        "Verse 1",
        "Hook:x2",
        "Verse 2:",
        "[Chorus: Gucci Mane]",
        "[Verse 1: Gucci Mane]",
        "[Hook: Gucci Mane]",
        "[Break]",
        "[Outro]",
        "[Gucci Mane]",
        "[Hook]",
        "[Verse 3]",
        "[Verse 2]",
      ];
      let songsLyrics = [];
      for (const songPath of songsPaths) {
        const fullSongPath = `https://genius.com${songPath}`;
        let response = await fetch(`https://cors-anywhere.herokuapp.com/${fullSongPath}`);
        console.log(response);
        let data = await response.text();
        const $ = cheerio.load(data);
        const lyrics = $(".lyrics p")
          .text()
          .split("\n")
          .filter((el) => el.length);
        let lyricsFiltered = [];
        for (let i = 0; i < lyrics.length; i++) {
          if (artistLyricsTags.includes(lyrics[i])) {
            for (let j = i + 1; j < lyrics.length; j++) {
              if (lyrics[j].charAt(0) === "[") {
                break;
              } else {
                lyricsFiltered.push(lyrics[j]);
              }
            }
          }
        }
        songsLyrics.push(...lyricsFiltered);
      }
      return songsLyrics;
    } catch (err) {
      throw new Error(err);
    }
  }


  getLyrics(){

  }

}
