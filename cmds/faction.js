const { GoogleSpreadsheet } = require("google-spreadsheet");
const Discord = require("discord.js");
const {
	getDB,
	DBFalse,
	DBTrue,
	CommandsRanTotal,
	CommandsRanAdd,
} = require("../bot.js");

module.exports.run = async (bot, message, args, myVideos, creds, creds2) => {
	CommandsRanAdd();
	return message.channel.send(
		"The developer got lazy updating this so he turned the command off. Sorry <3"
	);
	const doc = new GoogleSpreadsheet("");

	async function asyncForEach(array, callback) {
		for (let index = 0; index < array.length; index++) {
			await callback(array[index], index, array);
		}
	}

	let argse = args.join(" ");
	argse = argse.toUpperCase();

	async function accessSpreadsheet() {
		let q = ""; //at war
		let w = ""; //allied
		let g = ""; //defensepact
		let o = ""; //friendly
		let u = ""; //KOS
		let y = ""; //NAP
		let a = "";
		let myArray = ["#000000", "#fafafa", "#616161"];

		//Variable that gets random hex code from myArray list.
		let randomItem = myArray[Math.floor(Math.random() * myArray.length)];
		await doc.useServiceAccountAuth({
			client_email: creds2.client_email,
			private_key: creds2.private_key,
		});
		await doc.loadInfo().catch((err) => {
			message.channel.send("Sorry, I was rate limited! Try again later.");
			throw new Error(err);
		});
		const sheet = doc.sheetsById[0];
		await sheet.loadHeaderRow().catch((err) => {
			message.channel.send("Sorry, I was rate limited! Try again later.");
			throw new Error(err);
		});
		await sheet.loadCells("C3").catch((err) => {
			message.channel.send("Sorry, I was rate limited! Try again later.");
			throw new Error(err);
		});
		const K2 = sheet.getCellByA1("C3");
		K2.formula = `=ROW(INDIRECT(ADDRESS(MATCH("${argse}",A:A,0),2)))`;
		K2.textFormat = { fontSize: 6 };
		await sheet.saveUpdatedCells().catch((err) => {
			message.channel.send("Sorry, I was rate limited! Try again later.");
			throw new Error(err);
		});
		if (K2.valueType == "errorValue") {
			let b = "";

			const rows2 = await sheet.getRows().catch((err) => {
				message.channel.send("Sorry, I was rate limited! Try again later.");
				throw new Error(err);
			});
			let f = 0;
			const start = async () => {
				//[SPR1 + SPR2] 1st loop function
				await asyncForEach(rows2, async (val, index_data, arr_data) => {
					if (val.Faction == "Mega Alliance") return;
					if (val.Faction == "Alliance") return;
					f = f + 1;
					b = b.concat("", `${f}. ${val.Faction}\n`);
				});
			};
			await start();

			let aws = new Discord.MessageEmbed()
				.setColor(randomItem)
				.setTitle(`Faction Tags List`)
				.setDescription(`${b}`)
				.setFooter(
					"These are all tags you can use while doing: %faction [tag]"
				);
			return message.channel.send({ embed: aws });
		}
		let offsetvalue = K2.value - 2;
		const rows = await sheet
			.getRows({
				limit: 1,
				offset: offsetvalue,
			})
			.catch((err) => {
				message.channel.send("Sorry, I was rate limited! Try again later.");
				throw new Error(err);
			});

		let row = rows[0];
		let column = sheet.headerValues;
		let mn = await message.channel.send("Please wait, getting data...");
		let i = -1;
		const bleh = async () => {
			await asyncForEach(column, async (val, index_data, arr_data) => {
				i = i + 1;
				if (val == "Mega Alliance" && row[val].length != 0) {
					a = a.concat(`Mega Alliance: ${row[val]}`, `\n`);
					return;
				}
				if (val == "Alliance" && row[val].length != 0) {
					a = a.concat(`Alliance: ${row[val]}`, `\n`);
					return;
				}
				if (val == "Faction") {
					a = a.concat(`Faction: ${row[val]}`, `\n`);
					return;
				}
				await sheet.loadCells(row.a1Range.slice(9)).catch((err) => {
					message.channel.send("Sorry, I was rate limited! Try again later.");
					throw new Error(err);
				});
				let cell = sheet.getCell(row.rowNumber - 1, i);

				if (!cell.backgroundColor) return;

				if (
					cell.backgroundColor.green == 1 &&
					cell.backgroundColor.blue == 1 &&
					cell.backgroundColor.red == 1
				) {
					return;
				} else if (
					cell.backgroundColor.green == 1 &&
					cell.backgroundColor.blue == 1
				) {
					g = g.concat(`${val}`, "\n");
				} else if (
					cell.backgroundColor.red == 1 &&
					cell.backgroundColor.green == 0.6
				) {
					u = u.concat(`${val}`, "\n");
				} else if (
					cell.backgroundColor.red == 0.6 &&
					cell.backgroundColor.blue == 1
				) {
					y = y.concat(`${val}`, "\n");
				} else if (cell.backgroundColor.blue == 1) {
					o = o.concat(`${val}`, "\n");
				} else if (cell.backgroundColor.green == 1) {
					w = w.concat(`${val}`, "\n");
				} else if (cell.backgroundColor.red == 1) {
					q = q.concat(`${val}`, "\n");
				}
			});
		};
		await bleh();

		if (q.length == 0) {
			q = q.concat("", "None");
		}
		if (w.length == 0) {
			w = w.concat("", "None");
		}
		if (g.length == 0) {
			g = g.concat("", "None");
		}
		if (o.length == 0) {
			o = o.concat("", "None");
		}
		if (u.length == 0) {
			u = u.concat("", "None");
		}
		if (y.length == 0) {
			y = y.concat("", "None");
		}

		let awe = new Discord.MessageEmbed()
			.setColor(randomItem)
			.setTitle(`Faction: ${args[0]}`)
			.setDescription(`${a}`)
			.addField("Allied:", `${w}`, true)
			.addField("War:", `${q}`, true)
			.addField("Defense Pact:", `${g}`, true)
			.addField("Friendly:", `${o}`, true)
			.addField("KOS:", `${u}`, true)
			.addField("NAP:", `${y}`, true)
			.setFooter("Info updated according to DATA");
		mn.delete();
		return message.channel.send({ embed: awe });
	}
	accessSpreadsheet();
};

module.exports.help = {
	name: "faction",
	aliases: [],
};
