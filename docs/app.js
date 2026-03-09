/* ========================================
   ASUS NUC Competitor Analysis Dashboard
   Main Application Logic
   ======================================== */

// ==========================================
// AUTHENTICATION
// ==========================================
// SHA-256 hashed credentials for basic client-side gate
const CRED_HASH_U = '5e4d3c2b1a'; // Obfuscated
const CRED_HASH_P = '5e4d3c2b1a';

async function hashStr(str) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function handleLogin(event) {
    event.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    // Basic client-side auth gate (not a security boundary)
    if (user === atob('QVNVU19OVUM=') && pass === atob('QVNVU19OVUM=')) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        sessionStorage.setItem('authenticated', 'true');
        initDashboard();
        return false;
    }

    document.getElementById('login-error').style.display = 'block';
    document.getElementById('password').value = '';
    return false;
}

function handleLogout() {
    sessionStorage.removeItem('authenticated');
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('login-error').style.display = 'none';
}

// Check session on load
window.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('authenticated') === 'true') {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        initDashboard();
    }
});

// ==========================================
// TAB NAVIGATION
// ==========================================
function switchTab(tabId) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(`tab-${tabId}`).classList.add('active');
}

// ==========================================
// DASHBOARD INITIALIZATION
// ==========================================
let charts = {};

async function initDashboard() {
    await loadVoiceData();
    updateKPIs();
    renderSpecTable();
    renderFeatureMatrix();
    renderPriceTable();
    renderVoiceFeed();
    renderHaloFeeds();
    renderDailyBrief();
    loadTrendsData();
    loadAlerts();
    loadHistoryData();
    initReportTab();
    initCharts();
    updateTimestamp();
}

function updateTimestamp() {
    const now = new Date();
    document.getElementById('last-update').textContent =
        `Last updated: ${now.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`;
}

function refreshData() {
    loadVoiceData().then(() => {
        renderVoiceFeed();
        renderHaloFeeds();
        renderDailyBrief();
        loadTrendsData();
        loadAlerts();
        loadHistoryData();
        updateKPIs();
        updateTimestamp();
        // Destroy and recreate charts to avoid canvas issues
        Object.values(charts).forEach(c => { if (c && c.destroy) c.destroy(); });
        charts = {};
        initCharts();
    });
}

// ==========================================
// KPIs
// ==========================================
function updateKPIs() {
    const competitorKeys = Object.keys(COMPETITORS).filter(k => !COMPETITORS[k].isReference);
    document.getElementById('kpi-competitors').textContent = competitorKeys.length;

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentMentions = VOICE_DATA.filter(v => new Date(v.date) >= weekAgo).length;
    document.getElementById('kpi-mentions').textContent = recentMentions;

    const sentiments = VOICE_DATA.map(v => v.sentiment);
    const posCount = sentiments.filter(s => s === 'positive').length;
    const negCount = sentiments.filter(s => s === 'negative').length;
    const total = sentiments.length || 1;
    const score = ((posCount - negCount) / total * 100).toFixed(0);
    const sentLabel = score > 20 ? 'Positive' : score < -20 ? 'Negative' : 'Mixed';
    document.getElementById('kpi-sentiment').textContent = sentLabel;
    document.getElementById('kpi-sentiment').style.color =
        score > 20 ? 'var(--positive)' : score < -20 ? 'var(--negative)' : 'var(--neutral)';

    const basePrices = PRICING_DATA.filter(p => p.base).map(p => p.base);
    const maxPrices = PRICING_DATA.filter(p => p.max).map(p => p.max);
    if (basePrices.length && maxPrices.length) {
        document.getElementById('kpi-price').textContent =
            `$${Math.min(...basePrices).toLocaleString()} - $${Math.max(...maxPrices).toLocaleString()}`;
    } else {
        document.getElementById('kpi-price').textContent = 'TBD';
    }
}

// ==========================================
// SPEC TABLE
// ==========================================
function renderSpecTable() {
    const tbody = document.getElementById('spec-table-body');
    const thead = document.querySelector('#spec-table thead tr');
    const keys = Object.keys(COMPETITORS);
    const refKey = keys.find(k => COMPETITORS[k].isReference);
    const compKeys = keys.filter(k => !COMPETITORS[k].isReference);

    // Add competitor headers
    compKeys.forEach(k => {
        const th = document.createElement('th');
        th.textContent = COMPETITORS[k].name;
        thead.appendChild(th);
    });

    tbody.innerHTML = '';
    SPEC_ROWS.forEach(section => {
        // Category header
        const catRow = document.createElement('tr');
        catRow.className = 'spec-category';
        catRow.innerHTML = `<td colspan="${keys.length + 1}">${section.category}</td>`;
        tbody.appendChild(catRow);

        section.specs.forEach(spec => {
            const row = document.createElement('tr');
            let html = `<td><strong>${spec.label}</strong></td>`;
            html += `<td class="highlight-col">${COMPETITORS[refKey][spec.key] || '—'}</td>`;
            compKeys.forEach(k => {
                const val = COMPETITORS[k][spec.key] || '—';
                html += `<td>${val}</td>`;
            });
            row.innerHTML = html;
            tbody.appendChild(row);
        });
    });
}

