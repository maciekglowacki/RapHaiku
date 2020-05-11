import axios from "axios";
import cheerio from "cheerio";
import config from "./config";

export interface ArtistData {
	lyrics: Array<string>,
	photoUrl: string
}


export default class GeniusService {
	apiUrl: string;
	apiKey: string;
	axiosConfig: object;
	constructor() {
		this.apiUrl = config.BASE_URL;
		this.apiKey = config.API_KEY;
		this.axiosConfig = config.AXIOS_CONFIG;
	}

	async getSongById(id: number) {
		const fullApiUrl = `${this.apiUrl}/songs/${id}/?acess_token=${this.apiKey}`;
		try {
			const song = await axios.get(fullApiUrl);
			return song;
		} catch (err) {
			throw new Error(err.message);
		}
	}

	async getArtistId(name: string): Promise<number> {
		try {
			name = encodeURIComponent(name);
			const fullApiUrl = `${this.apiUrl}/search?q=${name}&access_token=${this.apiKey}`;
			const result = await axios.get(fullApiUrl);
			const id = result.data.response.hits[0].result.primary_artist.id;
			return id;
		} catch (err) {
			throw new Error(`Error in get Artist id:${err.message}`);
		}
	}

	async getArtistPhoto(id: number): Promise<string> {
		try {
			const fullApiUrl = `${this.apiUrl}/artists/${id}?access_token=${this.apiKey}`;
			const {
				data: {
					response: {
						artist: { image_url },
					},
				},
			} = await axios.get(fullApiUrl);
			return image_url;
		} catch (err) {
			throw new Error(`Error in getArtistPhoto: ${err.message}`);
		}
	}

	async getArtistSongsPaths(id: number): Promise<Array<string>> {
		try {
			const fullApiUrl = `${this.apiUrl}/artists/${id}/songs?access_token=${this.apiKey}`;
			const {
				data: {
					response: { songs },
				},
			} = await axios.get(fullApiUrl);
			// don't know how to assign type here
			const songsPaths = songs.map((song: any) => song.path).slice(5);
			return songsPaths;
		} catch (err) {
			if (typeof err === "object") {
				throw new Error(err);
			} else {
				throw new Error(JSON.stringify(err.toJSON(), null, 2));
			}
		}
	}
	async getArtistSongsLyrics(songsPaths: Array<string>): Promise<Array<string>> {
		try {
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
			const songsLyrics = [];
			for (const songPath of songsPaths) {
				const fullSongPath = `https://genius.com${songPath}`;
				const response = await fetch(`https://cors-anywhere.herokuapp.com/${fullSongPath}`);
				const data = await response.text();
				const $ = cheerio.load(data);
				const lyrics = $(".lyrics p")
					.text()
					.split("\n")
					.filter((el) => el.length);
				const lyricsFiltered = [];
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

	async getArtistData(name: string): Promise<ArtistData> {
		try {
			let artistData: ArtistData;
			const artistId = await this.getArtistId(name);
			const songsPaths = await this.getArtistSongsPaths(artistId);
			const lyrics = await this.getArtistSongsLyrics(songsPaths);
			const photoUrl = await this.getArtistPhoto(artistId);
			artistData = {lyrics, photoUrl}
			return artistData;
		} catch (err) {
			throw new Error(err);
		}
	}
}
