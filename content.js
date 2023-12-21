let intervalId = null;

function escapeRegex(string) {
  return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&");
}

function consolidateMessages() {
  if (chrome && chrome.runtime && chrome.runtime.id) {
    chrome.storage.sync.get(
      {
        enabled: true, // Default to enabled
        leaveGrayBorders: true, // Default to enabled
        onlyAdjacent: false, // Default to disabled
        excludeThreads: false, // Default to disabled
        groupedNumberTemplate: "({{n}}) -",
        matchOn: "Sender & Subject",
        senderList: "",
        subjectList: "",
        senderBlacklist: "",
        subjectBlacklist: "",
      },
      function ({
        enabled,
        leaveGrayBorders,
        onlyAdjacent,
        excludeThreads,
        groupedNumberTemplate,
        matchOn,
        senderList,
        subjectList,
        senderBlacklist,
        subjectBlacklist,
      }) {
        if (!enabled) return;
        const requiredSenders = senderList
          .split(",")
          .map((it) => it.trim().toLowerCase())
          .filter(Boolean);
        const requiredSubjects = subjectList
          .split(",")
          .map((it) => it.trim().toLowerCase())
          .filter(Boolean);
        const blacklistedSenders = senderBlacklist
          .split(",")
          .map((it) => it.trim().toLowerCase())
          .filter(Boolean);
        const blacklistedSubjects = subjectBlacklist
          .split(",")
          .map((it) => it.trim().toLowerCase())
          .filter(Boolean);
        const limit = 5000;
        const allDivs = Array.from(
          document.querySelectorAll(
            `div[aria-label="Message list"] > #MailList > div > div > div > div > div > div > div div div[draggable="true"]`
          )
        );
        const toRemoves = [];
        allDivs.forEach((div, ix) => {
          let count = 1;
          let iteration = 1;
          let nextMessageToCheck = allDivs[ix + iteration];
          const threadButton = div.querySelector(
            `div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(1) > button`
          );
          const hasThreadButton =
            threadButton && (threadButton.textContent || "").length === 1; //chevron symbol
          if (!(excludeThreads && hasThreadButton)) {
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
            let nextSendersList;
            let nextSubj;
            let nextHasThreadButton;
            const updateNextMessageToCheckVars = () => {
              if (nextMessageToCheck) {
                const nextThreadButton = nextMessageToCheck.querySelector(
                  `div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(1) > button`
                );
                nextHasThreadButton =
                  nextThreadButton &&
                  (nextThreadButton.textContent || "").length === 1; //chevron symbol
                const nextSenderDiv = nextMessageToCheck.querySelector(
                  `div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(${
                    nextHasThreadButton ? 3 : 2
                  }) > span`
                );
                nextSender = nextSenderDiv
                  ? nextSenderDiv.textContent.trim()
                  : "";
                nextSendersList = nextSender
                  .split(";")
                  .map((it) => it.trim().toLowerCase())
                  .filter(Boolean);
                const nextSubjDiv = nextMessageToCheck.querySelector(
                  `div > div:nth-child(2) > div > div:nth-child(2) > div > div > span`
                );
                nextSubj = nextSubjDiv ? nextSubjDiv.textContent.trim() : "";
              }
            };
            updateNextMessageToCheckVars();

            _whileLoop: while (nextMessageToCheck) {
              iteration++;
              if (
                sender &&
                subj &&
                nextSender &&
                nextSubj &&
                (matchOn === "Subject Only" || sender === nextSender) &&
                (matchOn === "Sender Only" || subj === nextSubj) &&
                count <= limit &&
                !(excludeThreads && nextHasThreadButton) &&
                (!requiredSenders.length ||
                  nextSendersList.some((sender) =>
                    requiredSenders.some((requiredSender) => {
                      const isStart = requiredSender.endsWith("%");
                      const isEnd = requiredSender.startsWith("%");
                      if (isStart && isEnd) {
                        const withoutPerc = requiredSender
                          .replace(/^\%/, "")
                          .replace(/\%$/, "");
                        return withoutPerc && sender.includes(withoutPerc);
                      } else if (isStart) {
                        return sender.startsWith(
                          requiredSender.replace(/\%$/, "")
                        );
                      } else if (isEnd) {
                        return sender.endsWith(
                          requiredSender.replace(/^\%/, "")
                        );
                      } else {
                        return sender === requiredSender;
                      }
                    })
                  )) &&
                (!blacklistedSenders.length ||
                  !nextSendersList.some((sender) =>
                    blacklistedSenders.some((blacklistedSender) => {
                      const isStart = blacklistedSender.endsWith("%");
                      const isEnd = blacklistedSender.startsWith("%");
                      if (isStart && isEnd) {
                        const withoutPerc = blacklistedSender
                          .replace(/^\%/, "")
                          .replace(/\%$/, "");
                        return withoutPerc && sender.includes(withoutPerc);
                      } else if (isStart) {
                        return sender.startsWith(
                          blacklistedSender.replace(/\%$/, "")
                        );
                      } else if (isEnd) {
                        return sender.endsWith(
                          blacklistedSender.replace(/^\%/, "")
                        );
                      } else {
                        return sender === blacklistedSender;
                      }
                    })
                  )) &&
                (!requiredSubjects.length ||
                  requiredSubjects.some((requiredSubject) => {
                    const isStart = requiredSubject.endsWith("%");
                    const isEnd = requiredSubject.startsWith("%");
                    if (isStart && isEnd) {
                      const withoutPerc = requiredSubject
                        .replace(/^\%/, "")
                        .replace(/\%$/, "");
                      return (
                        withoutPerc &&
                        nextSubj.toLowerCase().includes(withoutPerc)
                      );
                    } else if (isStart) {
                      return nextSubj
                        .toLowerCase()
                        .startsWith(requiredSubject.replace(/\%$/, ""));
                    } else if (isEnd) {
                      return nextSubj
                        .toLowerCase()
                        .endsWith(requiredSubject.replace(/^\%/, ""));
                    } else {
                      return nextSubj.toLowerCase() === requiredSubject;
                    }
                  })) &&
                (!blacklistedSubjects.length ||
                  !blacklistedSubjects.some((blacklistedSubject) => {
                    const isStart = blacklistedSubject.endsWith("%");
                    const isEnd = blacklistedSubject.startsWith("%");
                    if (isStart && isEnd) {
                      const withoutPerc = blacklistedSubject
                        .replace(/^\%/, "")
                        .replace(/\%$/, "");
                      return (
                        withoutPerc &&
                        nextSubj.toLowerCase().includes(withoutPerc)
                      );
                    } else if (isStart) {
                      return nextSubj
                        .toLowerCase()
                        .startsWith(blacklistedSubject.replace(/\%$/, ""));
                    } else if (isEnd) {
                      return nextSubj
                        .toLowerCase()
                        .endsWith(blacklistedSubject.replace(/^\%/, ""));
                    } else {
                      return nextSubj.toLowerCase() === blacklistedSubject;
                    }
                  }))
              ) {
                count++;
                const toRemove = leaveGrayBorders
                  ? nextMessageToCheck
                  : nextMessageToCheck.parentNode.parentNode.parentNode;
                toRemoves.push(toRemove);
              } else {
                if (onlyAdjacent) {
                  break _whileLoop;
                }
              }
              nextMessageToCheck = allDivs[ix + iteration];
              updateNextMessageToCheckVars();
            }

            if (count > 1) {
              if (subj) {
                const regexForAlreadyPrepended = new RegExp(
                  "^" +
                    escapeRegex(groupedNumberTemplate).replace(
                      "\\{\\{n\\}\\}",
                      "[0-9]+"
                    )
                );
                if (
                  subjDiv.textContent &&
                  subjDiv.textContent.match(regexForAlreadyPrepended)
                ) {
                  subjDiv.textContent = subjDiv.textContent.replace(
                    regexForAlreadyPrepended,
                    groupedNumberTemplate.replace("{{n}}", count)
                  );
                } else {
                  const newSubj =
                    matchOn === "Sender Only"
                      ? subj.split("").slice(0, 70).join("") +
                        ". . . (SUBJECT(S) VARIOUS/GROUPED)"
                      : subj;
                  subjDiv.textContent = `${groupedNumberTemplate.replace(
                    "{{n}}",
                    count
                  )} ${newSubj}`;
                  if (matchOn === "Subject Only") {
                    senderDiv.textContent = `${sender
                      .split("")
                      .slice(0, 23)
                      .join("")} (VARIOUS/GROUPED)`;
                  }
                }
              }
            }
          }
        });
        toRemoves.forEach((tR) => tR.remove());
      }
    );
  }
}

function startInterval() {
  // Prevent multiple intervals from being created
  if (intervalId !== null) {
    clearInterval(intervalId);
  }
  if (chrome && chrome.runtime && chrome.runtime.id) {
    chrome.storage.sync.get(
      {
        runHowOften: 2,
      },
      function ({ runHowOften }) {
        intervalId = setInterval(consolidateMessages, runHowOften * 1000);
      }
    );
  }
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
