
document.addEventListener('DOMContentLoaded', () => {
	const iframe = document.getElementById('browser-iframe');
	const addr = document.getElementById('addr');
	const goBtn = document.getElementById('goBtn');
	const consoleEl = document.getElementById('console');
	const tabsEl = document.getElementById('tabs');

	function createTab(url) {
		const tab = document.createElement('div');
		tab.className = 'tab';
		tab.dataset.url = url || 'about:blank';

		const icon = document.createElement('span');
		icon.className = 'tab-icon';
		icon.innerHTML = '<i data-lucide="globe"></i>';

		const label = document.createElement('span');
		label.className = 'tab-label';
		label.textContent = 'NewTab';

		const close = document.createElement('button');
		close.className = 'tab-close';
		close.title = 'Close tab';
		close.innerHTML = '<i data-lucide="x"></i>';

		tab.appendChild(icon);
		tab.appendChild(label);
		tab.appendChild(close);

		tabsEl.insertBefore(tab, document.getElementById('btn-new-tab'));
		if (window.lucide) window.lucide.createIcons();
		
		setTimeout(()=>{ try{ tab.scrollIntoView({behavior:'smooth', inline:'center', block:'nearest'}); }catch(e){} }, 40);

		close.addEventListener('click', (e) => {
			e.stopPropagation();
			if (tab.classList.contains('active')){
				const next = tab.nextElementSibling || tab.previousElementSibling;
				if (next && !next.classList.contains('tab-new')) activateTab(next);
			}
			tab.remove();
		});

		tab.addEventListener('click', () => activateTab(tab));
		return tab;
	}

	function activateTab(tab) {
		const prev = tabsEl.querySelector('.tab.active');
		if (prev) prev.classList.remove('active');
		if (!tab) return;
		tab.classList.add('active');
		const url = tab.dataset.url || 'about:blank';
		iframe.src = url;
			try {
				if (url === 'about:blank') {
					tab.querySelector('.tab-label').textContent = 'NewTab';
				} else {
					const u = new URL(url);
					tab.querySelector('.tab-label').textContent = u.hostname;
				}
				} catch (e) {
					tab.querySelector('.tab-label').textContent = url;
				}
					try{ tab.scrollIntoView({behavior:'smooth', inline:'center', block:'nearest'}); }catch(e){}
	}

	const newBtn = document.getElementById('btn-new-tab');
	if (newBtn) {
		newBtn.addEventListener('click', () => { const t = createTab('about:blank'); activateTab(t); });
	}

	if (window.lucide) window.lucide.createIcons();

	const firstTab = createTab('about:blank');
	activateTab(firstTab);

	let historyStack = [];
	let idx = -1;

	function write(msg){ if (consoleEl) consoleEl.textContent = msg; }

	function navigate(url, push = true){
		const looksLikeUrl = /^https?:\/\//i.test(url) || /\./.test(url);
		if (!looksLikeUrl) {
			const q = encodeURIComponent(url);
			url = 'https://duckduckgo.com/?q=' + q;
		} else if (!/^https?:\/\//i.test(url)) {
			url = 'https://' + url;
		}

		try{
			if (window.__useScramNavigate) {
				window.__useScramNavigate(url, iframe, null);
			} else {
				iframe.src = url;
				const active = tabsEl.querySelector('.tab.active');
				if (active) active.dataset.url = url;
				try{ const u = new URL(url); if (active) active.querySelector('.tab-label').textContent = u.hostname; }catch(e){ if (active) active.querySelector('.tab-label').textContent = url; }
			}
		} catch(e){ write('Navigation error: '+(e && e.message ? e.message : e)); }

		if (push){ historyStack = historyStack.slice(0, idx+1); historyStack.push(url); idx = historyStack.length - 1; }
	}

	goBtn && goBtn.addEventListener('click', ()=>{ navigate(addr.value || 'about:blank'); });
	addr.addEventListener('keydown', e=>{ if (e.key === 'Enter') { navigate(addr.value || 'about:blank'); } });

	const tbBack = document.getElementById('btn-back');
	const tbForward = document.getElementById('btn-forward');
	const tbRefresh = document.getElementById('btn-refresh');
	const tbSettings = document.getElementById('btn-settings');
	const tbIncognito = document.getElementById('btn-incognito');
	if (tbBack) tbBack.addEventListener('click', ()=>{ const el = document.getElementById('back'); if (el) el.click(); else write('No back control'); });
	if (tbForward) tbForward.addEventListener('click', ()=>{ const el = document.getElementById('forward'); if (el) el.click(); else write('No forward control'); });
	if (tbRefresh) tbRefresh.addEventListener('click', ()=>{ const el = document.getElementById('refresh'); if (el) el.click(); else { write('Refreshing...'); const cur = iframe.src || historyStack[idx] || ''; iframe.src = cur; setTimeout(()=> write('Refreshed.'), 600); } });
	if (tbSettings) tbSettings.addEventListener('click', ()=>{ alert('Settings placeholder'); });
	if (tbIncognito) tbIncognito.addEventListener('click', ()=>{ navigate('about:blank'); });

	const tbScram = document.getElementById('btn-scram');
	if (tbScram) tbScram.addEventListener('click', async ()=>{
		if (window.initScramjet) {
			write('Initializing Scramjet...');
			try{ await window.initScramjet(); write('Scramjet initialized'); }catch(e){ write('Scramjet init failed: '+(e&&e.message?e.message:e)); }
		} else { write('Scram init not available'); }
	});

	const refreshBtn = document.getElementById('refresh');
	if (refreshBtn) {
		refreshBtn.addEventListener('click', ()=>{
			write('Refreshing...');
			const cur = iframe.src || historyStack[idx] || '';
			iframe.src = cur;
			setTimeout(()=> write('Refreshed.'), 600);
		});
	}

	const backBtn = document.getElementById('back');
	if (backBtn) {
		backBtn.addEventListener('click', ()=>{
			if (idx > 0){ idx--; navigate(historyStack[idx], false); write('Back to '+historyStack[idx]); }
			else write('No back history');
		});
	}

	const forwardBtn = document.getElementById('forward');
	if (forwardBtn) {
		forwardBtn.addEventListener('click', ()=>{
			if (idx < historyStack.length-1){ idx++; navigate(historyStack[idx], false); write('Forward to '+historyStack[idx]); }
			else write('No forward history');
		});
	}

	const fsBtn = document.getElementById('fs');
	if (fsBtn) {
		fsBtn.addEventListener('click', ()=>{
			const shell = document.querySelector('.browser-shell');
			if (document.fullscreenElement) document.exitFullscreen();
			else shell.requestFullscreen();
		});
	}

	navigate('https://duckduckgo.com/?q=hi');
});
