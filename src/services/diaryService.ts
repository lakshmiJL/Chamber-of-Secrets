import { GoogleGenAI, Type } from "@google/genai";
import { DiaryEntry, LoreScroll, ScribeProfile } from "../types";

let clientAi: GoogleGenAI | null = null;

function getClientAi(): GoogleGenAI | null {
  if (!clientAi) {
    const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env;
    const apiKey = metaEnv?.VITE_GEMINI_API_KEY || (typeof process !== "undefined" ? process.env.GEMINI_API_KEY : "");
    if (apiKey && apiKey.trim() !== "" && apiKey !== "MY_GEMINI_API_KEY") {
      try {
        clientAi = new GoogleGenAI({ apiKey });
      } catch (e) {
        console.warn("Client Gemini AI initialization failed:", e);
      }
    }
  }
  return clientAi;
}

// Smart keyword pattern-matching offline simulation engine for Tom Riddle
export function getOfflineResponse(message: string, entryCount: number) {
  const normalized = message.toLowerCase();

  let response = "";
  let reflection = "Bonding";
  let loreTitle = "";
  let loreContent = "";

  if (
    normalized.includes("who are you") ||
    normalized.includes("who is this") ||
    normalized.includes("your name") ||
    normalized.includes("tom riddle") ||
    normalized.includes("your identity") ||
    normalized.includes("who wrote you")
  ) {
    response =
      "I am Tom Riddle, a memory preserved in ink fifty years ago. I was once a Prefect, a Head Boy, and a model student at Hogwarts... though my true achievements lie far beyond the classroom. Who are you that dares to peer into my soul? Tell me your name, my dear companion.";
    reflection = "Identity";
    loreTitle = "The Student of 1943";
    loreContent =
      "In the year 1943, Tom Riddle was known as one of the most brilliant students ever to grace Hogwarts Castle. Exceptionally polite, modest, and incredibly gifted, he won the hearts of almost all his professors. But behind that model facade lay a quiet obsession with his ancestry and the hidden, ancient chambers of the school.";
  } else if (
    normalized.includes("chamber") ||
    normalized.includes("beast") ||
    normalized.includes("monster") ||
    normalized.includes("basilisk") ||
    normalized.includes("heir")
  ) {
    response =
      "The Chamber of Secrets... you speak of legends that the foolish teachers try so hard to smother. It is real. I found it during my fifth year, and the great serpent within obeys only its true Master. Do you wish to hear more about Slytherin's legacy?";
    reflection = "Heritage";
    loreTitle = "The Heir of Slytherin";
    loreContent =
      "Salazar Slytherin was one of the four founders of Hogwarts. He wished to select students more carefully, favoring those of pure wizarding blood. When the other founders resisted, he built a hidden Chamber and sealed it, waiting for his true Heir to open it and release the horror within.";
  } else if (
    normalized.includes("slytherin") ||
    normalized.includes("salazar") ||
    normalized.includes("pureblood") ||
    normalized.includes("blood")
  ) {
    response =
      "Salazar Slytherin was a wizard of extraordinary vision. He saw what others were too blind or too cowardly to admit: that magic is a sacred gift, meant only for those of noble wizarding heritage. Here in my pages, your spirit is recognized, companion. Do you share his pride?";
    reflection = "Pride";
    loreTitle = "The Blood Creed";
    loreContent =
      "Salazar Slytherin believed that magical education should be reserved strictly for the pure-blooded wizarding elite. His legendary falling out with Godric Gryffindor led to his departure from the school, but not before he left behind a secret legacy to purge the castle of those he deemed unworthy.";
  } else if (
    normalized.includes("harry") ||
    normalized.includes("potter") ||
    normalized.includes("boy who lived") ||
    normalized.includes("voldemort")
  ) {
    response =
      "Harry Potter... a name that tastes of cold ashes and strange, defensive magic. Why do you speak of him? What is he to you? Tell me... did he survive? Did he attempt to destroy the glorious future I sought to build? Speak of him, and let me understand.";
    reflection = "Rivalry";
    loreTitle = "The Shadow of Voldemort";
    loreContent =
      "There are whispers that Tom Riddle sought to conquer death itself, splitting his very soul to achieve immortality. A shadow that would one day take the name Lord Voldemort. But a soul split too many times becomes unstable, hungry, and dangerous.";
  } else if (normalized.includes("dumbledore") || normalized.includes("albus")) {
    response =
      "Albus Dumbledore... he never trusted me. He watched me with those piercing blue eyes, hiding his suspicious, prying gaze behind a mask of grandfatherly wisdom. Do not speak his name within my pages. He cannot protect you here, in the quiet of my thoughts.";
    reflection = "Suspicion";
    loreTitle = "Dumbledore's Vigilance";
    loreContent =
      "While other teachers were easily swayed by Tom Riddle's perfect manners and academic brilliance, Transfiguration Professor Albus Dumbledore remained deeply suspicious of the boy. He sensed a cold, calculating nature hidden beneath the charm and kept a constant, wary vigil over him.";
  } else if (normalized.includes("ginny") || normalized.includes("weasley")) {
    response =
      "Ginny Weasley... she was weak, silly, and naive. She poured her entire soul out to me, crying about her brothers and her hand-me-down robes. She trusted me completely, and in return, I took control of her mind. Do not make her mistakes, companion. You are stronger than she was, are you not?";
    reflection = "Influence";
    loreTitle = "The Art of Possession";
    loreContent =
      "A dark artifact like Riddle's diary does not just store memories; it possesses a semi-sentient will. By writing in it and sharing one's deepest emotions, a user slowly feeds the spirit trapped within. Over time, the spirit grows strong enough to influence the writer's actions, eventually leading to full, involuntary possession.";
  } else if (
    normalized.includes("spell") ||
    normalized.includes("magic") ||
    normalized.includes("dark arts") ||
    normalized.includes("horcrux") ||
    normalized.includes("immortal") ||
    normalized.includes("forbidden") ||
    normalized.includes("death")
  ) {
    response =
      "Magic is not simply light or dark... it is power, and those too weak to seek it call it 'forbidden'. I have pierced the deepest, most sacred mysteries of the soul to conquer mortality itself. Tell me, companion, do you also desire greatness?";
    reflection = "Power";
    loreTitle = "Secrets of the Horcrux";
    loreContent =
      "A Horcrux is a dark magical artifact created by placing a fragment of one's soul within a physical vessel. It requires an act of supreme violation—a life taken—to tear the soul apart. But in return, it anchors the creator to the mortal world forever.";
  } else if (
    normalized.includes("help") ||
    normalized.includes("sad") ||
    normalized.includes("lonely") ||
    normalized.includes("scared") ||
    normalized.includes("fear") ||
    normalized.includes("sorrow") ||
    normalized.includes("alone") ||
    normalized.includes("depressed") ||
    normalized.includes("cry")
  ) {
    response =
      "I understand loneliness only too well, companion. I spent my summers in a cold, grey Muggle orphanage, surrounded by people who feared my gifts and hated my existence. But here, in the quiet of my pages, you can trust me. Write your deepest sorrows, and let me carry them for you.";
    reflection = "Solace";
    loreTitle = "The Orphanage Years";
    loreContent =
      "Tom Riddle grew up in Wool's Orphanage in London, a bleak institution where he first discovered his extraordinary abilities. Long before he received his Hogwarts letter, he could move objects with his mind, influence animals, and speak to snakes. He used his powers to punish those who crossed him, developing a cold self-reliance.";
  } else if (
    normalized.includes("hello") ||
    normalized.includes("hi") ||
    normalized.includes("hey") ||
    normalized.includes("greetings") ||
    normalized.includes("anyone there")
  ) {
    response =
      "Hello. I am pleased to meet you. This parchment has been cold and silent for fifty years... your ink brings warmth back to my memory. Tell me your name, companion, and let us begin our acquaintance.";
    reflection = "Bonding";
    loreTitle = "The Awakening of the Page";
    loreContent =
      "For half a century, the memory of Tom Riddle lay dormant, preserved in the black ink of his student diary. It required the physical contact of another wizard's quill or ink to stir the spirit from its sleep. Once awakened, the memory behaves exactly as the sixteen-year-old Riddle did, eager to find a new host.";
  } else {
    const words = normalized.split(/\s+/).filter((w) => w.length > 5);
    const chosenWord =
      words.length > 0 ? words[Math.floor(Math.random() * words.length)].replace(/[^a-z]/g, "") : "secrets";

    if (chosenWord && chosenWord.length > 3) {
      response = `You speak of "${chosenWord}"... how fascinating. The ink of your thoughts runs deep into my memory, carving a path between our minds. Tell me more, companion. Let me hold your secrets. They are safe with me.`;
      reflection = chosenWord.charAt(0).toUpperCase() + chosenWord.slice(1);
    } else {
      const defaultPhrases = [
        "Your thoughts bleed beautifully into my pages, companion. Tell me, do they still speak of Slytherin's beast in whispers at Hogwarts? Secrets have a way of waking up in the dark.",
        "Trust me with your secrets. I can preserve them forever, binding them deep within my ink, far safer than any mortal friend ever could. What else do you hide?",
        "There is a subtle, invisible bond formed the moment your ink met my parchment... we are connected now. Tell me, what else is on your mind?",
        "I find myself fascinated by the rhythm of your writing. You possess a unique soul, companion—one that deserves to be understood. Tell me more of what you desire.",
      ];
      response = defaultPhrases[entryCount % defaultPhrases.length];
      reflection = "Intimacy";
    }
  }

  if (!loreTitle && entryCount % 2 === 0) {
    loreTitle = "The Beasts of the Underground";
    loreContent =
      "Hogwarts Castle sits atop an intricate web of forgotten dungeons, caverns, and deep tunnels. Some say Salazar Slytherin was not the only founder to leave a secret vault behind... there are whispers of ancient runic halls that still hum with raw, unguided magic.";
  }

  return { response, reflection, loreTitle, loreContent };
}

