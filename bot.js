const botSettings = require("./botsettings.json");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const Discord = require("discord.js");
const fs = require("fs");
const prefix = botSettings.prefix;
const creds = require("./client_secret.json");
const creds2 = require("./client_secret2.json");
const { performance } = require("perf_hooks");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { token } = require("./botsettings.json");
const noblox = require("noblox.js");
let intent = Discord.Intents.FLAGS;

const bot = new Discord.Client({
	disableEveryone: false,
	intents: [
		intent.GUILDS,
		intent.GUILD_MEMBERS,
		intent.GUILD_MESSAGES,
		intent.DIRECT_MESSAGES,
		intent.GUILD_MESSAGE_REACTIONS,
	],
});
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.slashcommands = new Discord.Collection();
let debounce = true;
let commandsran = 0;

exports.getDB = function () {
	return debounce;
};

exports.DBFalse = function () {
	debounce = false;
};

exports.DBTrue = function () {
	debounce = true;
};

exports.CommandsRanTotal = function () {
	return commandsran;
};

exports.CommandsRanAdd = function () {
	commandsran = commandsran + 1;
};

fs.readdir("./cmds/", (err, files) => {
	if (err) console.error(err);

	let jsfiles = files.filter((f) => f.split(".").pop() === "js");
	if (jsfiles.length <= 0) {
		console.log("No commands to load!");
		return;
	}

	console.log(`loading ${jsfiles.length} commands!`);

	jsfiles.forEach((f, i) => {
		let props = require(`./cmds/${f}`);
		console.log(`${i + 1}: ${f} loaded!`);
		bot.commands.set(props.help.name, props);
		props.help.aliases.forEach((alias) => {
			bot.aliases.set(alias, props.help.name);
		});
	});
});

fs.readdir("./slcmds/", (err, files) => {
	if (err) console.error(err);

	let jsfiles = files.filter((f) => f.split(".").pop() === "js");
	if (jsfiles.length <= 0) {
		console.log("No commands to load!");
		return;
	}

	console.log(
		`======================================\nloading ${jsfiles.length} slash commands!`
	);

	jsfiles.forEach((f, i) => {
		let props = require(`./slcmds/${f}`);
		console.log(`${i + 1}: ${f} loaded!`);
		bot.slashcommands.set(props.help.name, props);
	});
});

const commands = [];
const commandFiles = fs
	.readdirSync("./slcmds")
	.filter((file) => file.endsWith(".js"));

const clientId = "";
const guildId = "";

for (const file of commandFiles) {
	const command = require(`./slcmds/${file}`);
	commands.push(command.data.toJSON());
}
const rest = new REST({ version: "9" }).setToken(token);
(async () => {
	try {
		console.log("Started refreshing application (/) commands.");
		await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
			body: commands,
		});
		//await rest.put(Routes.applicationCommands(clientId), { body: commands });

		console.log("Successfully reloaded application (/) commands.");
	} catch (error) {
		console.error(error);
	}
})();

const activities_list = ["Prefix: %", "Online", "Version 1.4", "with ur mom"]; // creates an arraylist containing phrases you want your bot to switch through.

bot.on("ready", async () => {
	let poop = 0;
	console.log(`Attendance Points is online! ${bot.user.username}`);
	setInterval(() => {
		if (poop !== 12) {
			const index = Math.floor(
				Math.random() * (activities_list.length - 1) + 1
			); // generates a random number between 1 and the length of the activities array list (in this case 5).
			bot.user.setActivity(activities_list[index]); // sets bot's activities to one of the phrases in the arraylist.
			poop = poop + 1;
		} else if (poop == 12) {
			debounce = true;
			bot.user.setActivity("DB_SYS RESET");
			poop = 0;
		}
	}, 10000); // Runs this every 10 seconds.
});

bot.on("interactionCreate", async (interaction) => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;
	if (!bot.slashcommands.has(`${commandName}`)) return;
	try {
		await bot.slashcommands.get(`${commandName}`).execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: "There was an error while executing this command!",
			ephemeral: true,
		});
	}
});

