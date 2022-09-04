const {
	getDB,
	DBFalse,
	DBTrue,
	CommandsRanTotal,
	CommandsRanAdd,
} = require("../bot.js");

module.exports.run = async (bot, message, args) => {
	CommandsRanAdd();
	let args2 = args.splice(1);
	var args3 = args2.join(" ");
	let dev = "251196062725963776";
	let user = message.author.id;
	message.delete();
	if (user !== dev) {
		return message.channel.send("Only developer may use this command");
	}

	bot.channels.cache
		.get(args[0])
		.send(`${args3}`)
		.catch((error) => message.channel.send(`**Error:** ${error.message}`));
};

module.exports.help = {
	name: "announce",
	aliases: ["message"],
};
