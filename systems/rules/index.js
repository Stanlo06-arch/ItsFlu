const {
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    MessageFlags,
    PermissionsBitField,
    ComponentType
} = require("discord.js");

const { channels, roles } = require("../../config/ids");

const BUTTON_ID = "itsflu:accept_rules";

// ==========================================
// REGELWERK VERÖFFENTLICHEN
// ==========================================

async function publishRules(client) {

    const channel = await client.channels.fetch(channels.rules);

    if (!channel || !channel.isTextBased() || !channel.messages) {
        throw new Error("Regel-Kanal wurde nicht gefunden.");
    }

    const container = new ContainerBuilder()
        .setAccentColor(0x287BFF)

        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
                "# 📜 Die Serverregeln\n" +
                "Willkommen bei **itsFlu**! 💙\n" +
                "Bitte lies dir unsere Regeln aufmerksam durch."
            )
        )

        .addSeparatorComponents(
            new SeparatorBuilder()
                .setDivider(true)
                .setSpacing(SeparatorSpacingSize.Large)
        )

        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
                "### 🛡️ 1 · Respektvoller Umgang\n" +
                "Behandle alle Mitglieder freundlich und respektvoll. Beleidigungen und Belästigungen sind nicht erlaubt."
            ),
            new TextDisplayBuilder().setContent(
                "### 👥 2 · Gemeinschaft\n" +
                "Sei freundlich zu neuen Mitgliedern und hilf dabei, eine angenehme Community aufzubauen."
            ),
            new TextDisplayBuilder().setContent(
                "### 🚫 3 · Kein Spam\n" +
                "Vermeide Spam, unerlaubte Werbung und unerwünschte Nachrichten."
            ),
            new TextDisplayBuilder().setContent(
                "### 🔒 4 · Privatsphäre\n" +
                "Veröffentliche keine privaten Daten anderer Personen."
            ),
            new TextDisplayBuilder().setContent(
                "### 📢 5 · Werbung\n" +
                "Werbung ist nur in den dafür vorgesehenen Bereichen erlaubt."
            ),
            new TextDisplayBuilder().setContent(
                "### ⚠️ 6 · Team-Anweisungen\n" +
                "Anweisungen des Serverteams sind zu beachten."
            )
        )

        .addSeparatorComponents(
            new SeparatorBuilder()
                .setDivider(true)
                .setSpacing(SeparatorSpacingSize.Large)
        )

        .addActionRowComponents(
            new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(BUTTON_ID)
                    .setLabel("Regeln akzeptieren")
                    .setEmoji("✅")
                    .setStyle(ButtonStyle.Success)
            )
        )

        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
                "-# itsFlu • Chill. Connect. Shop."
            )
        );

    // Prüfen, ob bereits ein Regelwerk existiert
    const messages = await channel.messages.fetch({ limit: 100 });

    const existing = messages.find(message =>
        message.author.id === client.user.id &&
        message.components.some(component =>
            component.type === ComponentType.Container &&
            component.components.some(item =>
                item.type === ComponentType.ActionRow &&
                item.components.some(button =>
                    button.customId === BUTTON_ID
                )
            )
        )
    );

    if (existing) {
        await existing.edit({
            flags: MessageFlags.IsComponentsV2,
            components: [container]
        });

        console.log("✅ Regelwerk aktualisiert.");
    } else {
        await channel.send({
            flags: MessageFlags.IsComponentsV2,
            components: [container]
        });

        console.log("✅ Regelwerk veröffentlicht.");
    }
}


// ==========================================
// REGELN AKZEPTIEREN / ROLLE VERGEBEN
// ==========================================

async function acceptRules(interaction) {

    await interaction.deferReply({
        flags: MessageFlags.Ephemeral
    });

    try {

        const guild = interaction.guild;

        const member = await guild.members.fetch(
            interaction.user.id
        );

        const role = await guild.roles.fetch(
            roles.verified
        );

        const botMember = guild.members.me;

        if (!role) {
            return interaction.editReply(
                "❌ Die Verifiziert-Rolle wurde nicht gefunden."
            );
        }

        if (
            !botMember ||
            !botMember.permissions.has(
                PermissionsBitField.Flags.ManageRoles
            )
        ) {
            return interaction.editReply(
                "❌ Dem Bot fehlt die Berechtigung Rollen verwalten."
            );
        }

        if (role.position >= botMember.roles.highest.position) {
            return interaction.editReply(
                "❌ Die Bot-Rolle muss über der Verifiziert-Rolle stehen."
            );
        }

        if (member.roles.cache.has(role.id)) {
            return interaction.editReply(
                "💙 Du bist bereits verifiziert!"
            );
        }

        await member.roles.add(
            role,
            "Serverregeln akzeptiert"
        );

        await interaction.editReply(
            "✅ Du hast die Serverregeln akzeptiert!\n" +
            "Deine Verifiziert-Rolle wurde erfolgreich vergeben. Willkommen bei itsFlu! 💙"
        );

        console.log(
            `✅ ${interaction.user.tag} wurde verifiziert.`
        );

    } catch (error) {

        console.error("❌ Fehler bei der Verifizierung:", error);

        await interaction.editReply(
            "❌ Die Verifizierung ist fehlgeschlagen. Bitte informiere das Team."
        ).catch(() => {});
    }
}


// ==========================================
// EXPORT
// ==========================================

module.exports = {
    publishRules,
    acceptRules,
    BUTTON_ID
};