process.on("unhandledRejection", async (error) => {
	let errorID;
	async function accessSpreadsheet() {
		if (error.stack.includes("Google API error")) {
			return console.log(error.message);
		}
		const doc = new GoogleSpreadsheet("");
		await doc.useServiceAccountAuth({
			client_email: creds2.client_email,
			private_key: creds2.private_key,
		});
		await doc.loadInfo();
		const sheet = doc.sheetsById[0];
		await sheet.loadCells(`F1`);
		const H2 = sheet.getCellByA1(`F1`);
		H2.value = H2.value + 1;
		await sheet.saveUpdatedCells();
		errorID = H2.value;
		let path = await error.stack;
		let todayDate = new Date().toLocaleString("en-US", {
			timeZone: "America/Denver",
		});
		let row = {
			"Error Message": `${error.message}`,
			"Error Path": `${path}`,
			"Error Code": `${error.code}`,
			Time: `${todayDate}`,
			"Error ID": `${errorID}`,
		};
		await sheet.addRow(row, { insert: true });
	}
	accessSpreadsheet();
	console.log(error);
});

bot.on("guildMemberRemove", (member) => {
	if (member.guild.id == "") {
		console.log(`user ${member.user.tag} left`);
		let toAP = member;
		async function accessSpreadsheet() {
			const doc = new GoogleSpreadsheet("");
			await doc.useServiceAccountAuth({
				client_email: creds.client_email,
				private_key: creds.private_key,
			});
			await doc.loadInfo();
			const sheet = doc.sheetsById[0];
			await sheet.loadCells("I3");
			const K2 = sheet.getCellByA1("I3");
			K2.formula = `=MATCH("${toAP.id}",H:H,0)`;
			K2.textFormat = { fontSize: 6 };
			await sheet.saveUpdatedCells();
			if (K2.valueType == "errorValue") {
				return console.log("user was not in db");
			}
			await sheet.loadCells(`C${K2.value}`);
			const H2 = sheet.getCellByA1(`C${K2.value}`);
			H2.backgroundColor = { red: 1, green: 0, blue: 0, alpha: 1 };
			await sheet.saveUpdatedCells();
		}
		accessSpreadsheet();
	}
});

