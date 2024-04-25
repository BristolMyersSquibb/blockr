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

  $stack.find(".block-code-toggle").hide();
  $stack.find(".block-output-toggle").hide();
  $stack.find(".stack-remove").hide();
  $stack.find(".stack-add-block").hide();
  $stack.find(".stack-edit-toggle").hide();
  $stack.find(".block-remove").hide();
  $stack.find(".stack-title").off();

  const $editor = $stack.find(".stack-edit-toggle");
  const isClosed = $editor.find("i").hasClass("fa-chevron-up");

  moveInputs(stack);
  if (isClosed) return;
  $editor.trigger("click");
};

const moveInputs = (stack) => {
  if ($(stack).find(".blockr-shown-inputs").length > 0) return;

  $(stack)
    .find(".card-body")
    .first()
    .prepend("<div class='blockr-shown-inputs p-2'></div>");

  const $parent = $(stack).find(".card-body").find(".blockr-shown-inputs");

  let n = 0;
  $(stack)
    .find(".block")
    .each((_index, block) => {
      const blockTitle = $(block)
        .find(".block-title")
        .find(".fw-bold")
        .first()
        .html();

      const detached = [];
      $(block)
        .find(".lock-input[data-locked='true']")
        .each((_index, el) => {
          const input = $(el)
            .closest(".blockr-input-container")
            .find(".blockr-input")
            .detach();

          n++;
          detached.push(input);
        });

      if (detached.length === 0) return;

      $parent.append(`<h6 class="fw-bold">${blockTitle}</h6>`);

      while (detached.length > 0) {
        const rowItems = detached.splice(0, 4);

        const row = document.createElement("div");
        row.className = "row";

        rowItems.map((el) => {
          const col = document.createElement("div");
          col.className = "col-3";
          col.appendChild(el[0]);
          row.appendChild(col);
        });

        $parent.append(row);
      }
    });

  if (n > 0) return;

  $(stack).find(".card-body").first().find(".blockr-shown-inputs").remove();
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
