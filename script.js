document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const fileName = document.getElementById('fileName');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const showPasswords = document.getElementById('showPasswords');
    const exactMatch = document.getElementById('exactMatch');
    const copyBtn = document.getElementById('copyBtn');
    const resultsContainer = document.getElementById('resultsContainer');
    const resultsList = document.getElementById('results');
    const countElement = document.querySelector('.count');
    const searchSection = document.getElementById('searchSection');
    const instructions = document.getElementById('instructions');
    
    let allUrls = [];
    let currentResults = [];
    
    // File upload handling
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            fileName.textContent = file.name;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const content = e.target.result;
                // Split by new lines and filter out empty lines
                allUrls = content.split('\n')
                    .map(line => line.trim())
                    .filter(line => line !== '');
                
                if (allUrls.length > 0) {
                    searchSection.style.display = 'block';
                    resultsContainer.style.display = 'block';
                    instructions.style.display = 'none';
                    currentResults = [...allUrls];
                    displayResults(currentResults);
                } else {
                    alert('No valid URLs found in the file. Expected format: https://domain.com/:username:password');
                }
            };
            reader.readAsText(file);
        } else {
            fileName.textContent = 'No file selected';
        }
    });
    
    // Search functionality
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Toggle password visibility
    showPasswords.addEventListener('change', function() {
        displayResults(currentResults);
    });
    
    // Copy all results
    copyBtn.addEventListener('click', function() {
        if (currentResults.length === 0) return;
        
        const textToCopy = currentResults.join('\n');
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        });
    });
    
    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (searchTerm === '') {
            currentResults = [...allUrls];
        } else {
            if (exactMatch.checked) {
                // Exact domain match
                currentResults = allUrls.filter(url => {
                    const domain = extractDomain(url);
                    return domain && domain.toLowerCase() === searchTerm;
                });
            } else {
                // Partial match anywhere in URL
                currentResults = allUrls.filter(url => 
                    url.toLowerCase().includes(searchTerm)
            }
        }
        
        displayResults(currentResults);
    }
    
    function extractDomain(url) {
        try {
            // Remove protocol and path
            let domain = url.replace(/^(https?:\/\/)?(www\.)?/, '');
            // Remove everything after first / or :
            domain = domain.split(/[/:]/)[0];
            // Remove port number if present
            domain = domain.split(':')[0];
            return domain;
        } catch (e) {
            return null;
        }
    }
    
    function displayResults(urls) {
        resultsList.innerHTML = '';
        
        if (urls.length === 0) {
            resultsList.innerHTML = '<div class="url-item">No results found</div>';
            countElement.textContent = '0';
            return;
        }
        
        countElement.textContent = urls.length.toLocaleString();
        
        const searchTerm = searchInput.value.trim().toLowerCase();
        const showPasswordsValue = showPasswords.checked;
        
        urls.forEach(url => {
            const urlItem = document.createElement('div');
            urlItem.className = 'url-item';
            
            // Parse the URL
            const parts = url.split('/:');
            const domain = parts[0];
            const credentials = parts[1] ? parts[1].split(':') : [];
            const username = credentials[0] || '';
            const password = credentials[1] || '';
            
            // Highlight search term in domain
            let displayDomain = domain;
            if (searchTerm && !exactMatch.checked) {
                displayDomain = highlightTerm(domain, searchTerm);
            }
            
            // Create HTML
            urlItem.innerHTML = `
                <div class="url-domain">${displayDomain}</div>
                <div class="url-credentials">
                    <span class="url-username">${username}</span>
                    ${showPasswordsValue ? 
                        `:<span class="url-password">${password}</span>` : 
                        ':••••••••'}
                </div>
            `;
            
            resultsList.appendChild(urlItem);
        });
    }
    
    function highlightTerm(text, term) {
        if (!term) return text;
        
        const regex = new RegExp(`(${term})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }
});
