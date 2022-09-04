const {
	getDB,
	DBFalse,
	DBTrue,
	CommandsRanTotal,
	CommandsRanAdd,
} = require("../bot.js");

module.exports.run = async (bot, message, args) => {
	CommandsRanAdd();
	let args2 = args[2];
	let dev = "251196062725963776";
	let user = message.author.id;
	let messageid = args[1];
	message.delete();
	if (user !== dev) {
		return message.channel.send("Only developer may use this command");
	}

	let channel = await bot.channels.fetch(args[0]);
	let message2 = await channel.messages.fetch(messageid);
	message2
		.react(`${args2}`)
		.catch((error) => message.channel.send(`**Error:** ${error.message}`));
};

module.exports.help = {
	name: "reactor",
	aliases: [],
};
