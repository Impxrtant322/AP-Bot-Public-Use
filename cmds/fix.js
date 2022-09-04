const { GoogleSpreadsheet } = require("google-spreadsheet");
const { performance } = require("perf_hooks");
const Discord = require("discord.js");
const moment = require("moment-timezone");
const clc = require("cli-color");
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
	switchere,
	roler
) => {
	if (message.author.id !== "251196062725963776")
		return message.channel.send("Developer Only Command");
	CommandsRanAdd();
	async function asyncForEach(array, callback) {
		for (let index = 0; index < array.length; index++) {
			await callback(array[index], index, array);
		}
	}
	var t0 = performance.now();
	let b = true;
	let o;
	let roleids;
	let doc;
	let facname;
	let rowsearchletter;
	let K2;
	let e = 0;

	async function switcher() {
		switch (b) {
			case message.guild.id == "601763897262735370":
				//VO Server
				facname = "VO";
				rowsearchletter = "H";
				doc = new GoogleSpreadsheet("");
				break;
			case message.guild.id == "701473055830048808":
				//MOPP Server
				facname = "MOPP";
				rowsearchletter = "H";
				doc = new GoogleSpreadsheet("");
				break;
			case message.guild.id == "677246811911487488":
				//LS Server
				facname = "LS";
				rowsearchletter = "G";
				doc = new GoogleSpreadsheet("");
				break;
			case message.guild.id == "703040999768981634":
				//GA Server
				throw new Error("");
				break;
			case message.guild.id == "757370229587181640":
				//ISC server
				facname = "ISC";
				rowsearchletter = "H";
				doc = new GoogleSpreadsheet("");
				break;
			case message.guild.id == "802881932232753175":
				//TGSS server
				facname = "TGSS";
				rowsearchletter = "H";
				doc = new GoogleSpreadsheet("");
				break;
			case message.guild.id == "617477144569708554":
				//UCG server
				facname = "UCG";
				rowsearchletter = "H";
				doc = new GoogleSpreadsheet("");
				break;

			default:
				message.channel.send(
					"Your server is not authorized to use this command. Is this an error? Message Genesis#8339"
				);
				throw new Error("no permission to use - any Server");
				break;
		}
	}
	switcher().catch((err) => {
		console.log(err);
		return;
	});

	let thread = await message.channel.threads.create({
		name: "ap-bot-processor",
		autoArchiveDuration: 60,
		reason: "Command Initiated. Please Wait...",
	});
	thread.join();
	let mms = await thread.send("```fix\nCommand Initiated. Please wait...\n```");

	//[SPR1 + SPR2] Link to both spreadsheets needed
	const doc2 = new GoogleSpreadsheet("");

	//[SPR1 + SPR2] Login to spreadsheets using service account
	await doc
		.useServiceAccountAuth({
			client_email: creds.client_email,
			private_key: creds.private_key,
		})
		.catch((err) => {
			console.log(err);
		});
	await doc2
		.useServiceAccountAuth({
			client_email: creds2.client_email,
			private_key: creds2.private_key,
		})
		.catch((err) => {
			console.log(err);
		});

	//[SPR1 + SPR2] Load all sheet info from spreadsheets
	await doc.loadInfo();
	await doc2.loadInfo();

	//[SPR1 + SPR2] Access the first sheet of the spreadsheets.
	const sheet = doc.sheetsById[0];
	const sheet2 = doc2.sheetsById[0];

	//[SPR1 + SPR2] Load cells I3 and K3 from spreadsheets.
	await sheet.loadCells("I3");
	await sheet2.loadCells("K3");

	//[SPR1 + SPR2] Get cell info from I3 and K3 from both spreadsheets
	if (facname == "VO") {
		K2 = await sheet.getCellByA1(`I3`);
	} else if (facname == "GA") {
		K2 = await sheet.getCellByA1(`I3`);
	} else if (facname == "MOPP") {
		K2 = await sheet.getCellByA1(`I3`);
	} else if (facname == "LS") {
		K2 = await sheet.getCellByA1(`I3`);
	} else if (facname == "ISC") {
		K2 = await sheet.getCellByA1(`I3`);
	} else if (facname == "TGSS") {
		K2 = await sheet.getCellByA1(`I3`);
	} else {
		return message.channel.send(
			"There was an error determining I3 and K3 values. Message Genesis#8339."
		);
	}
	const K22 = await sheet2.getCellByA1("K3");

	let toAP2 = await message.guild.members.fetch();
	let myMap2 = new Map(toAP2);
	let myMap = Array.from(myMap2.values());

	var E = 0;

	const start = async () => {
		//[SPR1 + SPR2] 1st loop function
		let bar;
		await asyncForEach(myMap, async (val, index_data, arr_data) => {
			let id = val.user.id;
			let tag = val.user.tag;
			let toAP = val;
			let total = myMap.length;
			//[SPR1 + SPR2] Function that does all the work
			async function accessSpreadsheet() {
				E = E + 1;
				e = e + 1;
				if (e >= 5) {
					mms.edit(
						`\`\`\`fix\nUser ${E} of ${myMap.length}\n[${bar}]\n=\nWaiting for 5 seconds to prevent API Disconnection\`\`\``
					);
					await new Promise((resolve) => setTimeout(resolve, 5000));
					e = 0;
				}
				let bar2 = await createBar(total, E);
				let bar3 = bar2.splice(",");
				bar = bar3[0];
				mms.edit(
					`\`\`\`fix\nUser ${E} of ${myMap.length}\n[${bar}]\n=\nEditing ${tag}'s row...\`\`\``
				);

				//[SPR1] Search for user's info row using this dumb formula
				K2.formula = `=ROW(INDIRECT(ADDRESS(MATCH("${toAP.id}",${rowsearchletter}:${rowsearchletter},0),2)))`;
				K2.textFormat = {
					fontSize: 6,
				}; //[SPR1] For looks
				await sheet.saveUpdatedCells(); //[SPR1] Save that cell.

				//[SPR1 + SPR2] If row wasnt found then return with message that they weren't on the spreadsheet.
				if (K2.valueType == "errorValue") {
					return;
				}

				//[SPR1] If row WAS found, then get that row's info
				let offsetvalue = K2.value - 2;
				const rows = await sheet.getRows({
					limit: 1,
					offset: offsetvalue,
				});

				let row = rows[0];

				//[SPR2] Search for user's info row using this formula again
				K22.formula = `=ROW(INDIRECT(ADDRESS(MATCH("${toAP.id}",A:A,0),2)))`;
				K22.textFormat = {
					fontSize: 6,
				}; //[SPR2] For looks
				await sheet2.saveUpdatedCells(); //[SPR2] Save that cell
				var time = moment().tz("America/New_York").format("M/D/YYYY, h:mm a z"); //[SPR2] Get date of when command was initiated.

				//[SPR1] Turn row's attendance point column and args 0 after command into numbers
				let num3;
				if (facname == "VO") {
					num3 = "Attendance Points";
					facnumber = 0;
				} else if (facname == "GA") {
					num3 = "Attendance Points";
				} else if (facname == "MOPP") {
					num3 = "Attendance points";
					facnumber = 2;
				} else if (facname == "LS") {
					num3 = "Souls (AP)";
					facnumber = 1;
				} else if (facname == "ISC") {
					num3 = "Attendance Points";
					facnumber = 3;
				} else if (facname == "TGSS") {
					num3 = "Attendance Points";
					facnumber = 4;
				} else {
					return message.channel.send(
						"There was an error determining Auto Role ID. Message Genesis#8339."
					);
				}
				let num1 = await Number(row[`${num3}`]);
				let num2 = await Number(args[args.length - 1]);

				//[SPR2] If row WAS found, then get that row's info
				let offsetvalue2 = K22.value - 2;
				const rows3 = await sheet2.getRows({
					limit: 1,
					offset: offsetvalue2,
				});

				let row4 = rows3[0];

				//[SPR2] If row WASNT found, implement a new row with the following info.
				if (K22.valueType == "errorValue") {
					const row2 = {
						UserID: `${toAP.id}`,
						recent: `${time}`,
						amount: `${args[1]}`,
						action: `added to`,
						apbefore: `${row[`${num3}`]}`,
						apafter: `${num1 + num2}`,
						ranktogive: ``,
						rankname: ``,
						discname: `${toAP.user.tag}`,
						byuser: `${toAP.user.tag}`,
					};
					await sheet2.addRow(row2); //[SPR2] Add row info to spreadsheet 2 as a new row.
				} else {
					//[SPR2] If row WAS found, update following info.
					row4.recent = time;
					row4.amount = args[1];
					row4.action = "added to";
					row4.apbefore = `${row[`${num3}`]}`;
					row4.apafter = `${num1 + num2}`;
					row4.ranktogive = ``;
					row4.rankname = ``;
					row4.discname = `${toAP.user.tag}`;
					row4.byuser = `${toAP.user.tag}`;
					await row4.save(); //[SPR2] Save the row.
				}

				//[SPR1 + SPR2] Deterrmine more values
				var Aplist = num1;

				let rankname;
				let ranktogive;
				let Whitelist;

				if (Number.isInteger(facnumber) == true) {
					let roleinfo = await roler(facnumber, Aplist, toAP, false);

					rankname = roleinfo.FinalRoleName;
					ranktogive = roleinfo.FinalRoleID;
					Whitelist = roleinfo.WhitelistBoolean;
					roleids = roleinfo.RoleList;
				} else {
					message.channel.send(`${facname} Auto-Role does not exist.`);
				}
				if (Whitelist == false) {
					//[SPR2] Update row's rank to give and rank name columns to their determined value.
					row4.ranktogive = `${ranktogive}`;
					row4.rankname = `${rankname}`;
					await row4.save(); //[SPR2] Save that row.

					//[SPR1 + SPR2] Determine if user already has the rank that is supposed to be given.
					if (!toAP.roles.cache.has(ranktogive[0])) {
						//[SPR1 + SPR2] Loop #2, which determines which role not to remove from user.
						for (var i = 0; i < roleids.length; i++) {
							if (roleids[i] === ranktogive[0]) {
								roleids.splice(i, 1);
							}
						}

						//[SPR1 + SPR2] Remove roles from user, excluding the one determined by loop above.
						await toAP.roles.remove(roleids);

						await toAP.roles.add(ranktogive).catch((err) => {
							message.channel.send(
								`Congratulations ${toAP.user.tag}, you have made it to Sheriff!`
							);
						}); //[SPR1 + SPR2] Add rank determined by Switch-Case-Break function.

						row.Role = `${row4.rankname}`; //[SPR1 + SPR2] Change spreadsheet rank to rank determined above.
						await row.save(); //SPR[1] Save the row.
					}
				} else {
					//[SPR1 + SPR2] If user DOES have certain ranks, then do not do above loops.
					console.log("role disabled");
				}
			}
			await accessSpreadsheet(); //[SPR1 + SPR2] Initiate function that does all the work.
		});
	};

	start().then(() => {
		//A list of Hex Codes for discord message embed coloring.
		var myArray = ["#000000", "#fafafa", "#616161"];

		//A function that gets a random link.
		function video() {
			return myVideos[Math.floor(Math.random() * myVideos.length)];
		}

		//Variable that gets random hex code from myArray list.
		var randomItem = myArray[Math.floor(Math.random() * myArray.length)];
		var t1 = performance.now();
		let aws = new Discord.MessageEmbed() //Determine what type of message discord should send.
			.setColor(randomItem)
			.setTitle(`Attendance Points`)
			.addField("Action:", `[\`Fixed roles of:\`](${video()})`)
			.addField("To:", `[\`${myMap.length} people\`](${video()})`)
			.setFooter(
				`Time: ${
					Math.round(((t1 - t0) / 1000) * 1000) / 1000
				} sec • Use %recent to see your most recent AP change!`
			);
		message.channel.send({
			embeds: [aws],
		}); //Send the embed to the channel.
		thread.delete();
	});
};

module.exports.help = {
	name: "fix",
	aliases: [],
};
