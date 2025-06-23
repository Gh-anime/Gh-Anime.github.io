// Sample data - in a real scenario, this would come from a file or API
const sampleData = [
    "https://sed.educacao.sp.gov.br/:Rg336617033sp:Eduardo2107!",
    "https://example.com/:admin:password123",
    "https://test.site/:user1:testpass",
    "https://anotherdomain.com/:john_doe:J0hnD03!2023",
    "https://secureportal.net/:support:s3cur3P@ss",
    "https://webapp.io/:demo_user:Demo1234"
];

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const showPasswords = document.getElementById('showPasswords');
    const copyBtn = document.getElementById('copyBtn');
    const resultsContainer = document.getElementById('results');
    const countElement = document.querySelector('.count');
    
    let allUrls = [...sampleData]; // In real use, this would be loaded from a file
    
    // Display all URLs initially
    displayResults(allUrls);
    
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
        const textToCopy = currentResults.join('\n');
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        });
    });
    
    let currentResults = [];
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        
        if (searchTerm.trim() === '') {
            currentResults = [...allUrls];
        } else {
            currentResults = allUrls.filter(url => 
                url.toLowerCase().includes(searchTerm)
            );
        }
        
        displayResults(currentResults);
    }
    
    function displayResults(urls) {
        resultsContainer.innerHTML = '';
        
        if (urls.length === 0) {
            resultsContainer.innerHTML = '<div class="url-item">No results found</div>';
            countElement.textContent = '0';
            return;
        }
        
        countElement.textContent = urls.length;
        
        urls.forEach(url => {
            const urlItem = document.createElement('div');
            urlItem.className = 'url-item';
            
            // Parse the URL
            const parts = url.split('/:');
            const domain = parts[0];
            const credentials = parts[1] ? parts[1].split(':') : [];
            const username = credentials[0] || '';
            const password = credentials[1] || '';
            
            // Create HTML
            urlItem.innerHTML = `
                <div class="url-domain">${domain}</div>
                <div class="url-credentials">
                    <span class="url-username">${username}</span>
                    ${showPasswords.checked ? 
                        `:<span class="url-password">${password}</span>` : 
                        ':••••••••'}
                </div>
            `;
            
            resultsContainer.appendChild(urlItem);
        });
    }
    
    // For GitHub Pages demo - in real use, you'd load from a file
    function loadFromFile(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            allUrls = content.split('\n').filter(line => line.trim() !== '');
            currentResults = [...allUrls];
            displayResults(currentResults);
        };
        reader.readAsText(file);
    }
    
    // If you want to implement file upload in the future:
    // document.getElementById('fileInput').addEventListener('change', function(e) {
    //     loadFromFile(e.target.files[0]);
    // });
});
