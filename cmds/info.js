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

module.exports.run = async (
	bot,
	message,
	args,
	myVideos,
	creds,
	creds2,
	switcher,
	roler,
	addtodatabase,
	k2value,
	autorolevalues
) => {
	CommandsRanAdd();
	let b = true;
	let pp;
	let facname;
	let doc;
	let rowsearchletter;
	let isfacranktrue;
	let toAP =
		message.guild.members.cache.get(message.mentions.users.first()?.id) ||
		message.guild.members.cache.get(args[0]) ||
		message.member;
	let rolesofperson = toAP.roles.cache;
	let rolesofperson2 = message.member.roles.cache;
	let factionid;
	let usermember;

	message.channel.sendTyping();

	switch (b) {
		case message.guild.id == "601763897262735370":
			//vo Server
			facname = "VO";
			doc = new GoogleSpreadsheet("");
			rowsearchletter = "H";
			isfacranktrue = rolesofperson2.get("601764132441554946");
			if (!isfacranktrue) {
				return message.channel.send(
					"You are not allowed to use this command. MISSING ROLE: Void Outlaws"
				);
			}
			break;
		case message.guild.id == "701473055830048808":
			//MOPP Server
			facname = "MOPP";
			doc = new GoogleSpreadsheet("");
			rowsearchletter = "H";
			isfacranktrue = rolesofperson2.get("712342778637713450");
			if (!isfacranktrue) {
				return message.channel.send(
					"You are not allowed to use this command. MISSING ROLE: Verified"
				);
			}
			break;
		case message.guild.id == "677246811911487488":
			//LS Server
			facname = "LS";
			doc = new GoogleSpreadsheet("");
			rowsearchletter = "G";
			isfacranktrue = message.guild.roles.cache.get("678621212150333480");
			if (isfacranktrue.position > message.member.roles.highest.position) {
				message.channel.send(
					"You cannot use this command because you are missing role: Allied or above."
				);
				return;
			}
			break;
		case message.guild.id == "757370229587181640":
			//ISC Server
			facname = "ISC";
			doc = new GoogleSpreadsheet("");
			rowsearchletter = "H";
			isfacranktrue = message.guild.roles.cache.get("757398203191656569");
			if (isfacranktrue.position > message.member.roles.highest.position) {
				message.channel.send(
					"You cannot use this command because you are missing role: Employee or above."
				);
				return;
			}
			break;
		case message.guild.id == "802881932232753175":
			//TGSS Server
			facname = "TGSS";
			doc = new GoogleSpreadsheet("");
			rowsearchletter = "H";
			isfacranktrue = message.guild.roles.cache.get("825207776354762762");
			if (isfacranktrue.position > message.member.roles.highest.position) {
				message.channel.send(
					"You cannot use this command because you are missing role: Newcomer or above."
				);
				return;
			}
			break;
		case message.guild.id == "617477144569708554":
			//UCG Server
			facname = "UCG";
			doc = new GoogleSpreadsheet("");
			rowsearchletter = "H";
			isfacranktrue = message.guild.roles.cache.get("706902647474618370");
			if (isfacranktrue.position > message.member.roles.highest.position) {
				message.channel.send(
					"You cannot use this command because you are missing role: Solado or above."
				);
				return;
			}
			break;
		case message.guild.id == "703040999768981634":
			//GA Server
			//message.channel.send(`GA Server commands are currently broken because of the "GA server remake"`)
			//throw new Error("")
			isfacranktrue = rolesofperson.get("783858180047372298");
			if (!isfacranktrue) {
				return message.channel.send(
					"You are not allowed to use this command. MISSING ROLE: Verified"
				);
			}
			let facrank =
				rolesofperson.get("783855632334979093") ||
				rolesofperson.get("783855310849835018") ||
				rolesofperson.get("783855682947514380") ||
				rolesofperson.get("711674826783195226") ||
				rolesofperson.get("750745728627769435") ||
				rolesofperson.get("783868850709069835") ||
				rolesofperson2.get("783856175808118824");
			let usermember2 =
				rolesofperson2.get("783855632334979093") ||
				rolesofperson2.get("783855310849835018") ||
				rolesofperson2.get("783855682947514380") ||
				rolesofperson2.get("711674826783195226") ||
				rolesofperson2.get("750745728627769435") ||
				rolesofperson2.get("783868850709069835") ||
				rolesofperson2.get("783856175808118824");
			if (usermember2.id == "783855310849835018") {
				factionid = "601763897262735370"; //vo
			} else if (usermember2.id == "783855682947514380") {
				factionid = "703040999768981634"; //ls
			} else if (usermember2.id == "783855632334979093") {
				factionid = "701473055830048808"; //mopp
			} else {
				return message.channel.send(
					"Your faction was not found on the database list."
				);
			}
			bot.guilds.fetch(`${factionid}`).then((e) => {
				e.members.fetch(`${message.author.id}`).then((f) => {
					usermember = f;
				});
			});
			if (facrank.id == "783855310849835018") {
				//vo
				doc = new GoogleSpreadsheet("");
				rowsearchletter = "H";
				facname = "VO";
				bot.guilds.fetch("601763897262735370").then((e) => {
					e.members.fetch(`${toAP.id}`).then((f) => {
						toAP = f;
					});
				});
			} else if (facrank.id == "783855682947514380") {
				//ls
				doc = new GoogleSpreadsheet("");
				rowsearchletter = "G";
				facname = "LS";
			} else if (facrank.id == "783855632334979093") {
				//MOPP
				doc = new GoogleSpreadsheet("");
				rowsearchletter = "H";
				facname = "MOPP";
				bot.guilds.fetch("701473055830048808").then((e) => {
					e.members.fetch(`${toAP.id}`).then((f) => {
						toAP = f;
					});
				});
			} else {
				//GA fallback
				doc = new GoogleSpreadsheet("");
				rowsearchletter = "F";
				facname = "GA";
			}
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

	if (args[0] == "@everyone") {
		return message.channel.send("Nice try, noob.");
	}
	let f = "";

	async function accessSpreadsheet() {
		await doc.useServiceAccountAuth({
			client_email: creds.client_email,
			private_key: creds.private_key,
		});
		await doc.loadInfo();
		const sheet = doc.sheetsById[0];
		await sheet.loadCells("I3");
		const K2 = sheet.getCellByA1("I3");
		K2.formula = `=ROW(INDIRECT(ADDRESS(MATCH("${toAP.id}",${rowsearchletter}:${rowsearchletter},0),2)))`;
		K2.textFormat = { fontSize: 6 };
		await sheet.saveUpdatedCells();
		if (K2.valueType == "errorValue") {
			return message.channel.send("This person is not on the spreadsheet!");
		}
		let offsetvalue = K2.value - 2;
		const rows = await sheet.getRows({
			limit: 1,
			offset: offsetvalue,
		});

		let row = rows[0];

		let num3;
		let facnumber;
		let info4 = await autorolevalues(facname, message);

		num3 = info4.num3;
		facnumber = info4.facnumber;
		if (!row[`${num3}`]) {
			return message.channel.send(
				"This person does not have any logged AP! This may be an error on the bot's part if the user was recently added via `ap:useradd`."
			);
		}
		if (args[0]) {
			f = "This user has";
		} else if (!args[0]) {
			f = "You have";
		}

		var myArray = ["#000000", "#fafafa", "#616161"];

		function video() {
			return myVideos[Math.floor(Math.random() * myVideos.length)];
		}

		var randomItem = myArray[Math.floor(Math.random() * myArray.length)];

		let aws;
		if (facname == "VO") {
			aws = new Discord.MessageEmbed()
				.setColor(randomItem)
				.setAuthor(toAP.user.tag, toAP.user.avatarURL())
				.setTitle(`${row.Members}'s TBB Info`)
				.addField(
					"Attendance Points:",
					`${f} [\`${row[`${num3}`]}\`](${video()}) Attendance Points.`
				)
				.addField("Rank:", `[\`${row.Role}\`](${video()}).`)
				.addField("Recruited:", `[\`${row.Recruited}\`](${video()}).`)
				.addField("Join Date:", `[\`${row["Join Date"]}\`](${video()}).`)
				.setFooter(
					"https://cutt.ly/uwu0w0 • Use %recent to see your most recent AP change!"
				);
		} else if (facname == "GA") {
			aws = new Discord.MessageEmbed()
				.setColor(randomItem)
				.setAuthor(toAP.user.tag, toAP.user.avatarURL())
				.setTitle(`${row["ROBLOX Name"]}'s ${facname} Info`)
				.addField(
					"Attendance Points:",
					`${f} [\`${row[`${num3}`]}\`](${video()}) Attendance Points.`
				)
				.addField("Faction:", `[\`${row.Faction}\`](${video()}).`)
				.addField("Join Date:", `[\`${row["Join Date"]}\`](${video()}).`)
				.setFooter(
					"This is a placeholder error. Your faction role was not found / not recognized."
				);
		} else if (facname == "MOPP") {
			aws = new Discord.MessageEmbed()
				.setColor(randomItem)
				.setAuthor(toAP.user.tag, toAP.user.avatarURL())
				.setTitle(`${row["Members"]}'s MOPP Info`)
				.addField(
					"Attendance Points:",
					`${f} [\`${row[`${num3}`]}\`](${video()}) Attendance Points.`
				)
				.addField("Rank:", `[\`${row.Role}\`](${video()}).`)
				.addField("Recruited:", `[\`${row.Recruited}\`](${video()}).`)
				.addField("Join Date:", `[\`${row["Join Date"]}\`](${video()}).`)
				.setFooter("Use %recent to see your most recent AP change!");
		} else if (facname == "LS") {
			aws = new Discord.MessageEmbed()
				.setColor(randomItem)
				.setAuthor(toAP.user.tag, toAP.user.avatarURL())
				.setTitle(`${row["Members"]}'s LS Info`)
				.addField("Souls:", `${f} [\`${row[`${num3}`]}\`](${video()}) Souls.`)
				.addField("Rank:", `[\`${row.Role}\`](${video()}).`)
				.addField("Join Date:", `[\`${row["Join Date"]}\`](${video()}).`)
				.setFooter("Use %recent to see your most recent AP change!");
		} else if (facname == "UCG") {
			aws = new Discord.MessageEmbed()
				.setColor(randomItem)
				.setAuthor(toAP.user.tag, toAP.user.avatarURL())
				.setTitle(`${row["Members"]}'s UCG Información`)
				.addField(
					"Puntos de Asistencia:",
					`${f} [\`${row[`${num3}`]}\`](${video()}) Puntos de Asistencia.`
				)
				.addField("Rank:", `[\`${row.Role}\`](${video()}).`)
				.addField("Join Date:", `[\`${row["Join Date"]}\`](${video()}).`)
				.setFooter("Use %recent to see your most recent AP change!");
		} else if (facname == "ISC") {
			aws = new Discord.MessageEmbed()
				.setColor(randomItem)
				.setAuthor(toAP.user.tag, toAP.user.avatarURL())
				.setTitle(`${row["Members"]}'s ISC Info`)
				.addField(
					"Attendance Points:",
					`${f} [\`${row[`${num3}`]}\`](${video()}) Attendance Points.`
				)
				.addField("Rank:", `[\`${row.Role}\`](${video()}).`)
				.addField("Join Date:", `[\`${row["Join Date"]}\`](${video()}).`)
				.setFooter("Use %recent to see your most recent AP change!");
		}
		message.channel.send({ embeds: [aws] });
	}
	accessSpreadsheet();
};
module.exports.help = {
	name: "info",
	aliases: ["ap", "i"],
};
