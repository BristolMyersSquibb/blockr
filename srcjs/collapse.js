export const collapse = (stack) => {
  bindCollapse("code");
  bindCollapse("output");
  editor(stack);
  showLastOutputs(stack);
};

const bindCollapse = (item) => {
  $(`.stack-${item}-toggle`).each((_, btn) => {
    // already has a listener
    if (btn.getAttribute("listener") == "true") {
      return;
    }

    $(btn).on("click", (event) => {
      $(btn).toggleClass("showing");

      $(event.target).closest(".stack").find(`.block-${item}`).each(
        (_, code) => {
          const collapse = bootstrap.Collapse.getOrCreateInstance(code, {
            toggle: false,
          });

          if (!$(btn).hasClass("showing")) {
            collapse.hide();
            return;
          }

          collapse.show();
        },
      );
    });
  });
};

const editor = (stack) => {
  const editBtn = $(stack).find(".stack-edit-toggle");

  // already has a listener
  if (editBtn[0].getAttribute("listener")) {
    return;
  }

  $(editBtn).on("click", (event) => {
    const $stack = $(event.target).closest(".stack");
    const $blocks = $stack.find(".block");

    $(event.currentTarget).toggleClass("etidable");
    const editable = $(event.currentTarget).hasClass("etidable");

    $blocks.each((index, block) => {
      const $block = $(block);

      if (editable) {
        $block.show();
        $block.find(".block-inputs").show();

        if (index == ($blocks.length - 1)) {
          $block.find(".block-inputs").show();
          $block.find(".block-output").show();
        }
        return;
      }

      $block.hide();
      $block.find(".block-inputs").hide();

      if (index == ($blocks.length - 1)) {
        $block.show();
        $block.find(".block-inputs").hide();
        $block.find(".block-output").show();
      }
    });
  });
};

export const showLastOutput = (el) => {
  const $block = $(el).find(".block").last();

  $block.show();
  const lastOutput = $block.find(".block-output");

  bootstrap.Collapse.getOrCreateInstance(lastOutput, { toggle: false }).show();
  $(lastOutput).trigger("shown");
};

const showLastOutputs = (stack) => {
  $(stack).each((_, el) => {
    showLastOutput(el);
  });
};
