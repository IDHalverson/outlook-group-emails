document.addEventListener("DOMContentLoaded", function () {
  var enabled = document.getElementById("ogeEnabled");
  var leaveGrayBorders = document.getElementById("ogeLeaveGrayBorders");
  var onlyAdjacent = document.getElementById("ogeOnlyAdjacent");

  // Load stored states or default to true or false
  chrome.storage.sync.get(
    {
      enabled: true, // Default to enabled
      leaveGrayBorders: true, // Default to enabled
      onlyAdjacent: false, // Default to disabled
    },
    function (items) {
      enabled.checked = items.enabled;
      leaveGrayBorders.checked = items.leaveGrayBorders;
      onlyAdjacent.checked = items.onlyAdjacent;
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
});
