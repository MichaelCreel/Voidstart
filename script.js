document.getElementById("date").textContent = new Date().toDateString();

document.getElementById("theme-toggle").addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
});

document.getElementById("search-button").addEventListener("click", () => {
    const query = document.getElementById("search-input").value;
    const engine = document.getElementById("search-engine").value;
    const urls = {
        google: `https://www.google.com/search?q=${query}`,
        bing: `https://www.bing.com/search?q=${query}`,
        duckduckgo: `https://duckduckgo.com/?q=${query}`,
        yahoo: `https://search.yahoo.com/search?p=${query}`
    };
    window.open(urls[engine], '_blank');
});