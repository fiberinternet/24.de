$(function () {
  // Cancel init
  if ($(".PersonioPositions").length === 0) return;

  // Initialize state.
  const url = new URL(location.href);
  const state = {
    query: new URLSearchParams(url.searchParams),
  };

  /**
   * Renders template using ajax.
   */
  async function render() {
    const url = new URL(location.href);
    url.search = state.query.toString();

    if (history.replaceState) {
      // Write state to url without navigating
      history.replaceState(null, "", url);
    }

    const result = await fetch(url);
    const html = await result.text();
    const $page = $(html);

    $(".personio__positions").replaceWith($page.find(".personio__positions"));
    $(".personio__pagination").replaceWith($page.find(".personio__pagination"));
    $(".personio__pagination-dot").on("click", handleClickPaginationDot);
  }

  /**
   * Renders office filter and dropdown given the current state
   */
  function renderOfficeDropdown() {
    const showDropdown = officeInputFocused || officeDropdownFocused;
    $officeDropdown.toggle(showDropdown);
    $officeInputIcon.toggleClass("fa-chevron-down", !showDropdown).toggleClass("fa-search", showDropdown);

    if (showDropdown) {
      const search = $officeInput.val().toLocaleLowerCase();
      $officeOptions.each(function () {
        const normalized = this.value.toLocaleLowerCase();
        $(this).closest("label").toggle(normalized.startsWith(search));
      });

      $officeInput.attr("placeholder", "Standort");
    } else {
      const values = $officeOptions
        .map((_, option) => (option.checked ? option.value : null))
        .get()
        .filter(Boolean)
        .join(", ");

      $officeInput.attr("placeholder", values || "Standort");
    }
  }

  /**
   * Fires when pagination dot is clicked.
   * @param {Event} e
   */
  async function handleClickPaginationDot(e) {
    const $dot = $(e.currentTarget);
    if ($dot.closest("li").attr("disabled")) {
      return;
    }

    const page = parseInt($dot.data("page"), 10);
    state.query.set("page", page);

    // scroll to first position in list
    $(".personio__position").get(0)?.scrollIntoView({
      block: "center",
      inline: "center",
    });

    await render();
  }

  /**
   * Fires when search form is submitted.
   * @param {Event} e
   */
  async function handleSubmitSearchForm(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const search = data.get("search");
    state.query.set("search", search);
    state.query.set("page", 1);
    await render();
  }

  async function handleSubmitFilterForm(e) {
    e.preventDefault();
  }

  /**
   * Fires when filters changed.
   * @param {Event} e
   */
  async function handleChangeFilter(e) {
    const formData = new FormData(e.currentTarget);

    state.query.delete("filters[office][]");
    for (const name of formData.keys()) {
      state.query.delete(name);
    }

    for (const [name, value] of formData.entries()) {
      if (value) {
        state.query.append(name, value);
      }
    }

    state.query.set("page", 1);
    await render();
  }

  // Make view interactive
  $(".personio__pagination-dot").on("click", handleClickPaginationDot);
  $(".personio__filters").on("change", handleChangeFilter).on("submit", handleSubmitFilterForm);
  $(".personio__search-form").on("submit", handleSubmitSearchForm);

  $officeOptions = $(".js-personio-office-option");
  $officeDropdown = $officeOptions.closest("ul").first();
  $officeInput = $(".js-personio-office-input");
  $officeInputIcon = $officeInput.next().children("i");

  officeInputFocused = false;
  officeDropdownFocused = false;

  $officeDropdown.on("pointerenter", function () {
    officeDropdownFocused = true;
    renderOfficeDropdown();
  });

  $officeDropdown.on("pointerleave", function () {
    officeDropdownFocused = false;
    renderOfficeDropdown();
  });

  $officeInput.on("focus", function () {
    officeInputFocused = true;
    renderOfficeDropdown();
  });

  $officeInput.on("blur", function () {
    officeInputFocused = false;
    renderOfficeDropdown();
  });

  $officeInput.on("input", function () {
    renderOfficeDropdown();
  });

  $officeOptions.on("change", function () {
    $officeInput.val("").focus();
    $officeOptions.closest("label").show();
  });
});
