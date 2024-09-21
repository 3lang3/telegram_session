const { TelegramClient } = require("telegram");
const { LogLevel } = require('telegram/extensions/Logger')

const { StringSession } = require("telegram/sessions");
const input = require("input");
const qrcode = require("qrcode-terminal");

const apiId = 22091323; // 从my.telegram.org获取, 没有则使用默认值
const apiHash = "9dc1ebe55ace4cbf9999e100acc74779"; // 从my.telegram.org获取, 没有则使用默认值

const main = async () => {
  const f2apwd = await input.text("输入2FA密码(没有直接回车): ")
  const client = new TelegramClient(new StringSession(""), apiId, apiHash, {
    connectionRetries: 5,
  });
  client.setLogLevel(LogLevel.NONE)
  await client.connect()
  await client.signInUserWithQrCode(
    { apiId, apiHash },
    {
      onError: async function (p1) {
        console.log("error", p1);
        return true;
      },
      qrCode: async (code) => {
        console.log(`使用telegram手机端扫描以下二维码登录:`);
        qrcode.generate(
          `tg://login?token=${code.token.toString("base64url")}`,
          { small: false }
        );
      },
      password: async () => f2apwd,
    }
  );
  console.log(`session:${client.session.save()}`);
  await client.disconnect();
  process.exit(0);
}

main();