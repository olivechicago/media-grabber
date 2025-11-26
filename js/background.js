// js/background.js

// 1. **MANDATORY MV3 CHANGE:** // Register listeners at the top level because the Service Worker 
// is event-driven and terminates when idle.

// List of media file extensions to look for
const MEDIA_TYPES = ["mp4", "webm", "ogg", "mp3", "wav", "flac", "mkv", "avi"];

// Use the webRequest API to intercept all network requests
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    const url = details.url;
    // Check if the URL matches a known media file extension
    const isMedia = MEDIA_TYPES.some(ext => url.includes(`.${ext}`));

    if (isMedia) {
      // Store the found media URL using the Storage API
      chrome.storage.local.set({ 
        'lastMediaUrl': url,
        'lastMediaPage': details.tabId 
      });

      // Optional: Log it for debugging
      console.log('Media URL found and saved:', url);
    }
  },
  // Filters: Monitor all requests on all pages
  { 
    urls: ["<all_urls>"],
    types: ["main_frame", "sub_frame", "object", "xmlhttprequest"] 
  },
  // Extra request information to include
  [] // No extra info needed for observation
);


// 2. **ACTION LISTENER (MV3 replacement for pageAction)**
// This is triggered when the popup is clicked, which is a key part of the extension's function.
chrome.action.onClicked.addListener((tab) => {
    // Check for the stored media URL when the action icon is clicked
    chrome.storage.local.get(['lastMediaUrl'], function(data) {
        if (data.lastMediaUrl) {
            console.log("Popup clicked. Last URL:", data.lastMediaUrl);
            // You can optionally inject a script here to update the popup/options page,
            // or rely on the popup.js script to fetch the data after it opens.
        }
    });
});


// 3. **BOOKMARKS IMPORT LOGIC (Your Original Logic)**
// If your original script had other listeners (like for bookmarks import),
// you must include them here, registered at the top level.

// Example of the Bookmarks API usage (must be placed here):
// chrome.bookmarks.getTree((bookmarkTreeNodes) => {
//     // ... original bookmark logic here ...
// });
