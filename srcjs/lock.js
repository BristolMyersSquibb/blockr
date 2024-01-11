let locked = false;
window.Shiny.addCustomMessageHandler("lock", (msg) => {
  locked = msg.locked;
  handleLock();
  const event = new CustomEvent("blockr:lock", {
    detail: {
      locked: msg.locked,
    },
  });
  document.dispatchEvent(event);
});

const handleLock = () => {
  $(".stack-remove").toggle();
  $(".stack-edit-toggle").toggle();
  $(".stack-copy-code").toggle();
  $(".block-code-toggle").toggle();
  $(".block-output-toggle").toggle();
  $(".block-remove").toggle();

  if (!locked) return;

  $(".stack").each((_index, el) => {
    const $editor = $(el).find(".stack-edit-toggle");
    const isClosed = $editor.find("i").hasClass("fa-chevron-up");

    if (isClosed) return;

    $editor.trigger("click");
  });
};

export const renderLocked = (stack, state) => {
  locked = state;
  if (!locked) return;

  lock(stack);
};

const lock = (stack) => {
  if (!locked) return;
  let $stack = $(stack);

  $stack.find(".stack-remove").hide();
  $stack.find(".stack-edit-toggle").hide();
  $stack.find(".stack-copy-code").hide();
  $stack.find(".block-code-toggle").hide();
  $stack.find(".block-output-toggle").hide();
  $stack.find(".block-remove").hide();

  const $editor = $stack.find(".stack-edit-toggle");
  const isClosed = $editor.find("i").hasClass("fa-chevron-up");

  if (isClosed) return;

  $editor.trigger("click");
};
