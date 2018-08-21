import { Artifact } from 'oip-index';

const apocalypse = {
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
const barberShop = {
	oip042: {
		artifact: {
			floAddress: "FLZXRaHzVPxJJfaoM32CWT4GZHuj2rx63k",
			timestamp: 1534285708,
			type: "Video",
			subtype: "Movie",
			info: {
				title: "Agent 327 - Operation Barbershop",
				year: 2018
			},
			details: {
				genre: "Animation,Family"
			},
			storage: {
				network: "IPFS",
				location: "QmUGXLufrQt7wUB5Htt2CVEtTzy7RVqWk1XfHGqsiQjQ1y",
				files: [
					{
						duration: 231,
						fname: "Agent 327 - Operation Barbershop.mp4",
						fsize: 28512527,
						type: "Video"
					},
					{
						fname: "Agent 327 - Operation Barbershop.en.vtt",
						fsize: 933,
						type: "Other"
					},
					{
						fname: "thumb.png",
						fsize: 1156481,
						type: "Image",
						subtype: "cover"
					}
				]
			},
			payment: {
				fiat: "USD",
				scale: "1000:1",
				tokens: { },
				addresses: { },
				platform: 15,
				influencer: 15,
				maxdisc: 30
			},
			signature: "IKu3vmWRpo8P5s4GiQlrGFdjiNbBf68t21t0bUbZiOj2bUnvvzXNck/4qmk8Xcv1Maexzb4Izs4DK+jBmHIj3II="
		}
	},
	txid: "5533ce5766dfbe4667d9e21e90f6542bdcd2a22bd81a2bb5d110e6aa97010008",
	publisher: "FLZXRaHzVPxJJfaoM32CWT4GZHuj2rx63k",
	publisherName: "OstlerDev"
}

const amsterdam = {
	oip042: {
		artifact: {
			floAddress: "FCs3WG4Y3XSG6uL5E3gU57x231ZPL3vJ9e",
			timestamp: 1532358389,
			type: "Image",
			subtype: "Basic",
			info: {
				title: "Amsterdam ",
				year: 2018
			},
			details: {
				artist: "Vanessa ",
				genre: "Parks/Outdoor",
				tags: [
					"Nature"
				]
			},
			storage: {
				network: "IPFS",
				location: "QmXqHXfmqhLBZ4Tenk6FyXD34CLx3QrD1AeXtK178m9BmN",
				files: [
					{
						fname: "IMG_5238.JPG",
						fsize: 2331286,
						type: "Image"
					},
					{
						fname: "IMG_5408.JPG",
						fsize: 2485634,
						type: "Image",
						subtype: "cover"
					}
				]
			},
			payment: {
				fiat: "USD",
				scale: "1000:1",
				tokens: { },
				addresses: { },
				platform: 15,
				influencer: 15,
				maxdisc: 30
			},
			signature: "H47SddM+5I3ysFokXuFJxatELBh849FHEjuJeFsMVtXUSbiNuyBqDSYfwmS6MHZPbAk8WflEKeRippA73ilsJpU="
		}
	},
	txid: "2c6d0898db20ae41e1d7456fcc8ac84a9dc60146351354d1ac39fe1a2f9521ec",
	publisher: "FCs3WG4Y3XSG6uL5E3gU57x231ZPL3vJ9e",
	publisherName: "vkinc"
}

module.exports = {
	apocalypse: new Artifact(apocalypse),
	barbershop: new Artifact(barberShop),
	amsterdam: new Artifact(amsterdam)
}

