const { performance } = require("perf_hooks");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const { promisify } = require("util");
const Discord = require("discord.js");
const moment = require("moment-timezone");
const createBar = require("string-progressbar");
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
	if (getDB() == false) {
		return message.channel.send(
			"Another AP command is currently processing. (to prevent glitches and problems)\nPlease try again in 5 seconds!"
		);
	} else {
		DBFalse();
	}
	var t0 = performance.now();

	if (message.author.id !== "759474834534563870") {
		DBTrue();
		return message.channel.send("Only Coolidest may use this command");
	}

	//Custom Async function for forEach loop.
	async function asyncForEach(array, callback) {
		for (let index = 0; index < array.length; index++) {
			await callback(array[index], index, array);
		}
	}

	let b = true;
	let pp;
	let facname;
	let doc;
	let rowsearchletter;
	let roleids;
	let facnumber;
	let text = "";
	let e = 0;

	//[SPR1 + SPR2] Get member who initiated command's voice channel.
	const voiceChannel1 = message.member.voice.channel;
	if (!voiceChannel1) {
		DBTrue();
		return message.channel.send(
			"You must be in a voice channel to use this command!"
		);
	}

	let mms = await message.channel.send(
		"```fix\nCommand Initiated. Please wait...\n```"
	);

	let array = voiceChannel1.members; //[SPR1 + SPR2] Get the members inside of the voice channel.
	let myMap2 = new Map(array); //[SPR1 + SPR2] Turn collection into a MAP
	let myMap = Array.from(myMap2.values()); //[SPR1 + SPR2] Turn MAP into array of values

	const doc2 = new GoogleSpreadsheet("");

	await doc2.useServiceAccountAuth({
		client_email: creds2.client_email,
		private_key: creds2.private_key,
	});

	await doc2.loadInfo();

	if (args.length == 0) {
		DBTrue();
		return message.channel.send(
			"Invalid option. Valid options are:\n\ngatinsir_falcons\ngatinsir_medbay\nviax_falcons_1\nviax_falcons_2"
		);
	}

	let oop = 0;
	let thing = "";
	if (args[0].toLowerCase() == "gatinsir_falcons") {
		oop = 0;
		thing = "gatinsir falcons";
	} else if (args[0].toLowerCase() == "gatinsir_medbay") {
		oop = 974143992;
		thing = "gatinsir medbay";
	} else if (args[0].toLowerCase() == "viax_falcons_1") {
		oop = 493454156;
		thing = "viax falcons 1";
	} else if (args[0].toLowerCase() == "viax_falcons_2") {
		oop = 525033072;
		thing = "viax falcons 2";
	} else if (args[0].toLowerCase() == "wild_hunt") {
		oop = 1920710240;
		thing = "wild_hunt";
	} else {
		DBTrue();
		return message.channel.send(
			"Invalid option. Valid options are:\n\ngatinsir_falcons\ngatinsir_medbay\nviax_falcons_1\nviax_falcons_2\nwild_hunt"
		);
	}
	const sheet2 = doc2.sheetsById[oop];
	const rows = await sheet2.getRows();
	text = text.concat(`${thing}`, "\n");

	await console.log(
		"Starting loop\n=========================================================================="
	);
	var E = 0;

	const start = async () => {
		//[SPR1 + SPR2] 1st loop function
		let bar;
		let i = -1;

		await asyncForEach(myMap, async (val, index_data, arr_data) => {
			//[SPR1 + SPR2] Define all needed variables.
			let id = val.user.id;
			let tag = val.user.tag;
			let toAP = val;
			let total = myMap.length;

			//[SPR1 + SPR2] Function that does all the work
			async function accessSpreadsheet() {
				E = E + 1;
				e = e + 1;
				i = i + 1;
				if (e >= 5) {
					mms.edit(
						`\`\`\`fix\nCommand Initiated. Please wait... User ${E} of ${myMap.length}\n[${bar}]\n=\nWaiting for 5 seconds to prevent API Disconnection\`\`\``
					);
					await new Promise((resolve) => setTimeout(resolve, 5000));
					e = 0;
				}
				let bar2 = await createBar(total, E);
				let bar3 = bar2.splice(",");
				bar = bar3[0];
				mms.edit(
					`\`\`\`fix\nCommand Initiated. Please wait... User ${E} of ${myMap.length}\n[${bar}]\n=\nMessaging ${tag}...\`\`\``
				);

				let heck = rows.length;
				if (heck >= i) {
					let accountusername = rows[i].Username;
					let accountpassword = rows[i].Password;
					await sheet2.loadCells(`A${i + 2}:B${i + 2}`);
					const H2 = sheet2.getCellByA1(`A${i + 2}`);
					const H3 = sheet2.getCellByA1(`B${i + 2}`);
					H2.backgroundColor = { red: 0, green: 1, blue: 0, alpha: 1 };
					H3.backgroundColor = { red: 0, green: 1, blue: 0, alpha: 1 };
					text = text.concat(
						"\n",
						`\`${toAP.user.tag}\` was given account: **${accountusername}**`
					);
					toAP.send(
						`Your alternate account has been decided by AP bot.\n**${thing}**\nROBLOX Username: \n\`${accountusername}\`\n\nROBLOX Password: \n\`${accountpassword}\``
					);
				} else {
					return;
				}
			}

			await accessSpreadsheet(); //[SPR1 + SPR2] Initiate function that does all the work.
		});
		await sheet2.saveUpdatedCells();
	};

	start().then(() => {
		DBTrue();

		//Variable that gets random hex code from myArray list.
		mms.edit("```yaml\nCommand finished.\n```");
		bot.channels.cache.get("709224418064465931").send(`${text}`);
		message.channel.send("```yaml\nCommand finished.\n```");
		console.log(
			"Finished loop\n=========================================================================="
		);
	});
};

module.exports.help = {
	name: "alt",
	aliases: ["alternate", "alts"],
};
