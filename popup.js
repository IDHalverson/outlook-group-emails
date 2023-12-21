document.addEventListener("DOMContentLoaded", function () {
  const enabled = document.getElementById("ogeEnabled");
  const leaveGrayBorders = document.getElementById("ogeLeaveGrayBorders");
  const onlyAdjacent = document.getElementById("ogeOnlyAdjacent");
  const groupedNumberTemplate = document.getElementById(
    "ogeGroupedNumberTemplate"
  );
  const runHowOften = document.getElementById("ogeRunHowOften");

  // Load stored states or default to true or false
  chrome.storage.sync.get(
    {
      enabled: true, // Default to enabled
      leaveGrayBorders: true, // Default to enabled
      onlyAdjacent: false, // Default to disabled
      groupedNumberTemplate: "({{n}}) -",
      runHowOften: 2,
    },
    function (items) {
      enabled.checked = items.enabled;
      leaveGrayBorders.checked = items.leaveGrayBorders;
      onlyAdjacent.checked = items.onlyAdjacent;
      groupedNumberTemplate.value = items.groupedNumberTemplate;
      runHowOften.value = items.runHowOften;
    }
  );

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
  groupedNumberTemplate.addEventListener("change", function () {
    chrome.storage.sync.set({
      groupedNumberTemplate: groupedNumberTemplate.value,
    });
  });
  runHowOften.addEventListener("change", function () {
    chrome.storage.sync.set({ runHowOften: runHowOften.value });
  });
});
