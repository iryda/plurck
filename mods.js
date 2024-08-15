// ==UserScript==
// @name        mods.de blurry block
// @namespace   Violentmonkey Scripts
// @match       https://forum.mods.de/bb/thread.php*
// @grant       none
// @version     0.0.0.9.1.pre-alpha.dontuseme-dev
// @author      I
// @description blur out one (or several) users' posts and quotes of their posts (and allow un- and reblurring on click)
// @run-at      document-start
// ==/UserScript==

const observationTarget = document.documentElement || document.body;

const badUsers = [
  "badUser",
  "anotherOne",
  "yetAnotherOne",
  "GuessWhat? More",
  "Yep: Even more",
  "lastForNow",
];
const badUserIds = [
  "12345",
  "67890",
  "223344",
  "445566",
  "11223344",
  "55667788",
];
const howBlur = "blur(5px)";

const setBlur = (badObject) => {
  badObject.style.filter = howBlur;
};

const toggleBlur = (badObject) => {
  if (!badObject.style) return;

  if (!badObject.style.filter || badObject.style.filter === "") {
    badObject.style.filter = howBlur;
  } else {
    badObject.style.filter = "";
  }
};

const setHandler = (badObject) => {
  badObject.addEventListener("click", (event) => {
    toggleBlur(event.currentTarget);
  });
};

const observer = new MutationObserver((mutationList) => {
  for (const mutation of mutationList) {
    const badPosts = Array.from(mutation.addedNodes).filter((node) => {
      return badUserIds.some((badUserId) => {
        return node.attributes?.uid?.value === badUserId;
      });
    });
    badPosts.forEach((badPost) => setBlur(badPost));
    badPosts.forEach((badPost) => setHandler(badPost));

    const badQuotes = Array.from(mutation.addedNodes).filter((node) => {
      return (
        node.firstChild?.nodeName === "A" &&
        node.firstChild?.text === "Zitat" &&
        badUsers.some((usr) =>
          node?.textContent?.startsWith(`Zitat von ${usr}`),
        )
      );
    });
    badQuotes.forEach((badQuote) => setBlur(badQuote));
    badQuotes.forEach((badQuote) => setHandler(badQuote));
  }
});

observer.observe(observationTarget, { childList: true, subtree: true });
