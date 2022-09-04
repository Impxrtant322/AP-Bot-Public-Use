const { GoogleSpreadsheet } = require("google-spreadsheet");
const { performance } = require("perf_hooks");
const Discord = require("discord.js");
const moment = require("moment-timezone");
const clc = require("cli-color");
const {
	getDB,
	DBFalse,
	DBTrue,
	CommandsRanTotal,
	CommandsRanAdd,
} = require("../bot.js");

module.exports.run = async (
	bot,
	message,
	args,
	myVideos,
	creds,
	creds2,
	switcher,
	roler
) => {
	CommandsRanAdd();
	message.channel.sendTyping();
	let DML = Date.now() - message.createdTimestamp;
	const doc2 = new GoogleSpreadsheet("");
	async function Spreadsheet() {
		let t0 = performance.now();
		let K2;
		await doc2
			.useServiceAccountAuth({
				client_email: creds2.client_email,
				private_key: creds2.private_key,
			})
			.catch((err) => {
				console.log(err);
			});
		await doc2.loadInfo();
		const sheet2 = doc2.sheetsById[1531624040];
		await sheet2.loadCells("A2");
		await sheet2.loadCells("B2");
		K2 = await sheet2.getCellByA1(`B2`);
		K2.formula = `=ROW(INDIRECT(ADDRESS(MATCH("Ping",A:A,0),2)))`;
		K2.textFormat = {
			fontSize: 6,
		};
		await sheet2.saveUpdatedCells();
		if (K2.valueType == "errorValue") {
			let p = "ERR";
			return p;
		}

		const rows = await sheet2.getRows({
			limit: 1,
			offset: 0,
		});
		let row = rows[0];

		row["check"] = "ping";
		await sheet2.saveUpdatedCells();
		if (row["check"] == "ping") {
			row["check"] = "";
			await sheet2.saveUpdatedCells();
			let t1 = performance.now();
			let heh = Math.round(((t1 - t0) / 1000) * 1000);
			let ee;
			if (heh < 1500) {
				ee = "[FAST]";
			} else if (heh >= 1500 && heh < 3000) {
				ee = "[NORMAL]";
			} else if (heh >= 3000 && heh < 6000) {
				ee = "[SLOW]";
			} else if (heh >= 6000 && heh < 9000) {
				ee = "[VERY SLOW]";
			} else {
				ee = "[THERE IS DEFINITELY A PROBLEM]";
			}
			let final = `${heh} ms ${ee}`;
			return final;
		}
	}
	async function debounceser() {
		let t0 = performance.now();
		let heck = getDB();
		let t1 = performance.now();
		let heh = Math.round(((t1 - t0) / 1000) * 1000);
		return heh;
	}
	async function roleAPI() {
		let t0 = performance.now();
		let roleinfo = await roler(0, 35, "uwu", true);
		let rankname = roleinfo.FinalRoleName;
		let ranktogive = roleinfo.FinalRoleID;
		let Whitelist = roleinfo.WhitelistBoolean;
		let roleids = roleinfo.RoleList;
		let t1 = performance.now();
		let heh = Math.round(((t1 - t0) / 1000) * 1000);
		return heh;
	}

	let spreadsheetAPI = await Spreadsheet();
	let debounceserr = await debounceser();
	let ree = await roleAPI();
	let myArray = ["#000000", "#fafafa", "#616161"];

	var randomItem = myArray[Math.floor(Math.random() * myArray.length)];
	function video() {
		return myVideos[Math.floor(Math.random() * myVideos.length)];
	}
	let aws = new Discord.MessageEmbed() //Determine what type of message discord should send.
		.setColor(randomItem)
		.setTitle(`Current Status`)
		.addField(
			"Spreadsheet API Response Time:",
			`[\`${spreadsheetAPI}\`](${video()})`
		)
		.addField(
			"Debounce System Response Time:",
			`[\`${debounceserr} ms\`](${video()})`
		)
		.addField("Auto-role Response Time:", `[\`${ree} ms\`](${video()})`)
		.addField(
			"AP Bot Discord Ping:",
			`[\`${Math.round(bot.ws.ping)} ms\`](${video()})`
		)
		.addField("Discord Message Latency:", `[\`${DML} ms\`](${video()})`)
		.addField(
			"Commands ran since AP bot restart:",
			`[\`${CommandsRanTotal()}\`](${video()})`
		);
	message.channel.send({
		embeds: [aws],
	});
};

module.exports.help = {
	name: "status",
	aliases: ["stats"],
};
