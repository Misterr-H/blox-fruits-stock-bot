import { Client, GatewayIntentBits, EmbedBuilder } from 'discord.js';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ]
});

const STOCK_API = 'https://workers-playground-dawn-credit-31e5.hs913271.workers.dev/api';
const CHECK_INTERVAL = 5 * 60 * 1000; // Check every 5 minutes

async function fetchStock() {
  try {
    const response = await fetch(STOCK_API);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching stock:', error);
    return null;
  }
}

function formatFruitList(fruits) {
  if (!fruits || fruits.length === 0) return 'No fruits in stock';
  
  return fruits.map(fruit => 
    `**${fruit.name}**\n` +
    `💰 USD: ${fruit.priceUSD} | BRL: ${fruit.priceBRL}\n` +
    `[Image](${fruit.image})`
  ).join('\n\n');
}

function createStockEmbed(stockData) {
  const embed = new EmbedBuilder()
    .setTitle('🍎 Blox Fruits Stock Update')
    .setColor('#FF5733')
    .setTimestamp()
    .setFooter({ text: 'Last Updated' });

  if (stockData.normalStock) {
    embed.addFields({
      name: '📦 Normal Stock',
      value: formatFruitList(stockData.normalStock),
      inline: false
    });
  }

  if (stockData.mirageStock) {
    embed.addFields({
      name: '🌊 Mirage Stock',
      value: formatFruitList(stockData.mirageStock),
      inline: false
    });
  }

  return embed;
}

async function updateStock() {
  const channel = client.channels.cache.get(process.env.CHANNEL_ID);
  if (!channel) return;

  const stockData = await fetchStock();
  if (!stockData) return;

  const embed = createStockEmbed(stockData);
  
  try {
    // Delete previous messages to keep channel clean
    const messages = await channel.messages.fetch({ limit: 1 });
    await Promise.all(messages.map(msg => msg.delete()));
    
    // Send new stock update
    await channel.send({ embeds: [embed] });
  } catch (error) {
    console.error('Error updating stock message:', error);
  }
}

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  updateStock(); // Initial update
  setInterval(updateStock, CHECK_INTERVAL);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'stock') {
    const stockData = await fetchStock();
    if (!stockData) {
      await interaction.reply('Unable to fetch stock data at the moment.');
      console.log('Command stock failed');
      return;
    }
    console.log('Command stock success');
    const embed = createStockEmbed(stockData);
    await interaction.reply({ embeds: [embed] });
  }

  if (interaction.commandName === 'venom') {
    console.log('Command venom');
    await interaction.reply('Hello venom');
  }
});

client.login(process.env.DISCORD_TOKEN);