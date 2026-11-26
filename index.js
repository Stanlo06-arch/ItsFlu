require("dotenv").config();

const {
    Client,
    GatewayIntentBits,
    Events
} = require("discord.js");

// Events laden
const readyEvent = require("./events/ready");
const interactionEvent = require("./events/interactionCreate");

// Token überprüfen
if (!process.env.DISCORD_TOKEN) {
    console.error("❌ DISCORD_TOKEN fehlt in Railway!");
    process.exit(1);
}

// Discord Client erstellen
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

// Bot ist online
client.once(Events.ClientReady, async () => {
    await readyEvent(client);
});

// Button-Interaktionen
client.on(
    Events.InteractionCreate,
    async (interaction) => {
        await interactionEvent(interaction);
    }
);

// Bot starten
client.login(process.env.DISCORD_TOKEN)
    .then(() => {
        console.log("💙 itsFlu verbindet sich mit Discord...");
    })
    .catch((error) => {
        console.error("❌ Discord Login fehlgeschlagen:", error);
        process.exit(1);
    });
