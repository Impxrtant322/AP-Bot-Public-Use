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
	let aws = new Discord.MessageEmbed()
		.setColor(randomItem)
		.setTitle("Curious?")
		.addField("I'm working on:", "1. Literally nothing.")
		.setFooter("Got any suggestions or concerns? Message Genesis!");
	message.channel.send({ embeds: [aws] });
};

module.exports.help = {
	name: "workingon",
	aliases: ["whatsnext"],
};
