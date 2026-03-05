
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys")
const P = require("pino")

async function startBot() {

const { state, saveCreds } = await useMultiFileAuthState("session")

const sock = makeWASocket({
logger: P({ level: "silent" }),
auth: state,
printQRInTerminal: true
})

sock.ev.on("creds.update", saveCreds)

sock.ev.on("connection.update", (update) => {
const { connection, lastDisconnect } = update

if (connection === "close") {

const shouldReconnect =
(lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut

console.log("Connexion fermée")

if (shouldReconnect) {
startBot()
}

} else if (connection === "open") {

console.log("Bot connecté à WhatsApp ✅")

}

})

sock.ev.on("messages.upsert", async ({ messages }) => {

const msg = messages[0]

if (!msg.message) return
if (msg.key.fromMe) return

const text =
msg.message.conversation ||
msg.message.extendedTextMessage?.text

const from = msg.key.remoteJid

if (text === ".ping") {

await sock.sendMessage(from, { text: "pong 🏓 Bot actif !" })

}

})

}

startBot()
