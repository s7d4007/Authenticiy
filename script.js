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
    async function checkUrl() {
        const urlToCheck = urlInput.value;

        // 1. Validate Input
        // Simple check to see if the input is empty
        if (urlToCheck.trim() === "") {
            showResult("error", "Input Error", "Please enter a URL to check.");
            return;
        }

        // 2. Show Loading State
        // This gives the user feedback that something is happening while waiting for the server
        showResult("loading", "Checking...", `Analyzing the safety of ${urlToCheck}`);

        // 3. --- REAL API CALL TO PYTHON BACKEND ---
        try {
            // We send the URL to your local Python server on port 5000
            const response = await fetch('http://localhost:5000/api/check-url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url: urlToCheck })
            });

            // Parse the JSON answer from the server
            const data = await response.json();

            // Check if the server reported an internal error
            if (!response.ok) {
                throw new Error(data.message || "Server Error");
            }

            // 4. Show the result using the data from the backend
            // The backend returns: { status: 'safe'|'dangerous', title: '...', message: '...' }
            showResult(data.status, data.title, data.message);

        } catch (error) {
            console.error('Error:', error);
            
            // Handle connection errors (e.g., if the Python server isn't running)
            let errorMessage = "Is your Python backend running? We couldn't reach http://localhost:5000.";
            
            // If it's a specific error from the server, use that instead
            if (error.message && error.message !== "Failed to fetch") {
                errorMessage = error.message;
            }

            showResult("error", "Connection Failed", errorMessage);
        }
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
            <div class="result-text">
                <h3>${title}</h3>
                <p>${message}</p>
            </div>
        `;

        // Add the new card to the page
        resultsContainer.appendChild(resultCard);
    }
});