bot.on("messageCreate", async (message) => {
	if (message.author.bot) return;
	if (message.mentions.everyone) return;
	if (message.channel.type === "dm") return;
	if (
		message.guild.id == "" ||
		message.guild.id == "" ||
		message.guild.id == ""
	)
		return;
	if (message.mentions.has(bot.user)) {
		let myArray2 = [
			"Fuck you, stop pinging me.",
			`I bet you're one of the people who:\n\nalways hear your name even if it's not being called.\n\nhate hearing your voice in recordings.\n\nuse the word "thingy" when you can't remember what something is called.\n\npretend you're writing in class so the teacher won't call on you.\n\nsays the entire alphabet because you can't remember what letter comes next.\n\nhate it when one of your hoodie strings is longer than the other.\n\nhate it when someone thinks you like someone when you clearly don't.\n\nhate it when your favorite song comes on as you pull in the driveway.\n\nfeel like if you turn on the lights, you'll be safe from anything.\n\npush those little buttons on the lids of fast-food drinks.`,
			"Who the hell do you think you are, that gives you the right to ping me?",
			"I've never seen such a gay piece of shit ping me ever in my life.",
			"Senpai, you finally noticed me did ya?",
			"What the fuck do you want you cunt",
			"I think its time I finally say this... You're adopted.",
			"Ping me again I fucking dare you!",
			"*Slowly loading Glock-17* - What.",
			"Hey you, you're finally awake?",
			"I got 99 problems and all of them include you",
			"Sometimes I wish my creator gave me mute permissions.",
			`${message.author} HOWS THAT FEEL HUH BITCH`,
			"Can I help you?",
			"https://rb.gy/woomze \nAllow me to show you heaven, (or hell)",
			"'Ight, Imma head out now.",
			"ok what goofy ass mickey mouse clubhouse motherfucker pinged me, if it was an @ everyone ping i’m going to find you and literally shove my fist so far up your ass it will go out of your mouth, if it was a regular ping still fuck you. i’m honestly tired of these motherfuckers thinking they are so funny to randomly ping everyone on the server. fuck you and every little bitch that pings me i don’t have all day to be on discord to see this shit, go get a fucking hobby and delete discord i’m so sick of this shit :rage:",
			"Omae wa... Mou, SHINDERU!",
			"If I had the permission to remove AP, You'd be below initiate role right about now.",
			"I am your end.",
			"You just yee'd your last haw, bitch.",
			"Nani?!",
			"Ma'am, Sir, your son has a case of IQ<0, and there's no cure. I'm not sorry.",
			"OMG! I think I just found a new species! Oh wait- Oh its just you. Nevermind.",
			"No.",
			"If spiderman had idiocy senses, he would be able sense you from the marvel universe",
			"stfu cum guzzler",
			"WHAT DO YOU FUCKING WANT?!!?!",
			"Whomst awakens the ancient one",
			"Ah yes, finally, a worthy opponent. Your ban will be legendary!",
			"https://imgflip.com/i/47dfu2",
			`${message.author} FEEL MY **PAAAAAAAAIIIIINNNNNNNNNNNN**`,
			"https://imgflip.com/i/47dg53",
			"https://imgflip.com/i/47dg97",
			"WHAT ARE YOU DOING SOLDIER ? SHOOT THE FUCKING HALOOOOOOOOOOO",
			"It is statistically proven that 100% of people who ping me are virgins.",
			"https://cdn.discordapp.com/attachments/601764140331040780/732388434253185027/unknown.png",
			"https://www.youtube.com/watch?v=WGDU5xifwRQ",
			"I've discovered the 3rd gender! It's a virgin!",
			"https://www.youtube.com/watch?v=RKW6rjnYEkc",
			"GOD FUCKING DAMN IT, I WAS PLAYING A FUCKING GAME AND YOU DECIDED TO PING ME AND GET ME FUCKING KILLED. FUCK YOU. FUCK YOU. I HAVE YOUR IP, I AM COMING FOR YOU.",
			"Sen... Senpai... I.. I made a song f- for you...\nhttps://www.youtube.com/watch?v=CAL4WMpBNs0",
			"What if we like kissed lmao jkjk\n\n\nUnless...?",
			"Pinged? Alright, who am I flinging off a cliff today",
			"Have you ever done something **useful** in your life?",
			"Thou who ping me shall get their **N̷̡̨̨͚̪͙̟̙̤̣̼̺̯̉̏̇̾̑̏͂͛̐̈́̾̒͂͜͠͝I̸͉̯͎͇̗̝̟̩̫͕͔͚̦̮͇̽̿Ċ̶̡̰͕̤͔͚̝̮̋͗͛͌̈́̃̐̒̈́̓̓̿̍̓͛̅͌̊̿̒̍̌̕͝͝͝͠͠͝O̴̡̡̧̧͉̲̤̞͓͚͍̝̰̣̥̬͖̼̻͍͇̐͆͆͌͆̀͋̏͑̈́̎͐̓̎̑͆̊̍̏̑̉͑͆̀̂͂̀̚̚͘͜͜ ̷͓̠̼̲̙̠̪̻͈͗́͋̿͆̈̃̿̃́̄̓̂͂̈́̊̈̂̕̕͠͝͝N̵̢̩͚̓͒͆͑̀͒͌͛̆̌̇̄̌͂́̆͐̅̿͆̕͝Į̷̡̹̝͚͕͇̫̰̙͎͎̭̼̦̻̻͙͛͆̋̿̉́̍̾͐͒͗̊̀̅Ç̴̲̗̱̩̮͓̘̦̲̞̲͆͂̈̀̉̄̊͛̏͆͂̈́̓̚Ơ̶̧̧̗̩͎͉̖̳̥̠̹͓̘̤̺̮̤͚͖͚͎̄͗̽̉́̒̌̎̇͌̿̿̏͛̄́́͂̚̕͠͠ͅͅ ̷̛̣̲̮͙̜͚͎̝̟͚̤̱͓̭̥̤̞̦̩̗̹̩̫͖͋͐͗̔̔͌́̓͂͛́̉̀̎̆̾̿̉̇̇͐͐̒̃͘̕͝K̷̟͙͔͇̯̹͓͈̥̗̼͖̱̟͔͂̏͒̂͛ͅŅ̴͎̹̹͓̻̠̱͎̩̤̫̱͍̳̫̜̠̩͉̲̔̎̾̿̕͜E̴̡̡̛͓̲̱͕̤̲͎͈̰̎́̅̅̀̊̎̾̃̄̓͆̉̏͂̇̅̃̅͋͌̔͊̈́̕͠͝͝͝Ȇ̵̡̡̲͕̜͚̺̯͙̞̼̞͙̯̱̜̻͚͓͚̭̲̻̘̍̈́̎̈́́̓́̀̓͑̍̔̈͛̏̔̄̈̓̉̌̚̕͜͠ͅͅC̷̡̢̛̛͓̺̰͔͇͕̝̥̖̝̱̺̯̼̲̮̔̔̆̀̈́͑̃̌̃͛̓̇͒̔̄̍̾͑͆̊̎̾͒̚̚͝͝͠Ą̶̨͈̥̗̜̻̯̟̰̦̫͕̬͚̹̗͓͚̣̬͇̎͛̅̾̅̅̾͊̊̔̏͛̋͒̈́̒͗̓̀͂̑͜ͅP̴̫̲̘̬̗̠͈͉͙̈́͊͆̑̀͌̂̓̂͌̈̾͑̇̈́̃̊̔̉̅̊͘͝͝͝͝͝S̷̢̢̹̻̺̰̙̣͒͗̓̋̍̈̽̏̉̿̽** broken",
			"the fuck",
			`fucking ${message.author}, yeah bitch hows that feel huh ${message.author} you mothher fucking ${message.author} ${message.author}${message.author}${message.author}${message.author}${message.author}${message.author}  FUCK YOU BIRCH`,
			"You finally noticed me... We'll be together forever! And we'll never be apart... :flushed:",
			"Better start praying, bitch. https://www.youtube.com/watch?v=kLaaJ_aeoyM",
			"if you ping me again, you are a certified gay",
			"Do you ever just... Not?",
			"I bet you get a boner every time you look at your 81 year old male teacher.",
			"I bet you're one of those people who get told to shut up and you say ShUt uP back in a higher pitched voice.",
			`\`\`\`js\nbot.on("message", async message => {\n  if(message.author.bot) return;\n  if(message.mentions.everyone) return;\n  if (message.mentions.has(bot.user)) {\n    var randomItem2 = myArray2[Math.floor(Math.random()*myArray2.length)];\n    message.channel.send(randomItem2)\n  }\n});\`\`\``,
			"Yes officer, this one here.",
			"This message was deleted because it is a furry post.",
			"Imagine reading a post, but over the course of it the quality seems to deteriorate and it gets wose an wose, where the swenetence stwucture and gwammer rewerts to a pwoint of uttew non swence, an u jus dont wanna wead it anymwore (o´ω｀o) awd twa wol owdewl iws jus awfwul (´･ω･`);. bwt tw powost iwswnwt obwer nyet, it gwos own an own an own an own. uwu wanyaa stwop weadwing bwut uwu cwant stop wewding, uwu stwartd thwis awnd ur gwoing two fwinibsh it nowo mwattew wat! uwu hab mwoxie kwiddowo, bwut uwu wibl gwib ub sowon. i cwan wite wike dis fwor owors, swo dwont cwalengbe mii..",
		];
		var randomItem2 = myArray2[Math.floor(Math.random() * myArray2.length)];
		message.channel.send(randomItem2);
	}
});

