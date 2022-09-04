const Discord = require("discord.js");
const {
	getDB,
	DBFalse,
	DBTrue,
	CommandsRanTotal,
	CommandsRanAdd,
} = require("../bot.js");

module.exports.run = async (bot, message, args) => {
	CommandsRanAdd();

	let embed = new Discord.MessageEmbed()
		.setTitle("AP Admin Commands")
		.setColor("#00ffee")
		.addField("%ap:add <@player> [AP]", `Adds AP to a user.`)
		.addField(
			"%ap:addto <@player> <@player> [AP]",
			`Adds AP to multiple users.`
		)
		.addField("%ap:remove <@player> [AP]", `Removes a user's AP.`)
		.addField(
			"%ap:removefrom <@player> <@player> [AP]",
			`Removes AP from multiple users.`
		)
		.addField("%vc:add [AP]", `Adds AP to all users in a VC.`)
		.addField("%vc:remove [AP]", "Removes AP from all users in a VC.")
		.addField("%ap:useradd", "Add a user to the database.");
	let embed2 = new Discord.MessageEmbed()
		.setTitle("Recruited Admin Commands")
		.setColor("#00ffee")
		.addField(
			"%recruitedadd <@player> [RP]",
			"Add recruitment points to a user."
		)
		.addField(
			"%recruitedremove <@player> [RP]",
			"Remove recruitment points from a user."
		);
	let embed3 = new Discord.MessageEmbed()
		.setTitle("Public Commands")
		.setColor("#00ffee")
		.addField("%info <@player>", "Check the TBB info of a person.")
		.addField(
			"%systeminfo <system name>",
			"Check the info of a starscape system."
		)
		.addField("%systemadd", "Follow prompt in DMs.")
		.addField("%recent", "Wanna know if you got AP recently? Use this command.")
		.addField("%credits", "Bot creator and credits.")
		.addField(
			"%workingon",
			"Curious to what @Genesis#8339 is working on? Well find out!"
		)
		.addField("%ss", "Link to the spreadsheet!")
		.addField("%alias", "See all the aliases of all commands.")
		.addField("%status", "See the status of AP bot.");
	message.author.send({ embeds: [embed, embed2, embed3] });
	message.channel.send("sucessfully sent all commands through DM's!");
};

module.exports.help = {
	name: "help",
	aliases: [],
};