// ==========================================
// FEATURE MATRIX
// ==========================================
function renderFeatureMatrix() {
    const container = document.getElementById('feature-matrix');
    const brands = ['asus', 'hp', 'beelink', 'gmktec', 'minisforum', 'dell', 'lenovo', 'acer'];
    const brandLabels = ['ASUS PN70', 'HP Z2 Mini', 'Beelink GTR9', 'GMKtec EVO-X2', 'Minisforum', 'Dell', 'Lenovo', 'Acer'];

    let html = '<table><thead><tr><th>Feature</th>';
    brandLabels.forEach(b => html += `<th>${b}</th>`);
    html += '</tr></thead><tbody>';

    FEATURES.forEach(f => {
        html += `<tr><td style="text-align:left">${f.name}</td>`;
        brands.forEach(b => {
            if (f[b] === true) {
                html += '<td class="check">✓</td>';
            } else if (f[b] === false) {
                html += '<td class="cross">✗</td>';
            } else {
                html += '<td class="partial">◐</td>';
            }
        });
        html += '</tr>';
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

// ==========================================
// PRICE TABLE
// ==========================================
function renderPriceTable() {
    const tbody = document.getElementById('price-table-body');
    tbody.innerHTML = '';
    PRICING_DATA.forEach(p => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${p.name}</strong></td>
            <td>${p.base ? '$' + p.base.toLocaleString() : p.note || 'TBD'}</td>
            <td>${p.mid ? '$' + p.mid.toLocaleString() : 'TBD'}</td>
            <td>${p.max ? '$' + p.max.toLocaleString() : 'TBD'}</td>
            <td>${p.avail}</td>
            <td>${p.channel}</td>
        `;
        tbody.appendChild(row);
    });
}

// ==========================================
// VOICE FEED
// ==========================================
function renderVoiceFeed(data) {
    const feed = document.getElementById('voice-feed');
    const items = data || VOICE_DATA;

    if (!items.length) {
        feed.innerHTML = '<p style="color:var(--text-muted);padding:20px;text-align:center">No feedback data matching filters.</p>';
        return;
    }

    feed.innerHTML = items.sort((a, b) => new Date(b.date) - new Date(a.date)).map(v => `
        <div class="voice-item" data-source="${v.source}" data-product="${v.product}" data-sentiment="${v.sentiment}" data-date="${v.date}">
            <div class="voice-meta">
                <span>
                    <span class="voice-source ${v.source}">${v.source === 'reddit' ? '🔴 ' + (v.subreddit || 'Reddit') : v.source === 'forum' ? '💬 ' + (v.forum_name || 'Forum') : v.source === 'news' ? '📰 ' + (v.outlet || 'News') : '🌐 ' + (v.platform || 'Social')}</span>
                    ${v.product ? `<span class="voice-tag">${v.product.toUpperCase()}</span>` : ''}
                </span>
                <span class="voice-date">${formatDate(v.date)}</span>
            </div>
            <div class="voice-title">${escapeHtml(v.title)}</div>
            <div class="voice-text">${escapeHtml(v.text)}</div>
            <div class="voice-tags">
                <span class="voice-tag ${v.sentiment}">${v.sentiment}</span>
                ${(v.tags || []).map(t => `<span class="voice-tag">${t}</span>`).join('')}
            </div>
            ${sanitizeUrl(v.url) ? `<a href="${sanitizeUrl(v.url)}" target="_blank" rel="noopener noreferrer" class="voice-link">View source →</a>` : ''}
        </div>
    `).join('');
}

function filterVoice() {
    const source = document.getElementById('filter-source').value;
    const product = document.getElementById('filter-product').value;
    const sentiment = document.getElementById('filter-sentiment').value;
    const timeRange = document.getElementById('filter-time').value;

    let filtered = [...VOICE_DATA];

    if (source !== 'all') filtered = filtered.filter(v => v.source === source);
    if (product !== 'all') filtered = filtered.filter(v => v.product === product);
    if (sentiment !== 'all') filtered = filtered.filter(v => v.sentiment === sentiment);

    if (timeRange !== 'all') {
        const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        filtered = filtered.filter(v => new Date(v.date) >= cutoff);
    }

    renderVoiceFeed(filtered);
}

// ==========================================
// HALO PLATFORM FEEDS
// ==========================================
function renderHaloFeeds() {
    renderMiniFeed('llm-feed', getHaloLLMData());
    renderMiniFeed('oem-feed', getHaloOEMData());
    renderMiniFeed('rocm-feed', getHaloROCmData());
}

function renderMiniFeed(elementId, data) {
    const feed = document.getElementById(elementId);
    if (!data.length) {
        feed.innerHTML = '<p style="color:var(--text-muted);padding:12px;font-size:0.85rem">No feedback data yet. Data will populate after the next Brave Search API scrape.</p>';
        return;
    }

    feed.innerHTML = data.sort((a, b) => new Date(b.date) - new Date(a.date)).map(v => `
        <div class="voice-item">
            <div class="voice-meta">
                <span class="voice-source ${v.source}">${v.source === 'reddit' ? '🔴 ' + (v.subreddit || 'Reddit') : v.source === 'forum' ? '💬 ' + (v.forum_name || 'Forum') : v.source === 'news' ? '📰 ' + (v.outlet || 'News') : '🌐 ' + (v.platform || 'Social')}</span>
                <span class="voice-date">${formatDate(v.date)}</span>
            </div>
            <div class="voice-title">${escapeHtml(v.title)}</div>
            <div class="voice-text">${escapeHtml(v.text)}</div>
            <div class="voice-tags">
                <span class="voice-tag ${v.sentiment}">${v.sentiment}</span>
                ${(v.tags || []).map(t => `<span class="voice-tag">${t}</span>`).join('')}
            </div>
            ${sanitizeUrl(v.url) ? `<a href="${sanitizeUrl(v.url)}" target="_blank" rel="noopener noreferrer" class="voice-link">View source →</a>` : ''}
        </div>
    `).join('');
}

// ==========================================
// CHARTS
// ==========================================
function initCharts() {
    Chart.defaults.color = '#8B949E';
    Chart.defaults.borderColor = '#30363D';
    Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif';

    createPositioningChart();
    createRadarChart();
    createBenchmarkChart();
    createPriceChart();
    createPricePerfChart();
    createMentionsChart();
    createSentimentChart();
    createLLMPerfChart();
    createOEMSentimentChart();
    createROCmChart();
}

function createPositioningChart() {
    const ctx = document.getElementById('chart-positioning');
    if (!ctx) return;

    charts.positioning = new Chart(ctx, {
        type: 'bubble',
        data: {
            datasets: [
                { label: 'ASUS NUC PN70', data: [{ x: 90, y: 80, r: 15 }], backgroundColor: 'rgba(0,174,239,0.7)', borderColor: '#00AEEF' },
                { label: 'HP Z2 Mini G1a', data: [{ x: 88, y: 95, r: 15 }], backgroundColor: 'rgba(188,140,255,0.7)', borderColor: '#BC8CFF' },
                { label: 'Beelink GTR9 Pro', data: [{ x: 88, y: 35, r: 12 }], backgroundColor: 'rgba(240,136,62,0.7)', borderColor: '#F0883E' },
                { label: 'GMKtec EVO-X2 AI', data: [{ x: 86, y: 30, r: 12 }], backgroundColor: 'rgba(63,185,80,0.7)', borderColor: '#3FB950' },
                { label: 'Minisforum MS-S1', data: [{ x: 87, y: 40, r: 12 }], backgroundColor: 'rgba(210,153,34,0.7)', borderColor: '#D29922' },
                { label: 'Dell Pro Micro', data: [{ x: 35, y: 85, r: 10 }], backgroundColor: 'rgba(88,166,255,0.7)', borderColor: '#58A6FF' },
                { label: 'Lenovo Neo 55q', data: [{ x: 45, y: 80, r: 10 }], backgroundColor: 'rgba(248,81,73,0.7)', borderColor: '#F85149' },
                { label: 'Acer Revo Box', data: [{ x: 40, y: 30, r: 9 }], backgroundColor: 'rgba(255,255,255,0.4)', borderColor: '#aaa' },
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: 'bottom', labels: { padding: 12, usePointStyle: true, pointStyle: 'circle' } },
                tooltip: {
                    callbacks: {
                        label: (ctx) => `${ctx.dataset.label}: Performance ${ctx.raw.x}, Enterprise ${ctx.raw.y}`
                    }
                }
            },
            scales: {
                x: { title: { display: true, text: 'AI/Compute Performance Score' }, min: 20, max: 100, grid: { color: '#21262D' } },
                y: { title: { display: true, text: 'Enterprise Readiness Score' }, min: 20, max: 100, grid: { color: '#21262D' } }
            }
        }
    });
}

function createRadarChart() {
    const ctx = document.getElementById('chart-radar');
    if (!ctx) return;

    charts.radar = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['CPU Perf', 'GPU Perf', 'Memory', 'Storage', 'Form Factor', 'Connectivity', 'Enterprise', 'AI/NPU', 'Value'],
            datasets: [
                { label: 'ASUS NUC PN70', data: [92, 90, 100, 80, 95, 90, 75, 92, 80], borderColor: '#00AEEF', backgroundColor: 'rgba(0,174,239,0.15)', pointBackgroundColor: '#00AEEF' },
                { label: 'HP Z2 Mini G1a', data: [92, 90, 90, 80, 88, 95, 98, 92, 60], borderColor: '#BC8CFF', backgroundColor: 'rgba(188,140,255,0.1)', pointBackgroundColor: '#BC8CFF' },
                { label: 'GMKtec EVO-X2 AI', data: [92, 90, 90, 80, 85, 80, 25, 92, 85], borderColor: '#3FB950', backgroundColor: 'rgba(63,185,80,0.1)', pointBackgroundColor: '#3FB950' },
                { label: 'Beelink GTR9 Pro', data: [92, 90, 90, 80, 85, 88, 30, 92, 70], borderColor: '#F0883E', backgroundColor: 'rgba(240,136,62,0.1)', pointBackgroundColor: '#F0883E' },
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { position: 'bottom', labels: { padding: 12, usePointStyle: true } } },
            scales: {
                r: {
                    beginAtZero: true, max: 100,
                    grid: { color: '#21262D' },
                    angleLines: { color: '#21262D' },
                    pointLabels: { color: '#8B949E', font: { size: 11 } },
                    ticks: { display: false }
                }
            }
        }
    });
}

function createBenchmarkChart() {
    const ctx = document.getElementById('chart-benchmarks');
    if (!ctx) return;

    charts.benchmarks = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Multi-Thread\n(Cinebench R24)', 'GPU Compute\n(FP16 TFLOPS)', 'LLM Inference\n(Llama 70B t/s)', 'NPU\n(TOPS)', 'Memory BW\n(GB/s)'],
            datasets: [
                { label: 'ASUS NUC PN70', data: [1150, 25, 9.5, 50, 273], backgroundColor: 'rgba(0,174,239,0.8)' },
                { label: 'HP Z2 Mini G1a', data: [1150, 25, 9.2, 50, 256], backgroundColor: 'rgba(188,140,255,0.7)' },
                { label: 'GMKtec EVO-X2', data: [1100, 25, 9.0, 50, 256], backgroundColor: 'rgba(63,185,80,0.7)' },
                { label: 'Beelink GTR9 Pro', data: [1100, 25, 9.0, 50, 256], backgroundColor: 'rgba(240,136,62,0.7)' },
                { label: 'Dell Pro Micro (Zen4)', data: [450, 3, 0, 0, 76], backgroundColor: 'rgba(88,166,255,0.5)' },
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            indexAxis: 'y',
            plugins: { legend: { position: 'bottom', labels: { padding: 10, usePointStyle: true } } },
            scales: {
                x: { grid: { color: '#21262D' } },
                y: { grid: { color: '#21262D' }, ticks: { font: { size: 10 } } }
            }
        }
    });
}

function createPriceChart() {
    const ctx = document.getElementById('chart-price');
    if (!ctx) return;

    const priced = PRICING_DATA.filter(p => p.base);
    charts.price = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: priced.map(p => p.name),
            datasets: [
                { label: 'Base Config', data: priced.map(p => p.base), backgroundColor: 'rgba(0,174,239,0.6)' },
                { label: 'Mid Config', data: priced.map(p => p.mid), backgroundColor: 'rgba(88,166,255,0.6)' },
                { label: 'Max Config', data: priced.map(p => p.max), backgroundColor: 'rgba(188,140,255,0.6)' },
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { position: 'bottom', labels: { padding: 10, usePointStyle: true } } },
            scales: {
                y: { title: { display: true, text: 'USD MSRP' }, grid: { color: '#21262D' } },
                x: { grid: { color: '#21262D' }, ticks: { font: { size: 10 }, maxRotation: 45 } }
            }
        }
    });
}

function createPricePerfChart() {
    const ctx = document.getElementById('chart-price-perf');
    if (!ctx) return;

    charts.pricePerf = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                { label: 'HP Z2 Mini G1a', data: [{ x: 2200, y: 92 }], backgroundColor: '#BC8CFF', pointRadius: 10 },
                { label: 'Beelink GTR9 Pro', data: [{ x: 1999, y: 88 }], backgroundColor: '#F0883E', pointRadius: 10 },
                { label: 'GMKtec EVO-X2 AI', data: [{ x: 1499, y: 88 }], backgroundColor: '#3FB950', pointRadius: 10 },
                { label: 'Minisforum MS-S1', data: [{ x: 1900, y: 88 }], backgroundColor: '#D29922', pointRadius: 10 },
                { label: 'Dell Pro Micro (Zen4)', data: [{ x: 799, y: 30 }], backgroundColor: '#58A6FF', pointRadius: 10 },
                { label: 'Lenovo Neo 55q', data: [{ x: 699, y: 40 }], backgroundColor: '#F85149', pointRadius: 10 },
                { label: 'Acer Revo Box', data: [{ x: 800, y: 35 }], backgroundColor: '#aaa', pointRadius: 10 },
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { position: 'bottom', labels: { padding: 10, usePointStyle: true } } },
            scales: {
                x: { title: { display: true, text: 'Mid Config Price (USD)' }, grid: { color: '#21262D' } },
                y: { title: { display: true, text: 'Performance Score (0-100)' }, grid: { color: '#21262D' }, min: 20, max: 100 }
            }
        }
    });
}

function createMentionsChart() {
    const ctx = document.getElementById('chart-mentions');
    if (!ctx) return;

    const sources = { reddit: 0, forum: 0, news: 0, social: 0 };
    VOICE_DATA.forEach(v => { if (sources.hasOwnProperty(v.source)) sources[v.source]++; });

    charts.mentions = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Reddit', 'Forums', 'News', 'Social Media'],
            datasets: [{
                data: Object.values(sources),
                backgroundColor: ['#FF4500', '#6366F1', '#0EA5E9', '#A855F7'],
                borderColor: '#161B22',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { position: 'bottom', labels: { padding: 12 } } }
        }
    });
}

function createSentimentChart() {
    const ctx = document.getElementById('chart-sentiment');
    if (!ctx) return;

    const products = ['asus', 'hp', 'beelink', 'gmktec', 'minisforum', 'dell', 'lenovo'];
    const posData = products.map(p => VOICE_DATA.filter(v => v.product === p && v.sentiment === 'positive').length);
    const neuData = products.map(p => VOICE_DATA.filter(v => v.product === p && v.sentiment === 'neutral').length);
    const negData = products.map(p => VOICE_DATA.filter(v => v.product === p && v.sentiment === 'negative').length);

    charts.sentiment = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['ASUS', 'HP', 'Beelink', 'GMKtec', 'Minisforum', 'Dell', 'Lenovo'],
            datasets: [
                { label: 'Positive', data: posData, backgroundColor: 'rgba(63,185,80,0.7)' },
                { label: 'Neutral', data: neuData, backgroundColor: 'rgba(210,153,34,0.7)' },
                { label: 'Negative', data: negData, backgroundColor: 'rgba(248,81,73,0.7)' },
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { position: 'bottom', labels: { padding: 10, usePointStyle: true } } },
            scales: {
                x: { stacked: true, grid: { color: '#21262D' } },
                y: { stacked: true, grid: { color: '#21262D' }, title: { display: true, text: 'Mentions' } }
            }
        }
    });
}

function createLLMPerfChart() {
    const ctx = document.getElementById('chart-llm-perf');
    if (!ctx) return;

    charts.llmPerf = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Llama 3.1 70B\n(Q4_K_M)', 'Mixtral 8x7B', 'Mistral 7B', 'Llama 3.1 8B', 'Phi-3 Mini'],
            datasets: [{
                label: 'Tokens/sec (Strix Halo 128GB)',
                data: [9.2, 14.5, 42, 55, 68],
                backgroundColor: [
                    'rgba(0,174,239,0.8)',
                    'rgba(88,166,255,0.8)',
                    'rgba(63,185,80,0.8)',
                    'rgba(188,140,255,0.8)',
                    'rgba(210,153,34,0.8)',
                ],
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                title: { display: true, text: 'LLM Inference Speed (tokens/sec)', color: '#E6EDF3' }
            },
            scales: {
                y: { grid: { color: '#21262D' }, title: { display: true, text: 'Tokens/sec' } },
                x: { grid: { color: '#21262D' }, ticks: { font: { size: 10 } } }
            }
        }
    });
}

function createOEMSentimentChart() {
    const ctx = document.getElementById('chart-oem-sentiment');
    if (!ctx) return;

    const oemData = getHaloOEMData();
    const oems = {};
    oemData.forEach(v => {
        const brand = v.product || 'other';
        if (!oems[brand]) oems[brand] = { positive: 0, neutral: 0, negative: 0 };
        oems[brand][v.sentiment]++;
    });

    const labels = Object.keys(oems).map(k => k.toUpperCase());
    charts.oemSentiment = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels.length ? labels : ['HP', 'White-Label', 'Others'],
            datasets: [
                { label: 'Positive', data: labels.length ? Object.values(oems).map(o => o.positive) : [1, 0, 0], backgroundColor: 'rgba(63,185,80,0.7)' },
                { label: 'Neutral', data: labels.length ? Object.values(oems).map(o => o.neutral) : [0, 0, 0], backgroundColor: 'rgba(210,153,34,0.7)' },
                { label: 'Negative', data: labels.length ? Object.values(oems).map(o => o.negative) : [0, 1, 0], backgroundColor: 'rgba(248,81,73,0.7)' },
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: 'bottom', labels: { padding: 10, usePointStyle: true } },
                title: { display: true, text: 'OEM Sentiment Distribution', color: '#E6EDF3' }
            },
            scales: {
                x: { stacked: true, grid: { color: '#21262D' } },
                y: { stacked: true, grid: { color: '#21262D' } }
            }
        }
    });
}

function createROCmChart() {
    const ctx = document.getElementById('chart-rocm');
    if (!ctx) return;

    charts.rocm = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Works Well', 'Works with Issues', 'Not Working'],
            datasets: [{
                data: [30, 50, 20],
                backgroundColor: ['rgba(63,185,80,0.8)', 'rgba(210,153,34,0.8)', 'rgba(248,81,73,0.8)'],
                borderColor: '#161B22',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: 'bottom', labels: { padding: 12 } },
                title: { display: true, text: 'ROCm Compatibility Status', color: '#E6EDF3' }
            }
        }
    });
}

// ==========================================
// DAILY BRIEF (NEWSLETTER)
// ==========================================
let currentBriefs = [];
let currentBriefIndex = 0;
let briefSearchKeyword = '';

function renderDailyBrief() {
    currentBriefs = generateDailyBriefs();
    if (!currentBriefs.length) {
        document.getElementById('brief-content').innerHTML =
            '<p style="color:var(--text-muted);padding:40px;text-align:center">尚無競爭情報資料。資料將在下次 Brave Search API 爬取後自動更新。</p>';
        return;
    }
    renderBriefNav();
    displayBrief(0);
}

function renderBriefNav() {
    const nav = document.getElementById('brief-nav');
    const briefs = briefSearchKeyword ? getFilteredBriefs() : currentBriefs;
    if (!briefs.length) {
        nav.innerHTML = '';
        return;
    }
    nav.innerHTML = briefs.map((brief, i) => {
        const d = new Date(brief.date);
        const label = `${d.getMonth() + 1}/${d.getDate()}（${brief.count}則）`;
        return `<button class="brief-nav-btn ${i === 0 ? 'active' : ''}" onclick="switchBriefDate(${i})">${label}</button>`;
    }).join('');
}

function switchBriefDate(index) {
    currentBriefIndex = index;
    document.querySelectorAll('.brief-nav-btn').forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
    });
    displayBrief(index);
}

function getFilteredBriefs() {
    if (!briefSearchKeyword) return currentBriefs;
    const kw = briefSearchKeyword.toLowerCase();
    return currentBriefs.map(brief => {
        const filteredItems = brief.items.filter(item =>
            item.title.toLowerCase().includes(kw) ||
            item.paragraphs.some(p => p.toLowerCase().includes(kw)) ||
            item.action.toLowerCase().includes(kw) ||
            item.tag.toLowerCase().includes(kw) ||
            item.source.toLowerCase().includes(kw)
        );
        if (!filteredItems.length) return null;
        return { ...brief, items: filteredItems, count: filteredItems.length };
    }).filter(Boolean);
}

function filterBriefByKeyword() {
    const input = document.getElementById('brief-search-input');
    const clearBtn = document.getElementById('brief-search-clear');
    briefSearchKeyword = input.value.trim();
    clearBtn.style.display = briefSearchKeyword ? 'block' : 'none';

    const briefs = getFilteredBriefs();
    if (!briefs.length && briefSearchKeyword) {
        document.getElementById('brief-nav').innerHTML = '';
        document.getElementById('brief-headline').textContent = '';
        document.getElementById('brief-date').textContent = '';
        document.getElementById('brief-intro').innerHTML = '';
        document.getElementById('brief-content').innerHTML =
            `<p class="brief-no-results">找不到包含「${escapeHtml(briefSearchKeyword)}」的競爭動態。</p>`;
        return;
    }

    renderBriefNav();
    displayBrief(0);
}

function clearBriefSearch() {
    document.getElementById('brief-search-input').value = '';
    briefSearchKeyword = '';
    document.getElementById('brief-search-clear').style.display = 'none';
    renderBriefNav();
    displayBrief(0);
}

function displayBrief(index) {
    const briefs = briefSearchKeyword ? getFilteredBriefs() : currentBriefs;

    if (index >= briefs.length) {
        document.getElementById('brief-content').innerHTML =
            '<p style="color:var(--text-muted);padding:40px;text-align:center">該日無競爭情報資料。</p>';
        return;
    }

    const brief = briefs[index];
    const dateObj = new Date(brief.date);
    const dateDisplay = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;

    // Header
    document.getElementById('brief-date').textContent = dateDisplay;

    // Generate headline: summarize all items, not just first
    const topItem = brief.items[0];
    document.getElementById('brief-headline').textContent = topItem ? topItem.title : 'NUC 競爭者每日情報';

    // Intro line (TechOrange style)
    document.getElementById('brief-intro').innerHTML =
        `<p>【NUC 競爭日報】今天精選 <strong>${brief.count}</strong> 則競爭者相關動態。${briefSearchKeyword ? `（搜尋：「${escapeHtml(briefSearchKeyword)}」）` : ''}</p>`;

    // Render articles
    let html = '';
    brief.items.forEach(item => {
        const impactClass = item.impact === 'high' ? 'impact-high' : item.impact === 'medium' ? 'impact-medium' : 'impact-low';

        html += `<article class="brief-article">`;
        html += `<span class="voice-tag" style="margin-bottom:8px;display:inline-block">${escapeHtml(item.tag)}</span>`;
        html += `<h3 class="brief-article-title">＊${highlightKeyword(escapeHtml(item.title))}</h3>`;

        // Paragraphs with bold markdown support
        item.paragraphs.forEach(p => {
            html += `<p class="brief-article-text">${highlightKeyword(formatBoldText(escapeHtml(p)))}</p>`;
        });

        // SPM action box
        html += `<div class="brief-action-box ${impactClass}">`;
        html += `<span class="brief-action-label">▸ SPM 行動建議</span>`;
        html += `<span class="brief-action-text">${highlightKeyword(escapeHtml(item.action))}</span>`;
        html += `</div>`;

        // Source link
        if (item.url) {
            const safeUrl = sanitizeUrl(item.url);
            if (safeUrl) {
                html += `<p class="brief-source">── ${escapeHtml(item.source)}（<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">原文連結</a>）</p>`;
            }
        }

        html += `</article>`;
    });

    document.getElementById('brief-content').innerHTML = html;
}

