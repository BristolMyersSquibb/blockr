window.Shiny.addCustomMessageHandler("lock", (msg) => {
  window.blockrLocked = msg.locked;
  lock();
  const event = new CustomEvent("blockr:lock", {
    detail: {
      locked: msg.locked,
    },
  });
  document.dispatchEvent(event);
});

export const lock = () => {
  $(".stack-remove").toggle();
  $(".stack-edit-toggle").toggle();
  $(".stack-copy-code").toggle();
  $(".block-code-toggle").toggle();
  $(".block-output-toggle").toggle();
  $(".block-remove").toggle();

  if (!window.blockrLocked) return;

  $(".stack").each((_index, el) => {
    const $editor = $(el).find(".stack-edit-toggle");
    const isClosed = $editor.find("i").hasClass("fa-chevron-up");

    if (isClosed) return;

    $editor.trigger("click");
  });
};
