const BadWordsNext = require('bad-words-next')

// Load data for each language
const en = require('bad-words-next/data/en.json')
const es = require('bad-words-next/data/es.json')
const fr = require('bad-words-next/data/fr.json')
const de = require('bad-words-next/data/de.json')
const ru = require('bad-words-next/data/ru.json')
const rl = require('bad-words-next/data/ru_lat.json')
const ua = require('bad-words-next/data/ua.json')
const pl = require('bad-words-next/data/pl.json')
const ch = require('bad-words-next/data/ch.json')


// Create a BadWordsNext instance
const badwords = new BadWordsNext()
badwords.add(en)
badwords.add(es)
badwords.add(fr)
badwords.add(de)
badwords.add(ru)
badwords.add(rl)
badwords.add(ua)
badwords.add(pl)
badwords.add(ch)

export const profanity = async (text: string): Promise<{ cleanedText: string }> => {
    
    const cleanedText = badwords.clean(text);

    return cleanedText;
};