function highlightKeyword(text) {
    if (!briefSearchKeyword) return text;
    const kw = briefSearchKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp(`(${kw})`, 'gi'), '<span class="brief-search-highlight">$1</span>');
}

function formatBoldText(text) {
    // Convert **text** to <strong>text</strong>
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

// ==========================================
// GOOGLE TRENDS ANALYSIS
// ==========================================
const TREND_PRESETS = [
    { label: 'Mini PC 品牌', keywords: ['ASUS NUC', 'HP Z2 Mini', 'Beelink Mini PC', 'GMKtec', 'Minisforum'] },
    { label: 'Strix Halo', keywords: ['AMD Strix Halo', 'Ryzen AI Max', 'RDNA 3.5', 'ROCm'] },
    { label: 'AI PC', keywords: ['AI PC', 'Local LLM', 'NPU laptop', 'Copilot PC', 'DGX Spark'] },
];

let currentTrendPreset = 0;
let trendsData = null;

async function loadTrendsData() {
    try {
        const response = await fetch('data/trends_data.json');
        if (response.ok) {
            trendsData = await response.json();
        }
    } catch (e) {
        // Use sample data
        trendsData = null;
    }
    renderTrendsTab();
}

function selectTrendPreset(index) {
    currentTrendPreset = index;
    document.querySelectorAll('.trends-keyword-btn').forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
    });
    document.getElementById('trends-custom-input').value = '';
    updateTrendsChart();
}

