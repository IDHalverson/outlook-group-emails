document.addEventListener("DOMContentLoaded", function () {
  const enabled = document.getElementById("ogeEnabled");
  const leaveGrayBorders = document.getElementById("ogeLeaveGrayBorders");
  const onlyAdjacent = document.getElementById("ogeOnlyAdjacent");
  const excludeThreads = document.getElementById("ogeExcludeThreads");
  const groupedNumberTemplate = document.getElementById(
    "ogeGroupedNumberTemplate"
  );
  const runHowOften = document.getElementById("ogeRunHowOften");
  const matchOn = document.getElementById("ogeMatchOn");
  const senderList = document.getElementById("ogeSenderList");
  const subjectList = document.getElementById("ogeSubjectList");
  const senderBlacklist = document.getElementById("ogeSenderBlacklist");
  const subjectBlacklist = document.getElementById("ogeSubjectBlacklist");

  // Load stored states or default to true or false
  chrome.storage.sync.get(
    {
      enabled: true, // Default to enabled
      leaveGrayBorders: true, // Default to enabled
      onlyAdjacent: false, // Default to disabled
      excludeThreads: false, // Default to disabled
      groupedNumberTemplate: "({{n}}) -",
      runHowOften: 2,
      matchOn: "Sender & Subject",
      senderList: "",
      subjectList: "",
      senderBlacklist: "",
      subjectBlacklist: "",
    },
    function (items) {
      enabled.checked = items.enabled;
      leaveGrayBorders.checked = items.leaveGrayBorders;
      onlyAdjacent.checked = items.onlyAdjacent;
      excludeThreads.checked = items.excludeThreads;
      groupedNumberTemplate.value = items.groupedNumberTemplate;
      runHowOften.value = items.runHowOften;
      matchOn.value = items.matchOn;
      senderList.value = items.senderList;
      subjectList.value = items.subjectList;
      senderBlacklist.value = items.senderBlacklist;
      subjectBlacklist.value = items.subjectBlacklist;
    }
  );

  // Finish button
  document
    .getElementById("finish-button")
    .addEventListener("click", function () {
      window.close(); // This closes the popup
    });

  // Save states when checkboxes are clicked
  enabled.addEventListener("change", function () {
    chrome.storage.sync.set({ enabled: enabled.checked });
  });
  leaveGrayBorders.addEventListener("change", function () {
    chrome.storage.sync.set({ leaveGrayBorders: leaveGrayBorders.checked });
  });
  onlyAdjacent.addEventListener("change", function () {
    chrome.storage.sync.set({ onlyAdjacent: onlyAdjacent.checked });
  });
  excludeThreads.addEventListener("change", function () {
    chrome.storage.sync.set({ excludeThreads: excludeThreads.checked });
  });
  groupedNumberTemplate.addEventListener("change", function () {
    chrome.storage.sync.set({
      groupedNumberTemplate: groupedNumberTemplate.value,
    });
  });
  runHowOften.addEventListener("change", function () {
    chrome.storage.sync.set({ runHowOften: runHowOften.value });
  });
  matchOn.addEventListener("change", function () {
    chrome.storage.sync.set({ matchOn: matchOn.value });
  });
  senderList.addEventListener("change", function () {
    chrome.storage.sync.set({ senderList: senderList.value });
  });
  subjectList.addEventListener("change", function () {
    chrome.storage.sync.set({ subjectList: subjectList.value });
  });
  senderBlacklist.addEventListener("change", function () {
    chrome.storage.sync.set({ senderBlacklist: senderBlacklist.value });
  });
  subjectBlacklist.addEventListener("change", function () {
    chrome.storage.sync.set({ subjectBlacklist: subjectBlacklist.value });
  });
});
