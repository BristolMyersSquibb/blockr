let locked = false;
window.Shiny.addCustomMessageHandler("lock", (msg) => {
  locked = msg.locked;
  handleLock();
  emitEvent(msg.locked);
});

export const isLocked = () => {
  return locked;
};

const emitEvent = (locked) => {
  const event = new CustomEvent("blockr:lock", {
    detail: {
      locked: locked,
    },
  });
  document.dispatchEvent(event);
};

const handleLock = () => {
  if (!locked) return;

  $(".block-code-toggle").hide();
  $(".block-output-toggle").hide();
  $(".stack-remove").hide();
  $(".stack-add-block").hide();
  $(".stack-edit-toggle").hide();
  $(".block-remove").hide();

  $(".stack-title").off();

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

  $stack.find(".block-code-toggle").hide();
  $stack.find(".block-output-toggle").hide();
  $stack.find(".stack-remove").hide();
  $stack.find(".stack-add-block").hide();
  $stack.find(".stack-edit-toggle").hide();
  $stack.find(".block-remove").hide();
  $stack.find(".stack-title").off();

  const $editor = $stack.find(".stack-edit-toggle");
  const isClosed = $editor.find("i").hasClass("fa-chevron-up");

  if (isClosed) return;

  $editor.trigger("click");
};