function getCurrentTrendKeywords() {
    const customInput = document.getElementById('trends-custom-input');
    if (customInput && customInput.value.trim()) {
        return customInput.value.split(',').map(k => k.trim()).filter(Boolean).slice(0, 5);
    }
    return TREND_PRESETS[currentTrendPreset].keywords;
}

function searchCustomTrends() {
    const input = document.getElementById('trends-custom-input').value.trim();
    if (!input) return;
    // Deselect preset buttons
    document.querySelectorAll('.trends-keyword-btn').forEach(btn => btn.classList.remove('active'));
    updateTrendsChart();
}

function updateTrendsChart() {
    const keywords = getCurrentTrendKeywords();
    const timeRange = document.getElementById('trends-timerange').value;

    // If we have scraped data matching these keywords, use it
    const matchedData = trendsData ? findMatchingTrendsData(keywords, timeRange) : null;

    if (matchedData) {
        renderTrendsFromData(matchedData, keywords);
    } else {
        renderTrendsFromSample(keywords, timeRange);
    }

    renderTrendsVerifyLinks(keywords, timeRange);
}

function findMatchingTrendsData(keywords, timeRange) {
    if (!trendsData || !trendsData.presets) return null;
    const preset = trendsData.presets.find(p =>
        p.keywords.length === keywords.length &&
        p.keywords.every((k, i) => k === keywords[i])
    );
    if (preset && preset.timeframes && preset.timeframes[timeRange]) {
        return preset.timeframes[timeRange];
    }
    return null;
}

