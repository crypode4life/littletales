import { useState, useRef } from "react";

const CATEGORIES = [
  { id: "animals", emoji: "🦁", label: "Animals", labelAr: "الحيوانات", color: "#FF9F43", bg: "#FFF5E6" },
  { id: "adventure", emoji: "🚀", label: "Adventure", labelAr: "المغامرة", color: "#54A0FF", bg: "#E8F4FF" },
  { id: "bedtime", emoji: "🌙", label: "Bedtime", labelAr: "وقت النوم", color: "#A29BFE", bg: "#F0EEFF" },
  { id: "educational", emoji: "🌟", label: "Learning", labelAr: "التعلم", color: "#00B894", bg: "#E6FFF8" },
];

const SAMPLE_STORIES = [
  {
    id: 1, category: "animals", emoji: "🦁",
    title: "Leo the Brave Lion", titleAr: "ليو الأسد الشجاع",
    text: "Once upon a time, in a great golden savanna, there lived a little lion named Leo. Leo was afraid of the dark. Every night when the sun went down, Leo would hide behind a big rock. One evening, a tiny firefly named Zara landed on Leo's nose. 'Why do you hide?' she asked. 'Because the dark is scary,' said Leo. Zara smiled and glowed brighter. 'Look around you!' In the darkness, Leo saw a thousand fireflies dancing like stars. 'The dark is not empty,' said Zara. 'It is full of light you never noticed.' From that night on, Leo slept under the stars — the bravest lion in the land.",
    words: ["lion", "brave", "firefly", "dark", "stars", "light"]
  },
  {
    id: 2, category: "adventure", emoji: "🚀",
    title: "Mia's Moon Mission", titleAr: "مهمة ميا إلى القمر",
    text: "Mia was seven years old and she had a big dream — she wanted to visit the moon. One night she built a rocket ship out of cardboard boxes and tin foil. She pressed the big red button. WHOOSH! Up she went through the clouds, past the stars, all the way to the moon! On the moon she met a small silver rabbit who collected moon rocks. 'Would you like one?' asked the rabbit. Mia put the moon rock in her pocket. When she woke up the next morning, there on her pillow was a small silver stone — glowing softly in the morning light.",
    words: ["rocket", "moon", "stars", "dream", "adventure", "flying"]
  },
  {
    id: 3, category: "bedtime", emoji: "🌙",
    title: "The Sleepy Cloud", titleAr: "السحابة النعسانة",
    text: "High above the world lived a little cloud named Nimbus. Every evening it was Nimbus's job to bring the soft rain that helped flowers sleep. But one night Nimbus was too tired to rain. The flowers waited and waited. A kind wind named Breezy came and whispered to Nimbus: 'You don't have to be big to be important.' Nimbus took a deep breath and let go of tiny drops of rain — pitter patter, pitter patter. The flowers smiled and slowly closed their petals. And Nimbus, having done something good, drifted off to sleep among the stars. Goodnight little cloud. Goodnight little flowers.",
    words: ["cloud", "rain", "flowers", "sleep", "wind", "night"]
  },
  {
    id: 4, category: "educational", emoji: "🌟",
    title: "The Number Garden", titleAr: "حديقة الأرقام",
    text: "In a magical garden, numbers grew like flowers. Number One stood tall and proud like a pencil. Number Two curved gently like a swan. Number Three had two soft bumps like a pair of hills. One day a girl named Layla walked into the garden. She picked the numbers and arranged them in patterns. One apple plus one apple equals two apples! Two butterflies plus three butterflies equals five butterflies! The garden sang with joy. 'Numbers are everywhere,' said the garden. 'In every flower, every cloud, every step you take.' Layla smiled and counted her steps all the way home.",
    words: ["numbers", "garden", "one", "two", "three", "learning"]
  },
];

const INTERACTIVE_ELEMENTS = {
  "🦁": ["roar", "paw", "tail", "mane"],
  "🚀": ["blast", "window", "fire", "star"],
  "🌙": ["glow", "shine", "float", "twinkle"],
  "🌟": ["sparkle", "grow", "bounce", "spin"],
};

