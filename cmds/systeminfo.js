const { GoogleSpreadsheet } = require("google-spreadsheet");
const { promisify } = require("util");
const Discord = require("discord.js");
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

	let toAP =
		message.guild.members.cache.get(message.mentions.users.first()?.id) ||
		message.guild.members.cache.get(args[0]) ||
		message.member;

	if (toAP == undefined) {
		toAP = message.guild.members.cache.get(args[0]);
	}
	if (toAP == undefined) {
		toAP = message.member;
	}
	if (args[0] == "@everyone") {
		return message.channel.send("Nice try, noob.");
	}
	var args2 = args.join(" ");
	let ff = args2.toLowerCase();
	if (ff == "the citadel") {
		ff = "citadel";
	}
	let systemname = ff.charAt(0).toUpperCase() + ff.slice(1);
	let p1 = "";
	let p2 = "";
	let p3 = "";
	let p4 = "";
	let p5 = "";
	let p6 = "";
	let p7 = "";
	console.log(systemname);
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
		if (K2.valueType == "errorValue") {
			return message.channel.send(
				"This system has not yet been logged! Log it using `%systemadd` then follow instructions in DMs"
			);
		}
		let offsetvalue = K2.value - 2;
		const rows = await sheet.getRows({
			limit: 1,
			offset: offsetvalue,
		});

		var myArray = ["#000000", "#fafafa", "#616161"];

		let row = rows[0];

		if (!row["Planet 1"] == false) {
			p1 = `\nPlanet 1: [\`${row["Planet 1"]}\`](${video()}).`;
		}
		if (!row["Planet 2"] == false) {
			p2 = `\nPlanet 2: [\`${row["Planet 2"]}\`](${video()}).`;
		}
		if (!row["Planet 3"] == false) {
			p3 = `\nPlanet 3: [\`${row["Planet 3"]}\`](${video()}).`;
		}
		if (!row["Planet 4"] == false) {
			p4 = `\nPlanet 4: [\`${row["Planet 4"]}\`](${video()}).`;
		}
		if (!row["Planet 5"] == false) {
			p5 = `\nPlanet 5: [\`${row["Planet 5"]}\`](${video()}).`;
		}
		if (!row["Planet 6"] == false) {
			p6 = `\nPlanet 6: [\`${row["Planet 6"]}\`](${video()}).`;
		}
		if (!row["Planet 7"] == false) {
			p7 = `\nPlanet 7: [\`${row["Planet 7"]}\`](${video()}).`;
		}

		function video() {
			return myVideos[Math.floor(Math.random() * myVideos.length)];
		}

		var randomItem = myArray[Math.floor(Math.random() * myArray.length)];

		let aws = new Discord.MessageEmbed()
			.setColor(randomItem)
			.setAuthor(toAP.user.tag, toAP.user.avatarURL())
			.setTitle(`${systemname} Planetary Info`)
			.setDescription(
				`Security Status: [\`${row.Status}\`](${video()}).` +
					p1 +
					p2 +
					p3 +
					p4 +
					p5 +
					p6 +
					p7 +
					`\nInputted by: [\`${row.User}\`](${video()}).` +
					`\n\nAccess The Spreadsheet with this link: [Link]()\n\nIf there is an error, please notify @Genesis#8339 or @kidofly5519.`
			)
			.setFooter("");
		message.channel.send({ embeds: [aws] });
	}
	accessSpreadsheet();
};
module.exports.help = {
	name: "systeminfo",
	aliases: ["sysinfo", "system:info", "find", "sinfo"],
};