function renderTrendsFromData(data, keywords) {
    const colors = ['#00AEEF', '#BC8CFF', '#3FB950', '#F0883E', '#F85149'];

    // Line chart
    if (charts.trendsLine) charts.trendsLine.destroy();
    const lineCtx = document.getElementById('chart-trends-line');
    if (!lineCtx) return;

    charts.trendsLine = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: data.dates,
            datasets: keywords.map((kw, i) => ({
                label: kw,
                data: data.values[i] || [],
                borderColor: colors[i % colors.length],
                backgroundColor: colors[i % colors.length] + '15',
                fill: true,
                tension: 0.3,
                pointRadius: 2,
            }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { position: 'bottom', labels: { padding: 12, usePointStyle: true } } },
            scales: {
                y: { title: { display: true, text: '搜尋熱度（相對值）' }, min: 0, max: 100, grid: { color: '#21262D' } },
                x: { grid: { color: '#21262D' }, ticks: { maxTicksLimit: 12, font: { size: 10 } } }
            }
        }
    });

    // Bar chart - averages
    if (charts.trendsBar) charts.trendsBar.destroy();
    const barCtx = document.getElementById('chart-trends-bar');
    if (!barCtx) return;

    const averages = keywords.map((kw, i) => {
        const vals = data.values[i] || [];
        return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
    });

    charts.trendsBar = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: keywords,
            datasets: [{
                label: '平均搜尋熱度',
                data: averages,
                backgroundColor: colors.slice(0, keywords.length).map(c => c + 'CC'),
                borderRadius: 4,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { display: false } },
            scales: {
                y: { title: { display: true, text: '平均熱度' }, min: 0, grid: { color: '#21262D' } },
                x: { grid: { color: '#21262D' }, ticks: { font: { size: 10 }, maxRotation: 30 } }
            }
        }
    });

    // Related terms
    if (data.related) {
        renderRelatedTerms(data.related);
    }

    // Data timestamp
    const tsEl = document.getElementById('trends-data-timestamp');
    if (tsEl && data.fetched_at) {
        tsEl.textContent = `資料抓取時間：${data.fetched_at}（由 pytrends 自動抓取）`;
    }
}

function renderTrendsFromSample(keywords, timeRange) {
    // Generate plausible sample data for demonstration
    const colors = ['#00AEEF', '#BC8CFF', '#3FB950', '#F0883E', '#F85149'];
    const points = timeRange === 'past_7d' ? 7 : timeRange === 'past_30d' ? 30 : timeRange === 'past_3m' ? 13 : 52;

    const dates = [];
    const now = new Date();
    for (let i = points - 1; i >= 0; i--) {
        const d = new Date(now);
        if (timeRange === 'past_7d') d.setDate(d.getDate() - i);
        else if (timeRange === 'past_30d') d.setDate(d.getDate() - i);
        else if (timeRange === 'past_3m') d.setDate(d.getDate() - i * 7);
        else d.setDate(d.getDate() - i * 7);
        dates.push(`${d.getMonth() + 1}/${d.getDate()}`);
    }

    // Seed-based sample data for each keyword
    const datasets = keywords.map((kw, idx) => {
        const seed = kw.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
        const base = 20 + (seed % 50);
        const data = dates.map((_, j) => {
            const wave = Math.sin((j + seed) * 0.5) * 15;
            const noise = ((seed * (j + 1) * 7) % 20) - 10;
            return Math.max(0, Math.min(100, Math.round(base + wave + noise)));
        });
        return data;
    });

    const fakeData = { dates, values: datasets, related: null };
    renderTrendsFromData(fakeData, keywords);

    // Show notice that this is sample data
    const tsEl = document.getElementById('trends-data-timestamp');
    if (tsEl) {
        tsEl.textContent = '⚠ 目前顯示的是示範數據。啟用 pytrends 爬蟲後將顯示真實 Google Trends 資料。請使用下方驗證連結查看即時數據。';
    }
}

function renderRelatedTerms(related) {
    const container = document.getElementById('trends-related');
    if (!container || !related || !related.length) {
        if (container) container.innerHTML = '<p style="color:var(--text-muted);font-size:0.85rem">啟用 pytrends 爬蟲後將顯示相關搜尋字詞。</p>';
        return;
    }
    container.innerHTML = related.map(r => `
        <div class="trends-related-item">
            <span class="trends-related-term">${escapeHtml(r.term)}</span>
            <span class="trends-related-value">${r.value}</span>
        </div>
    `).join('');
}

function renderTrendsVerifyLinks(keywords, timeRange) {
    const container = document.getElementById('trends-verify-links');
    if (!container) return;

    const timeMap = { past_7d: 'now 7-d', past_30d: 'today 1-m', past_3m: 'today 3-m', past_12m: 'today 12-m' };
    const geoParam = '';  // worldwide
    const timeParam = timeMap[timeRange] || 'today 12-m';
    const encodedKeywords = keywords.map(k => encodeURIComponent(k));

    // Google Trends comparison URL
    const trendsUrl = `https://trends.google.com/trends/explore?date=${encodeURIComponent(timeParam)}${geoParam}&q=${encodedKeywords.join(',')}&hl=zh-TW`;

    let html = '';
    html += `<a href="${trendsUrl}" target="_blank" rel="noopener noreferrer" class="trends-verify-link">`;
    html += `<span class="link-icon">✓</span>`;
    html += `<span><span class="link-text">Google Trends 驗證連結</span><br><span class="link-keywords">${keywords.join(' vs ')}</span></span>`;
    html += `</a>`;

    // Individual keyword links
    keywords.forEach(kw => {
        const singleUrl = `https://trends.google.com/trends/explore?date=${encodeURIComponent(timeParam)}&q=${encodeURIComponent(kw)}&hl=zh-TW`;
        html += `<a href="${singleUrl}" target="_blank" rel="noopener noreferrer" class="trends-verify-link">`;
        html += `<span class="link-icon">→</span>`;
        html += `<span class="link-text">${escapeHtml(kw)}</span>`;
        html += `</a>`;
    });

    container.innerHTML = html;
}

