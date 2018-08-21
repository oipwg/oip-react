import { Artifact } from 'oip-index';

const dehydratedArtifact = {
	oip042: {
		artifact: {
			floAddress: "FLZXRaHzVPxJJfaoM32CWT4GZHuj2rx63k",
			timestamp: 1534478026,
			type: "Video",
			subtype: "Movie",
			info: {
				title: "Apocalypse CA",
				description: "Wry, cynical and full of off-beat humor, `Apocalypse, CA` is the story of friends as they prepare for certain death at the hands of a massive asteroid, sex-inducing drugs, a three-hundred foot giant, and a horde of other absurd problems.",
				year: 2011
			},
			details: {
				artist: "Chad Peter",
				genre: "Action,Comedy",
				company: "NP2k Films"
			},
			storage: {
				network: "IPFS",
				location: "QmQV23t3wUj7rUGVMDq9Qfgv16j75B1yMpJQcsYpgWKCrt",
				files: [
					{
						dname: "Apocalypse CA",
						duration: 5226,
						fname: "Apocalypse_CA.mp4",
						fsize: 1509201346,
						sugPlay: 1000,
						type: "Video",
						sugBuy: 10000
					},
					{
						dname: "Trailer",
						duration: 102,
						fname: "Apocalypse_CA_Trailer.mp4",
						fsize: 28905659,
						type: "Video"
					},
					{
						fname: "Apocalypse_CA_Poster.jpg",
						fsize: 212900,
						type: "Image",
						subtype: "cover"
					}
				]
			},
			payment: {
				fiat: "USD",
				scale: "1000:1",
				tokens: { },
				addresses: {
					BTC: "1LqBGSKuX5yYUonjxT5qGfpUsXKYYWeabA",
					FLO: "FTogNNXik7eiHZw5uN2KMe4cvcr7GCEjbZ",
					LTC: "LUWPbpM43E2p7ZSh8cyTBEkvpHmr3cB8Ez"
				},
				platform: 15,
				influencer: 15,
				maxdisc: 30
			},
			signature: "IHeLXmJoM6FpW9cWpf9iOzNUFBrcKuBCYdRXERBZcEzATbeIazDKg4zUZIqgZhZnEgT1i0ktOsx86Lyj8Hl2EBg="
		}
	},
	txid: "21252c8315f83d731474964fbd9cda5086aaf9e677dcd31b3fc189e5e9d63e1e",
	publisher: "FLZXRaHzVPxJJfaoM32CWT4GZHuj2rx63k",
	publisherName: "OstlerDev"
}

export default new Artifact(dehydratedArtifact)