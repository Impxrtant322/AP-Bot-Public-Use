const { GoogleSpreadsheet } = require("google-spreadsheet");
const { performance } = require("perf_hooks");
const { promisify } = require("util");
const Discord = require("discord.js");
const clc = require("cli-color");
const moment = require("moment-timezone");
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
	let b = true;
	let o;
	let roleids;
	let doc;
	let facname;
	let rowsearchletter;
	let K2;
	let e;

	if (args.length === 0) {
		let ghrt = new Discord.MessageEmbed()
			.setColor("#000000")
			.setAuthor("Command Help")
			.setTitle("AP:Set")
			.setDescription(
				"Set a user's AP to whatever you want. You can mention the user or use their ID with this command!"
			)
			.addField("Initiation:", "%ap:set")
			.addField(
				"Correct Usage:",
				"%ap:set [user(ID)] <AP>\n\nUser === GuildMemberProperty\nUserID === GuildMemberProperty\nAP: Number"
			)
			.addField("Example:", `%ap:set @${message.author.tag} 1`)
			.addField("Permissions I need:", "Manage Roles, Manage Messages")
			.addField("Permissions you need:", "Manage Roles")
			.addField("Aliases:", '["apset", "set"]')
			.setFooter("Stable");

		DBTrue();
		return message.channel.send({ embeds: [ghrt] });
	}
	let toAP =
		message.guild.members.cache.get(message.mentions.users.first()?.id) ||
		message.guild.members.cache.get(args[0]);
	if (!toAP) {
		DBTrue();
		return message.channel.send("You did not specify a user mention or ID!");
	}
	if (!args[args.length - 1]) {
		DBTrue();
		return message.channel.send(
			"You did not specify what number to set AP to!"
		);
	}
	if (isNaN(args[args.length - 1])) {
		DBTrue();
		return message.channel.send("The specified AP is not a number.");
	}
	let usermember;
	let factionid;
	let facnumber;
	let info = await switcher(message, args, toAP, "SINGLE");

	doc = info.doc;
	facname = info.facname;
	rowsearchletter = info.rowsearchletter;
	toAP = info.toAP;

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
	K2 = await k2value(facname, sheet, message);
	const K22 = await sheet2.getCellByA1("K3");

	const start = async () => {
		//[SPR1 + SPR2] 1st loop function

		//[SPR1 + SPR2] Function that does all the work
		async function accessSpreadsheet() {
			mms.edit(`\`\`\`fix\nEditing ${toAP.user.tag}'s row...\`\`\``);

			//[SPR1] Search for user's info row using this dumb formula
			K2.formula = `=ROW(INDIRECT(ADDRESS(MATCH("${toAP.id}",${rowsearchletter}:${rowsearchletter},0),2)))`;
			K2.textFormat = {
				fontSize: 6,
			}; //[SPR1] For looks
			await sheet.saveUpdatedCells(); //[SPR1] Save that cell.

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
			K22.formula = `=ROW(INDIRECT(ADDRESS(MATCH("${toAP.id}",A:A,0),2)))`;
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
					amount: `${args[args.length - 1]}`,
					action: `set to`,
					apbefore: `${row[`${num3}`]}`,
					apafter: `${num2}`,
					ranktogive: ``,
					rankname: ``,
					discname: `${toAP.user.tag}`,
					byuser: `${message.author.tag}`,
				};
				await sheet2.addRow(row2); //[SPR2] Add row info to spreadsheet 2 as a new row.
			} else {
				//[SPR2] If row WAS found, update following info.
				row4.recent = time;
				row4.amount = args[args.length - 1];
				row4.action = "set to";
				row4.apbefore = `${row[`${num3}`]}`;
				row4.apafter = `${num2}`;
				row4.ranktogive = ``;
				row4.rankname = ``;
				row4.discname = `${toAP.user.tag}`;
				row4.byuser = `${message.author.tag}`;
				await row4.save(); //[SPR2] Save the row.
			}

			//[SPR1] Add current attendance points to args, then save the row.
			if (args[0]) {
				row[`${num3}`] = num2;
				await console.log(
					`{${row4[`UserID`]} || ${row4[`discname`]}} => updated AP. {${
						row4["apbefore"]
					} ==> ${row4["apafter"]}}`
				);
				await row.save();
			}
			o = row[`${num3}`];

			//[SPR1 + SPR2] Deterrmine more values
			let rankname = "";
			let ranktogive = "";
			let Whitelist;
			let iserror;
			var Aplist = row[`${num3}`];

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
						clc.blue(
							`{${row4[`UserID`]} || ${row4[`discname`]}} => updated Role to {${
								row4[`rankname`]
							}}.`
						)
					);
					await message.channel.send(
						`${toAP} has been \`promoted to\` ${row4.rankname}!`
					);
				}
			} else {
				console.log(clc.blue("Auto-role disabled"));
				if (iserror == false) {
					message.channel.send(
						`\`${toAP.user.tag}\` had a whitelisted role, and was not auto roled.`
					);
				}
			}
		}

		await accessSpreadsheet(); //[SPR1 + SPR2] Initiate function that does all the work.
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
			.addField("Action:", `[\`Set\`](${video()})`)
			.addField("Amount:", `[\`${args[args.length - 1]}\`](${video()})`)
			.addField("To:", `[\`${toAP.user.tag}\`](${video()})`)
			.addField("Now Has:", `[\`${o}\`](${video()}) Attendance Points.`)
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
	name: "apset",
	aliases: ["ap:set", "set"],
};