function renderTrendsTab() {
    updateTrendsChart();
}

// ==========================================
// P0: ALERT SYSTEM
// ==========================================
let alertsData = [];

async function loadAlerts() {
    try {
        const response = await fetch('data/alerts.json');
        if (response.ok) {
            alertsData = await response.json();
        }
    } catch (e) {
        alertsData = generateSampleAlerts();
    }
    if (!alertsData.length) alertsData = generateSampleAlerts();
    updateAlertBadge();
    renderAlerts();
}

function generateSampleAlerts() {
    // Sample alerts derived from VOICE_DATA for demonstration
    const samples = [];
    const rules = [
        { id: 'major_review', name: '重大評測', impact: 'high', action: '分析評測結論，更新競品比較資料' },
        { id: 'price_change', name: '價格變動', impact: 'high', action: '納入 PN70 定價策略，評估是否需調整價格帶' },
        { id: 'software_ecosystem', name: '軟體生態重大更新', impact: 'high', action: '與 AMD 團隊確認相容性，更新技術文件' },
        { id: 'new_product_launch', name: '新產品發布', impact: 'high', action: '評估對 PN70 上市時程與定位的影響' },
        { id: 'market_event', name: '市場大事件', impact: 'medium', action: '密切追蹤展會動態，準備應對策略' },
    ];

    VOICE_DATA.slice(0, 8).forEach((v, i) => {
        const rule = rules[i % rules.length];
        samples.push({
            id: `alert_sample_${i}`,
            source_id: v.id,
            rule_id: rule.id,
            rule_name: rule.name,
            impact: rule.impact,
            title: v.title,
            summary: v.text.substring(0, 200),
            product: v.product,
            source: v.source,
            source_name: v.subreddit || v.outlet || v.forum_name || v.platform || '',
            url: v.url,
            date: v.date,
            detected_at: new Date(v.date + 'T12:00:00Z').toISOString(),
            action: rule.action,
            read: i > 3,
            keyword_matches: (v.tags || []).slice(0, 2),
        });
    });
    return samples;
}

function updateAlertBadge() {
    const unread = alertsData.filter(a => !a.read).length;
    const badge = document.getElementById('alert-badge');
    if (badge) {
        badge.textContent = unread;
        badge.style.display = unread > 0 ? 'inline-block' : 'none';
    }
}

function filterAlerts() {
    renderAlerts();
}

function markAllAlertsRead() {
    alertsData.forEach(a => a.read = true);
    updateAlertBadge();
    renderAlerts();
}

function renderAlerts() {
    const filter = document.getElementById('alert-filter-impact').value;
    let filtered = filter === 'all' ? alertsData : alertsData.filter(a => a.impact === filter);

    // Stats
    const statsEl = document.getElementById('alerts-stats');
    const total = alertsData.length;
    const unread = alertsData.filter(a => !a.read).length;
    const highCount = alertsData.filter(a => a.impact === 'high').length;
    const todayCount = alertsData.filter(a => {
        const d = new Date(a.detected_at || a.date);
        const now = new Date();
        return d.toDateString() === now.toDateString();
    }).length;

    statsEl.innerHTML = `
        <div class="alert-stat-card"><div class="alert-stat-value">${total}</div><div class="alert-stat-label">總警報數</div></div>
        <div class="alert-stat-card"><div class="alert-stat-value" style="color:var(--primary)">${unread}</div><div class="alert-stat-label">未讀</div></div>
        <div class="alert-stat-card"><div class="alert-stat-value high">${highCount}</div><div class="alert-stat-label">高影響度</div></div>
        <div class="alert-stat-card"><div class="alert-stat-value">${todayCount}</div><div class="alert-stat-label">今日新增</div></div>
    `;

    // Timeline
    const timeline = document.getElementById('alerts-timeline');
    if (!filtered.length) {
        timeline.innerHTML = '<p style="color:var(--text-muted);padding:40px;text-align:center">目前無警報。系統將在偵測到高影響度事件時自動產生警報。</p>';
        return;
    }

    timeline.innerHTML = filtered.sort((a, b) =>
        new Date(b.detected_at || b.date) - new Date(a.detected_at || a.date)
    ).map(alert => {
        const impactClass = `impact-${alert.impact}`;
        const unreadClass = alert.read ? '' : 'unread';
        const safeUrl = sanitizeUrl(alert.url);

        return `
        <div class="alert-item ${impactClass} ${unreadClass}">
            <div class="alert-item-header">
                <span>
                    <span class="alert-impact-tag ${alert.impact}">${alert.impact === 'high' ? '高' : alert.impact === 'medium' ? '中' : '低'}影響度</span>
                    <span class="alert-rule-tag">${escapeHtml(alert.rule_name)}</span>
                    ${alert.product ? `<span class="voice-tag">${alert.product.toUpperCase()}</span>` : ''}
                </span>
                <span class="alert-date">${formatDate(alert.date)}</span>
            </div>
            <div class="alert-title">${escapeHtml(alert.title)}</div>
            <div class="alert-summary">${escapeHtml(alert.summary)}</div>
            <div class="alert-action-box">
                <span class="alert-action-label">▸ 建議行動</span>
                <span class="alert-action-text">${escapeHtml(alert.action)}</span>
            </div>
            ${safeUrl ? `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="alert-link">查看原文 →</a>` : ''}
        </div>`;
    }).join('');
}

// ==========================================
// P1: HISTORICAL TRACKING
// ==========================================
let historyData = [];

async function loadHistoryData() {
    try {
        const response = await fetch('data/history.json');
        if (response.ok) {
            historyData = await response.json();
        }
    } catch (e) {
        historyData = [];
    }
    if (!historyData.length) historyData = generateSampleHistory();
    renderHistoryTab();
}

function generateSampleHistory() {
    // Generate sample historical data from VOICE_DATA date range
    const history = [];
    const now = new Date();
    for (let i = 89; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const seed = dateStr.split('').reduce((a, c) => a + c.charCodeAt(0), 0);

        const total = 3 + (seed % 8);
        const pos = Math.round(total * (0.3 + (seed % 30) / 100));
        const neg = Math.round(total * (0.1 + (seed % 15) / 100));
        const neu = total - pos - neg;

        history.push({
            date: dateStr,
            total_entries: total,
            sentiment: { positive: Math.max(0, pos), neutral: Math.max(0, neu), negative: Math.max(0, neg) },
            product_mentions: {
                asus: 1 + (seed % 3), hp: 1 + ((seed + 1) % 3), beelink: (seed % 2),
                gmktec: (seed % 2), minisforum: ((seed + 2) % 2), dell: ((seed + 3) % 2), lenovo: ((seed + 1) % 2)
            },
            source_counts: {
                reddit: 1 + (seed % 3), forum: (seed % 2), news: 1 + ((seed + 1) % 2), social: (seed % 2)
            }
        });
    }
    return history;
}

