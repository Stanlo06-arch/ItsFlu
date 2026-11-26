const {
    acceptRules,
    BUTTON_ID
} = require("../systems/rules");

module.exports = async (interaction) => {

    if (!interaction.isButton()) return;

    if (interaction.customId !== BUTTON_ID) return;

    if (!interaction.inGuild()) return;

    try {
        await acceptRules(interaction);
    } catch (error) {
        console.error("❌ Fehler bei der Interaktion:", error);

        const response = {
            content: "❌ Es ist ein Fehler aufgetreten. Bitte versuche es erneut.",
            ephemeral: true
        };

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(response).catch(() => {});
        } else {
            await interaction.reply(response).catch(() => {});
        }
    }
};