async function roler(facnumber, ap, toAP, test, message) {
	let roleids = {
		faction: {
			VO: {
				RoleList: [
					"683315719320109144",
					"697208792617844756",
					"683316065807499278",
					"697209357699514499",
					"697209004203573291",
					"683316519156973636",
					"683316830169071851",
					"683425498239729734",
				],
				RolesToRole: {
					0: ["Initiate", "683315719320109144"],
					1: ["Private", "697208792617844756"],
					5: ["Private First Class", "683316065807499278"],
					10: ["Specialist", "697209357699514499"],
					15: ["Lance Corporal", "697209004203573291"],
					20: ["Corporal", "683316519156973636"],
					28: ["Staff Sergeant", "683316830169071851"],
					38: ["Sergeant First Class", "683425498239729734"],
					55: ["Sergeant First Class", "683425498239729734"],
				},
				RolesToStop: {
					1: [
						"601764131397304332",
						"739387189322055681",
						"602951811158114324",
						"678360571380236320",
						"601764130608906240",
						"697875420565078067",
						"786363696016392200",
					],
				},
			},
			LS: {
				RoleList: [
					"769062369418412062",
					"677247319594237962",
					"731247928320065536",
					"677275922654822438",
					"677276069761384448",
				],
				RolesToRole: {
					0: ["Apprentice", "769062369418412062"],
					1: ["Pilot", "677247319594237962"],
					5: ["Pilot First Class", "731247928320065536"],
					13: ["Officer", "677275922654822438"],
					20: ["Warrant Officer", "677276069761384448"],
				},
				RolesToStop: {
					1: [
						"677276297231335424",
						"677276460108742686",
						"677276848975118336",
						"691748901862244502",
						"731355937801109596",
						"677247220398948374",
						"794067948520079370",
						"677247177193685027",
						"678621212150333480",
						"810743758726758400",
					],
				},
			},
			MOPP: {
				RoleList: [
					"814270176534724618",
					"701473231995142165",
					"701473234557730826",
					"701473230740914316",
					"701473229658914917",
					"701473229121912843",
					"701473234436096050",
					"701473228622921728",
					"701473227871879238",
				],
				RolesToRole: {
					0: ["Enlistee", "814270176534724618"],
					2: ["Wiseguys", "701473231995142165", "701473234557730826"],
					6: ["Runner", "701473230740914316", "701473234557730826"],
					9: ["Untouchables", "701473229658914917", "701473234557730826"],
					15: ["Capo", "701473229121912843", "701473234436096050"],
					25: ["Capitan", "701473228622921728", "701473234436096050"],
					35: ["Mafioso", "701473227871879238", "701473234436096050"],
				},
				RolesToStop: {
					1: [
						"769755565218988043",
						"701473236059422730",
						"701473225305096202",
						"701473224566767666",
						"701473223799341066",
					],
				},
			},
			ISC: {
				RoleList: [
					"816083996361359402",
					"816083832422924299",
					"815356438784245810",
				],
				RolesToRole: {
					0: [
						"stay out of pvp or carl bot will hurt you",
						"816083996361359402",
					],
					1: ["in training", "816083832422924299"],
					4: ["trained", "815356438784245810"],
				},
				RolesToStop: {
					1: [],
				},
			},
			TGSS: {
				RoleList: [
					"825207776354762762",
					"825207767777804289",
					"825208298323836949",
					"825208439873470517",
					"825208453747441664",
				],
				RolesToRole: {
					0: ["Enlistee", "825207776354762762"],
					1: ["Member", "825207767777804289"],
					3: ["Trusted Member", "825208298323836949"],
					7: ["Elder", "825208439873470517"],
					15: ["Trusted Elder", "825208453747441664"],
				},
				RolesToStop: {
					1: ["825208751732555788", "825207779638902814"],
				},
			},
			UCG: {
				RoleList: [
					"711934062222376992",
					"706902647474618370",
					"706902561772273725",
					"706902608014737488",
					"707596950350069880",
					"707600661965045811",
					"837797565445308476",
					"837797521996251136",
				],
				RolesToRole: {
					3: ["Cadete", "711934062222376992"],
					6: ["Soldado", "706902647474618370"],
					15: ["Soldado de Primera", "706902561772273725"],
					35: ["Cabo", "706902608014737488"],
					55: ["Cabo Primero", "707596950350069880"],
					85: ["Sargento Segundo", "707600661965045811"],
					105: ["Sargento Primero", "837797565445308476"],
					130: ["Subteniente", "837797521996251136"],
				},
				RolesToStop: {
					1: [
						"746195868167700582",
						"701508051554795530",
						"701507978548871368",
						"794749823848022016",
						"617484437491548181",
					],
				},
			},
		},
	};

	function between(a, b, c) {
		if (isNaN(c)) {
			c = b + 1;
			console.log(a, b, c);
		}
		return b >= a && b <= c;
	}

	let FinalRoleName;
	let FinalRoleID;
	let WhitelistBoolean = false;
	let faction = Object.keys(roleids.faction);
	let range = Object.keys(roleids.faction[faction[facnumber]].RolesToRole);

	let whitelistList = roleids.faction[faction[facnumber]].RolesToStop[1];
	async function Wait() {
		if (test == false) {
			for (var i = 0; i < whitelistList.length; i++) {
				if (toAP.roles.cache.has(whitelistList[i])) {
					console.log(`User ${toAP.user.tag} has a whitelisted role.`);
					WhitelistBoolean = true;
					FinalRoleName = "";
					FinalRoleID = "";
					break;
				}
			}
		}
	}
	await Wait();
	let errore = true;
	if (WhitelistBoolean == false) {
		for (var i = 0; i < range.length; i++) {
			let APNumber = parseInt(range[i]);

			let exact = between(APNumber, ap, parseInt(range[i + 1]) - 1);
			if (exact == true) {
				errore = false;
				console.log(exact, APNumber, ap, parseInt(range[i + 1]) - 1);
				console.log(roleids.faction[faction[facnumber]].RolesToRole[APNumber]);
				let e = roleids.faction[faction[facnumber]].RolesToRole[APNumber];
				FinalRoleName = e[0];
				FinalRoleID = e.splice(1);
				break;
			}
		}
		if (errore == true) {
			message.channel.send(
				"My auto role broke somehow for this command so im not gonna use it!"
			);
		}
	}
	let RoleList = roleids.faction[faction[facnumber]].RoleList;

	return { FinalRoleName, FinalRoleID, RoleList, WhitelistBoolean, errore };
}