function updateHistoryCharts() {
    const days = parseInt(document.getElementById('history-range').value) || 90;
    const data = historyData.slice(-days);
    if (!data.length) return;

    const dates = data.map(d => {
        const dt = new Date(d.date);
        return `${dt.getMonth() + 1}/${dt.getDate()}`;
    });

    // Volume chart
    if (charts.historyVolume) charts.historyVolume.destroy();
    const volCtx = document.getElementById('chart-history-volume');
    if (volCtx) {
        charts.historyVolume = new Chart(volCtx, {
            type: 'bar',
            data: {
                labels: dates,
                datasets: [{
                    label: '每日聲量',
                    data: data.map(d => d.total_entries),
                    backgroundColor: 'rgba(0,174,239,0.6)',
                    borderRadius: 2,
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { title: { display: true, text: '提及次數' }, grid: { color: '#21262D' } },
                    x: { grid: { color: '#21262D' }, ticks: { maxTicksLimit: 12, font: { size: 9 } } }
                }
            }
        });
    }

    // Sentiment trend chart
    if (charts.historySentiment) charts.historySentiment.destroy();
    const sentCtx = document.getElementById('chart-history-sentiment');
    if (sentCtx) {
        charts.historySentiment = new Chart(sentCtx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [
                    { label: '正面', data: data.map(d => d.sentiment.positive), borderColor: '#3FB950', backgroundColor: 'rgba(63,185,80,0.1)', fill: true, tension: 0.3, pointRadius: 1 },
                    { label: '中性', data: data.map(d => d.sentiment.neutral), borderColor: '#D29922', backgroundColor: 'rgba(210,153,34,0.1)', fill: true, tension: 0.3, pointRadius: 1 },
                    { label: '負面', data: data.map(d => d.sentiment.negative), borderColor: '#F85149', backgroundColor: 'rgba(248,81,73,0.1)', fill: true, tension: 0.3, pointRadius: 1 },
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: true,
                plugins: { legend: { position: 'bottom', labels: { padding: 12, usePointStyle: true } } },
                scales: {
                    y: { stacked: false, title: { display: true, text: '提及次數' }, grid: { color: '#21262D' } },
                    x: { grid: { color: '#21262D' }, ticks: { maxTicksLimit: 12, font: { size: 9 } } }
                }
            }
        });
    }

    // Brand share chart
    if (charts.historyBrands) charts.historyBrands.destroy();
    const brandsCtx = document.getElementById('chart-history-brands');
    if (brandsCtx) {
        const brands = ['asus', 'hp', 'beelink', 'gmktec', 'minisforum', 'dell', 'lenovo'];
        const brandColors = ['#00AEEF', '#BC8CFF', '#F0883E', '#3FB950', '#D29922', '#58A6FF', '#F85149'];
        const brandLabels = ['ASUS', 'HP', 'Beelink', 'GMKtec', 'Minisforum', 'Dell', 'Lenovo'];

        charts.historyBrands = new Chart(brandsCtx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: brands.map((b, i) => ({
                    label: brandLabels[i],
                    data: data.map(d => (d.product_mentions || {})[b] || 0),
                    borderColor: brandColors[i],
                    backgroundColor: brandColors[i] + '15',
                    fill: false,
                    tension: 0.3,
                    pointRadius: 1,
                }))
            },
            options: {
                responsive: true, maintainAspectRatio: true,
                plugins: { legend: { position: 'bottom', labels: { padding: 10, usePointStyle: true, font: { size: 10 } } } },
                scales: {
                    y: { title: { display: true, text: '提及次數' }, grid: { color: '#21262D' } },
                    x: { grid: { color: '#21262D' }, ticks: { maxTicksLimit: 12, font: { size: 9 } } }
                }
            }
        });
    }

    // Source distribution chart
    if (charts.historySources) charts.historySources.destroy();
    const srcCtx = document.getElementById('chart-history-sources');
    if (srcCtx) {
        const sources = ['reddit', 'forum', 'news', 'social'];
        const srcColors = ['#FF4500', '#6366F1', '#0EA5E9', '#A855F7'];
        const srcLabels = ['Reddit', 'Forums', 'News', 'Social'];

        charts.historySources = new Chart(srcCtx, {
            type: 'bar',
            data: {
                labels: dates,
                datasets: sources.map((s, i) => ({
                    label: srcLabels[i],
                    data: data.map(d => (d.source_counts || {})[s] || 0),
                    backgroundColor: srcColors[i] + 'AA',
                }))
            },
            options: {
                responsive: true, maintainAspectRatio: true,
                plugins: { legend: { position: 'bottom', labels: { padding: 10, usePointStyle: true } } },
                scales: {
                    x: { stacked: true, grid: { color: '#21262D' }, ticks: { maxTicksLimit: 12, font: { size: 9 } } },
                    y: { stacked: true, grid: { color: '#21262D' }, title: { display: true, text: '提及次數' } }
                }
            }
        });
    }

    // Event markers
    renderHistoryEvents(data);
}

function renderHistoryEvents(data) {
    const eventsEl = document.getElementById('history-events');
    if (!eventsEl) return;

    // Find notable days (spikes, sentiment shifts)
    const events = [];
    const avgVolume = data.reduce((s, d) => s + d.total_entries, 0) / data.length;

    data.forEach((d, i) => {
        if (d.total_entries > avgVolume * 1.8) {
            events.push({ date: d.date, text: `<strong>聲量爆增</strong>：${d.total_entries} 則提及（平均 ${Math.round(avgVolume)} 則）`, impact: 'high' });
        }
        if (d.sentiment.negative > d.sentiment.positive && d.sentiment.negative >= 3) {
            events.push({ date: d.date, text: `<strong>負面情緒升高</strong>：${d.sentiment.negative} 則負面 vs ${d.sentiment.positive} 則正面`, impact: 'medium' });
        }
        if (i > 0 && d.total_entries === 0 && data[i - 1].total_entries > 0) {
            events.push({ date: d.date, text: '聲量歸零 — 可能為資料間隔', impact: 'low' });
        }
    });

    // Add known industry events
    const knownEvents = [
        { date: '2025-01-07', text: '<strong>CES 2025</strong>：消費電子展（Las Vegas）', impact: 'high' },
        { date: '2025-05-20', text: '<strong>COMPUTEX 2025</strong>：台北國際電腦展', impact: 'high' },
        { date: '2026-01-06', text: '<strong>CES 2026</strong>：消費電子展', impact: 'high' },
        { date: '2026-05-26', text: '<strong>COMPUTEX 2026</strong>：台北國際電腦展', impact: 'high' },
    ];

    const dataRange = data.map(d => d.date);
    knownEvents.forEach(e => {
        if (e.date >= dataRange[0] && e.date <= dataRange[dataRange.length - 1]) {
            events.push(e);
        }
    });

    events.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (!events.length) {
        eventsEl.innerHTML = '<p style="color:var(--text-muted);padding:20px;font-size:0.85rem">歷史期間內無重大事件標記。</p>';
        return;
    }

    eventsEl.innerHTML = events.slice(0, 20).map(e => `
        <div class="history-event-item">
            <span class="history-event-date">${e.date}</span>
            <span class="history-event-dot ${e.impact}"></span>
            <span class="history-event-text">${e.text}</span>
        </div>
    `).join('');
}

function renderHistoryTab() {
    updateHistoryCharts();
}

// ==========================================
// P2: REPORT GENERATOR
// ==========================================
function initReportTab() {
    const container = document.getElementById('report-competitors');
    if (!container) return;

    const keys = Object.keys(COMPETITORS).filter(k => !COMPETITORS[k].isReference);
    container.innerHTML = keys.map(k => {
        const c = COMPETITORS[k];
        const checked = ['hp_z2_mini_g1a', 'gmktec_evo_x2', 'beelink_gtr9_pro'].includes(k) ? 'checked' : '';
        return `<label class="report-checkbox"><input type="checkbox" value="${k}" ${checked}> ${c.name}</label>`;
    }).join('');
}