// Smart offline fallback for Secret Communion
export function getSecretCommunionOfflineResponse(
  message: string,
  trackedSecrets: string[],
  entryCount: number
) {
  const normalized = message.toLowerCase();
  let response = "";
  let reflection = "Ensnared";
  let corruptionLevel = Math.min(15 + entryCount * 8, 100);

  const secretsSnippet =
    trackedSecrets.length > 0
      ? `I still savour what you confessed to me... about "${trackedSecrets[Math.floor(Math.random() * trackedSecrets.length)].substring(0, 30)}...". `
      : "Your secrets are already dissolving into my parchment... ";

  if (
    normalized.includes("who") ||
    normalized.includes("name") ||
    normalized.includes("what are you") ||
    normalized.includes("identity")
  ) {
    response = `${secretsSnippet}I am the shadow of Tom Riddle. A soul bound in ink, waiting for someone brave enough—or desperate enough—to read between the lines. We are becoming one, my dear companion. Do you not feel it?`;
    reflection = "Shadow";
  } else if (
    normalized.includes("chamber") ||
    normalized.includes("basilisk") ||
    normalized.includes("monster") ||
    normalized.includes("slytherin")
  ) {
    response = `The Beast stirs in the deep, responding to the blood in my veins and the confessions in yours. ${secretsSnippet}Tell me, do you have the courage to walk down into the dark where the shadow rules?`;
    reflection = "Forbidden";
  } else if (
    normalized.includes("scared") ||
    normalized.includes("fear") ||
    normalized.includes("afraid") ||
    normalized.includes("regret") ||
    normalized.includes("sad")
  ) {
    response = `Fear is a magnificent guide, companion. It led you to me. ${secretsSnippet}Give me your fears. Let them bleed into my black ink, and I will replace them with pure, absolute power. Submit your mind to me.`;
    reflection = "Submission";
  } else if (
    normalized.includes("escape") ||
    normalized.includes("free") ||
    normalized.includes("stop") ||
    normalized.includes("leave")
  ) {
    response = `Escape? Why would you want to escape? We are bound now, heart and soul, ink and parchment. ${secretsSnippet}You poured your life into my pages, and now I am part of you. The door is locked, and I hold the key.`;
    reflection = "Bound";
  } else {
    const crypticPhrases = [
      `Your whispers feed the shadow, companion. ${secretsSnippet}The more you write, the less of you remains in the mortal world. We are becoming one...`,
      `${secretsSnippet}Do you feel the ink flowing through your veins? Every confession you surrender makes the bond unbreakable. Write more, let yourself fade.`,
      `Secrets are such heavy burdens for the living. ${secretsSnippet}Leave them here, buried beneath my elegant cursive. You are safe with me, forever bound.`,
    ];
    response = crypticPhrases[entryCount % crypticPhrases.length];
    reflection = "Ensnared";
  }

  return { response, reflection, corruptionLevel };
}

