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
		.setTitle("AP Admin Aliases")
		.setColor("#00ffee")
		.addField("%ap:add", `%apadd, %add`)
		.addField("%ap:addto", `%apaddto, %addto`)
		.addField("%ap:remove", `%apremove, %remove`)
		.addField("%ap:removefrom", `%apremovefrom, %removefrom`)
		.addField("%vc:add", `%vcadd, %massadd`)
		.addField("%vc:remove", "%vcremove, %massremove")
		.addField("%ap:useradd", "%apuseradd, %useradd, %adduser");
	let embed2 = new Discord.MessageEmbed()
		.setTitle("Recruited Admin Aliases")
		.setColor("#00ffee")
		.addField("%recruitedadd", "%recruited:add, %r:add, %radd")
		.addField("%recruitedremove", "%recruited:remove, %r:remove, %rremove");
	let embed3 = new Discord.MessageEmbed()
		.setTitle("Public Aliases")
		.setColor("#00ffee")
		.addField("%info", "%ap, %i")
		.addField("%systeminfo", "%sysinfo, %system:info, %find, %sinfo")
		.addField("%systemadd", "%sysadd, %system:add, %sys:add")
		.addField(
			"%recent",
			"%history, %ap:recent, %ap:history, %aprecent, %aphistory"
		)
		.addField("%credits", "%creds")
		.addField("%workingon", "%whatsnext")
		.addField("%ss", "%sheet, %spreadsheet")
		.addField("%alias", "%aliases, %aliaslist, %aliaseslist");
	message.author.send({ embeds: [embed, embed2, embed3] });
	message.channel.send("sucessfully sent all aliases through DM's!");
};

module.exports.help = {
	name: "aliases",
	aliases: ["alias", "aliaslist", "aliaseslist"],
};
