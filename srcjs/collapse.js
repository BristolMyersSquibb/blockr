export const collapse = (stack) => {
  editor(stack);
  showLastOutputs(stack);
  toggleOutputInput(stack);
  handleIcons(stack);
  handleBlockError(stack);
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

  $(stack)
    .find(".stack-edit-toggle:not(.blockr-bound)")
    .addClass("blockr-bound");
  $(stack)
    .find(".block-output-toggle:not(.blockr-bound)")
    .addClass("blockr-bound");
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

        const inputVisible = $block.find(".block-inputs").is(":visible");

        let toggle = inputVisible;

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

    $(event.currentTarget).toggleClass("editable");
    const editable = $(event.currentTarget).hasClass("editable");

    if (!editable) {
      $(event.target)
        .closest(".stack")
        .find(".stack-add-block")
        .addClass("d-none");
    } else {
      $(event.target)
        .closest(".stack")
        .find(".stack-add-block")
        .removeClass("d-none");
    }

    $blocks.each((index, block) => {
      const $block = $(block);

      if (editable) {
        $block.removeClass("d-none");
        $block.find(".block-title").removeClass("d-none");

        $block.find(".block-code-toggle").removeClass("d-none");
        $block.find(".block-output-toggle").removeClass("d-none");

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

      $block.find(".block-code-toggle").addClass("d-none");
      $block.find(".block-output-toggle").addClass("d-none");
      $block.find(".block-output-toggle").find("i").addClass("fa-chevron-up");
      $block
        .find(".block-output-toggle")
        .find("i")
        .removeClass("fa-chevron-down");

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

  const $lastOutput = $block.find(".block-output");
  const $lastTitle = $block.find(".block-title");
  const $lastInputs = $block.find(".block-inputs");

  $lastTitle.addClass("d-none");
  $lastInputs.addClass("d-none");

  // hide togglers
  $block.find(".block-code-toggle").addClass("d-none");
  $block.find(".block-output-toggle").addClass("d-none");

  // we have a loading state
  // because some block validations have no last output
  const tableId = $lastOutput.find(".shiny-bound-output").first().attr("id");

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

const handleBlockError = (stack) => {
  let hasError = false;
  $(stack)
    .find(".block>.card")
    .each((_index, block) => {
      if (!$(block).hasClass("border-danger")) return;

      hasError = true;
    });

  if (!hasError) return;

  $(stack).find(".stack-edit-toggle").trigger("click");
};
