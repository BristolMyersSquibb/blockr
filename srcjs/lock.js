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

  $(".stack").each((_index, el) => {
    lock(el);
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

  $stack.find(".stack-tools").hide();
  $stack.find(".block-code-toggle").hide();
  $stack.find(".block-output-toggle").hide();
  $stack.find(".block-remove").hide();
  $(".stack-title").off();

  const $editor = $stack.find(".stack-edit-toggle");
  const isClosed = $editor.find("i").hasClass("fa-chevron-up");

  if (isClosed) return;

  $editor.trigger("click");
  moveInputs(stack);
};

const moveInputs = (stack) => {
  $(stack)
    .find(".card-body")
    .first()
    .prepend("<div class='blockr-shown-inputs p-2'></div>");

  const $parent = $(stack).find(".card-body").find(".blockr-shown-inputs");

  $(stack)
    .find(".block")
    .each((_index, block) => {
      const blockTitle = $(block)
        .find(".block-title")
        .find(".fw-bold")
        .first()
        .text();

      const detached = [];
      $(block)
        .find(".lock-input[data-locked='true']")
        .each((_index, el) => {
          const input = $(el)
            .closest(".blockr-input-container")
            .find(".blockr-input")
            .detach();

          detached.push(input);
        });

      if (detached.length === 0) return;

      $parent.append(`<h6 class="fw-bold">${blockTitle}</h6>`);
      detached.forEach((detached) => {
        $parent.append(detached);
      });
    });
};

const toggleLock = (el) => {
  const locked = el.attr("data-locked") === "true";
  el.find("i").toggleClass("fa-eye fa-eye-slash");
  el.attr("data-locked", String(!locked));
};

$(document).on("click", ".lock-input", function (event) {
  const $el = $(event.currentTarget);
  toggleLock($el);
  $el.trigger("change");
});

const lockInput = new window.Shiny.InputBinding();

$.extend(lockInput, {
  find: function (scope) {
    return $(scope).find(".lock-input");
  },
  getValue: function (el) {
    return $(el).attr("data-locked") === "true";
  },
  setValue: function (el, value) {
    toggleLock(el);
    $(el).attr("data-locked", value);
  },
  receiveMessage: function (el, value) {
    this.setValue(el, value);
  },
  subscribe: function (el, callback) {
    $(el).on("change.lock-input", function () {
      callback(true);
    });
  },
  unsubscribe: function (el) {
    $(el).off(".lock-input");
  },
});

window.Shiny.inputBindings.register(lockInput, "blockr.lockInput");
