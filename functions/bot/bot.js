const { Telegraf } = require("telegraf")
const langchain = require("langchain");
const bot = new Telegraf(process.env.BOT_TOKEN)
const openAIKey = process.env.OPENAI_KEY;

bot.start(ctx => {
    console.log("Received /start command");
    try {
        const options = [
            { text: "2", callback_data: "action:learn_words:2" },
            { text: "3", callback_data: "action:learn_words:3" },
            { text: "4", callback_data: "action:learn_words:4" }
        ];
        const replyMarkup = {
            inline_keyboard: options.map(option => [{ text: option.text, callback_data: option.callback_data }])
        };
        return ctx.reply("How many words would you like to learn today?", { reply_markup: replyMarkup });
    } catch (e) {
        console.error("error in start action:", e);
        return ctx.reply("Error occurred");
    }
});

bot.action(/^action:learn_words:\d+$/, async ctx => {
    const callbackData = ctx.match[0];
    const numberOfWords = parseInt(callbackData.split(":")[2]);
    console.log(`Received callback data: ${numberOfWords}`);
    try {
        // Make a call to OpenAI
        const response = await langchain.openAI.callAPI(openAIKey, "Hello Suggest three words for me to learn!");

        // Access the response data
        console.log(response.data);

    } catch (e) {
        console.error("error in action handler:", e);
        return ctx.reply("Error occurred");
    }
});

// AWS event handler syntax (https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html)
exports.handler = async event => {
  try {
    await bot.handleUpdate(JSON.parse(event.body))
    return { statusCode: 200, body: "" }
  } catch (e) {
    console.error("error in handler:", e)
    return { statusCode: 400, body: "This endpoint is meant for bot and telegram communication" }
  }
}
