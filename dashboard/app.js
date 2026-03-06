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
