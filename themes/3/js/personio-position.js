$(function () {
  // Cancel init
  if ($(".PersonioPosition").length === 0) return;

  /**
   * Returns all cookies.
   */
  function getCookies() {
    const cookies = decodeURIComponent(document.cookie);
    return cookies
      .split(";")
      .map((cookie) => cookie.trim())
      .map((cookie) => cookie.split("="))
      .reduce((map, [key, value]) => map.set(key, value), new Map());
  }

  /**
   * Deletes a cookie.
   * @param {string} name
   */
  function deleteCookie(name) {
    const path = window.location.pathname;
    document.cookie = `${name}=;path=${path};expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  }

  /**
   * Returns message for personio api error.
   * @param {string} code
   */
  function getErrorMessage(code) {
    switch (code) {
      case "errors.applicant-already-exists":
        return "Du hast dich bereits auf diese Stelle beworben.";
      default:
        return null;
    }
  }

  // Remove hardcoded styles
  $(".js-personio-unstyle *[style]").removeAttr("style");

  // Read cookies for error messages
  const cookies = getCookies();
  for (const [name, code] of cookies) {
    if (name.startsWith("error")) {
      const message = getErrorMessage(code);
      if (message) {
        alert(message);
      }

      // Remove if error acknowledged
      deleteCookie(name);
    }
  }
});
