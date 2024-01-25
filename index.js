const chalk = require("chalk");
const dayjs = require("dayjs");
const fs = require("fs");
const { WebhookClient, EmbedBuilder, Embed } = require("discord.js");

/**
 *
 * @param {string} webhookUrl
 * @param {EmbedBuilder} embed
 */
const sendWebhook = async (webhookUrl, embed) => {
  try {
    const client = new WebhookClient({ url: webhookUrl });

    await client.send({
      embeds: [embed],
    });
  } catch (err) {
    module.exports.log(module.exports.ERROR, err);
  }
};

const generateEmbed = (level) => {
  switch (level) {
    case module.exports.OK:
      return new EmbedBuilder().setColor("Green").setTimestamp().setTitle("OK");
    case module.exports.WARN:
      return new EmbedBuilder()
        .setColor("Yellow")
        .setTimestamp()
        .setTitle("WARN");
    case module.exports.ERROR:
      return new EmbedBuilder()
        .setColor("Red")
        .setTimestamp()
        .setTitle("ERROR");
    case module.exports.INFO:
      return new EmbedBuilder()
        .setColor("White")
        .setTimestamp()
        .setTitle("INFO");
  }
};

module.exports = {
  OK: 0,
  WARN: 1,
  ERROR: 2,
  INFO: 3,
  /**
   * @param {number} level The log level
   * @param {string} message The log message
   * @param {options} options
   * @typedef {Object} options *
   * @property {boolean} options.sendWebhook Whether to send an embed to the webhook
   * @property {object[]} options.objects Additional objects to add to the log
   * @property {boolean} options.prettyPrint Whether objects should be pretty printed
   * @property {boolean} options.showDate Whether to show the date
   */
  log: (level, message, options) => {
    try {
      if (!options)
        options = {
          showDate: true,
          prettyPrint: false,
          objects: [],
        };

      const date = dayjs();

      const dateFormat = `${
        date.month() + 1
      }/${date.date()}/${date.year()} ${date.format("hh:mm:SSS")}`;

      let color;

      switch (level) {
        case module.exports.OK:
          color = chalk.bgGreen("OK");
          break;
        case module.exports.WARN:
          color = chalk.bgYellow("WARN");
          break;
        case module.exports.ERROR:
          color = chalk.bgRed("ERROR");
          break;
        case module.exports.INFO:
          color = chalk.bgWhite("INFO");
          break;
      }

      const log = `${color}: ${message}`;

      console.log(options.showDate ? dateFormat + ` ${log}` : log);

      if (!options.objects) options.objects = [];

      for (const object of options.objects) {
        const objectLog = `${color}: ${
          options.prettyPrint
            ? JSON.stringify(object, null, 2)
            : JSON.stringify(object)
        }`;

        console.log(
          options.showDate ? dateFormat + ` ${objectLog}` : objectLog
        );
      }

      if (!fs.existsSync(`${process.cwd()}/dslog.config.json`)) return;
      if (!options.sendWebhook) return;

      const json = JSON.parse(
        fs.readFileSync(`${__dirname}/dslog.config.json`)
      );

      const embed = generateEmbed(level);

      embed.setDescription(message);

      for (const object of options.objects) {
        embed.addFields({
          name: "=====",
          value: "```" + JSON.stringify(object, null, 2) + "```",
        });
      }

      if (json.webhooks) {
        for (const webhook of json.webhooks) {
          sendWebhook(webhook, embed);
        }

        return;
      }

      sendWebhook(json.webhookUrl, embed);
    } catch (err) {
      console.error(err);
    }
  },
};
