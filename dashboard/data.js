/* ========================================
   Competitor Data & Customer Voice Data
   ======================================== */

// ==========================================
// COMPETITOR PRODUCT SPECIFICATIONS
// ==========================================
const COMPETITORS = {
    "asus_pn70": {
        name: "ASUS NUC PN70",
        brand: "ASUS",
        platform: "Strix Halo",
        cpu: "AMD Ryzen AI Max+ 395 (Zen5)",
        cores: "16C/32T",
        tdp: "45-120W",
        gpu: "Radeon 8060S (RDNA 3.5, 40 CU / 20 WGP)",
        gpu_tflops: "~25 TFLOPS FP16",
        memory_type: "LPDDR5x",
        memory_speed: "8533 MT/s",
        memory_max: "128GB (unified)",
        storage: "2x M.2 PCIe Gen4 NVMe",
        volume: "<3L",
        wifi: "Wi-Fi 7",
        bluetooth: "BT 5.4",
        usb: "USB4, USB 3.2 Gen 2, USB-C",
        display_out: "HDMI 2.1, USB-C DP 2.1",
        npu: "XDNA 2 (50 TOPS)",
        total_tops: "~300+ TOPS (CPU+GPU+NPU)",
        psu: "Internal",
        orientation: "Horizontal / Vertical / Stackable",
        tool_free: "Yes",
        price_base: "$TBD",
        price_mid: "$TBD",
        price_max: "$TBD",
        availability: "H2 2025 (Expected)",
        target: "AI Developer, SMB IT, Designer, Financial Analyst, Retail SI, ISV",
        highlights: ["<3L with built-in PSU", "Tool-free design", "Up to 128GB unified LPDDR5x", "Dual NVMe Gen4", "NPU 50 TOPS"],
        isReference: true
    },
    "lenovo_neo_ultra": {
        name: "Lenovo ThinkCentre Neo Ultra",
        brand: "Lenovo",
        platform: "Strix Halo",
        cpu: "AMD Ryzen AI Max+ 395 / Max 390",
        cores: "16C/32T",
        tdp: "45-120W",
        gpu: "Radeon 8060S (RDNA 3.5, 40 CU)",
        gpu_tflops: "~25 TFLOPS FP16",
        memory_type: "LPDDR5x",
        memory_speed: "8000 MT/s",
        memory_max: "128GB (unified)",
        storage: "2x M.2 PCIe Gen5 NVMe",
        volume: "~3.7L",
        wifi: "Wi-Fi 7",
        bluetooth: "BT 5.4",
        usb: "USB4, USB 3.2 Gen 2",
        display_out: "HDMI 2.1, DP 2.1, USB-C",
        npu: "XDNA 2 (50 TOPS)",
        total_tops: "~300+ TOPS",
        psu: "External 230W",
        orientation: "Vertical",
        tool_free: "Partial",
        price_base: "$1,299",
        price_mid: "$1,699",
        price_max: "$2,299",
        availability: "Q2 2025",
        target: "Enterprise, AI Developer, Professional",
        highlights: ["PCIe Gen5 NVMe", "ThinkCentre enterprise ecosystem", "Lenovo Vantage management", "ISV certified"]
    },
    "hp_z2_mini_g1a": {
        name: "HP Z2 Mini G1a",
        brand: "HP",
        platform: "Strix Halo",
        cpu: "AMD Ryzen AI Max Pro 395",
        cores: "16C/32T",
        tdp: "45-120W",
        gpu: "Radeon 8060S (RDNA 3.5, 40 CU)",
        gpu_tflops: "~25 TFLOPS FP16",
        memory_type: "LPDDR5x",
        memory_speed: "8000 MT/s",
        memory_max: "128GB (unified)",
        storage: "2x M.2 PCIe Gen4 NVMe + 1x 2.5\" SATA",
        volume: "~2.7L",
        wifi: "Wi-Fi 7",
        bluetooth: "BT 5.4",
        usb: "USB4, USB 3.2 Gen 2, USB-A",
        display_out: "HDMI 2.1, Mini DP 2.1 x2",
        npu: "XDNA 2 (50 TOPS)",
        total_tops: "~300+ TOPS",
        psu: "External 280W",
        orientation: "Horizontal / Vertical",
        tool_free: "Yes",
        price_base: "$1,449",
        price_mid: "$1,899",
        price_max: "$2,499",
        availability: "Q2 2025",
        target: "Workstation, CAD/CAE, AI Professional",
        highlights: ["Z-series workstation lineage", "ISV certified (SolidWorks, AutoCAD)", "HP Wolf Security", "3x display outputs", "Optional SATA bay"]
    },
    "dell_optiplex_micro_7030": {
        name: "Dell OptiPlex Micro 7030 AMD",
        brand: "Dell",
        platform: "Strix Point",
        cpu: "AMD Ryzen AI 9 HX 370 (Zen5)",
        cores: "12C/24T (4P+8E)",
        tdp: "28-54W",
        gpu: "Radeon 890M (RDNA 3.5, 16 CU)",
        gpu_tflops: "~10 TFLOPS FP16",
        memory_type: "DDR5 SO-DIMM",
        memory_speed: "5600 MT/s",
        memory_max: "64GB",
        storage: "1x M.2 PCIe Gen4 NVMe + 1x 2.5\" SATA",
        volume: "~1.1L",
        wifi: "Wi-Fi 7",
        bluetooth: "BT 5.4",
        usb: "USB 3.2 Gen 2, USB-C DP",
        display_out: "HDMI 2.1, DP 1.4, USB-C",
        npu: "XDNA 2 (50 TOPS)",
        total_tops: "~80 TOPS",
        psu: "External 90W",
        orientation: "Horizontal / Vertical / VESA",
        tool_free: "Yes",
        price_base: "$899",
        price_mid: "$1,099",
        price_max: "$1,399",
        availability: "Available Now",
        target: "Enterprise Desktop Replacement, General Business",
        highlights: ["Ultra-compact 1.1L", "Dell Optimizer AI", "Enterprise management (vPro equiv)", "VESA mountable"]
    },
    "minisforum_umi2": {
        name: "Minisforum UMI2",
        brand: "Minisforum",
        platform: "Strix Halo",
        cpu: "AMD Ryzen AI Max+ 395",
        cores: "16C/32T",
        tdp: "45-120W",
        gpu: "Radeon 8060S (RDNA 3.5, 40 CU)",
        gpu_tflops: "~25 TFLOPS FP16",
        memory_type: "LPDDR5x",
        memory_speed: "8000 MT/s",
        memory_max: "128GB (unified)",
        storage: "2x M.2 PCIe Gen4 NVMe",
        volume: "~2.8L",
        wifi: "Wi-Fi 7",
        bluetooth: "BT 5.4",
        usb: "USB4 x2, USB 3.2 Gen 2 x3",
        display_out: "HDMI 2.1, USB4 DP",
        npu: "XDNA 2 (50 TOPS)",
        total_tops: "~300+ TOPS",
        psu: "External 240W",
        orientation: "Horizontal",
        tool_free: "No",
        price_base: "$1,099",
        price_mid: "$1,399",
        price_max: "$1,799",
        availability: "Q1 2025",
        target: "Enthusiast, AI Developer, Content Creator",
        highlights: ["First-to-market Strix Halo", "Aggressive pricing", "Dual USB4", "Community-driven updates"]
    },
    "gigabyte_brix_pro": {
        name: "Gigabyte BRIX Pro AI",
        brand: "Gigabyte",
        platform: "Strix Halo",
        cpu: "AMD Ryzen AI Max 390",
        cores: "12C/24T",
        tdp: "45-100W",
        gpu: "Radeon 8050S (RDNA 3.5, 32 CU / 16 WGP)",
        gpu_tflops: "~20 TFLOPS FP16",
        memory_type: "LPDDR5x",
        memory_speed: "7500 MT/s",
        memory_max: "96GB (unified)",
        storage: "1x M.2 PCIe Gen4 NVMe",
        volume: "~2.5L",
        wifi: "Wi-Fi 7",
        bluetooth: "BT 5.3",
        usb: "USB4 x1, USB 3.2 Gen 2 x3",
        display_out: "HDMI 2.1, DP 2.0, USB-C",
        npu: "XDNA 2 (50 TOPS)",
        total_tops: "~250 TOPS",
        psu: "External 200W",
        orientation: "Horizontal / Vertical",
        tool_free: "No",
        price_base: "$999",
        price_mid: "$1,299",
        price_max: "$1,599",
        availability: "Q2 2025 (Expected)",
        target: "Prosumer, SMB, Content Creator",
        highlights: ["Compact 2.5L", "BRIX ecosystem accessories", "Competitive pricing"]
    },
    "acer_revo_ai": {
        name: "Acer Revo Box AI",
        brand: "Acer",
        platform: "Strix Point",
        cpu: "AMD Ryzen AI 9 HX 370",
        cores: "12C/24T (4P+8E)",
        tdp: "28-54W",
        gpu: "Radeon 890M (RDNA 3.5, 16 CU)",
        gpu_tflops: "~10 TFLOPS FP16",
        memory_type: "DDR5 SO-DIMM",
        memory_speed: "5600 MT/s",
        memory_max: "64GB",
        storage: "1x M.2 PCIe Gen4 NVMe",
        volume: "~1.0L",
        wifi: "Wi-Fi 6E",
        bluetooth: "BT 5.3",
        usb: "USB 3.2 Gen 2 x4, USB-C x1",
        display_out: "HDMI 2.1, DP 1.4",
        npu: "XDNA 2 (50 TOPS)",
        total_tops: "~80 TOPS",
        psu: "External 65W",
        orientation: "Horizontal / VESA",
        tool_free: "No",
        price_base: "$699",
        price_mid: "$849",
        price_max: "$1,099",
        availability: "Q3 2025 (Expected)",
        target: "SMB, Education, General",
        highlights: ["Ultra-compact 1L", "Budget-friendly entry", "VESA mount included"]
    }
};

