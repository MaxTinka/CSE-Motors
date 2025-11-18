// Function to dynamically set the current year in the footer
function setFooterYear() {
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        // Get the current four-digit year (e.g., 2025)
        const currentYear = new Date().getFullYear();
        // Insert the year into the span element
        yearSpan.textContent = currentYear;
    }
}

// Execute the function once the entire HTML document is fully loaded
document.addEventListener('DOMContentLoaded', setFooterYear);
