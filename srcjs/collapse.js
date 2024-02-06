export const collapse = (stack) => {
  editor(stack);
  showLastOutputs(stack);
  toggleOutputInput(stack);
  handleIcons(stack);
};

export const handleIcons = (stack) => {
  $(stack)
    .find(".stack-edit-toggle:not(.blockr-bound)")
    .on("click", (event) => {
      $(event.currentTarget)
        .find("i")
        .toggleClass("fa-chevron-up fa-chevron-down");
    });

  $(stack)
    .find(".block-output-toggle:not(.blockr-bound)")
    .on("click", (event) => {
      $(event.currentTarget)
        .find("i")
        .toggleClass("fa-chevron-up fa-chevron-down");
    });

  $(stack).find(".stack-edit-toggle").addClass("blockr-bound");
  $(stack).find(".block-output-toggle").addClass("blockr-bound");
};

export const toggleOutputInput = (stack) => {
  $(stack)
    .find(".block-output-toggle")
    .each((_index, btn) => {
      // already has a listener
      if ($(btn).hasClass("block-bound")) {
        return;
      }

      $(btn).addClass("block-bound");

      $(btn).on("click", (event) => {
        const $block = $(event.target).closest(".block");

        const outputVisible = $block.find(".block-output").is(":visible");
        const inputVisible = $block.find(".block-input").is(":visible");

        const toggle = outputVisible || inputVisible;

        if (toggle) {
          $block.find(".block-inputs").addClass("d-none");
          $block.find(".block-output").addClass("d-none");
        } else {
          $block.find(".block-inputs").removeClass("d-none");
          $block.find(".block-output").removeClass("d-none");
        }

        let ev = "shown";
        if ($block.find(".block-output").hasClass("d-none")) {
          ev = "hidden";
        }

        $block.find(".block-inputs").trigger(ev);
        $block.find(".block-output").trigger(ev);
      });
    });
};

const editor = (stack) => {
  const editBtn = $(stack).find(".stack-edit-toggle");

  // already has a listener
  if ($(editBtn).hasClass("block-bound")) {
    return;
  }

  $(editBtn).addClass("block-bound");

  $(editBtn).on("click", (event) => {
    const $stack = $(event.target).closest(".stack");
    const $blocks = $stack.find(".block");

    $(event.currentTarget).toggleClass("etidable");
    const editable = $(event.currentTarget).hasClass("etidable");

    $blocks.each((index, block) => {
      const $block = $(block);

      if (editable) {
        $block.removeClass("d-none");
        $block.find(".block-title").removeClass("d-none");

        if (index == $blocks.length - 1) {
          $block.find(".block-output").addClass("show");
          $block.find(".block-output").removeClass("d-none");
          $block.find(".block-output").trigger("shown");

          const code = window.bootstrap.Collapse.getOrCreateInstance(
            $block.find(".block-code")[0],
            { toggle: false },
          );
          code.hide();

          $block.find(".block-inputs").addClass("d-none");
          $block.find(".block-inputs").trigger("hidden");
          return;
        }

        $block.find(".block-loading").addClass("d-none");
        return;
      }

      $block.find(".block-title").addClass("d-none");
      if (index == $blocks.length - 1) {
        $block.removeClass("d-none");

        $block.find(".block-output").addClass("show");
        $block.find(".block-output").removeClass("d-none");
        $block.find(".block-output").trigger("shown");

        const code = window.bootstrap.Collapse.getOrCreateInstance(
          $block.find(".block-code")[0],
          { toggle: false },
        );
        code.hide();

        $block.find(".block-inputs").addClass("d-none");
        $block.find(".block-inputs").trigger("hidden");
        return;
      }

      $block.addClass("d-none");
    });
  });
};

export const showLastOutput = (el) => {
  const $block = $(el).find(".block").last();

  $block.removeClass("d-none");
  const $lastOutput = $block.find(".block-output");
  const $lastTitle = $block.find(".block-title");

  $block
    .find(".block-output-toggle i")
    .toggleClass("fa-chevron-up fa-chevron-down");

  $lastTitle.addClass("d-none");
  $lastOutput.removeClass("d-none");
  $lastOutput.trigger("shown");

  // we have a loading state
  // because some block validations have no last output
  const tableId = $lastOutput.find(".datatables").first().attr("id");

  if (!tableId) {
    $lastOutput.find(".block-loading").addClass("d-none");
    return;
  }

  $(document).on("shiny:value", (event) => {
    if (event.name !== tableId) {
      return;
    }

    $lastOutput.find(".block-loading").addClass("d-none");
  });
};

const showLastOutputs = (stack) => {
  $(stack).each((_, el) => {
    showLastOutput(el);
  });
};
