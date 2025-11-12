// Wait for the entire page to load before running the script
document.addEventListener("DOMContentLoaded", () => {

    // Get the elements we need from the HTML
    const urlInput = document.getElementById("url-input");
    const searchBtn = document.getElementById("search-btn");
    const resultsContainer = document.getElementById("results-container");

    // --- Listen for Clicks ---
    
    // Run the check when the search icon is clicked
    searchBtn.addEventListener("click", () => {
        checkUrl();
    });

    // Also run the check when "Enter" is pressed in the input field
    urlInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            checkUrl();
        }
    });

    // --- Main Function to Check URL ---
    function checkUrl() {
        const urlToCheck = urlInput.value;

        // 1. Validate Input
        // Simple check to see if the input is empty or a very basic URL
        if (urlToCheck.trim() === "") {
            showResult("error", "Input Error", "Please enter a URL to check.");
            return;
        }

        // 2. Show Loading State
        // This gives the user feedback that something is happening
        showResult("loading", "Checking...", `Analyzing the safety of ${urlToCheck}`);

        
        // 3. --- API Simulation ---
        // Using  a 'setTimeout' to simulate a 2-second network delay.
        setTimeout(() => {
            // --- SIMULATED RESPONSE ---
            // Let's create a fake result for demonstration
            const fakeDomains = {
                "google.com": { status: "safe", title: "Safe" },
                "badsite.net": { status: "dangerous", title: "Dangerous" },
                "weirdsitelog.org": { status: "warning", title: "Warning" },
            };

            let result = fakeDomains[urlToCheck.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '')]; // Clean the URL a bit

            if (result) {
                // We found a matching fake domain
                if (result.status === "safe") {
                    showResult("safe", "This Link is Safe", `${urlToCheck} appears to be safe and free of threats.`);
                } else if (result.status === "dangerous") {
                    showResult("dangerous", "Dangerous Link!", `This site is flagged for phishing or malware. We strongly advise against visiting ${urlToCheck}.`);
                } else {
                    showResult("warning", "Use Caution", `We couldn't confirm this site's safety. It may be new or contain trackers. Proceed with caution.`);
                }
            } else {
                // If no specific match, give a generic "safe" or "warning"
                showResult("safe", "This Link Appears Safe", `${urlToCheck} is not on any known threat lists.`);
            }

        }, 2000); // 2-second delay
    }

    // --- 4. Function to Display the Result ---
    function showResult(status, title, message) {
        // 'status' can be 'safe', 'dangerous', 'warning', 'loading', or 'error'
        
        // Clear any previous results
        resultsContainer.innerHTML = "";
        
        // Create the new result card
        const resultCard = document.createElement("div");
        resultCard.className = `result-card ${status}`; // e.g., "result-card dangerous"

        let iconClass = "fa-solid ";
        if (status === "safe") iconClass += "fa-shield-check";
        else if (status === "dangerous") iconClass += "fa-shield-exclamation";
        else if (status === "warning") iconClass += "fa-shield-question";
        else if (status === "loading") iconClass += "fa-spinner fa-spin";
        else if (status === "error") iconClass += "fa-circle-xmark";

        // Set the HTML for the card
        resultCard.innerHTML = `
            <i class="${iconClass}"></i>
            <div classclass="result-text">
                <h3>${title}</h3>
                <p>${message}</p>
            </div>
        `;

        // Add the new card to the page
        resultsContainer.appendChild(resultCard);
    }
});