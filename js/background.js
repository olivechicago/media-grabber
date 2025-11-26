// js/background.js

// List of media file extensions to look for
const MEDIA_TYPES = ["mp4", "webm", "ogg", "mp3", "wav", "flac", "mkv", "avi", "mov", "wmv"]; // Added a few more common types

// **NEW:** Use the 'onInstalled' listener to ensure the webRequest listener is always registered properly.
chrome.runtime.onInstalled.addListener(() => {
    // 1. **webRequest Listener Registration**
    if (!chrome.webRequest.onBeforeRequest.hasListener(mediaGrabberListener)) {
        chrome.webRequest.onBeforeRequest.addListener(
            mediaGrabberListener,
            // Filters: Monitor all requests on all pages
            { 
                urls: ["<all_urls>"],
                types: ["main_frame", "sub_frame", "object", "xmlhttprequest", "media"] // Added 'media' type
            },
            [] 
        );
        console.log("Media Grabber webRequest listener registered.");
    }
});


// 2. **The Listener Function** (Extracted for clean registration)
function mediaGrabberListener(details) {
    const url = details.url;
    // Use a regular expression for a more robust check on file extensions
    const mediaRegex = new RegExp(`\.(${MEDIA_TYPES.join("|")})(\\?|#|$)`, "i");

    if (mediaRegex.test(url)) {
        // Store the found media URL using the Storage API
        chrome.storage.local.set({ 
            'lastMediaUrl': url,
            'lastMediaPage': details.tabId 
        });
        console.log('Media URL found and saved:', url);
    }
}


// 3. **ACTION LISTENER (Handles icon clicks - remains the same)**
chrome.action.onClicked.addListener((tab) => {
    // This part is primarily for debugging or if the popup is simple.
    // The popup.js handles the UI display.
    console.log(`Action button clicked on tab ${tab.id}`);
});