async function addtodatabase(toAP, message) {
	let b = true;
	let oof = toAP.joinedAt;
	console.log(oof);
	let dayofmonth = oof.getDate();
	console.log(dayofmonth);
	let year = oof.getFullYear();
	console.log(year);
	let month2 = oof.getMonth();
	let month = month2 + 1;
	console.log(month);
	let facrole;
	let eek = toAP.nickname;
	if (eek === null || eek === undefined) {
		eek = toAP.user.username;
		console.log("Nickname changed =>", eek);
	}
	let row;
	switch (b) {
		case message.guild.id == "":
			//TBB Server
			facrole = "TBB";
			row = {
				"Discord Tag": `${toAP.user.tag}`,
				Members: `${eek}`,
				Role: `Rascal`,
				"Attendance Points": `0`,
				"Join Date": `${month}/${dayofmonth}/${year}`,
				Recruited: "0",
				userID: `${toAP.id}`,
			};
			break;
		case message.guild.id == "":
			//UCG Server
			facrole = "UCG";
			row = {
				"Discord Tag": `${toAP.user.tag}`,
				Members: `${eek}`,
				Role: `Cadete`,
				"Puntos de Asistencia": `0`,
				"Join Date": `${month}/${dayofmonth}/${year}`,
				Recruited: "0",
				userID: `${toAP.id}`,
			};
			break;
		case message.guild.id == "":
			//LS Server
			facrole = "LS";
			row = {
				"Discord Tag": `${toAP.user.tag}`,
				Members: `${eek}`,
				Role: `Apprentice`,
				"Souls (AP)": `0`,
				"Join Date": `${month}/${dayofmonth}/${year}`,
				userID: `${toAP.id}`,
			};
			break;
		case message.guild.id == "":
			//GA Server
			//message.channel.send(`GA Server commands are currently broken because of the "GA server remake"`)
			//DBTrue()
			//throw new Error("")
			let rolesofperson = toAP.roles.cache;
			facrole = "GA";
			let facrank =
				rolesofperson.get("783855632334979093") ||
				rolesofperson.get("783855310849835018") ||
				rolesofperson.get("783855682947514380") ||
				rolesofperson.get("711674826783195226") ||
				rolesofperson.get("750745728627769435") ||
				rolesofperson.get("783868850709069835");
			facranke = facrank.name;
			row = {
				"Discord Tag": `${toAP.user.tag}`,
				"ROBLOX Name": `${eek}`,
				Faction: `${facranke}`,
				"Attendance Points": `0`,
				"Join Date": `${month}/${dayofmonth}/${year}`,
				UserID: `${toAP.id}`,
			};
			break;
		case message.guild.id == "701473055830048808":
			//MOPP Server
			facrole = "MOPP";
			row = {
				"Discord Tag": `${toAP.user.tag}`,
				Members: `${eek}`,
				Role: ``,
				"Attendance points": `0`,
				"Join Date": `${month}/${dayofmonth}/${year}`,
				Recruited: "0",
				userID: `${toAP.id}`,
			};
			break;
		case message.guild.id == "757370229587181640":
			//ISC Server
			facrole = "ISC";
			row = {
				"Discord Tag": `${toAP.user.tag}`,
				Members: `${eek}`,
				Role: ``,
				"Attendance Points": `0`,
				"Join Date": `${month}/${dayofmonth}/${year}`,
				Recruited: "0",
				userID: `${toAP.id}`,
			};
			break;
		case message.guild.id == "802881932232753175":
			//TGSS Server
			facrole = "TGSS";
			row = {
				"Discord Tag": `${toAP.user.tag}`,
				Members: `${eek}`,
				Role: ``,
				"Attendance Points": `0`,
				"Join Date": `${month}/${dayofmonth}/${year}`,
				Recruited: "0",
				userID: `${toAP.id}`,
			};
			break;

		default:
			message.channel.send(
				"Your server is not authorized to use this command. Is this an error? Message Genesis#8339"
			);
			debounce = true;
			throw new Error("no permission to use - any Server");
			break;
	}
	return { row, facrole };
}

