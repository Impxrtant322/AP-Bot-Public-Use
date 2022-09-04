const Discord = require("discord.js");
const {
	getDB,
	DBFalse,
	DBTrue,
	CommandsRanTotal,
	CommandsRanAdd,
} = require("../bot.js");

module.exports.run = async (bot, message, myVideos) => {
	CommandsRanAdd();

	var myArray = ["#000000", "#fafafa", "#616161"];

	var randomItem = myArray[Math.floor(Math.random() * myArray.length)];

	const heee = await bot.guilds.fetch(`601763897262735370`);
	thansar = await heee.members.fetch(`251196062725963776`);
	jakor = await heee.members.fetch(`506566700137840642`);
	carti = await heee.members.fetch(`759474834534563870`);
	kido = await heee.members.fetch(`371462175082020864`);
	//demo = await heee.members.fetch(`344454786508390411`);

	function video() {
		return myVideos[Math.floor(Math.random() * myVideos.length)];
	}

	let aws = new Discord.MessageEmbed()
		.setColor(randomItem)
		.setTitle(`Credits`)
		.addField("Main Developer:", `[${thansar}](${video()})`)
		.addField("Main Idea:", `[${jakor}](${video()})`)
		.addField(
			"Recommendations:",
			`[${kido}](${video()}), [${carti}](${video()}) & DemonicTheMaster`
		)
		.setFooter("Got any suggestions or concerns? Message Genesis!");
	message.channel.send({ embeds: [aws] });
};

module.exports.help = {
	name: "credits",
	aliases: ["creds"],
};
