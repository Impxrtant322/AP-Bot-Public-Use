const hastebin = require("hastebin-gen");
const fs = require("fs");
const moment = require("moment-timezone");
const {
	getDB,
	DBFalse,
	DBTrue,
	CommandsRanTotal,
	CommandsRanAdd,
} = require("../bot.js");

module.exports.run = async (bot, message, args) => {
	CommandsRanAdd();
	if (message.author.id !== "251196062725963776")
		return message.channel.send("This command is for developer only!");
	async function messagesgetter(channel, limit) {
		message.channel.send(
			"Processing Request and fetching messages! (could take a few minutes)"
		);
		fs.truncate("./file.txt", 0, function () {
			console.log("done");
		});
		const sum_messages = [];
		let last_id;

		while (true) {
			const options = { limit: 100 };
			if (last_id) {
				options.before = last_id;
			}

			const messages = await channel.messages.fetch(options);
			sum_messages.push(...messages.array());
			last_id = messages.last().id;

			if (messages.size != 100 || sum_messages.length >= limit) {
				break;
			}
		}

		return sum_messages;
	}
	let time = moment().tz("America/New_York").format("M/D/YYYY, h_mm a z"); //[SPR2] Get date of when command was initiated.
	time = "Backup_" + time + ".txt";
	if (!args[0]) return message.channel.send("Need channel ID to back up!");
	const thechannel = await bot.channels.fetch(args[0]);
	if (!thechannel)
		return message.channel.send("Error getting channel. Make sure its ID!");
	if (!args[1])
		return message.channel.send("Need amount of messages to grab! (In 100's)");
	if (!args[2])
		return message.channel.send("Need type of messages! (all / embeds)");
	let array = await messagesgetter(thechannel, args[1]);
	let i = "";
	if (args[2].toLowerCase() == "all") {
		array.forEach((element) => {
			i = i.concat("", `${element.author.tag}`);
			i = i.concat(":\n", `"${element.content}"`);

			i = i.concat("\nEmbeds:", "");
			element.attachments.forEach((hehe) => {
				i = i.concat("\n", `${hehe.url}`);
			});
			element.embeds.forEach((hehe) => {
				i = i.concat("\n", `${hehe.url}`);
			});
			i = i.concat("\n\n\n", "");
		});
		let haste = await hastebin(i, { extension: "txt" }).catch((err) => {
			haste = `[${err}]`;
		});
		fs.writeFile("./file.txt", `${i}`, function () {
			console.log("done");
		});
		message.channel
			.send(
				`This is not a permanent link! Make sure to download it if you want to keep permanently.\nOnline: --> ${haste}\nDownload:`,
				{
					files: [
						{
							attachment: "./file.txt",
							name: `${time}`,
						},
					],
				}
			)
			.catch(console.error);
	} else if (args[2].toLowerCase() == "embeds") {
		array.forEach((element) => {
			element.attachments.forEach((hehe) => {
				i = i.concat("\n", `${hehe.url}`);
			});
			element.embeds.forEach((hehe) => {
				i = i.concat("\n", `${hehe.url}`);
			});
		});
		let haste = await hastebin(i, { extension: "txt" }).catch((err) => {
			haste = `[${err}]`;
		});
		fs.writeFile("./file.txt", `${i}`, function () {
			console.log("done");
		});
		message.channel
			.send(
				`This is not a permanent link! Make sure to download it if you want to keep permanently.\nOnline: --> ${haste}\nDownload:`,
				{
					files: [
						{
							attachment: "./file.txt",
							name: `${time}`,
						},
					],
				}
			)
			.catch(console.error);
	} else {
		return message.channel.send("Did not get correct type: all / embeds");
	}
};

module.exports.help = {
	name: "backup",
	aliases: [],
};
