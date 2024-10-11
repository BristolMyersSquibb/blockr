const copyText = (txt) => {
  navigator.clipboard.writeText(txt);
};

window.Shiny.addCustomMessageHandler("blockr-copy-code", (msg) => {
  // todo notify user
  if (!msg.code) {
    window.Shiny.notifications.show({
      html: "<span>Failed to copy code to clipboard</span>",
      type: "error",
    });
    return;
  }
  copyText(msg.code.map((code) => code.trim()).join("\n\t"));
  window.Shiny.notifications.show({
    html: "<span>Code copied to clipboard</span>",
    type: "message",
  });
});

window.Shiny.addCustomMessageHandler("toggle-copy-code", (msg) => {
  if (!msg.state) {
    $(`#${msg.id}`).hide()
  } else {
    $(`#${msg.id}`).show()
  }
});