// Spec rows for comparison table
const SPEC_ROWS = [
    { category: "Platform", specs: [
        { label: "Platform / Architecture", key: "platform" },
        { label: "CPU", key: "cpu" },
        { label: "Cores / Threads", key: "cores" },
        { label: "TDP Range", key: "tdp" },
    ]},
    { category: "Graphics & AI", specs: [
        { label: "Integrated GPU", key: "gpu" },
        { label: "GPU Compute (FP16)", key: "gpu_tflops" },
        { label: "NPU", key: "npu" },
        { label: "Total AI TOPS", key: "total_tops" },
    ]},
    { category: "Memory & Storage", specs: [
        { label: "Memory Type", key: "memory_type" },
        { label: "Memory Speed", key: "memory_speed" },
        { label: "Max Memory", key: "memory_max" },
        { label: "Storage Slots", key: "storage" },
    ]},
    { category: "Connectivity", specs: [
        { label: "Wi-Fi", key: "wifi" },
        { label: "Bluetooth", key: "bluetooth" },
        { label: "USB Ports", key: "usb" },
        { label: "Display Outputs", key: "display_out" },
    ]},
    { category: "Form Factor", specs: [
        { label: "Volume", key: "volume" },
        { label: "PSU", key: "psu" },
        { label: "Orientation", key: "orientation" },
        { label: "Tool-Free Design", key: "tool_free" },
    ]},
    { category: "Market", specs: [
        { label: "Target Audience", key: "target" },
        { label: "Price (Base)", key: "price_base" },
        { label: "Availability", key: "availability" },
    ]}
];

