const copyText = (txt) => {
  navigator.clipboard.writeText(txt);
};

window.Shiny.addCustomMessageHandler("blockr-copy-code", (msg) => {
  // todo notify user
  if (!msg.code) return;
  copyText(msg.code.map((code) => code.trim()).join("\n\t"));
});
