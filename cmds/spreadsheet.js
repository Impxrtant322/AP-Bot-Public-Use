const { promisify } = require("util");
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
	var myArray = ["#000000", "#fafafa", "#616161"];

	var randomItem = myArray[Math.floor(Math.random() * myArray.length)];
	let b = true;
	let pp;
	let aws;
	switch (b) {
		case message.guild.id == "601763897262735370":
			//TBB Server
			aws = new Discord.MessageEmbed()
				.setColor(randomItem)
				.setTitle(`TBB Database / Spreadsheet Link`)
				.setDescription("a")
				.setFooter("Got any suggestions or concerns? Message Genesis!");
			break;
		case message.guild.id == "703040999768981634":
			//GA Server
			aws = new Discord.MessageEmbed()
				.setColor(randomItem)
				.setTitle(`GA Database / Spreadsheet Link`)
				.setDescription("[Here]()")
				.setFooter("Got any suggestions or concerns? Message Genesis!");
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
	message.channel.send({ embeds: [aws] });
};
module.exports.help = {
	name: "spreadsheet",
	aliases: ["sheet", "ss"],
};