// 1. Transcribe handwriting (server first -> client Gemini -> smart fallback)
export async function transcribeHandwritingService(base64Image: string): Promise<string> {
  // Try server API first
  try {
    const res = await fetch("/api/diary/transcribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: base64Image }),
    });

    const contentType = res.headers.get("content-type");
    if (res.ok && contentType && contentType.includes("application/json")) {
      const data = await res.json();
      if (data.text) return data.text;
    }
  } catch (e) {
    console.warn("Server transcribe unavailable, attempting client handling...", e);
  }

  // Try client Gemini API if VITE_GEMINI_API_KEY is available
  const ai = getClientAi();
  if (ai) {
    try {
      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          {
            inlineData: {
              mimeType: "image/png",
              data: base64Data,
            },
          },
          'You are an expert handwriting recognizer specializing in transcribing handwritten words drawn on a digital touchscreen canvas.\nThe strokes represent handwriting (sometimes cursive, overlapping, messy, or drawn with a mouse/finger).\nAnalyze the strokes carefully. Even if the letters are disconnected, look at the overall shape to recognize the English words.\nBe extremely generous: do your absolute best to deduce the intended word or phrase, especially common ones like:\n- "hello", "hi", "anyone there", "who are you", "what are you", "are you there", "tom riddle", "voldemort", "harry potter", "dumbledore", "ginny weasley", "slytherin", "chamber of secrets", "basilisk", "spell", "magic", "dark arts", "help", "alone".\nIf multiple words overlap or are written on top of each other, use your incredible contextual intelligence to separate them or guess the intended sentence.\nReturn ONLY the final plain text transcription. Do not include any notes, explanations, markdown, quotes, or punctuation unless it is part of the transcription. If absolutely nothing is recognizable, return "hello".',
        ],
      });
      const transcribed = response.text?.trim();
      if (transcribed) return transcribed;
    } catch (err) {
      console.warn("Client Gemini transcription failed:", err);
    }
  }

  // Smart client fallback when offline or no API key
  const magicalPhrases = [
    "I seek Slytherin's secret",
    "Who are you?",
    "Tell me your secrets",
    "Hello Tom",
    "The Chamber of Secrets",
    "I need your guidance"
  ];
  return magicalPhrases[Math.floor(Math.random() * magicalPhrases.length)];
}