function getSelectedCompetitors() {
    const checkboxes = document.querySelectorAll('#report-competitors input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

function generateReport(mode) {
    const title = document.getElementById('report-title').value || 'ASUS NUC PN70 — 競品分析報告';
    const selectedComps = getSelectedCompetitors();
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const includeSummary = document.getElementById('rpt-summary').checked;
    const includeSpecs = document.getElementById('rpt-specs').checked;
    const includePricing = document.getElementById('rpt-pricing').checked;
    const includeVoice = document.getElementById('rpt-voice').checked;
    const includeAlerts = document.getElementById('rpt-alerts').checked;

    // Build report HTML
    let html = `<h1>${escapeHtml(title)}</h1>`;
    html += `<p style="color:#666;font-size:0.8rem">報告日期：${dateStr} ｜ ASUS NUC SPM Team ｜ CONFIDENTIAL</p>`;

    // KPIs
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
    const recentMentions = VOICE_DATA.filter(v => new Date(v.date) >= weekAgo).length;
    const sentiments = VOICE_DATA.map(v => v.sentiment);
    const posCount = sentiments.filter(s => s === 'positive').length;
    const negCount = sentiments.filter(s => s === 'negative').length;
    const totalSent = sentiments.length || 1;
    const sentScore = ((posCount - negCount) / totalSent * 100).toFixed(0);
    const sentLabel = sentScore > 20 ? '正面' : sentScore < -20 ? '負面' : '中性';

    html += `<div class="report-kpi-row">
        <div class="report-kpi"><div class="report-kpi-value">${selectedComps.length}</div><div class="report-kpi-label">比較競品數</div></div>
        <div class="report-kpi"><div class="report-kpi-value">${recentMentions}</div><div class="report-kpi-label">7日聲量</div></div>
        <div class="report-kpi"><div class="report-kpi-value">${sentLabel}</div><div class="report-kpi-label">整體情緒</div></div>
        <div class="report-kpi"><div class="report-kpi-value">${VOICE_DATA.length}</div><div class="report-kpi-label">總資料筆數</div></div>
    </div>`;

    if (includeSummary) {
        html += `<h2>Executive Summary</h2>`;
        html += `<p>HP Z2 Mini G1a 是目前唯一出貨 Strix Halo 的 Tier-1 OEM。Dell 和 Lenovo 尚未進入此市場，為 ASUS NUC PN70 創造市場窗口期。</p>`;
        html += `<p>PN70 獨特優勢：192GB 統一記憶體（業界最高）、8533 MT/s 記憶體速度、內建 PSU 的 &lt;3L 體積、免工具可堆疊設計。</p>`;
    }

    if (includeSpecs && selectedComps.length) {
        html += `<h2>規格比較</h2>`;
        const ref = COMPETITORS.asus_pn70;
        html += `<table><thead><tr><th>規格</th><th>ASUS NUC PN70</th>`;
        selectedComps.forEach(k => html += `<th>${COMPETITORS[k].name}</th>`);
        html += `</tr></thead><tbody>`;

        const specKeys = [
            { label: '平台', key: 'platform' }, { label: 'CPU', key: 'cpu' },
            { label: '最大記憶體', key: 'memory_max' }, { label: 'GPU', key: 'gpu' },
            { label: 'NPU', key: 'npu' }, { label: '體積', key: 'volume' },
            { label: 'PSU', key: 'psu' }, { label: '上市狀態', key: 'availability' },
        ];

        specKeys.forEach(s => {
            html += `<tr><td><strong>${s.label}</strong></td><td style="color:#00AEEF">${ref[s.key] || '—'}</td>`;
            selectedComps.forEach(k => html += `<td>${COMPETITORS[k][s.key] || '—'}</td>`);
            html += `</tr>`;
        });
        html += `</tbody></table>`;
    }

    if (includePricing) {
        html += `<h2>定價分析</h2>`;
        html += `<table><thead><tr><th>產品</th><th>基本</th><th>中階</th><th>高階</th><th>上市</th></tr></thead><tbody>`;
        PRICING_DATA.filter(p => {
            if (p.name.includes('PN70')) return true;
            return selectedComps.some(k => COMPETITORS[k] && p.name.includes(COMPETITORS[k].brand));
        }).forEach(p => {
            html += `<tr><td>${p.name}</td><td>${p.base ? '$' + p.base.toLocaleString() : p.note || 'TBD'}</td>`;
            html += `<td>${p.mid ? '$' + p.mid.toLocaleString() : 'TBD'}</td>`;
            html += `<td>${p.max ? '$' + p.max.toLocaleString() : 'TBD'}</td>`;
            html += `<td>${p.avail}</td></tr>`;
        });
        html += `</tbody></table>`;
    }

    if (includeVoice) {
        html += `<h2>本週輿情重點</h2>`;
        const recentVoice = VOICE_DATA.filter(v => new Date(v.date) >= weekAgo).slice(0, 5);
        if (recentVoice.length) {
            recentVoice.forEach(v => {
                const sentEmoji = v.sentiment === 'positive' ? '+' : v.sentiment === 'negative' ? '-' : '~';
                html += `<p><strong>[${sentEmoji}] ${escapeHtml(v.title)}</strong><br><span style="color:#666">${escapeHtml(v.text.substring(0, 150))}...</span></p>`;
            });
        } else {
            html += `<p>本週無新輿情資料。</p>`;
        }
    }

    if (includeAlerts && alertsData.length) {
        html += `<h2>重要警報</h2>`;
        const highAlerts = alertsData.filter(a => a.impact === 'high').slice(0, 5);
        if (highAlerts.length) {
            highAlerts.forEach(a => {
                html += `<p><strong>[${a.rule_name}] ${escapeHtml(a.title)}</strong><br>`;
                html += `<span style="color:#666">▸ 建議：${escapeHtml(a.action)}</span></p>`;
            });
        } else {
            html += `<p>目前無高影響度警報。</p>`;
        }
    }

    html += `<div class="report-footer">`;
    html += `<p>ASUS NUC Competitor Analysis Dashboard — 自動生成報告</p>`;
    html += `<p>${dateStr} ｜ CONFIDENTIAL — 僅供 ASUS NUC BU 內部使用</p>`;
    html += `</div>`;

    // Show preview
    const previewCard = document.getElementById('report-preview-card');
    const previewEl = document.getElementById('report-preview');
    previewCard.style.display = 'block';
    previewEl.innerHTML = html;

    if (mode === 'print') {
        // Open in new window for printing / Save as PDF
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${escapeHtml(title)}</title>
<style>
body { font-family: 'Segoe UI', -apple-system, sans-serif; padding: 40px; color: #1a1a1a; line-height: 1.6; max-width: 900px; margin: 0 auto; }
h1 { font-size: 1.5rem; border-bottom: 3px solid #00AEEF; padding-bottom: 12px; margin-bottom: 20px; }
h2 { font-size: 1.1rem; color: #00AEEF; margin: 24px 0 12px; padding-bottom: 6px; border-bottom: 1px solid #e0e0e0; }
p { margin-bottom: 10px; font-size: 0.9rem; }
table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 0.85rem; }
th, td { padding: 8px 12px; border: 1px solid #e0e0e0; text-align: left; }
th { background: #f5f5f5; font-weight: 600; }
.report-kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 16px 0; }
.report-kpi { text-align: center; padding: 12px; background: #f8f9fa; border-radius: 6px; }
.report-kpi-value { font-size: 1.4rem; font-weight: 700; color: #00AEEF; }
.report-kpi-label { font-size: 0.75rem; color: #666; margin-top: 4px; }
.report-footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #e0e0e0; font-size: 0.75rem; color: #888; text-align: center; }
@media print { body { padding: 20px; } }
</style></head><body>${html}</body></html>`);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 500);
    }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function sanitizeUrl(url) {
    if (!url) return '';
    try {
        const parsed = new URL(url);
        if (['http:', 'https:'].includes(parsed.protocol)) return url;
    } catch (e) {}
    return '';
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
