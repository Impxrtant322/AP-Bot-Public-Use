const { GoogleSpreadsheet } = require("google-spreadsheet");
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
	let row;
	let toAP =
		message.guild.members.cache.get(message.mentions.users.first()?.id) ||
		message.guild.members.cache.get(args[0]);
	if (args.length === 0) {
		let ghrt = new Discord.MessageEmbed()
			.setColor("#000000")
			.setAuthor("Command Help")
			.setTitle("AP:Useradd")
			.setDescription(
				"Adds a user to the database of the discord that this command was called in. User mentions or IDs work!"
			)
			.addField("Initiation:", "%ap:useradd")
			.addField(
				"Correct Usage:",
				"%ap:useradd [user(ID)]\n\nUser === GuildMemberProperty\nUserID === GuildMemberProperty"
			)
			.addField("Example:", `%ap:useradd @${message.author.tag} 1`)
			.addField("Permissions I need:", "Manage Messages")
			.addField("Permissions you need:", "Manage Roles")
			.addField("Aliases:", '["apuseradd", "useradd", "adduser"]')
			.setFooter("Stable");

		DBTrue();
		return message.channel.send({ embeds: [ghrt] });
	}
	if (!toAP) {
		DBTrue();
		return message.channel.send("You did not specify a user mention or ID!");
	}
	let oof = toAP.joinedAt;
	console.log(oof);
	let dayofmonth = oof.getDate();
	console.log(dayofmonth);
	let year = oof.getFullYear();
	console.log(year);
	let month2 = oof.getMonth();
	let month = month2 + 1;
	console.log(month);
	let facrole;
	let facranke;
	let eek = toAP.nickname;
	if (eek === null || eek === undefined) {
		eek = toAP.user.username;
		console.log("Nickname changed =>", eek);
	}
	let doc;

	switch (b) {
		case message.guild.id == "601763897262735370":
			//TBB Server
			let v = await message.guild.roles.fetch("810641055854231613");
			if (!args.includes("*")) {
				if (message.member.roles.highest.position < v.position) {
					DBTrue();
					return message.channel.send(
						"You do not have permission to use this command."
					);
				}
			} else if (args.includes("*")) {
				if (message.author.id !== "251196062725963776") {
					message.channel.send("You do not have permission to use override!");
					debounce = true;
					throw new Error(`no permission to use command - ${facname}`);
				}
			}
			doc = new GoogleSpreadsheet("");
			facrole = "TBB";
			row = {
				"Discord Tag": `${toAP.user.tag}`,
				Members: `${eek}`,
				Role: `Rascal`,
				"Attendance Points": "0",
				"Join Date": `${month}/${dayofmonth}/${year}`,
				Recruited: "0",
				userID: `${toAP.id}`,
			};
			break;
		case message.guild.id == "677246811911487488":
			//LS Server
			let g = await message.guild.roles.fetch("677276460108742686");
			if (message.member.roles.highest.position < g.position) {
				DBTrue();
				return message.channel.send(
					"You do not have the minimum role needed to use this command. (Lieutenant)"
				);
			}
			doc = new GoogleSpreadsheet("");
			facrole = "LS";
			row = {
				"Discord Tag": `${toAP.user.tag}`,
				Members: `${eek}`,
				Role: `Apprentice`,
				"Souls (AP)": "0",
				"Join Date": `${month}/${dayofmonth}/${year}`,
				userID: `${toAP.id}`,
			};
			break;
		case message.guild.id == "703040999768981634":
			//GA Server
			//message.channel.send(`GA Server commands are currently broken because of the "GA server remake"`)
			//DBTrue()
			//throw new Error("")
			if (message.author.id !== "251196062725963776") {
				if (!message.member.permissions.has("MANAGE_ROLES")) {
					DBTrue();
					return message.channel.send(
						"You do not have permission to use this command."
					);
				}
			}
			let rolesofperson = toAP.roles.cache;
			facrole = "GA";
			doc = new GoogleSpreadsheet("");
			let facrank =
				rolesofperson.get("783855632334979093") ||
				rolesofperson.get("783855310849835018") ||
				rolesofperson.get("783855682947514380") ||
				rolesofperson.get("711674826783195226") ||
				rolesofperson.get("750745728627769435") ||
				rolesofperson.get("783868850709069835");
			facranke = facrank.name;
			row = {
				"Discord Tag": `${toAP.user.tag}`,
				"ROBLOX Name": `${eek}`,
				Faction: `${facranke}`,
				"Attendance Points": "0",
				"Join Date": `${month}/${dayofmonth}/${year}`,
				UserID: `${toAP.id}`,
			};
			break;
		case message.guild.id == "701473055830048808":
			//MOPP Server
			let f = await message.guild.roles.fetch("701473225854550156");
			if (message.member.roles.highest.position < f.position) {
				DBTrue();
				return message.channel.send(
					"You do not have the minimum role needed to use this command. (Fleet Major)"
				);
			}
			doc = new GoogleSpreadsheet("");
			facrole = "MOPP";
			row = {
				"Discord Tag": `${toAP.user.tag}`,
				Members: `${eek}`,
				Role: ``,
				"Attendance points": "0",
				"Join Date": `${month}/${dayofmonth}/${year}`,
				Recruited: "0",
				userID: `${toAP.id}`,
			};
			break;
		case message.guild.id == "757370229587181640":
			//ISC Server
			let j = await message.guild.roles.fetch("767132526023409694");
			if (message.member.roles.highest.position < j.position) {
				DBTrue();
				return message.channel.send(
					"You do not have the minimum role needed to use this command. (Secretary)"
				);
			}
			doc = new GoogleSpreadsheet("");
			facrole = "ISC";
			row = {
				"Discord Tag": `${toAP.user.tag}`,
				Members: `${eek}`,
				Role: ``,
				"Attendance Points": "0",
				"Join Date": `${month}/${dayofmonth}/${year}`,
				Recruited: "0",
				userID: `${toAP.id}`,
			};
			break;
		case message.guild.id == "802881932232753175":
			//TGSS Server
			let t = await message.guild.roles.fetch("825208751732555788");
			if (message.member.roles.highest.position < t.position) {
				DBTrue();
				return message.channel.send(
					"You do not have permission to use this command."
				);
			}
			doc = new GoogleSpreadsheet("");
			facrole = "TGSS";
			row = {
				"Discord Tag": `${toAP.user.tag}`,
				Members: `${eek}`,
				Role: `Newcomer`,
				"Attendance Points": "0",
				"Join Date": `${month}/${dayofmonth}/${year}`,
				Recruited: "0",
				userID: `${toAP.id}`,
			};
			break;
		case message.guild.id == "617477144569708554":
			//UCG Server
			let u = await message.guild.roles.fetch("794749823848022016");
			if (message.member.roles.highest.position < u.position) {
				DBTrue();
				return message.channel.send(
					"You do not have permission to use this command."
				);
			}
			doc = new GoogleSpreadsheet("");
			facrole = "UCG";
			row = {
				"Discord Tag": `${toAP.user.tag}`,
				Members: `${eek}`,
				Role: `Newcomer`,
				"Attendance Points": "0",
				"Join Date": `${month}/${dayofmonth}/${year}`,
				Recruited: "0",
				userID: `${toAP.id}`,
			};
			break;

		default:
			message.channel.send(
				"Your server is not authorized to use this command. Is this an error? Message Genesis#8339"
			);
			DBTrue();
			throw new Error("no permission to use - any Server");
			break;
	}
	if (!args.includes("*")) {
		if (toAP.roles.highest.position > message.member.roles.highest.position) {
			DBTrue();
			return message.channel.send(
				"You cannot change a member who has a higher role than you."
			);
		}
	}

	async function accessSpreadsheet() {
		await doc.useServiceAccountAuth({
			client_email: creds.client_email,
			private_key: creds.private_key,
		});
		await doc.loadInfo();
		const sheet = doc.sheetsById[0];

		await sheet.addRow(row, { insert: true });
	}
	accessSpreadsheet();

	var myArray = ["#000000", "#fafafa", "#616161"];

	function video() {
		return myVideos[Math.floor(Math.random() * myVideos.length)];
	}

	var randomItem = myArray[Math.floor(Math.random() * myArray.length)];
	let aws;
	if (facrole == "TBB") {
		aws = new Discord.MessageEmbed()
			.setColor(randomItem)
			.setTitle(`TBB User Database`)
			.addField("Action:", `[\`Added To TBB Database\`](${video()})`)
			.addField("Discord Tag:", `[\`${toAP.user.tag}\`](${video()})`)
			.addField("Members:", `[\`${eek}\`](${video()})`)
			.addField("Role:", `[\`Rascal\`](${video()})`)
			.addField("Attendance Points:", `[\`0\`](${video()})`)
			.addField(
				"Join Date:",
				`[\`${month}/${dayofmonth}/${year}\`](${video()})`
			)
			.addField("Recruited:", `[\`0\`](${video()})`)
			.addField("User ID:", `[\`${toAP.id}\`](${video()})`)
			.setFooter(
				"https://cutt.ly/uwu0w0 • Got any suggestions or concerns? Message Genesis!"
			);
	} else if (facrole == "GA") {
		aws = new Discord.MessageEmbed()
			.setColor(randomItem)
			.setTitle(`GA User Database`)
			.addField("Action:", `[\`Added To GA Database\`](${video()})`)
			.addField("Discord Tag:", `[\`${toAP.user.tag}\`](${video()})`)
			.addField("ROBLOX Name:", `[\`${eek}\`](${video()})`)
			.addField("Faction:", `[\`${facranke}\`](${video()})`)
			.addField("Attendance Points:", `[\`0\`](${video()})`)
			.addField(
				"Join Date:",
				`[\`${month}/${dayofmonth}/${year}\`](${video()})`
			)
			.addField("User ID:", `[\`${toAP.id}\`](${video()})`)
			.setFooter("Got any suggestions or concerns? Message Genesis!");
	} else if (facrole == "UCG") {
		aws = new Discord.MessageEmbed()
			.setColor(randomItem)
			.setTitle(`UCG User Database`)
			.addField("Action:", `[\`Added To UCG Database\`](${video()})`)
			.addField("Discord Tag:", `[\`${toAP.user.tag}\`](${video()})`)
			.addField("ROBLOX Name:", `[\`${eek}\`](${video()})`)
			.addField("Faction:", `[\`${facranke}\`](${video()})`)
			.addField("Puntos de Asistencia:", `[\`0\`](${video()})`)
			.addField(
				"Join Date:",
				`[\`${month}/${dayofmonth}/${year}\`](${video()})`
			)
			.addField("User ID:", `[\`${toAP.id}\`](${video()})`)
			.setFooter("Got any suggestions or concerns? Message Genesis!");
	} else if (facrole == "MOPP") {
		aws = new Discord.MessageEmbed()
			.setColor(randomItem)
			.setTitle(`MOPP User Database`)
			.addField("Action:", `[\`Added To MOPP Database\`](${video()})`)
			.addField("Discord Tag:", `[\`${toAP.user.tag}\`](${video()})`)
			.addField("Members:", `[\`${eek}\`](${video()})`)
			.addField("Role:", `[\`?\`](${video()})`)
			.addField("Attendance points:", `[\`0\`](${video()})`)
			.addField(
				"Join Date:",
				`[\`${month}/${dayofmonth}/${year}\`](${video()})`
			)
			.addField("Recruited:", `[\`0\`](${video()})`)
			.addField("User ID:", `[\`${toAP.id}\`](${video()})`)
			.setFooter("Got any suggestions or concerns? Message Genesis!");
	} else if (facrole == "LS") {
		aws = new Discord.MessageEmbed()
			.setColor(randomItem)
			.setTitle(`LS User Database`)
			.addField("Action:", `[\`Added To LS Database\`](${video()})`)
			.addField("Discord Tag:", `[\`${toAP.user.tag}\`](${video()})`)
			.addField("Members:", `[\`${eek}\`](${video()})`)
			.addField("Role:", `[\`Apprentice\`](${video()})`)
			.addField("Souls:", `[\`0\`](${video()})`)
			.addField(
				"Join Date:",
				`[\`${month}/${dayofmonth}/${year}\`](${video()})`
			)
			.addField("User ID:", `[\`${toAP.id}\`](${video()})`)
			.setFooter("Got any suggestions or concerns? Message Genesis!");
	} else if (facrole == "ISC") {
		aws = new Discord.MessageEmbed()
			.setColor(randomItem)
			.setTitle(`ISC User Database`)
			.addField("Action:", `[\`Added To ISC Database\`](${video()})`)
			.addField("Discord Tag:", `[\`${toAP.user.tag}\`](${video()})`)
			.addField("Members:", `[\`${eek}\`](${video()})`)
			.addField("Role:", `[\`\`](${video()})`)
			.addField("Attendance Points:", `[\`0\`](${video()})`)
			.addField(
				"Join Date:",
				`[\`${month}/${dayofmonth}/${year}\`](${video()})`
			)
			.addField("User ID:", `[\`${toAP.id}\`](${video()})`)
			.setFooter("Got any suggestions or concerns? Message Genesis!");
	} else if (facrole == "TGSS") {
		aws = new Discord.MessageEmbed()
			.setColor(randomItem)
			.setTitle(`TGSS User Database`)
			.addField("Action:", `[\`Added To TGSS Database\`](${video()})`)
			.addField("Discord Tag:", `[\`${toAP.user.tag}\`](${video()})`)
			.addField("Members:", `[\`${eek}\`](${video()})`)
			.addField("Role:", `[\`Newcomer\`](${video()})`)
			.addField("Attendance Points:", `[\`0\`](${video()})`)
			.addField(
				"Join Date:",
				`[\`${month}/${dayofmonth}/${year}\`](${video()})`
			)
			.addField("User ID:", `[\`${toAP.id}\`](${video()})`)
			.setFooter("Got any suggestions or concerns? Message Genesis!");
	}
	message.channel.send({ embeds: [aws] });
	DBTrue();
};

module.exports.help = {
	name: "apuseradd",
	aliases: ["ap:useradd", "useradd", "adduser"],
};
