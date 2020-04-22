import axios from "axios";
import cheerio from "cheerio";
import { getWordSyllablesCount, splitSentenceIntoWords } from "../main.js";

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
        const { data } = await axios.get(fullSongPath);
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

  extractHaikuLegibleLinesFromLyrics(lyrics) {
    let legibleFiveSyllableExpressions = new Set();
    let legibleSevenSyllableExpressions = new Set();
    for (const line of lyrics) {
      let counter = 0;
      const words = line.split(" ");
      for (let i = 0; i < words.length; i++) {
        const syllables = getWordSyllablesCount(words[i]);
        counter += syllables;
        if (counter === 5) {
          const legibleExpression = words.slice(0, i).join(" ");
          legibleFiveSyllableExpressions.add(legibleExpression);
          break;
        } else if (counter === 7) {
          const legibleExpression = words.slice(0, i).join(" ");
          legibleSevenSyllableExpressions.add(legibleExpression);
          break;
        }
      }
    }
    legibleFiveSyllableExpressions = [...legibleFiveSyllableExpressions];
    legibleSevenSyllableExpressions = [...legibleSevenSyllableExpressions];
    return [legibleFiveSyllableExpressions, legibleSevenSyllableExpressions];
  }

  async generateHaiku(artistName) {
    const lyrics = await this.getArtistSongsLyrics(artistName);
    const [legibleFiveSyllableExpressions, legibleSevenSyllableExpressions] = this.extractHaikuLegibleLinesFromLyrics(lyrics);

    let haiku = [];

    const firstLine = legibleFiveSyllableExpressions[Math.floor(Math.random() * legibleFiveSyllableExpressions.length)];
    const secondLine = legibleFiveSyllableExpressions[Math.floor(Math.random() * legibleSevenSyllableExpressions.length)];
    const thirdLine = legibleFiveSyllableExpressions[Math.floor(Math.random() * legibleFiveSyllableExpressions.length)];
    console.log(firstLine);

    haiku.push(firstLine, secondLine, thirdLine);
    // console.log(haiku);
    return haiku;
  }
}
