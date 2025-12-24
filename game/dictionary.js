class EnglishGermanDictionary {
    constructor() {

        // ---------------------------------------------------------
        // 🔹 1. Englische Wörterliste (NUR English Words)
        // ---------------------------------------------------------
        this.words = [ //liste 1 
            "apple", "animal", "answer", "air", "age", "area", "arm", "ask",
            "always", "anything",
            "baby", "bag", "ball", "bank", "bath", "beach", "bear", "beautiful",
            "because", "bed", "beer", "before", "begin", "behind", "big", "bird",
            "birthday", "black", "blood", "blue", "book", "boot", "bread",
            "break", "brother",
            "cake", "car", "cat", "chair", "cheese", "child", "city", "clean",
            "close", "cloud", "coffee", "cold", "color", "country", "cup",
            "day", "dad", "dance", "dark", "daughter", "dead", "dear", "deep",
            "desk", "dinner", "dog", "door", "dream", "drink", "drive",
            "ear", "earth", "easy", "eat", "egg", "energy", "evening", "eye",
            "everything",
            "face", "family", "far", "farm", "fast", "father", "feet", "fight",
            "fire", "fish", "floor", "flower", "food", "foot", "friend",
            "garden", "girl", "glass", "go", "good", "green", "ground", "group",
            "hair", "hand", "hang", "happy", "hat", "head", "health", "heart",
            "heat", "heavy", "hello", "here", "high", "home", "horse", "house",
            "ice", "idea", "ill", "important", "inside", "island",
            "job", "juice", "jump",
            "key", "kill", "king", "kitchen", "kiss", "know",
            "lake", "land", "language", "large", "laugh", "learn", "left",
            "leg", "life", "light", "like", "lion", "little", "long", "love",
            "machine", "make", "man", "many", "milk", "minute", "money",
            "month", "morning", "mother", "mountain",
            "name", "nation", "near", "neck", "night", "noise", "north",
            "ocean", "off", "office", "oil", "old", "open", "orange", "order",
            "page", "paper", "parent", "park", "party", "pen", "people",
            "phone", "picture", "place", "plant", "play", "pocket", "police",
            "potato", "problem",
            "queen", "question",
            "rain", "restaurant", "red", "right", "river", "road", "room", "run",
            "salt", "sand", "school", "sea", "season", "see", "shirt",
            "shoe", "shop", "short", "sleep", "slow", "small", "smile", "snow",
            "son", "sound", "soup", "sport", "spring", "star", "stone",
            "street", "strong", "summer", "sun", "sweet",
            "table", "teacher", "tea", "team", "ten", "test", "thing",
            "thought", "time", "tired", "tomorrow", "town", "tree", "train",
            "travel",
            "under", "uncle", "up", "use",
            "village", "voice",
            "walk", "warm", "water", "way", "week", "welcome", "white",
            "window", "wind", "winter", "woman", "word", "work", "world",
            "write",
            "year", "yellow", "young",
            "zoo"
        ];

        // ---------------------------------------------------------
        // 🔹 2. Englische Wörter → Deutsche Übersetzungen
        // ---------------------------------------------------------
        this.translations = {
            "apple": "Apfel", "animal": "Tier", "answer": "Antwort", "air": "Luft",
            "age": "Alter", "area": "Bereich", "arm": "Arm", "ask": "fragen",
            "always": "immer", "anything": "etwas",

            "baby": "Baby", "bag": "Tasche", "ball": "Ball", "bank": "Bank",
            "bath": "Bad", "beach": "Strand", "bear": "Bär", "beautiful": "schön",
            "because": "weil", "bed": "Bett", "beer": "Bier", "before": "vorher",
            "begin": "beginnen", "behind": "hinter", "big": "groß", "bird": "Vogel",
            "birthday": "Geburtstag", "black": "schwarz", "blood": "Blut",
            "blue": "blau", "book": "Buch", "boot": "Stiefel", "bread": "Brot",
            "break": "Pause", "brother": "Bruder",

            "cake": "Kuchen", "car": "Auto", "cat": "Katze", "chair": "Stuhl",
            "cheese": "Käse", "child": "Kind", "city": "Stadt", "clean": "sauber",
            "close": "schließen", "cloud": "Wolke", "coffee": "Kaffee",
            "cold": "kalt", "color": "Farbe", "country": "Land", "cup": "Tasse",

            "day": "Tag", "dad": "Papa", "dance": "tanzen", "dark": "dunkel",
            "daughter": "Tochter", "dead": "tot", "dear": "lieb", "deep": "tief",
            "desk": "Schreibtisch", "dinner": "Abendessen", "dog": "Hund",
            "door": "Tür", "dream": "Traum", "drink": "Getränk", "drive": "fahren",

            "ear": "Ohr", "earth": "Erde", "easy": "einfach", "eat": "essen",
            "egg": "Ei", "energy": "Energie", "evening": "Abend",
            "eye": "Auge", "everything": "alles",

            "face": "Gesicht", "family": "Familie", "far": "weit", "farm": "Bauernhof",
            "fast": "schnell", "father": "Vater", "feet": "Füße", "fight": "kämpfen",
            "fire": "Feuer", "fish": "Fisch", "floor": "Boden", "flower": "Blume",
            "food": "Essen", "foot": "Fuß", "friend": "Freund",

            "garden": "Garten", "girl": "Mädchen", "glass": "Glas", "go": "gehen",
            "good": "gut", "green": "grün", "ground": "Boden", "group": "Gruppe",

            "hair": "Haare", "hand": "Hand", "hang": "hängen", "happy": "glücklich",
            "hat": "Hut", "head": "Kopf", "health": "Gesundheit", "heart": "Herz",
            "heat": "Hitze", "heavy": "schwer", "hello": "hallo", "here": "hier",
            "high": "hoch", "home": "Zuhause", "horse": "Pferd", "house": "Haus",

            "ice": "Eis", "idea": "Idee", "ill": "krank", "important": "wichtig",
            "inside": "drinnen", "island": "Insel",

            "job": "Job", "juice": "Saft", "jump": "springen",

            "key": "Schlüssel", "kill": "töten", "king": "König", "kitchen": "Küche",
            "kiss": "Kuss", "know": "wissen",

            "lake": "See", "land": "Land", "language": "Sprache",
            "large": "groß", "laugh": "lachen", "learn": "lernen",
            "left": "links", "leg": "Bein", "life": "Leben", "light": "Licht",
            "like": "mögen", "lion": "Löwe", "little": "klein", "long": "lang",
            "love": "Liebe",

            "machine": "Maschine", "make": "machen", "man": "Mann", "many": "viele",
            "milk": "Milch", "minute": "Minute", "money": "Geld",
            "month": "Monat", "morning": "Morgen", "mother": "Mutter",
            "mountain": "Berg",

            "name": "Name", "nation": "Nation", "near": "nah", "neck": "Nacken",
            "night": "Nacht", "noise": "Lärm", "north": "Norden",

            "ocean": "Ozean", "off": "aus", "office": "Büro", "oil": "Öl",
            "old": "alt", "open": "öffnen", "orange": "Orange", "order": "bestellen",

            "page": "Seite", "paper": "Papier", "parent": "Eltern", "park": "Park",
            "party": "Party", "pen": "Stift", "people": "Menschen", "phone": "Telefon",
            "picture": "Bild", "place": "Ort", "plant": "Pflanze", "play": "spielen",
            "pocket": "Tasche", "police": "Polizei", "potato": "Kartoffel",
            "problem": "Problem",

            "queen": "Königin", "question": "Frage",

            "rain": "Regen", "restaurant": "Restaurant", "red": "rot",
            "right": "rechts", "river": "Fluss", "road": "Straße",
            "room": "Zimmer", "run": "rennen",

            "salt": "Salz", "sand": "Sand", "school": "Schule", "sea": "Meer",
            "season": "Jahreszeit", "see": "sehen", "shirt": "Hemd",
            "shoe": "Schuh", "shop": "Laden", "short": "kurz", "sleep": "schlafen",
            "slow": "langsam", "small": "klein", "smile": "Lächeln", "snow": "Schnee",
            "son": "Sohn", "sound": "Geräusch", "soup": "Suppe", "sport": "Sport",
            "spring": "Frühling", "star": "Stern", "stone": "Stein", "street": "Straße",
            "strong": "stark", "summer": "Sommer", "sun": "Sonne", "sweet": "süß",

            "table": "Tisch", "teacher": "Lehrer", "tea": "Tee", "team": "Team",
            "ten": "zehn", "test": "Test", "thing": "Ding", "thought": "Gedanke",
            "time": "Zeit", "tired": "müde", "tomorrow": "morgen", "town": "Stadt",
            "tree": "Baum", "train": "Zug", "travel": "reisen",

            "under": "unter", "uncle": "Onkel", "up": "oben", "use": "benutzen",

            "village": "Dorf", "voice": "Stimme",

            "walk": "gehen", "warm": "warm", "water": "Wasser", "way": "Weg",
            "week": "Woche", "welcome": "willkommen", "white": "weiß",
            "window": "Fenster", "wind": "Wind", "winter": "Winter",
            "woman": "Frau", "word": "Wort", "work": "Arbeit", "world": "Welt",
            "write": "schreiben",

            "year": "Jahr", "yellow": "gelb", "young": "jung",

            "zoo": "Zoo"
        };
    }

    translate(englishWord) {
        return this.translations[englishWord.toLowerCase()] ?? null;
    }

    setWords(newWordList) {
        this.words = newWordList;
    }
}

module.exports = EnglishGermanDictionary;