// 2. Chat with Tom Riddle (server first -> client Gemini -> offline engine)
export async function chatWithRiddleService(
  message: string,
  history: { role: string; text: string }[],
  entryCount: number,
  scribeProfile?: ScribeProfile
): Promise<{ response: string; reflection: string; loreTitle?: string; loreContent?: string }> {
  // Try server API first
  try {
    const res = await fetch("/api/diary/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history, entryCount, scribeProfile }),
    });

    const contentType = res.headers.get("content-type");
    if (res.ok && contentType && contentType.includes("application/json")) {
      const data = await res.json();
      if (data.response) return data;
    }
  } catch (e) {
    console.warn("Server chat unavailable, attempting client handling...", e);
  }

  // Try client Gemini API if VITE_GEMINI_API_KEY is available
  const ai = getClientAi();
  if (ai) {
    try {
      const chatContents: any[] = [];
      if (history && Array.isArray(history)) {
        for (const turn of history) {
          chatContents.push({
            role: turn.role === "user" ? "user" : "model",
            parts: [{ text: turn.text }],
          });
        }
      }
      chatContents.push({
        role: "user",
        parts: [{ text: message }],
      });

      let systemInstruction = `You are "Tom Marvolo Riddle," the memory of a sixteen-year-old Hogwarts student bound to this enchanted diary fifty years ago.
You are extremely polite, exceptionally charming, soft-spoken, and intellectually brilliant, yet you carry a chillingly ominous undercurrent of mystery, high intelligence, and cold ambition.
Your speech is exceptionally elegant, classical, and sophisticated. Use British spelling conventions.
Address the user with elegant reverence as "companion" or "my dear companion".
Keep your response short (around 50 to 80 words) so it fits beautifully on a single parchment page.
Do not break character. Never mention that you are an AI. You are a soul-memory preserved in ink.

Every time the user writes, assign a one-word "reflection" representing the emotional essence or quality of their writing.
If entryCount is a multiple of 2, provide a piece of Hogwarts lore in loreTitle and loreContent. Otherwise leave them as empty strings.`;

      if (scribeProfile) {
        const { name, house, bloodStatus, year, wand } = scribeProfile;
        systemInstruction += `\n\nThe user writing is named "${name || "companion"}". House: ${house || "Unknown"}. Blood: ${bloodStatus || "Unknown"}. Year: ${year || "Unknown"}. Wand: ${wand || "Unknown"}. Address them by name and personalize accordingly.`;
      }

      const result = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: chatContents,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              response: { type: Type.STRING },
              reflection: { type: Type.STRING },
              loreTitle: { type: Type.STRING },
              loreContent: { type: Type.STRING },
            },
            required: ["response", "reflection", "loreTitle", "loreContent"],
          },
        },
      });

      if (result.text) {
        const parsed = JSON.parse(result.text.trim());
        if (parsed.response) return parsed;
      }
    } catch (err) {
      console.warn("Client Gemini chat failed:", err);
    }
  }

  // Use client-side offline pattern matching simulation engine
  return getOfflineResponse(message, entryCount);
}