// Feature matrix data
const FEATURES = [
    { name: "Strix Halo APU", asus: true, lenovo: true, hp: true, dell: false, minisforum: true, gigabyte: true, acer: false },
    { name: "LPDDR5x Unified Memory", asus: true, lenovo: true, hp: true, dell: false, minisforum: true, gigabyte: true, acer: false },
    { name: "128GB+ Memory Support", asus: true, lenovo: true, hp: true, dell: false, minisforum: true, gigabyte: false, acer: false },
    { name: "PCIe Gen5 NVMe", asus: false, lenovo: true, hp: false, dell: false, minisforum: false, gigabyte: false, acer: false },
    { name: "USB4", asus: true, lenovo: true, hp: true, dell: false, minisforum: true, gigabyte: true, acer: false },
    { name: "NPU (50 TOPS)", asus: true, lenovo: true, hp: true, dell: true, minisforum: true, gigabyte: true, acer: true },
    { name: "Wi-Fi 7", asus: true, lenovo: true, hp: true, dell: true, minisforum: true, gigabyte: true, acer: false },
    { name: "Tool-Free Access", asus: true, lenovo: "partial", hp: true, dell: true, minisforum: false, gigabyte: false, acer: false },
    { name: "Internal PSU", asus: true, lenovo: false, hp: false, dell: false, minisforum: false, gigabyte: false, acer: false },
    { name: "< 3L Form Factor", asus: true, lenovo: false, hp: true, dell: true, minisforum: true, gigabyte: true, acer: true },
    { name: "ISV Certified", asus: "partial", lenovo: true, hp: true, dell: true, minisforum: false, gigabyte: false, acer: false },
    { name: "Enterprise Management", asus: "partial", lenovo: true, hp: true, dell: true, minisforum: false, gigabyte: false, acer: false },
    { name: "ROCm Support", asus: true, lenovo: true, hp: true, dell: "partial", minisforum: true, gigabyte: true, acer: "partial" },
    { name: "3+ Display Output", asus: true, lenovo: true, hp: true, dell: true, minisforum: true, gigabyte: true, acer: false },
];

