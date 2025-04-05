const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
  ],
  partials: ["CHANNEL", "USER"], // Added "USER" for proper DM handling
});

const monitoredRoles = ['SSL 2200+', 'Supersonic Legend', 'Grand Champion III', 'Grand Champion II', 'Grand Champion I', 'Champion III', 'Champion II', 'Champion I', 'Diamond III', 'Diamond II', 'Diamond I', 'Platinum III', 'Platinum II', 'Platinum I', 'Gold III', 'Gold II', 'Gold I', 'Silver III', 'Silver II', 'Silver I', 'Bronze III', 'Bronze II', 'Bronze I', 'Unranked']; // Update with actual role names
const logChannelId = "1357541679636414635"; // Replace with your log channel ID

client.once("ready", async () => { 
  console.log(`✅ Bot is online as ${client.user.tag}`);

  try {
    await client.user.setUsername("Sir Ranks-A-Lot");
    console.log("✅ Bot username updated!");
  } catch (error) {
    console.error("⚠️ Failed to update bot username:", error);
  }
});

client.on("guildMemberUpdate", async (oldMember, newMember) => {
  const oldRoles = oldMember.roles.cache.filter((role) =>
    monitoredRoles.includes(role.name)
  );
  const newRoles = newMember.roles.cache.filter((role) =>
    monitoredRoles.includes(role.name)
  );

  console.log(`🔍 Checking roles for ${newMember.user.tag}`);
  console.log(`🟢 Old Roles: ${oldRoles.map((r) => r.name).join(", ") || "None"}`);
  console.log(`🟡 New Roles: ${newRoles.map((r) => r.name).join(", ") || "None"}`);

  const addedRole = newRoles.find((role) => !oldRoles.has(role.id));
  let removedRole = oldRoles.find((role) => !newRoles.has(role.id));

  if (addedRole) {
    console.log(`🔹 ${newMember.user.tag} got ${addedRole.name}`);

    if (!removedRole) {
      console.log(`⚠️ No old role detected to remove.`);
    } else {
      console.log(`❌ Trying to remove ${removedRole.name}`);
      try {
        await newMember.roles.remove(removedRole);
        console.log(`✅ Removed old role: ${removedRole.name}`);
      } catch (error) {
        console.error(`⚠️ Failed to remove role ${removedRole.name}:`, error);
      }
    }

    // 📩 Send DM Embed
    const embed = new EmbedBuilder()
      .setColor(0x00ff00)
      .setTitle("Role Update")
      .setDescription(
        `🚨 You have been assigned **${addedRole.name}**.\n${removedRole ? `❌ Previous role **${removedRole.name}** has been removed.` : ""}`
      )
      .setTimestamp();

    try {
      const dmMessage = await newMember.send({ embeds: [embed] });

      // Delete the DM after 5-10 minutes
      setTimeout(() => {
        dmMessage.delete().catch(console.error);
      }, Math.floor(Math.random() * (10 - 5 + 1) + 5) * 60 * 1000);
    } catch (err) {
      console.error(`⚠️ Could not send DM to ${newMember.user.tag}:`, err);
    }

    // 📝 Log to Channel
    try {
      const logChannel = await client.channels.fetch(logChannelId);
      if (!logChannel || !logChannel.isTextBased()) {
        console.error("⚠️ Log channel not found or not a text channel.");
        return;
      }

      const logEmbed = new EmbedBuilder()
        .setColor(0x3498db)
        .setTitle("Role Change Log")
        .setDescription(
          `👤 **User:** ${newMember.user.tag}\n🎭 **Added Role:** ${addedRole.name}\n❌ **Removed Role:** ${removedRole ? removedRole.name : "None"}`
        )
        .setTimestamp();

      logChannel.send({ embeds: [logEmbed] }).catch(console.error);
    } catch (error) {
      console.error("⚠️ Error fetching log channel:", error);
    }
  }
});

client.login(process.env.DISCORD_TOKEN).catch((err) => {
  console.error("❌ Failed to login! Check your token and .env file:", err);
  process.exit(1);
});

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Bot is alive!'));

app.listen(PORT, () => {
  console.log(`Keep-alive server running on port ${PORT}`);
});
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

setInterval(() => {
  fetch('https://your-render-app.onrender.com/')
    .then(() => console.log('Pinged self to stay awake'))
    .catch((err) => console.error('Ping failed:', err));
}, 5 * 60 * 1000); // every 5 minutes

