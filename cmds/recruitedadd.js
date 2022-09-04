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
	if (getDB() == false) {
		return message.channel.send(
			"If this message is showing, your command could not be processed because either:\n1. Another AP command in any server is currently running.\nor\n2.There was an error in an AP command that the bot did not account for, and therefore caused this error. (if so, the system will reset in at most 2 minutes.)"
		);
	} else {
		DBFalse();
	}
	let b = true;
	let pp;

	if (args.length === 0) {
		let ghrt = new Discord.MessageEmbed()
			.setColor("#000000")
			.setAuthor("Command Help")
			.setTitle("AP:Recruitedadd")
			.setDescription(
				"Add recruitment points to a user. You can mention the user or use their ID with this command!"
			)
			.addField("Initiation:", "%ap:recruitedadd")
			.addField(
				"Correct Usage:",
				"%ap:recruitedadd [user(ID)] <RP>\n\nUser === GuildMemberProperty\nUserID === GuildMemberProperty\nRP: Number"
			)
			.addField("Example:", `%ap:recruitedadd @${message.author.tag} 1`)
			.addField("Permissions I need:", "Manage Messages")
			.addField("Permissions you need:", "Manage Roles")
			.addField("Aliases:", '["recruited:add", "r:add", "radd"]')
			.setFooter("Stable");

		DBTrue();
		return message.channel.send({ embeds: [ghrt] });
	}

	switch (b) {
		case message.guild.id == "601763897262735370":
			//TBB Server
			let v = await message.guild.roles.fetch("810641055854231613");
			if (!args.includes("*")) {
				if (message.member.roles.highest.position < v.position) {
					message.channel.send(
						"You do not have permission to use this command."
					);
					DBTrue();
					throw new Error("no permission to use - VO");
				}
			} else if (args.includes("*")) {
				if (message.author.id !== "251196062725963776") {
					message.channel.send("You do not have permission to use override!");
					DBTrue();
					throw new Error("no permission to use - VO");
				}
			}
			break;
		case message.guild.id == "703040999768981634":
			//GA Server
			pp = 1;
			DBTrue();
			message.channel.send(
				"TBB Bot is currently in the testing phase for GA integration. The only command functional will be %ap:add and %info."
			);
			break;

		default:
			DBTrue();
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
		message.guild.members.cache.get(args[0]);
	if (!toAP) {
		DBTrue();
		return message.channel.send("You did not specify a user mention or ID!");
	}
	if (!args[1]) {
		DBTrue();
		return message.channel.send(
			"You did not specify what number to set RP to!"
		);
	}
	if (isNaN(args[1])) {
		DBTrue();
		return message.channel.send("The specified RP is not a number.");
	}
	if (toAP.roles.highest.position > message.member.roles.highest.position) {
		DBTrue();
		return message.channel.send(
			"You cannot change a member who has a higher role than you."
		);
	}

	async function accessSpreadsheet() {
		const doc = new GoogleSpreadsheet("");
		await doc.useServiceAccountAuth({
			client_email: creds.client_email,
			private_key: creds.private_key,
		});
		await doc.loadInfo();
		const sheet = doc.sheetsById[0];
		await sheet.loadCells("I3");
		const K2 = sheet.getCellByA1("I3");
		K2.formula = `=ROW(INDIRECT(ADDRESS(MATCH("${toAP.id}",H:H,0),2)))`;
		K2.textFormat = { fontSize: 6 };
		await sheet.saveUpdatedCells();
		if (K2.valueType == "errorValue") {
			DBTrue();
			return message.channel.send(
				"Hey! This user: `" +
					`${toAP.user.tag}` +
					"` is not on the spreadsheet! Add them using `" +
					`%ap:useradd ${toAP.user.id}` +
					"`"
			);
		}

		let offsetvalue = K2.value - 2;
		const rows = await sheet.getRows({
			limit: 1,
			offset: offsetvalue,
		});

		let row = rows[0];

		let num1 = Number(row.Recruited);
		let num2 = Number(args[1]);
		if (args[1]) {
			row.Recruited = num1 += num2;
			row.save();
		}
		var myArray = ["#000000", "#fafafa", "#616161"];

		function video() {
			return myVideos[Math.floor(Math.random() * myVideos.length)];
		}

		var randomItem = myArray[Math.floor(Math.random() * myArray.length)];
		let aws = new Discord.MessageEmbed()
			.setColor(randomItem)
			.setTitle(`Recruitment Points`)
			.addField("Action:", `[\`Added\`](${video()})`)
			.addField("Amount:", `[\`${args[1]}\`](${video()})`)
			.addField("To:", `[\`${toAP.user.tag}\`](${video()})`)
			.addField(
				"Now Has:",
				`[\`${row.Recruited}\`](${video()}) Recruitment Points.`
			)
			.setFooter("https://cutt.ly/uwu0w0");
		message.channel.send({ embeds: [aws] });
		DBTrue();
	}

	accessSpreadsheet();
};

module.exports.help = {
	name: "recruitedadd",
	aliases: ["recruited:add", "r:add", "radd"],
};
