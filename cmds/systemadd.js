const { GoogleSpreadsheet } = require("google-spreadsheet");
const { promisify } = require("util");
const {
	getDB,
	DBFalse,
	DBTrue,
	CommandsRanTotal,
	CommandsRanAdd,
} = require("../bot.js");

module.exports.run = async (bot, message, args, myVideos, creds) => {
	CommandsRanAdd();
	let b = true;
	let pp;
	switch (b) {
		case message.guild.id == "601763897262735370":
			//TBB Server
			break;
		case message.guild.id == "703040999768981634":
			//GA Server
			break;
		case message.guild.id == "757370229587181640":
			//ISC Server
			break;
		case message.guild.id == "677246811911487488":
			//LS Server
			break;
		case message.guild.id == "701473055830048808":
			//MOPP Server
			break;
		case message.guild.id == "802881932232753175":
			//TGSS Server
			break;
		case message.guild.id == "617477144569708554":
			//UCG Server
			break;

		default:
			message.channel.send(
				"Your server is not authorized to use this command. Is this an error? Message Genesis#8339"
			);
			pp = 1;
			break;
	}
	if (pp == 1) {
		return;
	}
	const filter = (msg) => msg.author.id === message.author.id;
	let systemname = "";
	let cancel = "N";
	await message.author.send(
		'```fix\nType "cancel" to cancel input.\n\nType out system name:```'
	);
	await message.author.dmChannel
		.awaitMessages(filter, { max: 1, time: 120000, errors: ["time"] })
		.then((msg) => {
			let ec = msg.first().content;
			let eck = ec.toLowerCase();
			systemname = eck.charAt(0).toUpperCase() + eck.slice(1);
			if (systemname == "Cancel") {
				cancel = "Y";
			}
			return;
		})
		.catch((err) => {
			message.author.send("Time's Up, Cancelled input.");
			console.log(err);
			return;
		});

	if (cancel == "Y") {
		return message.author.send("Cancelled Input");
	}
	if (
		systemname.toLowerCase() == "the citadel" ||
		systemname.toLowerCase() == "citadel"
	)
		return message.author.send("Input already added");

	let status = "";
	let p1 = "";
	let p2 = "";
	let p3 = "";
	let p4 = "";
	let p5 = "";
	let p6 = "";
	let p7 = "";
	let user = `${message.author.tag}`;
	let verify = "";
	let planetnumber = "";
	function translate(info, planet) {
		let t = true;
		let sndresult = "";
		var array = info.split(" + ");
		for (i = 0; i < array.length; i++) {
			switch (t) {
				case array[i] == "S(C)":
					sndresult += `CoreSec Station + `;
					break;
				case array[i] == "S(L)":
					sndresult += `Lycentian Station + `;
					break;
				case array[i] == "S(K)":
					sndresult += `Kavani Station + `;
					break;
				case array[i] == "S(F)":
					sndresult += `Foralkan Station + `;
					break;
				case array[i] == "S(RES)":
					sndresult += `Residential Station + `;
					break;
				case array[i] == "S(T)":
					sndresult += `Trade Union Station + `;
					break;
				case array[i] == "S(S)":
					sndresult += `Syndicate Station + `;
					break;
				case array[i] == "AT":
					sndresult += `Asteroid Field + `;
					break;
				case array[i] == "SP":
					sndresult += `Spice Platform + `;
					break;
				case array[i] == "BF":
					sndresult += `Grave Yard + `;
					break;
				case array[i] == "MD":
					sndresult += `Mine Field + `;
					break;
				case array[i] == "DF(1)":
					sndresult += `Drone Factory Lvl 1 + `;
					break;
				case array[i] == "DF(2)":
					sndresult += `Drone Factory Lvl 2 + `;
					break;
				case array[i] == "DF(3)":
					sndresult += `Drone Factory Lvl 3 + `;
					break;
				case array[i] == "DF(4)":
					sndresult += `Drone Factory Lvl 4 + `;
					break;
				case array[i] == "DF(5)":
					sndresult += `Drone Factory Lvl 5 + `;
					break;
				case array[i] == "MO(1)":
					sndresult += `Monument Lvl 1 + `;
					break;
				case array[i] == "MO(2)":
					sndresult += `Monument Lvl 2 + `;
					break;
				case array[i] == "N":
					sndresult += `None + `;
					break;
				default:
					message.author.send(
						"Something went wrong with the translation process."
					);
					break;
			}
		}

		let finalresult = sndresult.substring(0, sndresult.length - 3);

		switch (t) {
			case planet == 1:
				p1 = finalresult;
				break;
			case planet == 2:
				p2 = finalresult;
				break;
			case planet == 3:
				p3 = finalresult;
				break;
			case planet == 4:
				p4 = finalresult;
				break;
			case planet == 5:
				p5 = finalresult;
				break;
			case planet == 6:
				p6 = finalresult;
				break;
			case planet == 7:
				p7 = finalresult;
				break;

			default:
				message.author.send("Planet forming went wrong.");
				break;
		}
	}

	let ms =
		"```fix\nValid inputs are:\nS(C)  - CoreSec Station\nS(L)  - Lycentian Station\nS(K)  - Kavani Station\nS(F)  - Foralkan Station\nS(RES)  - Residential Station\nS(T)  - Trade Union Station\nS(S)  - Syndicate Station\nAT      - Asteroid Field\nSP      - Spice Platform\nBF      - Graveyard with Drones\nMD      - Minefield\nDF(#)   - Drone Factory (level)\nMO(#)   - Monument (level)\nN       - None\nC        - Cancel\n\nIf there are multiple, put a + in between each. Example: MO(1) + S(L)\n\n=\n\n";
	function mw(planetw) {
		let t = true;
		switch (t) {
			case planetw == 1:
				ms += "Type out Planet 1 Geography:```";
				break;
			case planetw == 2:
				ms += "Type out Planet 2 Geography:```";
				break;
			case planetw == 3:
				ms += "Type out Planet 3 Geography:```";
				break;
			case planetw == 4:
				ms += "Type out Planet 4 Geography:```";
				break;
			case planetw == 5:
				ms += "Type out Planet 5 Geography:```";
				break;
			case planetw == 6:
				ms += "Type out Planet 6 Geography:```";
				break;
			case planetw == 7:
				ms += "Type out Planet 7 Geography:```";
				break;

			default:
				message.author.send("Planet forming went wrong.");
				break;
		}
	}

	async function accessSpreadsheet() {
		const doc = new GoogleSpreadsheet("");
		await doc.useServiceAccountAuth({
			client_email: creds.client_email,
			private_key: creds.private_key,
		});
		await doc.loadInfo();
		const sheet = doc.sheetsById[0];
		await sheet.loadCells("K2");
		const K2 = sheet.getCellByA1("K2");
		K2.formula = `=ROW(INDIRECT(ADDRESS(MATCH("${systemname}",A:A,0),2)))`;
		K2.textFormat = { fontSize: 6 };
		await sheet.saveUpdatedCells();
		if (K2.value >= 0) {
			sheet.saveUpdatedCells();
			return message.author.send(
				`This system is already logged into the database.\nTo access it, use the command: \`%systeminfo\`\n\n*If you believe that the info is incorrect, please contact @Genesis#8339*`
			);
		}

		const filter = (msg) => msg.author.id === message.author.id;

		await message.author.send(
			"```fix\nValid statuses are:\nCore, Secure, Unsecure, Wild, or Cancel\n\n=\n\nType out System Status:```"
		);
		await message.author.dmChannel
			.awaitMessages(filter, { max: 1, time: 120000, errors: ["time"] })
			.then((msg) => {
				let ec = msg.first().content;
				let eck = ec.toLowerCase();
				if (
					eck == "core" ||
					eck == "secure" ||
					eck == "unsecure" ||
					eck == "wild"
				) {
					let e = eck.charAt(0).toUpperCase() + eck.slice(1);
					status = e;
					return;
				} else if (eck == "cancel") {
					cancel = "Y";
				} else {
					message.author.send("Invalid Option, please retry the command.");
					return;
				}
			})
			.catch((err) => {
				message.author.send("Time's Up, Cancelled input.");
				console.log(err);
				return;
			});

		if (cancel == "Y") {
			return message.author.send("Cancelled Input");
		}

		if (
			!status == "Core" ||
			!status == "Secure" ||
			!status == "Unsecure" ||
			!status == "Wild" ||
			status >= -9999999 ||
			status <= 9999999
		) {
			return;
		}

		await message.author.send(
			"```fix\nValid inputs are:\n1, 2, 3, 4, 5, 6, 7, or Cancel\n\n=\n\nType out how many planets are in this system:```"
		);
		await message.author.dmChannel
			.awaitMessages(filter, { max: 1, time: 120000, errors: ["time"] })
			.then((msg) => {
				let ec = msg.first().content;
				if (ec.toLowerCase() == "cancel") {
					cancel = "Y";
				} else if (ec >= 8 || ec <= 0 || isNaN(ec) == true) {
					return message.author.send("Invalid input. Retry command.");
				}
				planetnumber = ec;
				return;
			})
			.catch((err) => {
				message.author.send("Time's Up, Cancelled input.");
				console.log(err);
				return;
			});

		if (cancel == "Y") {
			return message.author.send("Cancelled Input");
		}

		if (planetnumber == "") {
			return;
		}
		if (planetnumber >= 1) {
			mw(1);
			await message.author.send(ms);
			await message.author.dmChannel
				.awaitMessages(filter, { max: 1, time: 120000, errors: ["time"] })
				.then((msg) => {
					let ec = msg.first().content;
					let eck = ec.toUpperCase();
					if (eck == "C") {
						cancel = "Y";
						return;
					}
					translate(eck, 1);
					ms = ms.substring(0, ms.length - 31);
					return;
				})
				.catch((err) => {
					message.author.send("Time's Up, Cancelled input.");
					console.log(err);
					return;
				});
		}

		if (cancel == "Y") {
			return message.author.send("Cancelled Input");
		}

		if (planetnumber >= 2) {
			mw(2);
			await message.author.send(ms);
			await message.author.dmChannel
				.awaitMessages(filter, { max: 1, time: 120000, errors: ["time"] })
				.then((msg) => {
					let ec = msg.first().content;
					let eck = ec.toUpperCase();
					if (eck == "C") {
						cancel = "Y";
						return;
					}
					translate(eck, 2);
					ms = ms.substring(0, ms.length - 31);
					return;
				})
				.catch((err) => {
					message.author.send("Time's Up, Cancelled input.");
					console.log(err);
					return;
				});
		}

		if (cancel == "Y") {
			return message.author.send("Cancelled Input");
		}

		if (planetnumber >= 3) {
			mw(3);
			await message.author.send(ms);
			await message.author.dmChannel
				.awaitMessages(filter, { max: 1, time: 120000, errors: ["time"] })
				.then((msg) => {
					let ec = msg.first().content;
					let eck = ec.toUpperCase();
					if (eck == "C") {
						cancel = "Y";
						return;
					}
					translate(eck, 3);
					ms = ms.substring(0, ms.length - 31);
					return;
				})
				.catch((err) => {
					message.author.send("Time's Up, Cancelled input.");
					console.log(err);
					return;
				});
		}

		if (cancel == "Y") {
			return message.author.send("Cancelled Input");
		}

		if (planetnumber >= 4) {
			mw(4);
			await message.author.send(ms);
			await message.author.dmChannel
				.awaitMessages(filter, { max: 1, time: 120000, errors: ["time"] })
				.then((msg) => {
					let ec = msg.first().content;
					let eck = ec.toUpperCase();
					if (eck == "C") {
						cancel = "Y";
						return;
					}
					translate(eck, 4);
					ms = ms.substring(0, ms.length - 31);
					return;
				})
				.catch((err) => {
					message.author.send("Time's Up, Cancelled input.");
					console.log(err);
					return;
				});
		}

		if (cancel == "Y") {
			return message.author.send("Cancelled Input");
		}

		if (planetnumber >= 5) {
			mw(5);
			await message.author.send(ms);
			await message.author.dmChannel
				.awaitMessages(filter, { max: 1, time: 120000, errors: ["time"] })
				.then((msg) => {
					let ec = msg.first().content;
					let eck = ec.toUpperCase();
					if (eck == "C") {
						cancel = "Y";
						return;
					}
					translate(eck, 5);
					ms = ms.substring(0, ms.length - 31);
					return;
				})
				.catch((err) => {
					message.author.send("Time's Up, Cancelled input.");
					console.log(err);
					return;
				});
		}

		if (cancel == "Y") {
			return message.author.send("Cancelled Input");
		}

		if (planetnumber >= 6) {
			mw(6);
			await message.author.send(ms);
			await message.author.dmChannel
				.awaitMessages(filter, { max: 1, time: 120000, errors: ["time"] })
				.then((msg) => {
					let ec = msg.first().content;
					let eck = ec.toUpperCase();
					if (eck == "C") {
						cancel = "Y";
						return;
					}
					translate(eck, 6);
					ms = ms.substring(0, ms.length - 31);
					return;
				})
				.catch((err) => {
					message.author.send("Time's Up, Cancelled input.");
					console.log(err);
					return;
				});
		}

		if (cancel == "Y") {
			return message.author.send("Cancelled Input");
		}

		if (planetnumber == 7) {
			mw(7);
			await message.author.send(ms);
			await message.author.dmChannel
				.awaitMessages(filter, { max: 1, time: 120000, errors: ["time"] })
				.then((msg) => {
					let ec = msg.first().content;
					let eck = ec.toUpperCase();
					if (eck == "C") {
						cancel = "Y";
						return;
					}
					translate(eck, 7);
					ms = ms.substring(0, ms.length - 31);
					return;
				})
				.catch((err) => {
					message.author.send("Time's Up, Cancelled input.");
					console.log(err);
					return;
				});
		}

		if (cancel == "Y") {
			return message.author.send("Cancelled Input");
		}

		await message.author.send(
			`\`\`\`fix\nYou have entered the following information:\n\nSystem Name: ${systemname}\nSecurity Status: ${status}\nPlanet 1: ${p1}\nPlanet 2: ${p2}\nPlanet 3: ${p3}\nPlanet 4: ${p4}\nPlanet 5: ${p5}\nPlanet 6: ${p6}\nPlanet 7: ${p7}\n\nPlease Verify the information.\n\nValid inputs are:\nY / N\n\n=\n\nType out input:\`\`\``
		);
		await message.author.dmChannel
			.awaitMessages(filter, { max: 1, time: 120000, errors: ["time"] })
			.then((msg) => {
				let ec = msg.first().content;
				let eck = ec.toUpperCase();
				if (eck == "Y") {
					verify = "Y";
				} else if (eck == "N") {
					verify = "N";
				} else {
					verify = "N";
				}
				return;
			})
			.catch((err) => {
				message.author.send("Time's Up, Cancelled input.");
				console.log(err);
				return;
			});
		if (verify == "N") {
			return message.author.send("System Data input cancelled.");
		}

		let row = {
			"System Name": `${systemname}`,
			Status: `${status}`,
			"Planet 1": `${p1}`,
			"Planet 2": `${p2}`,
			"Planet 3": `${p3}`,
			"Planet 4": `${p4}`,
			"Planet 5": `${p5}`,
			"Planet 6": `${p6}`,
			"Planet 7": `${p7}`,
			User: `${user}`,
		};
		await sheet.addRow(row, { insert: true });
		message.author.send(
			`\`\`\`yaml\nSystem Input finished! ${systemname} is now logged onto the database.\n\`\`\``
		);
	}
	accessSpreadsheet();
};

module.exports.help = {
	name: "systemadd",
	aliases: ["sysadd", "system:add", "sys:add"],
};
