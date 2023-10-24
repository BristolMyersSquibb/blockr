export const collapse = (stack) => {
  editor(stack);
  showLastOutputs(stack);
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
          $block.find(".block-inputs").trigger("shown");
          $block.find(".block-output").show();
          $block.find(".block-output").trigger("shown");
        }
        return;
      }

      $block.hide();
      $block.find(".block-inputs").hide();

      if (index == ($blocks.length - 1)) {
        $block.show();
        $block.find(".block-inputs").hide();
        $block.find(".block-inputs").trigger("hidden");
        $block.find(".block-output").show();
        $block.find(".block-output").trigger("shown");
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
