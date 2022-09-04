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
		return message.channel.send("Developer Only Command");
	let args2 = args.join(" ");

	message.channel.send(`${args2}`);
	message.delete({ timeout: 100 });
};

module.exports.help = {
	name: "say",
	aliases: [],
};
