const { GoogleSpreadsheet } = require("google-spreadsheet");
const { performance } = require("perf_hooks");
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
	roler,
	addtodatabase,
	k2value,
	autorolevalues
) => {
	CommandsRanAdd();
	if (getDB() == false) {
		return message.channel.send(
			"If this message is showing, your command could not be processed because either:\n1. Another AP command in any server is currently running.\nor\n2.There was an error in an AP command that the bot did not account for, and therefore caused this error. (if so, the system will reset in at most 2 minutes.)"
		);
	} else {
		DBFalse();
	}
	var t0 = performance.now();
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
	let e = 0;

	if (args.length === 0) {
		let ghrt = new Discord.MessageEmbed()
			.setColor("#000000")
			.setAuthor("Command Help")
			.setTitle("AP:Addto")
			.setDescription(
				"Add AP to an existing array of users. You can ONLY mention users this command! (User IDs do not work)"
			)
			.addField("Initiation:", "%ap:addto")
			.addField(
				"Correct Usage:",
				"%ap:addto [list of users] <AP>\n\nUsers === GuildMemberProperty\nAP: Number"
			)
			.addField(
				"Example:",
				`%ap:addto @${message.author.tag} @${message.author.tag} @${message.author.tag} 1`
			)
			.addField("Permissions I need:", "Manage Roles, Manage Messages")
			.addField("Permissions you need:", "Manage Roles")
			.addField("Aliases:", '["apaddto", "addto"]')
			.setFooter("Stable");

		DBTrue();
		return message.channel.send({ embeds: [ghrt] });
	}

	let toAP2 =
		message.mentions.members.size != 0 ? message.mentions.members : false;
	if (!toAP2) {
		DBTrue();
		return message.channel.send(
			"There was no mentioned user.\nOR\nUser ID's do not work with this command. Try wrapping the IDs like this: <@ID>!"
		);
	}
	let myMap2 = new Map(toAP2);
	let myMap = Array.from(myMap2.values());
	if (isNaN(args[args.length - 1])) {
		DBTrue();
		return message.channel.send("The specified AP is not a number.");
	}
	let thread = await message.channel.threads.create({
		name: "ap-bot-processor",
		autoArchiveDuration: 60,
		reason: "Command Initiated. Please Wait...",
	});
	let mms = await thread.send("```fix\nCommand Initiated. Please wait...\n```");
	//[SPR1 + SPR2] Link to both spreadsheets needed
	const doc2 = new GoogleSpreadsheet("");

	//[SPR1 + SPR2] Login to spreadsheets using service account
	await doc2.useServiceAccountAuth({
		client_email: creds2.client_email,
		private_key: creds2.private_key,
	});

	await doc2.loadInfo();
	const sheet2 = doc2.sheetsById[0];
	await sheet2.loadCells("K3");
	const K22 = await sheet2.getCellByA1("K3");
	await console.log(
		"Starting loop\n=========================================================================="
	);
	var E = 0;

	const start = async () => {
		//[SPR1 + SPR2] 1st loop function
		let bar;

		await asyncForEach(myMap, async (val, index_data, arr_data) => {
			let info = await switcher(message, args, val, "LOOP");

			doc = info.doc;
			facname = info.facname;
			let toAP = info.toAP;
			rowsearchletter = info.rowsearchletter;
			let gafallback = info.gafallback;
			let total = myMap.length;
			let id = val.user.id;
			let tag = val.user.tag;

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

			if (gafallback == true) return;

			//[SPR1 + SPR2] Login to spreadsheets using service account
			await doc.useServiceAccountAuth({
				client_email: creds.client_email,
				private_key: creds.private_key,
			});

			//[SPR1 + SPR2] Load all sheet info from spreadsheets
			await doc.loadInfo();

			//[SPR1 + SPR2] Access the first sheet of the spreadsheets.
			const sheet = doc.sheetsById[0];

			//[SPR1 + SPR2] Load cells I3 and K3 from spreadsheets.
			await sheet.loadCells("I3");

			//[SPR1 + SPR2] Get cell info from I3 and K3 from both spreadsheets
			const K2 = await sheet.getCellByA1("I3");

			//[SPR1 + SPR2] Function that does all the work
			async function accessSpreadsheet() {
				await console.log(`Starting {${id} || ${tag}}'s Profiling.`);

				//[SPR1] Search for user's info row using this dumb formula
				K2.formula = `=ROW(INDIRECT(ADDRESS(MATCH("${id}",${rowsearchletter}:${rowsearchletter},0),2)))`;
				K2.textFormat = {
					fontSize: 6,
				}; //[SPR1] For looks
				await sheet.saveUpdatedCells(); //[SPR1] Save that cell.
				await console.log(`I3 cell value: ${K2.value}`);

				//[SPR1 + SPR2] If row wasnt found then return with message that they weren't on the spreadsheet.
				if (K2.valueType == "errorValue") {
					let info3 = await addtodatabase(toAP, message);

					let row = info3.row;
					let facrole = info3.facrole;

					await sheet.addRow(row, { insert: true });
					message.channel.send(
						`\`${toAP.user.tag}\` wasn't on the database, however I added them automatically and gave them the AP.`
					);
					K2.formula = `=ROW(INDIRECT(ADDRESS(MATCH("${toAP.id}",${rowsearchletter}:${rowsearchletter},0),2)))`;
					K2.textFormat = {
						fontSize: 6,
					}; //[SPR1] For looks
					await sheet.saveUpdatedCells(); //[SPR1] Save that cell.
					await console.log(`I3 cell value: ${K2.value}`);
				}

				//[SPR1] If row WAS found, then get that row's info
				let offsetvalue = K2.value - 2;
				const rows = await sheet.getRows({
					limit: 1,
					offset: offsetvalue,
				});

				let row = rows[0];

				//[SPR2] Search for user's info row using this formula again
				K22.formula = `=ROW(INDIRECT(ADDRESS(MATCH("${id}",A:A,0),2)))`;
				K22.textFormat = {
					fontSize: 6,
				}; //[SPR2] For looks
				await sheet2.saveUpdatedCells(); //[SPR2] Save that cell
				var time = moment().tz("America/New_York").format("M/D/YYYY, h:mm a z"); //[SPR2] Get date of when command was initiated.

				//[SPR1] Turn row's attendance point column and args 0 after command into numbers
				let num3;

				let info4 = await autorolevalues(facname, message);

				num3 = info4.num3;
				facnumber = info4.facnumber;

				let num1 = await Number(row[num3]);
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
						UserID: `${id}`,
						recent: `${time}`,
						amount: `${args[args.length - 1]}`,
						action: `added to`,
						apbefore: `${row[num3]}`,
						apafter: `${num1 + num2}`,
						ranktogive: ``,
						rankname: ``,
						discname: `${tag}`,
						byuser: `${message.author.tag}`,
					};
					await sheet2.addRow(row2); //[SPR2] Add row info to spreadsheet 2 as a new row.
				} else {
					//[SPR2] If row WAS found, update following info.
					row4.recent = time;
					row4.amount = args[args.length - 1];
					row4.action = "added to";
					row4.apbefore = `${row[num3]}`;
					row4.apafter = `${num1 + num2}`;
					row4.ranktogive = ``;
					row4.rankname = ``;
					row4.discname = `${tag}`;
					row4.byuser = `${message.author.tag}`;
					await row4.save(); //[SPR2] Save the row.
				}

				//[SPR1] Add current attendance points to args, then save the row.
				if (!isNaN(args[args.length - 1])) {
					row[num3] = num1 += num2;
					await console.log(
						`{${row4[`UserID`]} || ${row4[`discname`]}} => updated AP. {${
							row4["apbefore"]
						} + ${args[args.length - 1]} = ${row4["apafter"]}}`
					);
					await row.save();
				}

				//[SPR1 + SPR2] Deterrmine more values
				let rankname;
				let ranktogive;
				let Whitelist;
				let iserror;
				let Aplist = row[num3];

				if (Number.isInteger(facnumber) == true) {
					let roleinfo = await roler(facnumber, Aplist, toAP, false, message);

					rankname = roleinfo.FinalRoleName;
					ranktogive = roleinfo.FinalRoleID;
					Whitelist = roleinfo.WhitelistBoolean;
					roleids = roleinfo.RoleList;
					iserror = roleinfo.errore;
					if (iserror == true) {
						Whitelist = true;
					}
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
								`Congratulations ${toAP}, you have made it to Sheriff!`
							);
						}); //[SPR1 + SPR2] Add rank determined by Switch-Case-Break function.

						row.Role = `${row4.rankname}`; //[SPR1 + SPR2] Change spreadsheet rank to rank determined above.
						await row.save(); //SPR[1] Save the row.

						await console.log(
							`{${row4[`UserID`]} || ${row4[`discname`]}} => updated Role to {${
								row4[`rankname`]
							}}.`
						);
						await message.channel.send(
							`${toAP} has been \`promoted to\` ${row4.rankname}!`
						);
					}
				} else {
					//[SPR1 + SPR2] If user DOES have certain ranks, then do not do above loops.
					console.log("role disabled");
					if (iserror == false) {
						message.channel.send(
							`\`${toAP.user.tag}\` had a whitelisted role, and was not auto roled.`
						);
					}
				}
				await console.log(
					`{${id} || ${tag}} Finished Profiling.\n==========================================================================`
				); //[SPR1 + SPR2] Finish loop for object.
			}

			await accessSpreadsheet(); //[SPR1 + SPR2] Initiate function that does all the work.
		});
	};

	start().then(() => {
		DBTrue();

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
			.addField("Action:", `[\`Mass Added\`](${video()})`)
			.addField("Amount:", `[\`${args[args.length - 1]}\`](${video()})`)
			.addField("To Users:", `${myMap}`)
			.setFooter(
				`Time: ${
					Math.round(((t1 - t0) / 1000) * 1000) / 1000
				} sec • Use %recent to see your most recent AP change!`
			);
		message.channel.send({
			embeds: [aws],
		}); //Send the embed to the channel.
		message.channel.send("```yaml\nCommand finished.\n```");
		console.log(
			"Finished loop\n=========================================================================="
		);
		thread.delete();
	});
};

module.exports.help = {
	name: "apaddto",
	aliases: ["ap:addto", "addto"],
};
