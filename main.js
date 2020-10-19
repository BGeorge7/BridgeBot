const Discord = require('discord.js');
const fs = require('fs');
const fetch = require('node-fetch');
const spawn = require("child_process").spawn;

const client = new Discord.Client();

const prefix = '-';

client.once('read', () => {
    console.log('BridgeBot Online');
});

function bridgeCreate(message)
{
    pfp = message.author.avatarURL.toString();
    let pfpString = message.author.avatarURL().toString(); //gets the url string
    let pfpStringLength = pfpString.length; //length of the string
    let pfpStringNPng = pfpString.substring(0, pfpStringLength-4); //substring with webp removed

    pfpStringNPng = pfpStringNPng + "png";

    pfpStringNPng = pfpStringNPng.replace("https", "http"); //make link http

    async function download() 
    {
        const response = await fetch(pfpStringNPng);
        const buffer = await response.buffer();
        fs.writeFile(".\\user_pfp\\" + message.author.id.toString() + ".png", buffer, () => 
            console.log('Downloaded image for: ' + message.author.id.toString()));
    }

    download(); //calls the download image function
    const pythonProcess = spawn('python',["bridge_paste.py", ".\\user_pfp\\" + message.author.id.toString() + ".png", message.author.id.toString() + ".png"]);
    console.log(".\\user_pfp\\" + message.author.id.toString() + ".png");

    pythonProcess.stdout.on('data', (data) => {
        const attachment = new Discord.MessageAttachment(".\\Bridged_Images\\Bridged"+ message.author.id.toString()+ ".png");
        message.channel.send(attachment);
    });
}


client.on('message', message => { // for commands
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/); //splices the argument out with the prefix, including a space in between
    const command = args.shift().toLowerCase();

    if(command === 'bridge')
    {
        bridgeCreate(message);
    }
    if(command === 'help')
    {
        message.channel.send("My prefix is \"-\"");
        message.channel.send("-bridge (Sends your pfp to the bridge)");
        message.channel.send("Also try out typing the word \"pain\"");
    }
});

client.on('message', message => { //Messages without a prefix
    if(message.content.startsWith(prefix) || message.author.bot) return;

    const command = message.content.toLowerCase();

    if(command === 'bridge' || command === 'the word' ||command.includes("bridge", 0)) //Sends bridge when the keywords are triggered
    {
		bridgeCreate(message);
    }
    else if(command === 'pain'){ //Pain Emote
        message.channel.send('<:painchamp:764605948253044736>');
        message.delete();
    }
});

try {
    const data = fs.readFileSync('key.txt', 'utf8') //Reads the key from a file called key
    client.login(data.toString());
    console.log(data)
  } catch (err) {
    console.error(err)
  }