export default function LittleTales() {
  const [screen, setScreen] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWord, setCurrentWord] = useState(-1);
  const [tapEffect, setTapEffect] = useState(null);
  const [lang, setLang] = useState("en");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiStory, setAiStory] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [emojiAnim, setEmojiAnim] = useState(false);
  const [particles, setParticles] = useState([]);
  const speechRef = useRef(null);
  const wordTimerRef = useRef(null);

  const filteredStories = selectedCategory
    ? SAMPLE_STORIES.filter(s => s.category === selectedCategory)
    : SAMPLE_STORIES;

  const stopSpeech = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (wordTimerRef.current) clearInterval(wordTimerRef.current);
    setIsPlaying(false);
    setCurrentWord(-1);
  };

  const readStory = (story) => {
    stopSpeech();
    if (!window.speechSynthesis) return;
    const text = story.text || story;
    const words = text.split(' ');
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.85;
    utter.pitch = 1.1;
    utter.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const nice = voices.find(v => v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Karen'));
    if (nice) utter.voice = nice;
    utter.onend = () => { setIsPlaying(false); setCurrentWord(-1); };
    setIsPlaying(true);
    window.speechSynthesis.speak(utter);
    let wi = 0;
    wordTimerRef.current = setInterval(() => {
      setCurrentWord(wi);
      wi++;
      if (wi >= words.length) clearInterval(wordTimerRef.current);
    }, 500);
  };

  const handleEmojiTap = () => {
    setEmojiAnim(true);
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 200 - 100,
      y: Math.random() * -200 - 50,
      emoji: ["⭐", "✨", "💫", "🌟", "💥"][Math.floor(Math.random() * 5)],
    }));
    setParticles(newParticles);
    setTimeout(() => { setEmojiAnim(false); setParticles([]); }, 1000);
    const word = selectedStory?.words?.[Math.floor(Math.random() * (selectedStory?.words?.length || 1))];
    if (word && window.speechSynthesis) {
      const u = new SpeechSynthesisUtterance(word);
      u.rate = 0.8; u.pitch = 1.3;
      window.speechSynthesis.speak(u);
    }
  };

  const generateAIStory = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiError("");
    setAiStory(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Create a short children's story (ages 4-10) based on this idea: "${aiPrompt}". 
            
            Return ONLY a JSON object with these fields (no markdown, no backticks):
            {
              "title": "Story title in English",
              "titleAr": "Story title in Arabic",
              "emoji": "One relevant emoji",
              "text": "The story text (150-200 words, simple language, magical and fun)",
              "words": ["5", "key", "words", "from", "story"]
            }`
          }]
        })
      });
      const data = await res.json();
      const raw = data.content[0].text.trim();
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setAiStory({ ...parsed, id: 99, category: "ai", isAI: true });
    } catch (e) {
      setAiError("Oops! Could not create story. Please try again! 🌟");
    }
    setAiLoading(false);
  };

  const storyWords = (selectedStory?.text || "").split(' ');

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #FFF9F0 0%, #F0F4FF 50%, #F5FFF0 100%)",
      fontFamily: "'Fredoka One', 'Comic Sans MS', cursive",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Floating background shapes */}
      {["🌸","⭐","🌈","☁️","🦋","🌺","✨","🍀"].map((e, i) => (
        <div key={i} style={{
          position: "fixed",
          fontSize: `${16 + (i * 4)}px`,
          opacity: 0.12,
          top: `${10 + (i * 11)}%`,
          left: i % 2 === 0 ? `${5 + i * 3}%` : "auto",
          right: i % 2 !== 0 ? `${5 + i * 3}%` : "auto",
          animation: `float${i % 3} ${4 + i}s ease-in-out infinite`,
          pointerEvents: "none",
          zIndex: 0,
        }}>{e}</div>
      ))}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap');
        @keyframes float0 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        @keyframes float1 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-15px) rotate(10deg)} }
        @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-25px)} }
        @keyframes bounce { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
        @keyframes wiggle { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-15deg)} 75%{transform:rotate(15deg)} }
        @keyframes sparkle { 0%{opacity:1;transform:translate(0,0) scale(1)} 100%{opacity:0;transform:translate(var(--tx),var(--ty)) scale(0)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(255,159,67,0.4)} 50%{box-shadow:0 0 0 12px rgba(255,159,67,0)} }
        .story-btn { transition: all 0.2s; cursor: pointer; border: none; }
        .story-btn:hover { transform: translateY(-3px) scale(1.02); }
        .story-btn:active { transform: scale(0.97); }
        .word-highlight { background: #FFE066; border-radius: 4px; padding: 0 3px; transition: all 0.3s; }
        .cat-card:hover { transform: translateY(-6px) scale(1.03); box-shadow: 0 12px 40px rgba(0,0,0,0.15) !important; }
      `}</style>

      {/* HEADER */}
      <div style={{
        background: "linear-gradient(135deg, #FF9F43, #FF6B6B)",
        padding: "16px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 4px 20px rgba(255,107,107,0.3)",
        position: "relative", zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {screen !== "home" && (
            <button onClick={() => { stopSpeech(); setScreen(screen === "read" ? "stories" : screen === "stories" ? "home" : "home"); setSelectedStory(null); setAiStory(null); }}
              style={{ background: "rgba(255,255,255,0.25)", border: "none", borderRadius: "50%", width: 36, height: 36, fontSize: 18, cursor: "pointer", color: "white" }}>
              ←
            </button>
          )}
          <div onClick={() => { stopSpeech(); setScreen("home"); setSelectedStory(null); setAiStory(null); }}
            style={{ cursor: "pointer" }}>
            <div style={{ fontSize: 28, fontFamily: "'Fredoka One'", color: "white", lineHeight: 1, textShadow: "2px 2px 0 rgba(0,0,0,0.15)" }}>
              📚 LittleTales
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", fontFamily: "Nunito", fontWeight: 600, letterSpacing: 1 }}>
              Stories that come alive ✨
            </div>
          </div>
        </div>
        <button onClick={() => setLang(l => l === "en" ? "ar" : "en")}
          style={{ background: "rgba(255,255,255,0.25)", border: "2px solid rgba(255,255,255,0.4)", borderRadius: 20, padding: "6px 16px", color: "white", cursor: "pointer", fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}>
          {lang === "en" ? "🌍 عربي" : "🌍 English"}
        </button>
      </div>

      <div style={{ position: "relative", zIndex: 1, padding: "0 0 40px" }}>

        {/* HOME SCREEN */}
        {screen === "home" && (
          <div style={{ animation: "slideUp 0.5s ease" }}>
            {/* Hero */}
            <div style={{ textAlign: "center", padding: "40px 24px 20px" }}>
              <div style={{ fontSize: 72, marginBottom: 8, filter: "drop-shadow(2px 4px 8px rgba(0,0,0,0.15))", animation: "float0 3s ease-in-out infinite" }}>
                📖
              </div>
              <h1 style={{ fontFamily: "'Fredoka One'", fontSize: "clamp(28px,6vw,48px)", color: "#2D3436", margin: "0 0 8px", lineHeight: 1.1 }}>
                {lang === "en" ? "Where Stories Come Alive!" : "حيث تحيا القصص!"}
              </h1>
              <p style={{ fontFamily: "Nunito", fontSize: 16, color: "#636E72", margin: "0 0 32px" }}>
                {lang === "en" ? "Listen 👂 • Read 📖 • Interact 🎮 • Create 🌟" : "استمع 👂 • اقرأ 📖 • تفاعل 🎮 • أنشئ 🌟"}
              </p>
            </div>

            {/* Main action buttons */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, padding: "0 20px 32px", maxWidth: 600, margin: "0 auto" }}>
              {[
                { icon: "🎧", label: lang === "en" ? "Listen & Read" : "استمع واقرأ", sub: lang === "en" ? "Stories read aloud" : "قصص مسموعة", color: "#FF9F43", action: () => setScreen("stories") },
                { icon: "🤖", label: lang === "en" ? "AI Story Maker" : "منشئ القصص", sub: lang === "en" ? "Create your own!" : "أنشئ قصتك!", color: "#A29BFE", action: () => setScreen("ai") },
                { icon: "🎮", label: lang === "en" ? "Tap & Play" : "اضغط والعب", sub: lang === "en" ? "Interactive fun" : "متعة تفاعلية", color: "#00B894", action: () => { setScreen("stories"); setSelectedCategory("animals"); }},
                { icon: "🌟", label: lang === "en" ? "Categories" : "الفئات", sub: lang === "en" ? "Browse by type" : "تصفح حسب النوع", color: "#54A0FF", action: () => setScreen("categories") },
              ].map((btn, i) => (
                <button key={i} onClick={btn.action} className="story-btn"
                  style={{ background: "white", borderRadius: 20, padding: "20px 16px", textAlign: "center", boxShadow: `0 8px 24px ${btn.color}30`, border: `3px solid ${btn.color}40` }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>{btn.icon}</div>
                  <div style={{ fontFamily: "'Fredoka One'", fontSize: 18, color: "#2D3436", marginBottom: 4 }}>{btn.label}</div>
                  <div style={{ fontFamily: "Nunito", fontSize: 12, color: "#B2BEC3" }}>{btn.sub}</div>
                </button>
              ))}
            </div>

            {/* Categories quick access */}
            <div style={{ padding: "0 20px", maxWidth: 600, margin: "0 auto" }}>
              <h2 style={{ fontFamily: "'Fredoka One'", fontSize: 22, color: "#2D3436", marginBottom: 16, textAlign: "center" }}>
                {lang === "en" ? "✨ Popular Stories" : "✨ القصص الشائعة"}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {SAMPLE_STORIES.slice(0, 3).map(story => (
                  <button key={story.id} onClick={() => { setSelectedStory(story); setScreen("read"); }} className="story-btn"
                    style={{ background: "white", borderRadius: 16, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 4px 16px rgba(0,0,0,0.08)", border: "2px solid #F0F0F0", textAlign: "left" }}>
                    <div style={{ fontSize: 44, flexShrink: 0 }}>{story.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Fredoka One'", fontSize: 18, color: "#2D3436" }}>{lang === "en" ? story.title : story.titleAr}</div>
                      <div style={{ fontFamily: "Nunito", fontSize: 12, color: "#B2BEC3", marginTop: 4 }}>
                        {CATEGORIES.find(c => c.id === story.category)?.[lang === "en" ? "label" : "labelAr"]} • {story.words.length} key words
                      </div>
                    </div>
                    <div style={{ fontSize: 24, color: "#DFE6E9" }}>▶</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CATEGORIES SCREEN */}
        {screen === "categories" && (
          <div style={{ padding: "32px 20px", maxWidth: 600, margin: "0 auto", animation: "slideUp 0.4s ease" }}>
            <h2 style={{ fontFamily: "'Fredoka One'", fontSize: 28, color: "#2D3436", textAlign: "center", marginBottom: 24 }}>
              {lang === "en" ? "Choose a World 🌍" : "اختر عالمك 🌍"}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => { setSelectedCategory(cat.id); setScreen("stories"); }} className="story-btn cat-card"
                  style={{ background: cat.bg, borderRadius: 24, padding: "28px 20px", textAlign: "center", border: `3px solid ${cat.color}40`, boxShadow: `0 8px 24px ${cat.color}25`, transition: "all 0.3s" }}>
                  <div style={{ fontSize: 52, marginBottom: 12 }}>{cat.emoji}</div>
                  <div style={{ fontFamily: "'Fredoka One'", fontSize: 20, color: cat.color }}>{lang === "en" ? cat.label : cat.labelAr}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STORIES LIST SCREEN */}
        {screen === "stories" && (
          <div style={{ padding: "24px 20px", maxWidth: 600, margin: "0 auto", animation: "slideUp 0.4s ease" }}>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 16, marginBottom: 20 }}>
              <button onClick={() => setSelectedCategory(null)} className="story-btn"
                style={{ background: !selectedCategory ? "#FF9F43" : "white", color: !selectedCategory ? "white" : "#636E72", borderRadius: 20, padding: "8px 18px", border: "2px solid #FF9F4340", fontFamily: "Nunito", fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0 }}>
                {lang === "en" ? "All ✨" : "الكل ✨"}
              </button>
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className="story-btn"
                  style={{ background: selectedCategory === cat.id ? cat.color : "white", color: selectedCategory === cat.id ? "white" : "#636E72", borderRadius: 20, padding: "8px 18px", border: `2px solid ${cat.color}40`, fontFamily: "Nunito", fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0 }}>
                  {cat.emoji} {lang === "en" ? cat.label : cat.labelAr}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {filteredStories.map(story => {
                const cat = CATEGORIES.find(c => c.id === story.category);
                return (
                  <button key={story.id} onClick={() => { setSelectedStory(story); setScreen("read"); }} className="story-btn"
                    style={{ background: "white", borderRadius: 20, padding: "20px", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 6px 20px rgba(0,0,0,0.08)", border: `2px solid ${cat?.color}30`, textAlign: "left" }}>
                    <div style={{ width: 70, height: 70, borderRadius: 16, background: cat?.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, flexShrink: 0 }}>{story.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Fredoka One'", fontSize: 19, color: "#2D3436", marginBottom: 4 }}>{lang === "en" ? story.title : story.titleAr}</div>
                      <div style={{ fontFamily: "Nunito", fontSize: 13, color: "#B2BEC3", marginBottom: 8 }}>{cat?.[lang === "en" ? "label" : "labelAr"]}</div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {story.words.slice(0, 3).map(w => (
                          <span key={w} style={{ background: cat?.bg, color: cat?.color, borderRadius: 10, padding: "2px 10px", fontSize: 11, fontFamily: "Nunito", fontWeight: 700 }}>{w}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ color: cat?.color, fontSize: 28 }}>▶</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* READ / LISTEN SCREEN */}
        {screen === "read" && selectedStory && (
          <div style={{ padding: "20px", maxWidth: 680, margin: "0 auto", animation: "slideUp 0.4s ease" }}>
            {/* Story header */}
            <div style={{ textAlign: "center", marginBottom: 24, position: "relative" }}>
              {/* Interactive emoji */}
              <div onClick={handleEmojiTap} style={{ fontSize: 90, cursor: "pointer", display: "inline-block", animation: emojiAnim ? "wiggle 0.4s ease" : "float0 3s ease-in-out infinite", userSelect: "none", filter: "drop-shadow(3px 6px 12px rgba(0,0,0,0.2))", position: "relative" }}>
                {selectedStory.emoji}
                {particles.map(p => (
                  <span key={p.id} style={{ position: "absolute", fontSize: 20, left: "50%", top: "50%", animation: "sparkle 0.8s ease-out forwards", "--tx": `${p.x}px`, "--ty": `${p.y}px`, pointerEvents: "none" }}>{p.emoji}</span>
                ))}
              </div>
              <div style={{ fontFamily: "Nunito", fontSize: 12, color: "#B2BEC3", marginTop: 4 }}>
                {lang === "en" ? "👆 Tap me!" : "👆 اضغط عليّ!"}
              </div>
              <h2 style={{ fontFamily: "'Fredoka One'", fontSize: "clamp(22px,5vw,34px)", color: "#2D3436", margin: "12px 0 0" }}>
                {lang === "en" ? selectedStory.title : selectedStory.titleAr}
              </h2>
            </div>

            {/* Play controls */}
            <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 24 }}>
              <button onClick={() => isPlaying ? stopSpeech() : readStory(selectedStory)} className="story-btn"
                style={{ background: isPlaying ? "#FF6B6B" : "#FF9F43", color: "white", borderRadius: 30, padding: "14px 32px", fontSize: 16, fontFamily: "'Fredoka One'", boxShadow: isPlaying ? "0 6px 20px rgba(255,107,107,0.4)" : "0 6px 20px rgba(255,159,67,0.4)", animation: isPlaying ? "pulse 1.5s infinite" : "none" }}>
                {isPlaying ? "⏹ Stop" : "▶ Read to Me!"}
              </button>
            </div>

            {/* Story text with word highlighting */}
            <div style={{ background: "white", borderRadius: 24, padding: "28px 24px", boxShadow: "0 8px 32px rgba(0,0,0,0.08)", marginBottom: 20, lineHeight: 2.2 }}>
              <p style={{ fontFamily: "Nunito", fontSize: "clamp(15px,3vw,18px)", color: "#2D3436", margin: 0 }}>
                {storyWords.map((word, i) => (
                  <span key={i} className={currentWord === i ? "word-highlight" : ""}>
                    {word}{" "}
                  </span>
                ))}
              </p>
            </div>

            {/* Key words */}
            <div style={{ background: "white", borderRadius: 20, padding: "20px 24px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Fredoka One'", fontSize: 18, color: "#2D3436", marginBottom: 14, marginTop: 0 }}>
                {lang === "en" ? "🔤 Key Words — Tap to Hear!" : "🔤 الكلمات الرئيسية — اضغط لتسمعها!"}
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {selectedStory.words.map(word => (
                  <button key={word} onClick={() => { if (window.speechSynthesis) { const u = new SpeechSynthesisUtterance(word); u.rate = 0.7; u.pitch = 1.3; window.speechSynthesis.speak(u); } setTapEffect(word); setTimeout(() => setTapEffect(null), 600); }} className="story-btn"
                    style={{ background: tapEffect === word ? "#FF9F43" : "#FFF5E6", color: tapEffect === word ? "white" : "#FF9F43", borderRadius: 20, padding: "10px 18px", fontFamily: "'Fredoka One'", fontSize: 16, border: "2px solid #FF9F4340", transform: tapEffect === word ? "scale(1.15)" : "scale(1)", transition: "all 0.2s" }}>
                    🔊 {word}
                  </button>
                ))}
              </div>
            </div>

            {/* More stories */}
            <button onClick={() => setScreen("stories")} className="story-btn"
              style={{ width: "100%", background: "linear-gradient(135deg, #A29BFE, #6C5CE7)", color: "white", borderRadius: 20, padding: "16px", fontFamily: "'Fredoka One'", fontSize: 18, boxShadow: "0 8px 24px rgba(108,92,231,0.3)" }}>
              {lang === "en" ? "📚 More Stories!" : "📚 المزيد من القصص!"}
            </button>
          </div>
        )}

        {/* AI STORY MAKER SCREEN */}
        {screen === "ai" && (
          <div style={{ padding: "24px 20px", maxWidth: 600, margin: "0 auto", animation: "slideUp 0.4s ease" }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ fontSize: 64, marginBottom: 8, animation: "float0 3s ease-in-out infinite" }}>🤖</div>
              <h2 style={{ fontFamily: "'Fredoka One'", fontSize: 28, color: "#2D3436", margin: "0 0 8px" }}>
                {lang === "en" ? "Create Your Story!" : "أنشئ قصتك!"}
              </h2>
              <p style={{ fontFamily: "Nunito", fontSize: 15, color: "#636E72", margin: 0 }}>
                {lang === "en" ? "Tell me what your story is about and I'll write it for you! ✨" : "أخبرني عن قصتك وسأكتبها لك! ✨"}
              </p>
            </div>

            {/* Prompt examples */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontFamily: "Nunito", fontWeight: 700, color: "#636E72", fontSize: 13, marginBottom: 10 }}>
                {lang === "en" ? "💡 Try these ideas:" : "💡 جرب هذه الأفكار:"}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["A brave little lion 🦁", "A princess who loves math 👑", "A robot who learns to feel 🤖", "A flying cat in space 🐱"].map(idea => (
                  <button key={idea} onClick={() => setAiPrompt(idea)} className="story-btn"
                    style={{ background: "#F0F4FF", color: "#6C5CE7", borderRadius: 16, padding: "8px 14px", fontFamily: "Nunito", fontWeight: 600, fontSize: 13, border: "2px solid #A29BFE40" }}>
                    {idea}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div style={{ background: "white", borderRadius: 20, padding: "20px", boxShadow: "0 6px 24px rgba(0,0,0,0.08)", marginBottom: 16 }}>
              <textarea value={aiPrompt} onChange={e => setAiPrompt(e.target.value)}
                placeholder={lang === "en" ? "Describe your story idea... e.g. 'A story about a brave lion who is afraid of the dark'" : "اكتب فكرة قصتك... مثل: قصة عن أسد شجاع يخاف من الظلام"}
                style={{ width: "100%", minHeight: 100, border: "2px solid #F0F0F0", borderRadius: 14, padding: "14px", fontFamily: "Nunito", fontSize: 15, resize: "none", outline: "none", color: "#2D3436", boxSizing: "border-box" }} />
              <button onClick={generateAIStory} disabled={aiLoading || !aiPrompt.trim()} className="story-btn"
                style={{ width: "100%", marginTop: 12, background: aiLoading ? "#DFE6E9" : "linear-gradient(135deg, #A29BFE, #6C5CE7)", color: "white", borderRadius: 16, padding: "16px", fontFamily: "'Fredoka One'", fontSize: 18, boxShadow: aiLoading ? "none" : "0 8px 24px rgba(108,92,231,0.35)", opacity: aiLoading || !aiPrompt.trim() ? 0.7 : 1 }}>
                {aiLoading ? "✨ Writing your story..." : lang === "en" ? "🌟 Create My Story!" : "🌟 أنشئ قصتي!"}
              </button>
            </div>

            {aiError && (
              <div style={{ background: "#FFE8E8", borderRadius: 16, padding: "16px", textAlign: "center", fontFamily: "Nunito", color: "#FF6B6B", marginBottom: 16 }}>
                {aiError}
              </div>
            )}

            {/* AI Generated Story */}
            {aiStory && (
              <div style={{ background: "white", borderRadius: 24, padding: "24px", boxShadow: "0 8px 32px rgba(108,92,231,0.15)", border: "3px solid #A29BFE40", animation: "slideUp 0.5s ease" }}>
                <div style={{ textAlign: "center", marginBottom: 16 }}>
                  <div style={{ fontSize: 56, marginBottom: 8 }}>{aiStory.emoji}</div>
                  <h3 style={{ fontFamily: "'Fredoka One'", fontSize: 24, color: "#2D3436", margin: "0 0 4px" }}>{aiStory.title}</h3>
                  {aiStory.titleAr && <div style={{ fontFamily: "Nunito", color: "#A29BFE", fontSize: 16 }}>{aiStory.titleAr}</div>}
                </div>
                <p style={{ fontFamily: "Nunito", fontSize: 16, color: "#2D3436", lineHeight: 2, marginBottom: 20 }}>{aiStory.text}</p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
                  {aiStory.words?.map(w => (
                    <button key={w} onClick={() => { if (window.speechSynthesis) { const u = new SpeechSynthesisUtterance(w); u.rate = 0.7; u.pitch = 1.3; window.speechSynthesis.speak(u); }}} className="story-btn"
                      style={{ background: "#F0EEFF", color: "#6C5CE7", borderRadius: 16, padding: "8px 16px", fontFamily: "'Fredoka One'", fontSize: 15, border: "2px solid #A29BFE40" }}>
                      🔊 {w}
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => readStory(aiStory)} className="story-btn"
                    style={{ flex: 1, background: "#FF9F43", color: "white", borderRadius: 16, padding: "14px", fontFamily: "'Fredoka One'", fontSize: 16, boxShadow: "0 6px 20px rgba(255,159,67,0.35)" }}>
                    ▶ {lang === "en" ? "Read to Me!" : "اقرأ لي!"}
                  </button>
                  <button onClick={() => { setSelectedStory(aiStory); setScreen("read"); }} className="story-btn"
                    style={{ flex: 1, background: "#A29BFE", color: "white", borderRadius: 16, padding: "14px", fontFamily: "'Fredoka One'", fontSize: 16, boxShadow: "0 6px 20px rgba(162,155,254,0.35)" }}>
                    📖 {lang === "en" ? "Full View" : "عرض كامل"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Bottom nav */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "white", padding: "10px 20px 16px", boxShadow: "0 -4px 20px rgba(0,0,0,0.08)", display: "flex", justifyContent: "space-around", zIndex: 100 }}>
        {[
          { icon: "🏠", label: lang === "en" ? "Home" : "الرئيسية", sc: "home" },
          { icon: "📚", label: lang === "en" ? "Stories" : "القصص", sc: "stories" },
          { icon: "🌍", label: lang === "en" ? "Explore" : "استكشف", sc: "categories" },
          { icon: "🤖", label: lang === "en" ? "Create" : "أنشئ", sc: "ai" },
        ].map(nav => (
          <button key={nav.sc} onClick={() => { stopSpeech(); setScreen(nav.sc); setSelectedStory(null); setAiStory(null); }}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, opacity: screen === nav.sc ? 1 : 0.45, transform: screen === nav.sc ? "scale(1.1)" : "scale(1)", transition: "all 0.2s" }}>
            <div style={{ fontSize: 24 }}>{nav.icon}</div>
            <div style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 11, color: screen === nav.sc ? "#FF9F43" : "#B2BEC3" }}>{nav.label}</div>
          </button>
        ))}
      </div>

      <div style={{ height: 80 }} />
    </div>
  );
}
