/* ========================================
   Competitor Data & Customer Voice Data
   Updated with verified research data
   ======================================== */

// ==========================================
// COMPETITOR PRODUCT SPECIFICATIONS
// ==========================================
const COMPETITORS = {
    "asus_pn70": {
        name: "ASUS NUC PN70",
        brand: "ASUS",
        platform: "Strix Halo",
        cpu: "AMD Ryzen AI Max+ 395 (Zen5, 16C/32T)",
        cores: "16C/32T",
        tdp: "45-120W",
        gpu: "Radeon 8060S (RDNA 3.5, 40 CU / 20 WGP)",
        gpu_tflops: "~25 TFLOPS FP16",
        memory_type: "LPDDR5x (soldered, unified)",
        memory_speed: "8533 MT/s",
        memory_max: "Up to 192GB",
        storage: "2x M.2 PCIe Gen4 NVMe",
        volume: "<3L",
        wifi: "Wi-Fi 7",
        bluetooth: "BT 5.4",
        usb: "USB4, USB 3.2 Gen 2, USB-C",
        display_out: "HDMI 2.1, USB-C DP 2.1",
        npu: "XDNA 2 (50 TOPS)",
        total_tops: "~300+ TOPS (CPU+GPU+NPU)",
        psu: "Internal (built-in)",
        orientation: "Horizontal / Vertical / Stackable",
        tool_free: "Yes",
        price_base: "$TBD",
        price_mid: "$TBD",
        price_max: "$TBD",
        availability: "H2 2025 (Expected)",
        target: "AI Developer, SMB IT, Designer, Financial Analyst, Retail SI, ISV",
        highlights: ["<3L with built-in PSU (unique)", "Tool-free design", "Up to 192GB unified LPDDR5x (highest in class)", "8533 MT/s memory (fastest)", "Dual NVMe Gen4", "NPU 50 TOPS"],
        isReference: true
    },
    "hp_z2_mini_g1a": {
        name: "HP Z2 Mini G1a",
        brand: "HP",
        platform: "Strix Halo",
        cpu: "AMD Ryzen AI MAX+ PRO 395 (Zen5, 16C/32T)",
        cores: "16C/32T",
        tdp: "Up to 120W",
        gpu: "Radeon 8060S (RDNA 3.5, 40 CU)",
        gpu_tflops: "~25 TFLOPS FP16",
        memory_type: "LPDDR5x (soldered, unified)",
        memory_speed: "8000 MT/s",
        memory_max: "128GB (unified)",
        storage: "2x M.2 PCIe NVMe",
        volume: "~2.9L (200×168×86mm)",
        wifi: "Wi-Fi 7",
        bluetooth: "BT 5.4",
        usb: "Thunderbolt 4 x2, USB-A 3.2",
        display_out: "Mini DP 2.1 x2, Flex I/O module",
        npu: "XDNA 2 (50 TOPS)",
        total_tops: "~300+ TOPS",
        psu: "Internal 300W",
        orientation: "Horizontal / Vertical / Rackable (5 per 4U)",
        tool_free: "Yes",
        price_base: "$1,200",
        price_mid: "$2,200",
        price_max: "$4,600",
        availability: "Available Now",
        target: "Workstation, CAD/CAE, AI Professional, ISV",
        highlights: ["Z-series workstation lineage", "ISV certified (SolidWorks, AutoCAD)", "HP Wolf Security", "Internal 300W PSU", "2x Flex I/O (10GbE option)", "Rackable 5-per-4U"]
    },
    "beelink_gtr9_pro": {
        name: "Beelink GTR9 Pro",
        brand: "Beelink",
        platform: "Strix Halo",
        cpu: "AMD Ryzen AI Max+ 395 (Zen5, 16C/32T)",
        cores: "16C/32T",
        tdp: "Up to 120W+",
        gpu: "Radeon 8060S (RDNA 3.5, 40 CU)",
        gpu_tflops: "~25 TFLOPS FP16",
        memory_type: "LPDDR5x (soldered, unified)",
        memory_speed: "8000 MT/s",
        memory_max: "128GB (unified)",
        storage: "Dual M.2 NVMe",
        volume: "~2-3L (Mac Studio-like)",
        wifi: "Wi-Fi 7",
        bluetooth: "BT 5.4",
        usb: "USB4 x2, USB 3.2 Gen 2",
        display_out: "HDMI 2.1, USB4 DP",
        npu: "XDNA 2 (50 TOPS)",
        total_tops: "~300+ TOPS",
        psu: "External",
        orientation: "Horizontal",
        tool_free: "No",
        price_base: "$1,999",
        price_mid: "$1,999",
        price_max: "$2,499",
        availability: "Pre-order (2025)",
        target: "AI Developer, Creative Professional, Enthusiast",
        highlights: ["Dual 10GbE", "Mac Studio-like design", "Dual USB4", "126 TOPS total AI"]
    },
    "gmktec_evo_x2": {
        name: "GMKtec EVO-X2 AI",
        brand: "GMKtec",
        platform: "Strix Halo",
        cpu: "AMD Ryzen AI Max+ 395 (Zen5, 16C/32T)",
        cores: "16C/32T",
        tdp: "Up to 120W",
        gpu: "Radeon 8060S (RDNA 3.5, 40 CU)",
        gpu_tflops: "~25 TFLOPS FP16",
        memory_type: "LPDDR5x (soldered, unified)",
        memory_speed: "8000 MT/s",
        memory_max: "128GB (up to 96GB GPU-addressable)",
        storage: "Dual M.2 NVMe",
        volume: "~2-3L",
        wifi: "Wi-Fi 7",
        bluetooth: "BT 5.4",
        usb: "USB4, USB 3.2 Gen 2",
        display_out: "HDMI 2.1, USB4 DP",
        npu: "XDNA 2 (50 TOPS)",
        total_tops: "~300+ TOPS",
        psu: "External",
        orientation: "Horizontal",
        tool_free: "No",
        price_base: "$1,499",
        price_mid: "$1,499",
        price_max: "$1,899",
        availability: "Available Now",
        target: "AI Developer, Creative Professional",
        highlights: ["First Strix Halo to market", "96GB GPU-addressable unified memory", "Aggressive pricing"]
    },
    "minisforum_ms_s1": {
        name: "Minisforum MS-S1 MAX",
        brand: "Minisforum",
        platform: "Strix Halo",
        cpu: "AMD Ryzen AI Max+ 395 (Zen5, 16C/32T)",
        cores: "16C/32T",
        tdp: "Up to 120W+",
        gpu: "Radeon 8060S (RDNA 3.5, 40 CU)",
        gpu_tflops: "~25 TFLOPS FP16",
        memory_type: "LPDDR5x (soldered, unified)",
        memory_speed: "8000 MT/s",
        memory_max: "128GB (unified)",
        storage: "Dual M.2 NVMe",
        volume: "~2-3L",
        wifi: "Wi-Fi 7",
        bluetooth: "BT 5.4",
        usb: "USB4 x2, USB 3.2 Gen 2 x3",
        display_out: "HDMI 2.1, USB4 DP",
        npu: "XDNA 2 (50 TOPS)",
        total_tops: "~300+ TOPS",
        psu: "External 240W",
        orientation: "Horizontal",
        tool_free: "No",
        price_base: "$1,700",
        price_mid: "$1,900",
        price_max: "$2,500",
        availability: "Announced (CES 2026)",
        target: "AI Developer, Content Creator, Enthusiast",
        highlights: ["AI workstation design", "CES 2026 showcase", "Community-driven firmware", "Dual USB4"]
    },
    "dell_pro_micro": {
        name: "Dell Pro Micro QCM1255",
        brand: "Dell",
        platform: "Zen 4 (NOT Zen 5)",
        cpu: "AMD Ryzen 5 PRO 8500GE (Zen 4, 6C/12T)",
        cores: "6C/12T",
        tdp: "35W",
        gpu: "Radeon 740M (RDNA 3, 4 CU)",
        gpu_tflops: "~3 TFLOPS FP16",
        memory_type: "DDR5 SO-DIMM",
        memory_speed: "4800 MT/s",
        memory_max: "64GB",
        storage: "Up to dual M.2 SSD",
        volume: "~1.17L (182×36×178mm)",
        wifi: "Wi-Fi 6E",
        bluetooth: "BT 5.3",
        usb: "USB 3.2 Gen 2, USB-C",
        display_out: "DP 1.4, HDMI, Flex I/O",
        npu: "None (Ryzen PRO 8000)",
        total_tops: "~11 TOPS",
        psu: "External 65-90W",
        orientation: "Horizontal / Vertical / VESA",
        tool_free: "Yes",
        price_base: "$579",
        price_mid: "$799",
        price_max: "$1,077",
        availability: "Available Now",
        target: "Enterprise Desktop Replacement, General Business",
        highlights: ["Ultra-compact 1.17L", "Flex I/O (VGA/DP/HDMI/COM/5G)", "AMD PRO manageability", "No Zen5 offering yet"]
    },
    "lenovo_neo_55q": {
        name: "Lenovo ThinkCentre Neo 55q Gen 6",
        brand: "Lenovo",
        platform: "Strix Point",
        cpu: "AMD Ryzen AI 300 Series (Zen5, Strix Point)",
        cores: "Up to 12C/24T",
        tdp: "15-28W",
        gpu: "Radeon 890M (RDNA 3.5, 16 CU)",
        gpu_tflops: "~10 TFLOPS FP16",
        memory_type: "DDR5 SO-DIMM",
        memory_speed: "5600 MT/s",
        memory_max: "64GB",
        storage: "Up to 2TB PCIe Gen4 SSD",
        volume: "~1.21L (183×179×37mm)",
        wifi: "Wi-Fi 7",
        bluetooth: "BT 5.4",
        usb: "USB 3.2 Gen 2, USB-C",
        display_out: "HDMI 2.1, DP 1.4a, USB-C",
        npu: "XDNA 2 (50 TOPS)",
        total_tops: "~80 TOPS",
        psu: "External 90W",
        orientation: "Horizontal / Vertical / VESA",
        tool_free: "Yes",
        price_base: "$499",
        price_mid: "$699",
        price_max: "$999",
        availability: "Oct 2025",
        target: "SMB, General Commercial, Education",
        highlights: ["Strix Point only (NOT Strix Halo)", "Copilot+ PC", "ENERGY STAR 9.0", "EPEAT Gold", "No Strix Halo ThinkCentre announced"]
    },
    "acer_revo_ai": {
        name: "Acer Revo Box AI",
        brand: "Acer",
        platform: "Strix Point",
        cpu: "AMD Ryzen AI 300 Series (Zen5, Strix Point)",
        cores: "Up to 12C/24T",
        tdp: "15-28W",
        gpu: "Radeon 890M (RDNA 3.5, 16 CU)",
        gpu_tflops: "~10 TFLOPS FP16",
        memory_type: "LPDDR5",
        memory_speed: "Up to 7500 MT/s",
        memory_max: "32GB",
        storage: "2x M.2 2280 PCIe Gen4",
        volume: "~0.75L (130×130×43mm)",
        wifi: "Wi-Fi 6E",
        bluetooth: "BT 5.3",
        usb: "USB4, USB 3.2 Gen 2",
        display_out: "HDMI 2.1, DP 2.0",
        npu: "XDNA 2 (50 TOPS)",
        total_tops: "~80 TOPS",
        psu: "External 65W",
        orientation: "Horizontal / VESA",
        tool_free: "No",
        price_base: "$800",
        price_mid: "$800",
        price_max: "$999",
        availability: "Q2 2025",
        target: "Consumer, Prosumer, Desktop Replacement",
        highlights: ["Ultra-compact 0.75L", "Dual 2.5GbE", "Fingerprint reader", "Copilot+ PC", "No Strix Halo announced"]
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

// Feature matrix data — updated with verified competitors
// Columns: asus, hp, beelink, gmktec, minisforum, dell, lenovo, acer
const FEATURES = [
    { name: "Strix Halo APU",          asus: true, hp: true, beelink: true, gmktec: true, minisforum: true, dell: false, lenovo: false, acer: false },
    { name: "LPDDR5x Unified Memory",  asus: true, hp: true, beelink: true, gmktec: true, minisforum: true, dell: false, lenovo: false, acer: false },
    { name: "128GB+ Memory",           asus: true, hp: true, beelink: true, gmktec: true, minisforum: true, dell: false, lenovo: false, acer: false },
    { name: "192GB Memory (Max)",       asus: true, hp: false, beelink: false, gmktec: false, minisforum: false, dell: false, lenovo: false, acer: false },
    { name: "USB4 / Thunderbolt 4",    asus: true, hp: true, beelink: true, gmktec: true, minisforum: true, dell: false, lenovo: false, acer: true },
    { name: "NPU (50 TOPS XDNA 2)",   asus: true, hp: true, beelink: true, gmktec: true, minisforum: true, dell: false, lenovo: true, acer: true },
    { name: "Wi-Fi 7",                 asus: true, hp: true, beelink: true, gmktec: true, minisforum: true, dell: false, lenovo: true, acer: false },
    { name: "Tool-Free Access",        asus: true, hp: true, beelink: false, gmktec: false, minisforum: false, dell: true, lenovo: true, acer: false },
    { name: "Internal PSU",            asus: true, hp: true, beelink: false, gmktec: false, minisforum: false, dell: false, lenovo: false, acer: false },
    { name: "< 3L Form Factor",        asus: true, hp: true, beelink: true, gmktec: true, minisforum: true, dell: true, lenovo: true, acer: true },
    { name: "ISV Certified",           asus: "partial", hp: true, beelink: false, gmktec: false, minisforum: false, dell: "partial", lenovo: "partial", acer: false },
    { name: "Enterprise Management",   asus: "partial", hp: true, beelink: false, gmktec: false, minisforum: false, dell: true, lenovo: true, acer: false },
    { name: "ROCm / RDNA 3.5 GPU",    asus: true, hp: true, beelink: true, gmktec: true, minisforum: true, dell: false, lenovo: "partial", acer: "partial" },
    { name: "Rackable / Stackable",    asus: true, hp: true, beelink: false, gmktec: false, minisforum: false, dell: false, lenovo: false, acer: false },
    { name: "10GbE Option",            asus: false, hp: true, beelink: true, gmktec: false, minisforum: false, dell: false, lenovo: false, acer: false },
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
            title: "ASUS NUC PN70 vs HP Z2 Mini G1a — which Strix Halo mini PC for AI dev?",
            text: "Been comparing the PN70 and HP Z2 Mini. Both use Ryzen AI Max+ 395 with 40 CU RDNA 3.5. The ASUS has built-in PSU and claims up to 192GB memory, while HP maxes at 128GB but has ISV certs. HP Z2 is shipping now, PN70 is H2 2025. For AI dev workloads, the extra memory on the ASUS could be huge.",
            url: "https://liliputing.com/asus-could-be-working-on-a-nuc-mini-pc-with-an-amd-ryzen-ai-max-395-strix-halo-processor/",
            date: "2025-03-04",
            sentiment: "neutral",
            product: "asus",
            tags: ["comparison", "form-factor", "memory"]
        },
        {
            id: 2,
            source: "reddit",
            subreddit: "r/LocalLLaMA",
            title: "Strix Halo local LLM performance — running Llama 3.1 70B on 128GB unified memory",
            text: "Just got my Strix Halo mini PC and running Llama 3.1 70B Q4 on the 128GB unified LPDDR5x. Getting ~9.2 tokens/sec. Mixtral 8x7B runs at 14.5 t/s, Mistral 7B at 42 t/s. The unified memory eliminates the PCIe bottleneck you get with discrete GPUs. Game changer for inference.",
            url: "https://forum.level1techs.com/t/strix-halo-ryzen-ai-max-395-llm-benchmark-results/233796",
            date: "2025-03-03",
            sentiment: "positive",
            product: "gmktec",
            tags: ["local-llm", "performance", "strix-halo", "benchmarks"],
            halo_category: "llm_performance"
        },
        {
            id: 3,
            source: "forum",
            forum_name: "ServeTheHome Forums",
            title: "HP Z2 Mini G1a Review — Strix Halo Workstation, loud but capable",
            text: "HP's Z2 Mini G1a is solid. Internal 300W PSU is a big plus over competitors with external bricks. ISV certifications and Wolf Security are real selling points for enterprise. However, fan noise hits 70dB under sustained GPU load — that's loud for a desk unit. Flex I/O with 10GbE option is unique.",
            url: "https://hothardware.com/reviews/hp-z2-mini-g1a-workstation-review",
            date: "2025-03-02",
            sentiment: "positive",
            product: "hp",
            tags: ["build-quality", "thermals", "workstation", "noise"],
            halo_category: "oem_feedback"
        },
        {
            id: 4,
            source: "reddit",
            subreddit: "r/LocalLLaMA",
            title: "ROCm on RDNA 3.5 (gfx1151) — getting better but still quirky",
            text: "ROCm 6.3 on Strix Halo RDNA 3.5 works for basic inference with llama.cpp but PyTorch ROCm support is hit or miss. Had to use nightly builds. HIP SDK needs manual env setup. Some ONNX operators not supported on gfx1151. Vulkan backend works more reliably. AMD needs to improve OOB experience.",
            url: "https://rocm.docs.amd.com/en/latest/how-to/system-optimization/strixhalo.html",
            date: "2025-03-01",
            sentiment: "neutral",
            product: "gmktec",
            tags: ["rocm", "rdna3.5", "software", "gfx1151"],
            halo_category: "rocm_feedback"
        },
        {
            id: 5,
            source: "news",
            outlet: "StorageReview",
            title: "HP Z2 Mini G1a running GPT-OSS 120B without discrete GPU",
            text: "StorageReview tested the HP Z2 Mini G1a running a 120B parameter model entirely on the integrated Radeon 8060S via 128GB unified memory. No discrete GPU needed. Performance was usable for inference at ~5 t/s. This is a paradigm shift for AI workstations — desktop-class LLM inference without NVIDIA.",
            url: "https://www.storagereview.com/review/hp-z2-mini-g1a-review-running-gpt-oss-120b-without-a-discrete-gpu",
            date: "2025-02-28",
            sentiment: "positive",
            product: "hp",
            tags: ["review", "llm", "performance", "workstation"],
            halo_category: "llm_performance"
        },
        {
            id: 6,
            source: "reddit",
            subreddit: "r/LocalLLaMA",
            title: "Strix Halo 128GB unified memory — real-world LLM benchmarks compilation",
            text: "Compiled benchmarks across Strix Halo systems: Llama 3.1 70B Q4 = 9.2 t/s, Mixtral 8x7B = 14.5 t/s, Mistral 7B = 42 t/s, Llama 3.1 8B = 55 t/s, Phi-3 Mini = 68 t/s. Power draw ~95W total system. vs RTX 4090 rig at ~450W. Performance/watt is insane for inference.",
            url: "https://community.frame.work/t/amd-strix-halo-ryzen-ai-max-395-gpu-llm-performance-tests/72521",
            date: "2025-02-27",
            sentiment: "positive",
            product: "asus",
            tags: ["benchmarks", "local-llm", "inference", "power-efficiency"],
            halo_category: "llm_performance"
        },
        {
            id: 7,
            source: "social",
            platform: "X/Twitter",
            title: "Strix Halo mini PC pricing: ODMs vs Tier-1 OEMs",
            text: "GMKtec EVO-X2 at $1499, Beelink GTR9 Pro at $1999 vs HP Z2 Mini at $1200+. ODMs not necessarily cheaper — HP's base config is competitive. But ODMs ship faster. ASUS NUC PN70 pricing still unknown. The 192GB memory option could justify a premium if priced right.",
            url: "https://liliputing.com/amd-strix-halo-is-coming-to-more-mini-pcs-eventually/",
            date: "2025-02-25",
            sentiment: "neutral",
            product: "asus",
            tags: ["pricing", "competition", "market"]
        },
        {
            id: 8,
            source: "reddit",
            subreddit: "r/Amd",
            title: "ROCm 6.3 on Strix Halo — community guide and issues tracker",
            text: "Community thread for ROCm on Strix Halo. Main issues: 1) HIP SDK installation needs manual env setup, 2) Some ONNX operators not supported on gfx1151, 3) Memory allocation can fail with >64GB models, 4) PyTorch nightly required. Stable Diffusion XL works via ROCm — roughly RTX 3060 equivalent for image gen.",
            url: "https://github.com/ROCm/ROCm/issues/5745",
            date: "2025-02-24",
            sentiment: "negative",
            product: "asus",
            tags: ["rocm", "software-issues", "developer-experience"],
            halo_category: "rocm_feedback"
        },
        {
            id: 9,
            source: "forum",
            forum_name: "NotebookCheck",
            title: "HP Z2 Mini G1a Review — compact workstation with Ryzen AI Max",
            text: "NotebookCheck's review of the HP Z2 Mini G1a. Pros: excellent build quality, ISV certs, internal PSU, Flex I/O modularity. Cons: loud under load (up to 70dB), external display output via Mini DP only (no full-size HDMI on base config). For price, HP undercuts many ODMs at the base config.",
            url: "https://www.notebookcheck.net/HP-Z2-Mini-G1a-with-AMD-Strix-Halo-review-Compact-workstation-with-Ryzen-AI-Max-and-Radeon-RX-8060S.1069652.0.html",
            date: "2025-02-22",
            sentiment: "positive",
            product: "hp",
            tags: ["review", "build-quality", "noise", "workstation"],
            halo_category: "oem_feedback"
        },
        {
            id: 10,
            source: "reddit",
            subreddit: "r/MiniPCs",
            title: "Dell has NO Zen 5 mini PC — still on Ryzen PRO 8000 (Zen 4)",
            text: "Checked Dell's lineup — the Pro Micro QCM1255 uses Ryzen 5 PRO 8500GE (Zen 4). No Strix Point, no Strix Halo. Dell is behind HP by at least a year in AMD mini PC adoption. If you need Zen 5, look at HP Z2 Mini, ASUS NUC PN70, or ODM brands like Beelink/GMKtec.",
            url: "https://www.techradar.com/pro/12th-mini-workstation-pc-with-amds-flagship-ai-cpu-announced-and-i-dont-understand-why-dell-asus-and-msi-havent-released-one",
            date: "2025-02-20",
            sentiment: "neutral",
            product: "dell",
            tags: ["dell", "zen4", "limitation", "comparison"]
        },
        {
            id: 11,
            source: "news",
            outlet: "Tom's Hardware",
            title: "GMKtec EVO-X2 AI Review — first Strix Halo mini PC tested",
            text: "Tom's Hardware reviewed the GMKtec EVO-X2 AI. First Strix Halo mini PC to market. 128GB unified memory with up to 96GB GPU-addressable. Performance matches expectations for the Ryzen AI Max+ 395 platform. Build quality is decent for an ODM product. External PSU is the main drawback.",
            url: "https://www.tomshardware.com/desktops/mini-pcs/gmktec-evo-x2-ai-mini-pc-review",
            date: "2025-02-18",
            sentiment: "positive",
            product: "gmktec",
            tags: ["review", "first-to-market", "performance"],
            halo_category: "oem_feedback"
        },
        {
            id: 12,
            source: "reddit",
            subreddit: "r/LocalLLaMA",
            title: "White-label Strix Halo mini PCs — buyer beware on BIOS/firmware",
            text: "Bought a no-name Strix Halo from AliExpress ($200 cheaper). Hardware is fine but BIOS is barebones — no TDP control, no memory timing options, aggressive fan curve. Compare to HP Z2 Mini with proper BIOS, Wolf Security, 3yr warranty. You get what you pay for in firmware polish.",
            url: "https://strixhalo.wiki/Hardware/Boards/Sixunited_AXB35/Firmware",
            date: "2025-02-15",
            sentiment: "negative",
            product: "gmktec",
            tags: ["white-label", "bios", "firmware", "quality"],
            halo_category: "oem_feedback"
        },
        {
            id: 13,
            source: "reddit",
            subreddit: "r/Amd",
            title: "Strix Halo running Stable Diffusion XL via ROCm — it works!",
            text: "Finally got SDXL running on Strix Halo via ROCm. Performance roughly equals RTX 3060 for image generation. The 128GB unified memory means no VRAM limits ever. Setup was painful (nightly PyTorch, manual HIP config) but worth it. Using automatic1111 with ROCm backend.",
            url: "https://community.frame.work/t/anybody-tried-running-image-generation-e-g-stable-diffusion-xl-3-5-or-similar-on-linux/76932",
            date: "2025-02-12",
            sentiment: "positive",
            product: "asus",
            tags: ["stable-diffusion", "rocm", "ai-workload"],
            halo_category: "rocm_feedback"
        },
        {
            id: 14,
            source: "news",
            outlet: "VideoCardz",
            title: "AMD announces Ryzen AI Halo mini PC platform — competitor to NVIDIA DGX Spark",
            text: "AMD unveiled the Ryzen AI Halo developer platform at CES 2026. Palm-sized device with Strix Halo APU, up to 128GB unified memory. Targets local AI development as direct competitor to NVIDIA DGX Spark. Linux + Windows support, ROCm included. Expected Q2 2026.",
            url: "https://videocardz.com/newz/amd-announces-ryzen-ai-halo-mini-pc-platform-aimed-at-local-ai-positioned-against-nvidia-dgx-spark",
            date: "2025-02-10",
            sentiment: "positive",
            product: "asus",
            tags: ["amd-platform", "dgx-spark", "developer"]
        },
        {
            id: 15,
            source: "reddit",
            subreddit: "r/LocalLLaMA",
            title: "Strix Halo LLM power efficiency — 95W vs 450W for same inference speed",
            text: "Measured power: Strix Halo 128GB running Llama 70B = ~95W total system. RTX 4090 rig running same model = ~450W. Strix Halo is ~4.7x more power efficient for LLM inference. Perfect for always-on local LLM server. ROCm still needs work but llama.cpp vulkan is solid.",
            url: "https://www.hardware-corner.net/strix-halo-llm-optimization/",
            date: "2025-02-08",
            sentiment: "positive",
            product: "asus",
            tags: ["power-efficiency", "inference", "comparison"],
            halo_category: "llm_performance"
        },
        {
            id: 16,
            source: "news",
            outlet: "Liliputing",
            title: "Beelink GTR9 Pro teased — Strix Halo with dual 10GbE for $1999",
            text: "Beelink's GTR9 Pro features Ryzen AI Max+ 395, up to 128GB LPDDR5x, dual USB4, dual 10GbE networking. Mac Studio-like design. At $1999, it's pricier than GMKtec's offering but adds enterprise networking. No ISV certification though.",
            url: "https://liliputing.com/beelink-gtr9-pro-is-an-amd-strix-halo-mini-pc-that-looks-like-a-mac-studio/",
            date: "2025-02-05",
            sentiment: "neutral",
            product: "beelink",
            tags: ["beelink", "pricing", "networking", "10gbe"],
            halo_category: "oem_feedback"
        },
        {
            id: 17,
            source: "reddit",
            subreddit: "r/MiniPCs",
            title: "Lenovo ThinkCentre Neo 55q Gen 6 — Strix Point only, no Halo",
            text: "Lenovo's new ThinkCentre tiny uses Strix Point (Ryzen AI 300), NOT Strix Halo. Max 64GB DDR5, 16 CU GPU. Good for office work but not AI workloads. Starting at $499 it's well-positioned for enterprise refresh cycles. No Strix Halo ThinkCentre has been announced.",
            url: "https://liliputing.com/lenovo-thinkcentre-neo-55q-gen-6-is-a-mini-pc-with-ryzen-ai-200-or-300-inside/",
            date: "2025-02-02",
            sentiment: "neutral",
            product: "lenovo",
            tags: ["lenovo", "strix-point", "enterprise", "limitation"]
        },
        {
            id: 18,
            source: "forum",
            forum_name: "ServeTheHome",
            title: "Beelink SER9 review — Strix Point mini PC, solid but limited memory",
            text: "Beelink SER9 with Ryzen AI 9 HX 370 (Strix Point). Only 32GB soldered LPDDR5x — not upgradeable. Good for general use, near-silent at <32dB. USB4, 2.5GbE. For AI workloads you'll want Strix Halo with 128GB+. $799-999 pricing is reasonable for the platform.",
            url: "https://www.servethehome.com/beelink-ser9-amd-ryzen-ai-9-hx-370-mini-pc-review/",
            date: "2025-01-28",
            sentiment: "neutral",
            product: "beelink",
            tags: ["strix-point", "review", "memory-limitation"]
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
// DAILY BRIEF / NEWSLETTER DATA
// Auto-generated from VOICE_DATA competitor intelligence
// Style reference: TechOrange 科技早餐
// ==========================================

// Generate daily briefs from VOICE_DATA after it loads
function generateDailyBriefs() {
    // Group voice data by date
    const byDate = {};
    VOICE_DATA.forEach(v => {
        if (!byDate[v.date]) byDate[v.date] = [];
        byDate[v.date].push(v);
    });

    // Sort dates descending
    const sortedDates = Object.keys(byDate).sort((a, b) => new Date(b) - new Date(a));

    // Generate briefs for each date
    return sortedDates.map(date => {
        const items = byDate[date];
        const briefItems = items.map(v => {
            // Map voice data to newsletter article format
            const brandMap = {
                asus: 'ASUS NUC PN70', hp: 'HP Z2 Mini G1a', beelink: 'Beelink GTR9 Pro',
                gmktec: 'GMKtec EVO-X2 AI', minisforum: 'Minisforum MS-S1', dell: 'Dell Pro Micro',
                lenovo: 'Lenovo Neo 55q', acer: 'Acer Revo Box'
            };
            const productName = brandMap[v.product] || v.product;

            // Determine tag from source/category
            let tag = '競品動態';
            if (v.halo_category === 'llm_performance') tag = 'AI 效能';
            else if (v.halo_category === 'rocm_feedback') tag = '軟體生態';
            else if (v.halo_category === 'oem_feedback') tag = 'OEM 評測';
            else if (v.tags && v.tags.includes('pricing')) tag = '定價情報';
            else if (v.tags && v.tags.includes('review')) tag = '產品評測';
            else if (v.tags && v.tags.includes('comparison')) tag = '競品比較';

            // Determine impact
            let impact = 'medium';
            if (v.sentiment === 'negative' && (v.product === 'asus' || v.halo_category === 'rocm_feedback')) impact = 'high';
            else if (v.tags && (v.tags.includes('review') || v.tags.includes('pricing'))) impact = 'high';
            else if (v.sentiment === 'positive' && v.product === 'asus') impact = 'high';

            // Generate SPM action recommendation
            let action = '持續追蹤後續發展';
            if (v.product === 'hp') action = '分析 HP 策略，找出 PN70 差異化切入點';
            else if (v.product === 'asus' && v.sentiment === 'positive') action = '將此正面回饋納入行銷素材';
            else if (v.halo_category === 'rocm_feedback') action = '與 AMD 團隊確認 ROCm 支援進度';
            else if (v.tags && v.tags.includes('pricing')) action = '納入 PN70 定價策略參考';
            else if (v.product === 'dell' || v.product === 'lenovo') action = '把握競爭對手缺位的市場窗口';

            return {
                tag: tag,
                title: v.title,
                paragraphs: generateParagraphs(v, productName),
                impact: impact,
                action: action,
                source: v.source === 'reddit' ? (v.subreddit || 'Reddit') : v.source === 'forum' ? (v.forum_name || 'Forum') : v.source === 'news' ? (v.outlet || 'News') : (v.platform || 'Social'),
                url: v.url,
                sentiment: v.sentiment
            };
        });

        // Generate headline from most impactful item
        const topItem = briefItems[0];
        const dateObj = new Date(date);
        const dateStr = `${dateObj.getFullYear()}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${String(dateObj.getDate()).padStart(2, '0')}`;

        return {
            date: date,
            dateDisplay: dateStr,
            count: briefItems.length,
            items: briefItems
        };
    });
}

function generateParagraphs(voiceItem, productName) {
    // Generate 2-3 paragraphs of analysis text in TechOrange style
    // with bold keywords for emphasis
    const paragraphs = [];

    // Main content paragraph - use the voice data text directly
    paragraphs.push(voiceItem.text);

    // Analysis paragraph - generate competitive insight
    if (voiceItem.product === 'hp') {
        paragraphs.push(`對 ASUS NUC PN70 而言，**HP Z2 Mini G1a** 是目前最直接的 Tier-1 OEM 競爭對手。HP 在**企業認證、安全性和通路深度**上具備優勢，但 PN70 的 **192GB 記憶體上限**和**可堆疊設計**是 HP 目前無法匹敵的差異化特點。`);
    } else if (voiceItem.product === 'gmktec' || voiceItem.product === 'beelink' || voiceItem.product === 'minisforum') {
        paragraphs.push(`ODM 品牌在 Strix Halo 市場的快速佈局值得關注。**${productName}** 的出貨速度快於 Tier-1 OEM，但在**韌體品質、ISV 認證、企業管理**等方面仍有明顯差距。這正是 ASUS NUC 品牌價值的核心所在。`);
    } else if (voiceItem.product === 'dell' || voiceItem.product === 'lenovo') {
        paragraphs.push(`**${productName}** 目前尚未進入 Strix Halo 市場，這為 ASUS NUC PN70 創造了寶貴的**市場窗口期**。在 Dell 和 Lenovo 推出對應產品之前，PN70 有機會率先建立 Strix Halo 迷你 PC 在企業市場的品牌認知。`);
    } else if (voiceItem.halo_category === 'llm_performance') {
        paragraphs.push(`Strix Halo 的 **128GB 統一記憶體架構**消除了傳統 PCIe 頻寬瓶頸，使本地 LLM 推論成為可能。PN70 更進一步支援 **192GB**，這意味著可以在不犧牲精度的情況下跑完整的大型模型，這在**企業 AI 部署**場景中是決定性優勢。`);
    } else if (voiceItem.halo_category === 'rocm_feedback') {
        paragraphs.push(`ROCm 軟體生態的成熟度直接影響 Strix Halo 平台的 AI 應用體驗。目前 **gfx1151（RDNA 3.5）的支援度仍待改善**，這是 PN70 上市前需要與 AMD 密切協調的關鍵議題。建議 SPM 團隊持續追蹤 ROCm 更新進度，確保 PN70 出貨時提供穩定的**開箱即用 AI 開發體驗**。`);
    }

    return paragraphs;
}

// Static fallback briefs (used when VOICE_DATA hasn't loaded yet)
const STATIC_BRIEFS = [];

// ==========================================
// PRICING DATA FOR CHARTS
// ==========================================
const PRICING_DATA = [
    { name: "ASUS NUC PN70", base: null, mid: null, max: null, avail: "H2 2025 (Expected)", channel: "ASUS eShop, Retail, SI", note: "Pricing TBD" },
    { name: "HP Z2 Mini G1a", base: 1200, mid: 2200, max: 4600, avail: "Available Now", channel: "HP.com, CDW, SHI, Micro Center" },
    { name: "Beelink GTR9 Pro", base: 1999, mid: 1999, max: 2499, avail: "Pre-order 2025", channel: "Beelink.com, Amazon" },
    { name: "GMKtec EVO-X2 AI", base: 1499, mid: 1499, max: 1899, avail: "Available Now", channel: "GMKtec.com, Amazon" },
    { name: "Minisforum MS-S1", base: 1700, mid: 1900, max: 2500, avail: "Announced (CES 2026)", channel: "Minisforum.com" },
    { name: "Dell Pro Micro", base: 579, mid: 799, max: 1077, avail: "Available Now (Zen 4)", channel: "Dell.com, CDW" },
    { name: "Lenovo Neo 55q", base: 499, mid: 699, max: 999, avail: "Oct 2025", channel: "Lenovo.com, CDW, Insight" },
    { name: "Acer Revo Box AI", base: 800, mid: 800, max: 999, avail: "Q2 2025", channel: "Acer.com, Retail" }
];