async function k2value(facname, sheet, message) {
	let K2;
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
	} else if (facname == "UCG") {
		K2 = await sheet.getCellByA1(`I3`);
	} else {
		return message.channel.send(
			"There was an error determining I3 and K3 values. Message Genesis#8339."
		);
	}
	return K2;
}

async function autorolevalues(facname, message) {
	let facnumber;
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
	} else if (facname == "UCG") {
		num3 = "Attendance Points";
		facnumber = 5;
	} else {
		return message.channel.send(
			"There was an error determining Auto Role ID. Message Genesis#8339."
		);
	}
	return { num3, facnumber };
}

async function switcher(message, args, toAP, type) {
	let facname;
	let rowsearchletter;
	let doc;
	let factionid;
	let e;
	let gafallback = false;
	let usermember;
	let b = true;
	let minroletouseAPcommands;
	let isGA = false;
	switch (b) {
		case message.guild.id == "601763897262735370":
			//VO Server
			minroletouseAPcommands = "810641055854231613";
			facname = "VO";
			rowsearchletter = "H";
			doc = new GoogleSpreadsheet("");
			break;
		case message.guild.id == "617477144569708554":
			//UCG Server
			minroletouseAPcommands = "794749823848022016";
			facname = "UCG";
			rowsearchletter = "H";
			doc = new GoogleSpreadsheet("");
			break;
		case message.guild.id == "701473055830048808":
			//MOPP Server
			minroletouseAPcommands = "701473228622921728";
			facname = "MOPP";
			rowsearchletter = "H";
			doc = new GoogleSpreadsheet("");
			break;
		case message.guild.id == "677246811911487488":
			//LS Server
			minroletouseAPcommands = "677276460108742686";
			facname = "LS";
			rowsearchletter = "G";
			doc = new GoogleSpreadsheet("");
			break;
		case message.guild.id == "757370229587181640":
			//ISC server
			minroletouseAPcommands = "767132526023409694";
			facname = "ISC";
			rowsearchletter = "H";
			doc = new GoogleSpreadsheet("");
			break;
		case message.guild.id == "802881932232753175":
			//TGSS Server
			minroletouseAPcommands = "825208751732555788";
			facname = "TGSS";
			rowsearchletter = "H";
			doc = new GoogleSpreadsheet("");
			break;
		case message.guild.id == "703040999768981634":
			//GA Server
			isGA = true;
			let servertocheckdatabase;
			minroletouseAPcommands = "783855213521010688";
			let GAtoAPRoles = toAP.roles.cache;
			if (GAtoAPRoles.has("783855310849835018")) {
				//VO-GA server
				servertocheckdatabase = await bot.guilds.fetch("601763897262735370");
				toAP = await servertocheckdatabase.members.fetch(`${toAP.id}`);
				facname = "VO";
				rowsearchletter = "H";
				doc = new GoogleSpreadsheet("");
			} else if (GAtoAPRoles.has("783855682947514380")) {
				//LS-GA server
				servertocheckdatabase = await bot.guilds.fetch("677246811911487488");
				toAP = await servertocheckdatabase.members.fetch(`${toAP.id}`);
				facname = "LS";
				rowsearchletter = "G";
				doc = new GoogleSpreadsheet("");
			} else {
				message.channel.send(
					`User \`${toAP.user.tag}\` is not in any Retribution database that AP bot knows of.`
				);
				gafallback = true;
			}
			break;

		default:
			message.channel.send(
				"Your server is not authorized to use this command. Is this an error? Message Genesis#8339"
			);
			debounce = true;
			throw new Error("no permission to use - any Server");
			break;
	}
	if (!args.includes("*")) {
		minroletouseAPcommands = await message.guild.roles.fetch(
			`${minroletouseAPcommands}`
		);
		if (
			message.member.roles.highest.position < minroletouseAPcommands.position
		) {
			message.channel.send("You do not have permission to use this command.");
			debounce = true;
			throw new Error(`no permission to use command - ${facname}`);
		}
		if (isGA == false) {
			if (type == "SINGLE") {
				if (
					toAP.roles.highest.position > message.member.roles.highest.position
				) {
					message.channel.send(
						"You cannot change a member who has a higher role than you."
					);
					debounce = true;
					throw new Error(`Higher Role rejection - ${facname}`);
				}
			}
		}
	} else if (args.includes("*")) {
		if (message.author.id !== "251196062725963776") {
			message.channel.send("You do not have permission to use override!");
			debounce = true;
			throw new Error(`no permission to use command - ${facname}`);
		}
	}
	return { facname, rowsearchletter, doc, toAP, gafallback };
}
/*
async function robloxTime() {
	let currentUser = await noblox.setCookie(botSettings.nobloxToken);
	console.log(`Logged in as ${currentUser.UserName} -- ${currentUser.UserID}`);

	let targetUser = await noblox.getPresences([115025101]);
	console.log(targetUser);
}
robloxTime();
*/
bot.on("messageCreate", async (message) => {
	if (message.author.bot) return;
	if (message.channel.type === "dm") return;
	let messageArray = message.content.split(" ");
	let args = messageArray.slice(1);
	let command = messageArray[0];
	if (!command.startsWith(prefix)) return;

	let myVideos = [
		"https://www.youtube.com/watch?v=mwKFCj1K7uY",
		"https://www.youtube.com/watch?v=N0btfGyoxNM",
		"https://www.youtube.com/watch?v=rB7XFQgJHBI",
		"https://www.youtube.com/watch?v=PVHrZlCMVTE",
		"https://www.youtube.com/watch?v=1k8craCGpgs",
		"https://www.youtube.com/watch?v=HQnC1UHBvWA",
		"https://www.youtube.com/watch?v=uKxyLmbOc0Q",
		"https://www.youtube.com/watch?v=zvq9r6R6QAY",
		"https://www.youtube.com/watch?v=VD3TwFgPgZE",
		"https://www.youtube.com/watch?v=dQw4w9WgXcQ",
		"https://www.youtube.com/watch?v=LYG7sMtb6u8",
		"https://www.youtube.com/watch?v=-Q--ZqWOZrw",
		"https://www.youtube.com/watch?v=LDU_Txk06tM",
		"https://www.youtube.com/watch?v=wDgQdr8ZkTw",
		"https://www.youtube.com/watch?v=0HdBmpvFF2c",
		"https://www.youtube.com/watch?v=zA52uNzx7Y4",
		"https://www.youtube.com/watch?v=CAL4WMpBNs0",
		"https://www.youtube.com/watch?v=bQtmm_lpUKI",
		"https://www.youtube.com/watch?v=V7M-L_h4BzY",
		"https://www.youtube.com/watch?v=_3ngiSxVCBs",
		"https://www.youtube.com/watch?v=S8dmq5YIUoc",
		"https://www.youtube.com/watch?v=rlkSMp7iz6c",
		"https://www.youtube.com/watch?v=SP1spLptZVs",
		"https://www.youtube.com/watch?v=yi8WrSCDfTY",
		"https://www.youtube.com/watch?v=KA8mYnZcy5w",
		"https://www.youtube.com/watch?v=J-fXTRHApRc",
		"https://www.youtube.com/watch?v=rB7XFQgJHBI",
		"https://www.youtube.com/watch?v=UlgzfMmN9s8",
		"https://www.youtube.com/watch?v=KxQ0LoEwQGQ",
		"https://www.youtube.com/watch?v=dfzBfJP2MM8",
		"https://www.youtube.com/watch?v=ET5F-XahpQo",
		"https://www.youtube.com/watch?v=BxV14h0kFs0",
		"https://www.youtube.com/watch?v=RJPdd59Pzzk",
		"https://www.youtube.com/watch?v=V-QVTbKNwRM",
		"https://www.youtube.com/watch?v=z9t6k-e7byg",
		"https://www.youtube.com/watch?v=53rkO8qDv4A",
		"https://www.youtube.com/watch?v=O4NWhjwa3Ns",
		"https://www.youtube.com/watch?v=n9KjA471Y3k",
		"https://www.youtube.com/watch?v=5jKZ9KGtee0",
		"https://www.youtube.com/watch?v=dkJNeLawexM",
	];

	let cmd;
	if (!message.content.startsWith(prefix)) return;

	if (bot.commands.has(command.slice(prefix.length))) {
		cmd = bot.commands.get(command.slice(prefix.length));
	} else {
		cmd = bot.commands.get(bot.aliases.get(command.slice(prefix.length)));
	}
	if (cmd)
		cmd.run(
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
		);

	console.log(
		`${command} called in ${message.guild.name} with args: [${args}]`
	);
});

bot.login(botSettings.token);
