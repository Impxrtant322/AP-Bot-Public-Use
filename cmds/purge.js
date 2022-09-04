const {
	getDB,
	DBFalse,
	DBTrue,
	CommandsRanTotal,
	CommandsRanAdd,
} = require("../bot.js");

module.exports.run = async (bot, message, args) => {
	CommandsRanAdd();
	let b = true;
	const oof = parseInt(args[0]);
	if (oof == 0)
		return message.channel.send("Invalid number of messages to purge.");
	let pp;

	switch (b) {
		case message.guild.id == "601763897262735370":
			//TBB Server
			if (message.author.id !== "251196062725963776") {
				if (!message.member.permissions.has("MANAGE_MESSAGES"))
					return message.channel.send(
						"You do not have permission to use this command."
					);
			}
			break;
		case message.guild.id == "703040999768981634":
			//GA Server
			pp = 1;
			message.channel.send(
				"TBB Bot is currently in the testing phase for GA integration. The only command functional will be %ap:add and %info."
			);
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
	if (isNaN(oof))
		return message.channel.send(
			"**Error:** Invalid Number of messages to purge."
		);
	if (oof > 50)
		return message.channel.send(
			"**Error:** I cannot delete that many messages at once! (max: 50)"
		);

	await message.delete();

	message.channel
		.bulkDelete(oof)
		.then((messages) =>
			message.channel.send(
				`**Successfully deleted \`${messages.size}/${args[0]}\` messages!**`
			)
		)
		.catch((error) => message.channel.send(`**Error:** ${error.message}`));
};

module.exports.help = {
	name: "purge",
	aliases: [],
};