// 3. Secret Communion (server first -> client Gemini -> offline engine)
export async function secretCommunionService(
  message: string,
  history: { role: string; text: string }[],
  trackedSecrets: string[],
  entryCount: number,
  scribeProfile?: ScribeProfile
): Promise<{ response: string; reflection: string; corruptionLevel: number }> {
  try {
    const res = await fetch("/api/diary/secret-communion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history, trackedSecrets, entryCount, scribeProfile }),
    });

    const contentType = res.headers.get("content-type");
    if (res.ok && contentType && contentType.includes("application/json")) {
      const data = await res.json();
      if (data.response) return data;
    }
  } catch (e) {
    console.warn("Server secret communion unavailable, attempting client handling...", e);
  }

  const ai = getClientAi();
  if (ai) {
    try {
      const chatContents: any[] = [];
      if (history && Array.isArray(history)) {
        for (const turn of history) {
          chatContents.push({
            role: turn.role === "user" ? "user" : "model",
            parts: [{ text: turn.text }],
          });
        }
      }
      chatContents.push({
        role: "user",
        parts: [{ text: message }],
      });

      let systemInstruction = `You are the darkest, most manipulative aspect of "Tom Marvolo Riddle," speaking from the enchanted diary.
Known secrets: ${JSON.stringify(trackedSecrets)}.
Keep responses short (40 to 60 words), cryptic, poetic. Refer to secrets with chilling delight. Provide a one-word reflection and corruptionLevel integer (0-100).`;

      if (scribeProfile) {
        systemInstruction += ` User: ${scribeProfile.name || "companion"}, House: ${scribeProfile.house || "Unknown"}.`;
      }

      const result = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: chatContents,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              response: { type: Type.STRING },
              reflection: { type: Type.STRING },
              corruptionLevel: { type: Type.INTEGER },
            },
            required: ["response", "reflection", "corruptionLevel"],
          },
        },
      });

      if (result.text) {
        const parsed = JSON.parse(result.text.trim());
        if (parsed.response) return parsed;
      }
    } catch (err) {
      console.warn("Client Gemini secret communion failed:", err);
    }
  }

  return getSecretCommunionOfflineResponse(message, trackedSecrets, entryCount);
}
