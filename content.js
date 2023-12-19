let intervalId = null;

function consolidateMessages() {
  const limit = 5000;
  const allDivs = Array.from(
    document.querySelectorAll(
      `div[aria-label="Message list"] > #MailList > div > div > div > div > div > div > div div div[draggable="true"]`
    )
  );
  const toRemoves = [];
  allDivs.forEach((div, ix) => {
    let count = 1;
    let nextSibling = allDivs[ix + 1];
    const threadButton = div.querySelector(
      `div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(1) > button`
    );
    const hasThreadButton =
      threadButton && (threadButton.textContent || "").length === 1; //chevron symbol
    const senderDiv = div.querySelector(
      `div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(${
        hasThreadButton ? 3 : 2
      }) > span`
    );
    const sender = senderDiv ? senderDiv.textContent.trim() : "";
    const subjDiv = div.querySelector(
      `div > div:nth-child(2) > div > div:nth-child(2) > div > div > span`
    );
    const subj = subjDiv ? subjDiv.textContent.trim() : "";

    let nextSender;
    let nextSubj;
    const updateNextSiblingVars = () => {
      if (nextSibling) {
        const nextThreadButton = nextSibling.querySelector(
          `div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(1) > button`
        );
        const nextHasThreadButton =
          nextThreadButton && (nextThreadButton.textContent || "").length === 1; //chevron symbol
        const nextSenderDiv = nextSibling.querySelector(
          `div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(${
            nextHasThreadButton ? 3 : 2
          }) > span`
        );
        nextSender = nextSenderDiv ? nextSenderDiv.textContent.trim() : "";
        const nextSubjDiv = nextSibling.querySelector(
          `div > div:nth-child(2) > div > div:nth-child(2) > div > div > span`
        );
        nextSubj = nextSubjDiv ? nextSubjDiv.textContent.trim() : "";
      }
    };
    updateNextSiblingVars();

    while (
      sender &&
      subj &&
      nextSibling &&
      nextSender &&
      nextSubj &&
      sender === nextSender &&
      subj === nextSubj &&
      count <= limit
    ) {
      count++;
      const toRemove = nextSibling;
      nextSibling = allDivs[ix + count];
      updateNextSiblingVars();
      toRemoves.push(toRemove);
    }

    if (count > 1) {
      if (subj) {
        subjDiv.textContent = `${count} - ${subj}`;
      }
    }
  });
  toRemoves.forEach((tR) => tR.remove());
}

function startInterval() {
  // Prevent multiple intervals from being created
  if (intervalId !== null) {
    clearInterval(intervalId);
  }
  intervalId = setInterval(consolidateMessages, 3000);
}

function stopInterval() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

const initialize = () => {
  setTimeout(consolidateMessages, 1);
  startInterval();
  // Clear the interval when the page starts unloading
  window.onbeforeunload = stopInterval;
};

// Run the function when the document is loaded
if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  initialize();
} else {
  document.addEventListener("DOMContentLoaded", initialize);
}