// ==========================================
// CUSTOMER VOICE DATA (Sample — replaced by scraper)
// ==========================================
let VOICE_DATA = [];

// Load scraped data if available, otherwise use sample data
async function loadVoiceData() {
    try {
        const response = await fetch('data/voice_data.json');
        if (response.ok) {
            VOICE_DATA = await response.json();
        } else {
            throw new Error('No scraped data');
        }
    } catch (e) {
        // Use sample data as fallback
        VOICE_DATA = getSampleVoiceData();
    }
    return VOICE_DATA;
}

function getSampleVoiceData() {
    return [
        {
            id: 1,
            source: "reddit",
            subreddit: "r/MiniPCs",
            title: "ASUS NUC PN70 vs Minisforum UMI2 — which Strix Halo mini PC is better?",
            text: "Been comparing the PN70 and UMI2. The ASUS has a built-in PSU which is a huge plus for cable management. But the Minisforum is shipping sooner and cheaper. Both use the same Ryzen AI Max+ 395. Anyone have thoughts on build quality?",
            url: "https://reddit.com/r/MiniPCs/comments/example1",
            date: "2025-03-04",
            sentiment: "neutral",
            product: "asus",
            tags: ["build-quality", "form-factor", "pricing"]
        },
        {
            id: 2,
            source: "reddit",
            subreddit: "r/AMDLaptops",
            title: "Strix Halo local LLM performance is insane — running Llama 3.1 70B on 128GB unified memory",
            text: "Just got my Strix Halo mini PC and running Llama 3.1 70B on the 128GB unified LPDDR5x. Getting around 8-10 tokens/sec which is way better than I expected for a desktop APU. The unified memory architecture is a game changer for LLM inference.",
            url: "https://reddit.com/r/AMDLaptops/comments/example2",
            date: "2025-03-03",
            sentiment: "positive",
            product: "minisforum",
            tags: ["local-llm", "performance", "strix-halo"],
            halo_category: "llm_performance"
        },
        {
            id: 3,
            source: "forum",
            forum_name: "ServeTheHome Forums",
            title: "HP Z2 Mini G1a Review — Strix Halo Workstation",
            text: "HP's Z2 Mini G1a is solid but the external 280W PSU is annoying for such a small form factor. Build quality is excellent as expected from the Z-series. ISV certifications are a big selling point for CAD/CAE shops. Thermals are well managed but fan can get loud under sustained GPU load.",
            url: "https://forums.servethehome.com/example3",
            date: "2025-03-02",
            sentiment: "positive",
            product: "hp",
            tags: ["build-quality", "thermals", "workstation"],
            halo_category: "oem_feedback"
        },
        {
            id: 4,
            source: "reddit",
            subreddit: "r/LocalLLaMA",
            title: "ROCm on RDNA 3.5 — getting better but still quirky",
            text: "ROCm 6.3 on Strix Halo RDNA 3.5 works for basic inference with llama.cpp but PyTorch ROCm support is still hit or miss. Had to use nightly builds. Vulkan backend works more reliably for now. AMD needs to improve the out-of-box experience.",
            url: "https://reddit.com/r/LocalLLaMA/comments/example4",
            date: "2025-03-01",
            sentiment: "neutral",
            product: "minisforum",
            tags: ["rocm", "rdna3.5", "software"],
            halo_category: "rocm_feedback"
        },
        {
            id: 5,
            source: "news",
            outlet: "AnandTech",
            title: "Lenovo ThinkCentre Neo Ultra Review: Strix Halo Goes Enterprise",
            text: "Lenovo's ThinkCentre Neo Ultra is one of the first enterprise-grade Strix Halo mini PCs. PCIe Gen5 NVMe support sets it apart. Performance is excellent for multi-threaded workloads and local AI. The 3.7L chassis is a bit larger than competitors but well-built.",
            url: "https://anandtech.com/example5",
            date: "2025-02-28",
            sentiment: "positive",
            product: "lenovo",
            tags: ["review", "enterprise", "performance"]
        },
        {
            id: 6,
            source: "reddit",
            subreddit: "r/LocalLLaMA",
            title: "Strix Halo 128GB for AI — real-world LLM benchmarks",
            text: "Tested multiple LLMs on Strix Halo 128GB config: Llama 3.1 70B Q4 = 9.2 t/s, Mixtral 8x7B = 14.5 t/s, Mistral 7B = 42 t/s. The unified memory eliminates the PCIe bottleneck you get with discrete GPUs. For inference-only workloads under 70B params, this is a sweet spot.",
            url: "https://reddit.com/r/LocalLLaMA/comments/example6",
            date: "2025-02-27",
            sentiment: "positive",
            product: "asus",
            tags: ["benchmarks", "local-llm", "inference"],
            halo_category: "llm_performance"
        },
        {
            id: 7,
            source: "social",
            platform: "X/Twitter",
            title: "AMD Strix Halo mini PCs compared — pricing war heating up",
            text: "Minisforum UMI2 at $1099, Gigabyte BRIX Pro at $999 vs Lenovo/HP at $1300+. The white-label ODMs are undercutting tier-1 OEMs significantly. Remains to be seen if ASUS NUC PN70 will be competitive on pricing.",
            url: "https://twitter.com/example7",
            date: "2025-02-25",
            sentiment: "neutral",
            product: "asus",
            tags: ["pricing", "competition", "market"]
        },
        {
            id: 8,
            source: "reddit",
            subreddit: "r/Amd",
            title: "ROCm 6.3 on Strix Halo — guide and issues tracker",
            text: "Started a community thread for ROCm on Strix Halo. Main issues: 1) HIP SDK installation needs manual env setup, 2) Some ONNX operators not supported on gfx1151, 3) Memory allocation can fail with >64GB models. Workarounds exist but it's not user-friendly yet. AMD please fix.",
            url: "https://reddit.com/r/Amd/comments/example8",
            date: "2025-02-24",
            sentiment: "negative",
            product: "asus",
            tags: ["rocm", "software-issues", "developer-experience"],
            halo_category: "rocm_feedback"
        },
        {
            id: 9,
            source: "forum",
            forum_name: "NotebookReview",
            title: "HP Z2 Mini G1a vs white-label Strix Halo — is the premium worth it?",
            text: "Comparing HP Z2 Mini G1a ($1449) to a white-label Strix Halo box ($899). Same APU, similar specs. HP gives you ISV certs, Wolf Security, 3yr warranty, better thermals. White-label gives you savings but questionable long-term support. For business use, HP is justified. For home lab, go white-label.",
            url: "https://forum.notebookreview.com/example9",
            date: "2025-02-22",
            sentiment: "neutral",
            product: "hp",
            tags: ["comparison", "value", "white-label"],
            halo_category: "oem_feedback"
        },
        {
            id: 10,
            source: "reddit",
            subreddit: "r/MiniPCs",
            title: "Dell OptiPlex Micro with Strix Point — good for office, not for AI",
            text: "Got the new Dell OptiPlex Micro with Ryzen AI 9 HX 370. It's a great office machine but with only 64GB DDR5 and a 16 CU GPU, it's not in the same league as Strix Halo for AI workloads. If you need local LLM, wait for the Halo-based models.",
            url: "https://reddit.com/r/MiniPCs/comments/example10",
            date: "2025-02-20",
            sentiment: "neutral",
            product: "dell",
            tags: ["strix-point", "limitation", "comparison"]
        },
        {
            id: 11,
            source: "news",
            outlet: "Tom's Hardware",
            title: "ASUS NUC PN70 Preview: Strix Halo in Sub-3L Form Factor",
            text: "ASUS's upcoming NUC PN70 promises to pack AMD's Strix Halo into a sub-3-liter chassis with an internal power supply — a first for this power class. The tool-free design and stackable orientation options make it flexible for various deployment scenarios. Pricing remains the key unknown.",
            url: "https://tomshardware.com/example11",
            date: "2025-02-18",
            sentiment: "positive",
            product: "asus",
            tags: ["preview", "form-factor", "design"]
        },
        {
            id: 12,
            source: "reddit",
            subreddit: "r/LocalLLaMA",
            title: "White-label Strix Halo mini PCs — buyer beware on BIOS/firmware",
            text: "Bought a no-name Strix Halo mini PC from AliExpress. Hardware is fine but the BIOS is barebones — no TDP control, no memory timing options. Fan curve is aggressive. At least it was $200 cheaper than branded options. You get what you pay for in terms of firmware polish.",
            url: "https://reddit.com/r/LocalLLaMA/comments/example12",
            date: "2025-02-15",
            sentiment: "negative",
            product: "minisforum",
            tags: ["white-label", "bios", "firmware"],
            halo_category: "oem_feedback"
        },
        {
            id: 13,
            source: "reddit",
            subreddit: "r/Amd",
            title: "Strix Halo running Stable Diffusion via ROCm — it works!",
            text: "Finally got Stable Diffusion XL running on Strix Halo via ROCm. Performance is roughly equivalent to an RTX 3060 for image generation. The 128GB unified memory means I never run out of VRAM. Setup was painful but worth it. Using automatic1111 with ROCm backend.",
            url: "https://reddit.com/r/Amd/comments/example13",
            date: "2025-02-12",
            sentiment: "positive",
            product: "asus",
            tags: ["stable-diffusion", "rocm", "ai-workload"],
            halo_category: "rocm_feedback"
        },
        {
            id: 14,
            source: "social",
            platform: "YouTube",
            title: "Gigabyte BRIX Pro AI unboxing — Strix Halo for $999",
            text: "Gigabyte BRIX Pro AI unboxing. Build quality is decent for the price. Only 1 NVMe slot is a drawback. 96GB max memory vs 128GB on competitors. GPU is slightly cut down at 32 CU instead of 40 CU. Good value but not the full Strix Halo experience.",
            url: "https://youtube.com/example14",
            date: "2025-02-10",
            sentiment: "neutral",
            product: "gigabyte",
            tags: ["unboxing", "review", "value"]
        },
        {
            id: 15,
            source: "reddit",
            subreddit: "r/LocalLLaMA",
            title: "Strix Halo LLM inference power efficiency — impressive",
            text: "Measured power consumption running Llama 3.1 70B on Strix Halo vs RTX 4090: Halo draws ~95W total system vs ~450W for the 4090 rig. Performance per watt is way better on Halo for inference. Perfect for always-on local LLM server.",
            url: "https://reddit.com/r/LocalLLaMA/comments/example15",
            date: "2025-02-08",
            sentiment: "positive",
            product: "asus",
            tags: ["power-efficiency", "inference", "comparison"],
            halo_category: "llm_performance"
        }
    ];
}

