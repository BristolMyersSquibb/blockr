export const handleSearch = () => {
    $("body").on("keyup", ".add-block-search", search);
};

const search = (event) => {
    let debounce;

    const query = $(event.target).val().toLowerCase();

    const pillsContainer = $(event.target).
        closest(".offcanvas-body").
        find(".scrollable-child");

    console.log(query);

    clearTimeout(debounce);

    debounce = setTimeout(() => {
        const blocks = $(pillsContainer).find(".add-block");

        if (query == "") {
            $(blocks).show();
            return;
        }

        blocks.each((_index, block) => {
            const text = $(block).text().toLowerCase();

            if(text.includes(query)){
                $(block).show();
                return;
            }

            const desc = $(block).data("description").toLowerCase();

            if (desc.includes(query)) {
                $(block).show();
                return;
            }

            $(block).hide();
        });
    }, 150);
};
