const { useState, useEffect, useRef } = React;

const IMG_WEEK1 = 'https://images.unsplash.com/photo-1544168190-79c17527004f?auto=format&fit=crop&w=300&q=80';

// CHART COMPONENT
const ScoreChart = ({ history }) => {
    const chartRef = useRef(null);
    useEffect(() => {
        if (!chartRef.current) return;
        const ctx = chartRef.current.getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: history.map(h => h.date),
                datasets: [{
                    label: 'Acne Score',
                    data: history.map(h => h.score),
                    borderColor: '#6b21a8',
                    backgroundColor: 'rgba(107, 33, 168, 0.2)',
                    fill: true,
                    tension: 0.3,
                    pointBackgroundColor: '#6b21a8',
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { min: 0, max: 100, ticks: { stepSize: 20 } }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
        return () => chart.destroy();
    }, [history]);
    return <div className="h-48 w-full"><canvas ref={chartRef}></canvas></div>;
};

// DASHBOARD VIEW
const DashboardView = ({ setView, userData }) => {
    const [sliderVal, setSliderVal] = useState(50);
    const { history, points } = userData;
    const baseline = history[0];
    const latest = history[history.length - 1];
    const currentScore = latest?.score || 0;
    const improvement = history.length > 1 ? currentScore - baseline.score : 0;
    const weeksActive = history.length > 1 ? history.length - 1 : 0;

    return (
        <div className="phone-container flex flex-col h-full" style={{background:'#f4f0fb'}}>

            {/* ── STICKY HEADER ── */}
            <div className="bg-white px-4 py-3 flex items-center gap-3 shadow-sm sticky top-0 z-20 border-b border-gray-100">
                <button onClick={() => setView('whatsapp')}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition">
                    <i className="fa-solid fa-arrow-left text-sm"></i>
                </button>
                <div className="flex-1">
                    <p className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold">Galderma</p>
                    <h1 className="text-base font-bold text-gray-900 leading-tight">My Skin Journey</h1>
                </div>
                <div className="w-8 h-8 rounded-full bg-benzac-light flex items-center justify-center text-benzac-purple text-sm font-bold">
                    {points > 0 ? `${points}` : '⭐'}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar pb-6">

                {/* ── 1. HERO SUMMARY ── */}
                <div className="mx-4 mt-4 rounded-2xl overflow-hidden shadow-lg" style={{background:'linear-gradient(135deg,#3b0764 0%,#6b21a8 60%,#9333ea 100%)'}}>
                    <div className="px-5 pt-5 pb-4">
                        <p className="text-purple-200 text-xs font-semibold uppercase tracking-widest mb-3">Your Progress At a Glance</p>
                        {/* Big score */}
                        <div className="flex items-end gap-4 mb-4">
                            <div>
                                <p className="text-purple-300 text-xs mb-1">Current Score</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-black text-white">{currentScore}</span>
                                    <span className="text-purple-300 text-lg">/100</span>
                                </div>
                            </div>
                            {improvement > 0 && (
                                <div className="mb-2 bg-white/15 rounded-xl px-3 py-2 text-center">
                                    <div className="text-green-300 text-xl font-black">+{improvement}</div>
                                    <div className="text-purple-200 text-[10px]">pts gained</div>
                                </div>
                            )}
                        </div>
                        {/* Score bar */}
                        <div className="w-full bg-white/20 rounded-full h-2 mb-1">
                            <div className="h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-300 transition-all duration-700"
                                style={{width:`${currentScore}%`}}></div>
                        </div>
                        <div className="flex justify-between text-[10px] text-purple-300 mb-4">
                            <span>Needs care</span><span>Clear skin</span>
                        </div>
                        {/* Stat chips */}
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                {icon:'🗓️', val: `${weeksActive}`, label:'Weeks active'},
                                {icon:'🔥', val:'7-day', label:'Streak'},
                                {icon:'💊', val:'85%', label:'Adherence'},
                            ].map((s,i) => (
                                <div key={i} className="bg-white/10 rounded-xl py-2 px-1 text-center">
                                    <div className="text-lg">{s.icon}</div>
                                    <div className="text-white font-bold text-sm">{s.val}</div>
                                    <div className="text-purple-300 text-[10px]">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── 2. ACNE SCORE CHART ── */}
                <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
                    <div className="flex justify-between items-center mb-3">
                        <div>
                            <h2 className="font-bold text-gray-800 text-sm">Score Timeline</h2>
                            <p className="text-[11px] text-gray-400">Tracking your skin week by week</p>
                        </div>
                        {improvement > 0 && <span className="text-xs bg-green-50 text-green-700 font-semibold px-2 py-1 rounded-lg">↑ Improving</span>}
                    </div>
                    <ScoreChart history={history} />
                </div>

                {/* ── 3. BEFORE / AFTER ── only if 2 scans */}
                {history.length > 1 && (
                    <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                        <div className="px-4 pt-4 pb-2">
                            <h2 className="font-bold text-gray-800 text-sm">Visible Progress</h2>
                            <p className="text-[11px] text-gray-400">Drag to compare Day 1 vs Week 1</p>
                        </div>
                        <div className="relative w-full h-56 bg-gray-100 select-none">
                            <img src={latest.img} className="absolute inset-0 w-full h-full object-cover" draggable="false" />
                            <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{width:`${sliderVal}%`}}>
                                <img src={baseline.img} className="absolute inset-0 h-full object-cover" style={{width:'400px'}} draggable="false" />
                            </div>
                            <div className="absolute top-2 left-3 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">Day 1</div>
                            <div className="absolute top-2 right-3 bg-benzac-purple/90 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">Week {weeksActive}</div>
                            <input type="range" min="0" max="100" value={sliderVal} onChange={e => setSliderVal(e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10" />
                            <div className="absolute top-0 bottom-0 w-0.5 bg-white pointer-events-none shadow-lg" style={{left:`calc(${sliderVal}% - 1px)`}}>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 bg-white rounded-full shadow-lg border-2 border-benzac-purple flex items-center justify-center">
                                    <i className="fa-solid fa-arrows-left-right text-benzac-purple text-[10px]"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── 4. WEEKLY SCAN HISTORY ── */}
                <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
                    <div className="flex justify-between items-center mb-3">
                        <div>
                            <h2 className="font-bold text-gray-800 text-sm">Scan History</h2>
                            <p className="text-[11px] text-gray-400">Every photo you've uploaded</p>
                        </div>
                        <span className="text-[11px] text-benzac-purple font-semibold bg-benzac-light px-2 py-1 rounded-lg">{history.length} scans</span>
                    </div>
                    <div className="space-y-3">
                        {history.slice().reverse().map((item, idx) => (
                            <div key={idx} className={`flex gap-3 p-3 rounded-xl border ${idx === 0 ? 'bg-benzac-light border-benzac-purple/30' : 'bg-gray-50 border-gray-100'}`}>
                                <img src={item.img} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-gray-700">{item.week === 0 ? '📸 Baseline' : `Week ${item.week}`}</span>
                                        <div className="flex items-center gap-1">
                                            {item.change > 0 && <span className="text-[10px] text-green-600 font-bold">+{item.change}</span>}
                                            <span className={`text-sm font-black ${idx === 0 ? 'text-benzac-purple' : 'text-gray-500'}`}>{item.score}</span>
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-gray-500 mt-0.5 truncate">{item.description}</p>
                                    <p className="text-[10px] text-gray-400 mt-1">{item.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── 5. ROUTINE ADHERENCE ── */}
                <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
                    <div className="flex justify-between items-center mb-1">
                        <div>
                            <h2 className="font-bold text-gray-800 text-sm">Routine Adherence</h2>
                            <p className="text-[11px] text-gray-400">Last 2 weeks</p>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-black text-green-600">85%</span>
                            <p className="text-[10px] text-gray-400">completion</p>
                        </div>
                    </div>
                    <div className="mt-3 grid grid-cols-7 gap-1.5 mb-1">
                        {['M','T','W','T','F','S','S'].map((d,i)=>(
                            <div key={i} className="text-center text-[10px] text-gray-400 font-medium">{d}</div>
                        ))}
                        {Array.from({length:14}).map((_,i)=>(
                            <div key={i}
                                className={`aspect-square rounded-md ${i===5||i===12?'bg-gray-100':i<8?'bg-benzac-purple':'bg-benzac-purple/40'}`}
                                title={i===5?'Skipped':'Completed'}></div>
                        ))}
                    </div>
                    <div className="flex gap-3 mt-2">
                        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-benzac-purple"></div><span className="text-[10px] text-gray-500">Completed</span></div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-gray-100"></div><span className="text-[10px] text-gray-500">Missed</span></div>
                    </div>
                </div>

                {/* ── 6. RECOVERY INSIGHTS ── */}
                {history.length > 0 && (
                    <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
                        <h2 className="font-bold text-gray-800 text-sm mb-3">AI Recovery Insights</h2>
                        <div className="space-y-2">
                            {[
                                {icon:'✅', color:'bg-green-50 border-green-100', text:'Redness reduced consistently over 1 week.'},
                                {icon:'⚠️', color:'bg-yellow-50 border-yellow-100', text:'New breakouts correlate with low-sleep days.'},
                                {icon:'🌟', color:'bg-purple-50 border-purple-100', text:'Routine consistency improved your score by 13 points.'},
                            ].map((ins,i)=>(
                                <div key={i} className={`flex gap-2 items-start p-3 rounded-xl border ${ins.color}`}>
                                    <span className="text-base flex-shrink-0">{ins.icon}</span>
                                    <p className="text-xs text-gray-700 leading-relaxed">{ins.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── 7. LIFESTYLE TRIGGERS ── */}
                <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
                    <h2 className="font-bold text-gray-800 text-sm mb-1">Lifestyle Triggers</h2>
                    <p className="text-[11px] text-gray-400 mb-4">How your habits affect your skin</p>
                    <div className="flex gap-3">
                        {[
                            {label:'Sleep', pct:80, color:'bg-blue-400', bg:'bg-blue-50', val:'7h avg'},
                            {label:'Stress', pct:40, color:'bg-red-400', bg:'bg-red-50', val:'Moderate'},
                            {label:'Water', pct:60, color:'bg-cyan-400', bg:'bg-cyan-50', val:'1.5L avg'},
                        ].map((t,i)=>(
                            <div key={i} className={`flex-1 ${t.bg} rounded-xl p-3 text-center`}>
                                <div className="relative w-full bg-gray-200 rounded-full h-2 mb-2">
                                    <div className={`h-2 rounded-full ${t.color}`} style={{width:`${t.pct}%`}}></div>
                                </div>
                                <p className="text-xs font-bold text-gray-700">{t.val}</p>
                                <p className="text-[10px] text-gray-400">{t.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── 8. REWARDS WALLET ── */}
                <div className="mx-4 mt-4 rounded-2xl overflow-hidden shadow-sm" style={{background:'linear-gradient(135deg,#1e1b4b,#3b0764)'}}>
                    <div className="p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <p className="text-purple-300 text-[11px] uppercase tracking-widest mb-1">Rewards Wallet</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-white">{points}</span>
                                    <span className="text-purple-300 text-sm">pts</span>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center text-xl">💰</div>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2 mb-1.5">
                            <div className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-300"
                                style={{width:`${Math.min((points/500)*100,100)}%`}}></div>
                        </div>
                        <div className="flex justify-between text-[10px]">
                            <span className="text-purple-300">{points} pts earned</span>
                            <span className="text-yellow-300 font-semibold">{500-points} to voucher 🎁</span>
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px] text-purple-300">
                            <div className="bg-white/10 rounded-lg py-2"><div className="text-white font-bold">+10</div>Daily check-in</div>
                            <div className="bg-white/10 rounded-lg py-2"><div className="text-white font-bold">+25</div>Weekly scan</div>
                            <div className="bg-white/10 rounded-lg py-2"><div className="text-white font-bold">+50</div>7-day streak</div>
                        </div>
                    </div>
                </div>

                {/* ── 9. MILESTONE ── */}
                {history.length > 1 && (
                    <div className="mx-4 mt-4 rounded-2xl overflow-hidden shadow-sm border border-yellow-200" style={{background:'linear-gradient(135deg,#fffbeb,#fef3c7)'}}>
                        <div className="p-4 flex gap-4 items-center">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-2xl shadow-md flex-shrink-0">
                                🏆
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-yellow-600 uppercase tracking-widest font-bold mb-0.5">Milestone Unlocked</p>
                                <h3 className="font-black text-gray-800 text-sm">Week 1 Complete!</h3>
                                <p className="text-[11px] text-gray-600 mt-0.5">Acne Score improved <b>+{improvement} points</b>. Your skin is healing. 💕</p>
                            </div>
                        </div>
                        <div className="px-4 pb-4">
                            <button className="w-full py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-xl shadow-sm">
                                Share My Progress 📤
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};


// WHATSAPP VIEW
const WhatsAppView = ({ setView, userData, setUserData }) => {
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [answers, setAnswers] = useState({});
    
    const QUESTIONS = [
        { id: 1, text: "Hi! I'm Benzac Buddy, your AI Acne Coach. Let's start your clear skin journey. Ready for your first skin scan?", options: ["Ready!"], key: 'ready' },
        { id: 2, text: "Where are your breakouts?\nThis helps identify acne pattern and severity.", options: ["Forehead", "Cheeks", "Chin", "Nose", "Jawline", "Multiple areas"], key: 'area' },
        { id: 3, text: "What does your acne look like today?\nBuddy matches Benzac products based on acne stage.", options: ["Small bumps", "Whiteheads", "Blackheads", "Red pimples", "Painful acne"], key: 'acneType' },
        { id: 4, text: "How would you describe your skin?\nNeeded for cleanser and routine recommendations.", options: ["Dry", "Normal", "Combination", "Oily", "Very Oily"], key: 'skinType' },
        { id: 5, text: "How long has this breakout been here?\nHelps distinguish new flare-ups from persistent acne.", options: ["Today", "2–3 days", "1 week", "More than a week"], key: 'duration' },
        { id: 6, text: "Tell me a little about this week.\nLifestyle inputs feed the predictive acne model.", options: ["High stress 🤯", "Poor sleep 😴", "Feeling good! ✨"], key: 'lifestyle' },
        { id: 7, text: "Anything I should know about your skin?\nFinal personalization question.", options: ["Sensitive skin", "Skin feels painful", "Marks after pimples", "First breakout", "Acne keeps coming back"], key: 'extra' },
        { id: 8, text: "Final Step 📸\nUpload a clear selfie.\nNatural light • Front-facing • No makeup • Close-up.", isUpload: true }
    ];

    const getRecommendation = (ans) => {
        let rec = {};
        if (ans.acneType === "Red pimples" || ans.extra === "Skin feels painful") {
            rec = {
                title: "Active Spot Breakout Routine",
                benefit: "The Power Patch targets active spots directly — absorbing impurities and reducing inflammation overnight.",
                products: [
                    {
                        name: "Step 1: Benzac Power Patch",
                        links: [
                            { name: "Amazon", url: "https://www.amazon.in/Benzac-Fast-Acting-Ultra-Thin-Invisible-Dermatologist-Tested/dp/B0F23YL442" },
                            { name: "Zepto", url: "https://www.zepto.com/pn/benzac-power-fast-acting-pimple-patch/pvid/f828cef4-77f3-4fb6-ac82-1c751d459019" }
                        ]
                    },
                    {
                        name: "Step 2: Benzac AC 2.5% Gel (PM)",
                        links: [
                            { name: "Amazon", url: "https://www.amazon.in/BENZAC-AC-2-5-Tube-Gel/dp/B09V3SWKM5" },
                            { name: "Blinkit", url: "https://blinkit.com/prn/benzac-ac-2.5-tube-of-30gm-gel/prid/647788" }
                        ]
                    }
                ]
            };
        } else if (ans.extra === "Marks after pimples") {
            rec = {
                title: "Post-Acne Marks Routine",
                benefit: "The Skin Restore Patch fades dark marks left behind by pimples, working gently while you sleep.",
                products: [
                    {
                        name: "Step 1: Benzac Power Patch Skin Restore",
                        links: [
                            { name: "Amazon", url: "https://www.amazon.in/s?k=Benzac+Power+Patch+Skin+Restore" },
                            { name: "Zepto", url: "https://www.zeptonow.com/search?query=Benzac%20Power%20Patch%20Skin%20Restore" }
                        ]
                    },
                    {
                        name: "Step 2: Benzac AC 5% Gel Wash (AM)",
                        links: [
                            { name: "Amazon", url: "https://www.amazon.in/Benzac-Ac-5-Bottle-100ml/dp/B0CD1RSQLT" },
                            { name: "Blinkit", url: "https://blinkit.com/prn/benzac-ac-5-bottle-of-100-ml-gel-wash/prid/666922" }
                        ]
                    }
                ]
            };
        } else if (ans.skinType === "Dry") {
            rec = {
                title: "Gentle Acne Routine (Dry Skin)",
                benefit: "The gentler 2.5% formula treats acne without over-drying, ideal for skin that's already feeling tight.",
                products: [
                    {
                        name: "Step 1: Benzac AC 2.5% Gel (PM)",
                        links: [
                            { name: "Amazon", url: "https://www.amazon.in/BENZAC-AC-2-5-Tube-Gel/dp/B09V3SWKM5" },
                            { name: "Blinkit", url: "https://blinkit.com/prn/benzac-ac-2.5-tube-of-30gm-gel/prid/647788" }
                        ]
                    },
                    {
                        name: "Step 2: Benzac Power Patch (for active spots)",
                        links: [
                            { name: "Amazon", url: "https://www.amazon.in/Benzac-Fast-Acting-Ultra-Thin-Invisible-Dermatologist-Tested/dp/B0F23YL442" },
                            { name: "Zepto", url: "https://www.zepto.com/pn/benzac-power-fast-acting-pimple-patch/pvid/f828cef4-77f3-4fb6-ac82-1c751d459019" }
                        ]
                    }
                ]
            };
        } else {
            rec = {
                title: "Full Benzac AM/PM Routine",
                benefit: "A complete routine — cleanse, treat, and patch — gives your skin the best chance to clear up fast.",
                products: [
                    {
                        name: "Step 1: Benzac AC 5% Gel Wash (AM Cleanser)",
                        links: [
                            { name: "Amazon", url: "https://www.amazon.in/Benzac-Ac-5-Bottle-100ml/dp/B0CD1RSQLT" },
                            { name: "Blinkit", url: "https://blinkit.com/prn/benzac-ac-5-bottle-of-100-ml-gel-wash/prid/666922" }
                        ]
                    },
                    {
                        name: "Step 2: Benzac AC 5% Gel (PM Treatment)",
                        links: [
                            { name: "Amazon", url: "https://www.amazon.in/BENZAC-AC-5-Tube-Gel/dp/B09V3SXW86" },
                            { name: "Blinkit", url: "https://blinkit.com/prn/benzac-ac-5-gel/prid/646589" }
                        ]
                    },
                    {
                        name: "Step 3: Benzac Power Patch (overnight)",
                        links: [
                            { name: "Amazon", url: "https://www.amazon.in/Benzac-Fast-Acting-Ultra-Thin-Invisible-Dermatologist-Tested/dp/B0F23YL442" },
                            { name: "Zepto", url: "https://www.zepto.com/pn/benzac-power-fast-acting-pimple-patch/pvid/f828cef4-77f3-4fb6-ac82-1c751d459019" }
                        ]
                    }
                ]
            };
        }
        return rec;
    };

    const advanceBot = (stepIdx, customAnswers = answers) => {
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            if (stepIdx < QUESTIONS.length) {
                setMessages(prev => [...prev, { ...QUESTIONS[stepIdx], type: 'bot' }]);
            }
        }, 1000);
    };

    useEffect(() => {
        if (messages.length === 0) {
            setMessages([{ ...QUESTIONS[0], type: 'bot' }]);
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleOptionClick = (option, key) => {
        const lastMsg = messages[messages.length - 1];
        if (lastMsg.options && lastMsg.options.includes(option)) {
            // Remove options from UI
            setMessages(prev => {
                const newMsgs = [...prev];
                newMsgs[newMsgs.length - 1] = { ...newMsgs[newMsgs.length - 1], options: null };
                newMsgs.push({ id: Date.now(), type: 'user', text: option });
                return newMsgs;
            });
            
            const newAnswers = { ...answers };
            if (key) newAnswers[key] = option;
            setAnswers(newAnswers);
            
            // Advance to next question
            const currentStepIdx = QUESTIONS.findIndex(q => q.id === lastMsg.id);
            advanceBot(currentStepIdx + 1, newAnswers);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imgData = event.target.result;
                // Remove upload button from previous message
                setMessages(prev => {
                    const newMsgs = [...prev];
                    newMsgs[newMsgs.length - 1] = { ...newMsgs[newMsgs.length - 1], isUpload: false };
                    newMsgs.push({ id: Date.now(), type: 'user', isImage: true, image: imgData });
                    return newMsgs;
                });
                
                // Start AI analysis phase
                setIsTyping(true);
                setTimeout(() => {
                    setIsTyping(false);
                    
                    if (userData.history.length === 0) {
                        setMessages(prev => [...prev, { id: Date.now(), type: 'bot', text: "Analyzing your skin... This usually takes about 15 seconds." }]);
                        
                        setIsTyping(true);
                        setTimeout(() => {
                            setIsTyping(false);
                            const rec = getRecommendation(answers);
                            
                            setUserData(prev => ({
                                ...prev,
                                history: [{ week: 0, date: 'Day 1', score: 58, description: `Baseline: ${rec.title}`, change: 0, img: imgData }]
                            }));

                            const productString = rec.products.map(p => `🔹 **${p.name}**\n   🛒 [${p.links[0].name}](${p.links[0].url}) | [${p.links[1].name}](${p.links[1].url})`).join('\n\n');

                            setMessages(prev => [
                                ...prev, 
                                { id: Date.now(), type: 'bot', isCard: true, cardType: 'baseline', score: 58 },
                                { id: Date.now(), type: 'bot', text: `I know dealing with breakouts can be really frustrating, especially when they just won't budge. But hey — you took the first step, and that matters! 💕\n\nBased on everything you've shared, here's a personalised Benzac routine I'd recommend to help your skin heal:\n\n✨ **${rec.title}**\n\n${productString}\n\n**Why this works:** ${rec.benefit}\n\nStart with this routine and we'll check in every day. Small steps lead to big changes! 🌟`, options: ["Simulate Next Day"] }
                            ]);
                        }, 3000);
                    } else {
                        // Week 1 scan analysis
                        setMessages(prev => [...prev, { id: Date.now(), type: 'bot', text: "Comparing with your Day 1 photo..." }]);
                        
                        setIsTyping(true);
                        setTimeout(() => {
                            setIsTyping(false);
                            setUserData(prev => ({
                                ...prev,
                                history: [
                                    ...prev.history,
                                    { week: 1, date: 'Day 7', score: 71, description: 'Inflammation ↓, Redness ↓. Healing Progress +13', change: 13, img: imgData }
                                ]
                            }));

                            setMessages(prev => [
                                ...prev, 
                                { id: Date.now(), type: 'bot', isCard: true, cardType: 'week1' },
                                { id: Date.now(), type: 'bot', text: "Keep using your AM/PM routine. You're doing great!", options: ["View Full Dashboard"] }
                            ]);
                        }, 3000);
                    }
                }, 1000);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSpecialOption = (option) => {
        if (option === "Simulate Next Day") {
            setMessages(prev => {
                const newMsgs = [...prev];
                newMsgs[newMsgs.length - 1] = { ...newMsgs[newMsgs.length - 1], options: null };
                newMsgs.push({ id: Date.now(), type: 'user', text: option });
                return newMsgs;
            });
            setIsTyping(true);
            setTimeout(() => {
                setIsTyping(false);
                setMessages(prev => [...prev, { id: Date.now(), type: 'bot', text: "Good morning! ☀️ Did you complete your Benzac AM routine today?", options: ["✅ Completed", "Skip Today"] }]);
            }, 1000);
        } else if (option === "✅ Completed") {
            setMessages(prev => {
                const newMsgs = [...prev];
                newMsgs[newMsgs.length - 1] = { ...newMsgs[newMsgs.length - 1], options: null };
                newMsgs.push({ id: Date.now(), type: 'user', text: option });
                return newMsgs;
            });
            setUserData(prev => ({ ...prev, points: prev.points + 10 }));
            setIsTyping(true);
            setTimeout(() => {
                setIsTyping(false);
                setMessages(prev => [...prev, { id: Date.now(), type: 'bot', text: "Awesome! +10 Points to your Rewards Wallet.", options: ["Simulate Week 1 Scan"] }]);
            }, 1000);
        } else if (option === "Simulate Week 1 Scan") {
            setMessages(prev => {
                const newMsgs = [...prev];
                newMsgs[newMsgs.length - 1] = { ...newMsgs[newMsgs.length - 1], options: null };
                newMsgs.push({ id: Date.now(), type: 'user', text: option });
                return newMsgs;
            });
            setIsTyping(true);
            setTimeout(() => {
                setIsTyping(false);
                setMessages(prev => [
                    ...prev, 
                    { id: Date.now(), type: 'bot', text: "📸 Weekly Skin Check Time!\nUpload a fresh photo in natural lighting so I can measure your progress.", isUpload: true }
                ]);
            }, 1500);
        } else if (option === "View Full Dashboard") {
            setView('dashboard');
        }
    };

    return (
        <div className="phone-container flex flex-col h-full bg-[#efeae2]">
            {/* WhatsApp Header */}
            <div className="bg-[#075e54] text-white px-4 py-3 flex items-center gap-3 shadow-md z-10">
                <i className="fa-solid fa-arrow-left"></i>
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
                    <img src="buddy_dp.jpg" alt="Benzac Buddy" className="w-full h-full object-cover" />
                </div>
                <div>
                    <h1 className="font-semibold text-lg leading-tight">Benzac Buddy 🤖</h1>
                    <p className="text-xs text-green-100">Online</p>
                </div>
                <div className="flex-1"></div>
                <i className="fa-solid fa-video ml-3"></i>
                <i className="fa-solid fa-phone ml-4"></i>
                <i className="fa-solid fa-ellipsis-vertical ml-4"></i>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 chat-bg hide-scrollbar flex flex-col">
                <div className="text-center my-2">
                    <span className="bg-[#d9ede1] text-xs px-3 py-1 rounded-lg text-gray-600 shadow-sm">Today</span>
                </div>
                
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                        {msg.text && (
                            <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm shadow-sm relative ${msg.type === 'user' ? 'bg-[#dcf8c6] rounded-tr-none' : 'bg-white rounded-tl-none'}`}>
                                <div className="whitespace-pre-wrap text-gray-800" dangerouslySetInnerHTML={{__html: msg.text.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-blue-600 underline">$1</a>')}}></div>
                                <span className="text-[10px] text-gray-400 float-right ml-3 mt-2">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} {msg.type === 'user' && <i className="fa-solid fa-check-double text-blue-500 ml-1"></i>}</span>
                            </div>
                        )}
                        
                        {msg.isImage && (
                            <div className="max-w-[70%] bg-[#dcf8c6] rounded-lg p-1 shadow-sm rounded-tr-none mt-1">
                                <img src={msg.image} className="rounded w-full object-cover h-48" />
                                <span className="text-[10px] text-gray-400 float-right mt-1 mr-1">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} <i className="fa-solid fa-check-double text-blue-500 ml-1"></i></span>
                            </div>
                        )}

                        {msg.isUpload && (
                            <div className="mt-2 w-[80%] max-w-sm">
                                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full bg-benzac-purple text-white font-semibold py-3 px-4 rounded-xl text-sm shadow-sm hover:bg-benzac-dark transition flex items-center justify-center gap-2"
                                >
                                    <i className="fa-solid fa-camera"></i> Take or Upload Photo
                                </button>
                            </div>
                        )}

                        {msg.isCard && msg.cardType === 'baseline' && (
                            <div className="max-w-[85%] bg-white rounded-xl shadow-md overflow-hidden mt-1 border border-gray-100">
                                <div className="bg-benzac-dark text-white p-3 text-center">
                                    <h3 className="font-bold">Initial Skin Scan</h3>
                                </div>
                                <div className="p-4 space-y-3">
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <span className="text-sm text-gray-600">Acne Score</span>
                                        <span className="text-2xl font-bold text-benzac-purple">{msg.score}<span className="text-sm text-gray-400">/100</span></span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="bg-red-50 p-2 rounded text-red-700"><b>High</b><br/>Inflammation</div>
                                        <div className="bg-orange-50 p-2 rounded text-orange-700"><b>Active</b><br/>Breakouts</div>
                                    </div>
                                    <p className="text-xs text-gray-500 italic text-center mt-2">"We'll update this every week!"</p>
                                </div>
                            </div>
                        )}

                        {msg.isCard && msg.cardType === 'week1' && (
                            <div className="max-w-[85%] bg-white rounded-xl shadow-md overflow-hidden mt-1 border border-gray-100">
                                <div className="bg-benzac-purple text-white p-3 text-center">
                                    <h3 className="font-bold">Weekly Progress Scan</h3>
                                </div>
                                <div className="p-4 space-y-3">
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <div className="text-center">
                                            <div className="text-xs text-gray-400">Previous</div>
                                            <div className="text-lg font-bold text-gray-500 line-through">58</div>
                                        </div>
                                        <i className="fa-solid fa-arrow-right text-green-500 mx-2"></i>
                                        <div className="text-center">
                                            <div className="text-xs text-benzac-purple font-bold">New Score</div>
                                            <div className="text-2xl font-bold text-benzac-purple">71</div>
                                        </div>
                                    </div>
                                    <div className="text-center text-sm font-bold text-green-600 py-1 bg-green-50 rounded">
                                        +13 Points Improvement! 🎉
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Options */}
                        {msg.options && (
                            <div className="flex flex-col gap-2 mt-2 w-[85%] max-w-sm">
                                {msg.options.map((opt, i) => (
                                    <button 
                                        key={i} 
                                        onClick={() => msg.key ? handleOptionClick(opt, msg.key) : handleSpecialOption(opt)}
                                        className="bg-white border-2 border-benzac-purple text-benzac-purple font-semibold py-2 px-4 rounded-xl text-sm shadow-sm hover:bg-benzac-light transition text-left"
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                {isTyping && (
                    <div className="bg-white rounded-lg rounded-tl-none px-4 py-2 w-16 shadow-sm">
                        <div className="flex space-x-1 items-center h-4">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-[#f0f0f0] p-2 flex items-center gap-2">
                <i className="fa-regular fa-face-smile text-gray-500 text-xl ml-2"></i>
                <div className="bg-white flex-1 rounded-full py-2 px-4 text-sm text-gray-400 shadow-sm border border-gray-200">
                    Message
                </div>
                <div className="w-10 h-10 bg-[#00a884] rounded-full flex items-center justify-center text-white shadow-sm">
                    <i className="fa-solid fa-microphone"></i>
                </div>
            </div>
        </div>
    );
};

// MAIN APP COMPONENT
const App = () => {
    const [view, setView] = useState('whatsapp'); // 'whatsapp', 'dashboard'
    const [userData, setUserData] = useState({
        day: 1,
        acneScore: 0,
        history: [],
        routine: [],
        points: 0
    });

    return (
        <div className="w-full h-full max-w-md bg-black shadow-2xl relative overflow-hidden md:rounded-[2rem] md:h-[90vh]">
            {view === 'whatsapp' ? (
                <WhatsAppView setView={setView} userData={userData} setUserData={setUserData} />
            ) : (
                <DashboardView setView={setView} userData={userData} />
            )}
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