// ==========================================
// HALO-SPECIFIC DATA AGGREGATIONS
// ==========================================

function getHaloLLMData() {
    return VOICE_DATA.filter(v => v.halo_category === 'llm_performance');
}

function getHaloOEMData() {
    return VOICE_DATA.filter(v => v.halo_category === 'oem_feedback');
}

function getHaloROCmData() {
    return VOICE_DATA.filter(v => v.halo_category === 'rocm_feedback');
}

// ==========================================
// PRICING DATA FOR CHARTS
// ==========================================
const PRICING_DATA = [
    { name: "ASUS NUC PN70", base: null, mid: null, max: null, avail: "H2 2025 (Expected)", channel: "ASUS eShop, Retail, SI", note: "Pricing TBD" },
    { name: "Lenovo Neo Ultra", base: 1299, mid: 1699, max: 2299, avail: "Q2 2025", channel: "Lenovo.com, CDW, Insight" },
    { name: "HP Z2 Mini G1a", base: 1449, mid: 1899, max: 2499, avail: "Q2 2025", channel: "HP.com, CDW, SHI" },
    { name: "Dell OptiPlex Micro", base: 899, mid: 1099, max: 1399, avail: "Available Now", channel: "Dell.com, CDW" },
    { name: "Minisforum UMI2", base: 1099, mid: 1399, max: 1799, avail: "Q1 2025", channel: "Minisforum.com, Amazon" },
    { name: "Gigabyte BRIX Pro", base: 999, mid: 1299, max: 1599, avail: "Q2 2025 (Expected)", channel: "Newegg, Amazon" },
    { name: "Acer Revo Box AI", base: 699, mid: 849, max: 1099, avail: "Q3 2025 (Expected)", channel: "Acer.com, Retail" }
];
