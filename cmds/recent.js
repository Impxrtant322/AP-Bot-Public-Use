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

module.exports.run = async (bot, message, args, myVideos, creds2) => {
	CommandsRanAdd();
	let b = true;

	switch (b) {
		case message.guild.id == "601763897262735370":
			//TBB Server
			break;
		case message.guild.id == "677246811911487488":
			//LS Server
			break;
		case message.guild.id == "703040999768981634":
			//GA Server
			break;
		case message.guild.id == "701473055830048808":
			//MOPP Server
			break;
		case message.guild.id == "757370229587181640":
			//LS Server
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
			throw new Error("");
			break;
	}

	let toAP =
		message.guild.members.cache.get(message.mentions.users.first()?.id) ||
		message.guild.members.cache.get(args[0]) ||
		message.member;

	async function accessSpreadsheet() {
		const doc2 = new GoogleSpreadsheet("");
		await doc2.useServiceAccountAuth({
			client_email: creds2.client_email,
			private_key: creds2.private_key,
		});
		await doc2.loadInfo();
		const sheet2 = doc2.sheetsById[0];
		await sheet2.loadCells("K3");
		const K22 = sheet2.getCellByA1("K3");
		K22.formula = `=ROW(INDIRECT(ADDRESS(MATCH("${toAP.id}",A:A,0),2)))`;
		K22.textFormat = { fontSize: 6 };
		await sheet2.saveUpdatedCells();
		if (K22.valueType == "errorValue") {
			return message.channel.send("This person is not on the bot spreadsheet!");
		}
		let offsetvalue2 = K22.value - 2;
		const rows2 = await sheet2.getRows({
			limit: 1,
			offset: offsetvalue2,
		});

		let row = rows2[0];

		var myArray = ["#000000", "#fafafa", "#616161"];

		function video() {
			return myVideos[Math.floor(Math.random() * myVideos.length)];
		}

		var randomItem = myArray[Math.floor(Math.random() * myArray.length)];
		let aws = new Discord.MessageEmbed()
			.setColor(randomItem)
			.setTitle(`Recent`)
			.setAuthor(toAP.user.tag, toAP.user.avatarURL())
			.addField(
				`You recently had __**${row.amount}**__ AP __**${row.action}**__ you at:`,
				`[\`${row.recent}\`](${video()})\n\nBy: [\`${
					row.byuser
				}\`](${video()})\n\nYou previously had [\`${
					row.apbefore
				}\`](${video()}) AP.`
			)
			.setFooter(
				"https://cutt.ly/XlC255Y • Got any suggestions or concerns? Message Genesis!"
			);
		message.channel.send({ embeds: [aws] });
	}
	accessSpreadsheet().catch((err) => {
		message.channel.send(err);
		console.log(err);
	});
};

module.exports.help = {
	name: "recent",
	aliases: ["history", "ap:recent", "ap:history", "aprecent", "aphistory"],
};
