const { ActivityType } = require("discord.js");

const { publishRules } = require("../systems/rules");

module.exports = async (client) => {

    console.log("--------------------------------");
    console.log("💙 itsFlu Bot ist online!");
    console.log(`🤖 Bot: ${client.user.tag}`);
    console.log("--------------------------------");

    // Bot-Status
    client.user.setActivity("itsFlu 💙", {
        type: ActivityType.Watching
    });

    // Serverregeln veröffentlichen
    try {

        await publishRules(client);

        console.log("✅ Serverregeln erfolgreich geladen!");

    } catch (error) {

        console.error(
            "❌ Fehler beim Laden der Serverregeln:",
            error
        );

    }

};
