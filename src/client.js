// Scramjet frontend client logic

document.addEventListener('DOMContentLoaded', function() {
  const urlBar = document.getElementById('url-bar');
  const searchBtn = document.getElementById('btn-search');
  const resultsFrame = document.getElementById('results-frame');
  const backBtn = document.getElementById('btn-back');
  const reloadBtn = document.getElementById('btn-reload');
  const nextBtn = document.getElementById('btn-next');

  function proxyUrl(input) {
    let targetUrl = '';
    if (input.startsWith('http://') || input.startsWith('https://')) {
      targetUrl = input;
    } else {
      targetUrl = `https://start.duckduckgo.com/?q=${encodeURIComponent(input)}`;
    }
    // Change this to your backend proxy endpoint
    return `/scramjet/${encodeURIComponent(targetUrl)}`;
  }

  function loadUrl(url) {
    resultsFrame.src = proxyUrl(url);
  }

  searchBtn.addEventListener('click', function() {
    const input = urlBar.value.trim();
    if (input) loadUrl(input);
  });

  urlBar.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      const input = urlBar.value.trim();
      if (input) loadUrl(input);
    }
  });

  backBtn.addEventListener('click', function() {
    resultsFrame.contentWindow.history.back();
  });
  reloadBtn.addEventListener('click', function() {
    resultsFrame.contentWindow.location.reload();
  });
  nextBtn.addEventListener('click', function() {
    resultsFrame.contentWindow.history.forward();
  });
});
