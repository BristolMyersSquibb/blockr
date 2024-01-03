const copyFromElement = (el) => {
  navigator.clipboard.writeText($(el).text());
};

const copyText = (txt) => {
  navigator.clipboard.writeText(txt);
};

export const copyCode = () => {
  $(".block-copy-code").each((_index, btn) => {
    // TODO bind selectively instead of reset
    $(btn).off("click");

    $(btn).on("click", (event) => {
      const code = $(event.target).closest("div").find("pre");
      copyFromElement(code);
    });
  });
};

window.Shiny.addCustomMessageHandler("blockr-copy-code-stack", (msg) => {
  copyText(msg.code.map((code) => code.trim()).join("\n\t"));
});
