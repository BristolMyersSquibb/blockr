$(() => {
  $("body").on("click", ".stack-title-display", (event) => {
    const $group = $(event.target).closest(".stack-title");

    $group.find(".stack-title-display").addClass("d-none");
    $group.find(".stack-title-input").removeClass("d-none");
    $group.find(".stack-title-input").find("input").focus();
  });

  $("body").on("click", ".stack-title-save", (event) => {
    const $group = $(event.target)
      .closest(".input-group")
      .closest(".stack-title");

    const v = $group.find(".stack-title-input").find("input").val();
    if (v === "") {
      window.Shiny.notifications.show({
        html: "Must set a title",
        type: "error",
      });
      return;
    }
    $group.find(".stack-title-display").text(v);

    $group.find(".stack-title-input").addClass("d-none");
    $group.find(".stack-title-display").removeClass("d-none");
  });

  $("body").on("keydown", ".stack-title-input", (event) => {
    if (event.key !== "Enter") return;

    const $group = $(event.target).closest(".stack-title");

    const v = $(event.target).val();
    if (v === "") {
      window.Shiny.notifications.show({
        html: "Must set a title",
        type: "error",
      });
      return;
    }
    $group.find(".stack-title-display").text(v);

    $group.find(".stack-title-display").removeClass("d-none");
    $group.find(".stack-title-input").addClass("d-none");
  });
});
