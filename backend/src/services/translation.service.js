import fs from 'fs';
import path from 'path';
import axios from 'axios';
import i18n from "i18next";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCALE_BASE_PATH = path.resolve(__dirname, '../../../frontend/src/assets/locales');
const GOOGLETRANSLATE_URL = 'https://translate.googleapis.com/translate_a/single';

class TranslationService {
    async translateText(text, sourceLang, targetLang) {
        try {
            const res = await axios.get(GOOGLETRANSLATE_URL, {
                params: {
                    client: 'gtx',
                    sl: sourceLang,
                    tl: targetLang,
                    dt: 't',
                    q: text,
                },
                timeout: 10000
            });

            const translated = res.data[0]?.map(item => item[0]).join('');
            return translated;
        } catch (err) {
            console.error(`❌ Google Translate API error:`, err.message);
            return text;
        }
    }

    loadLocaleFile(namespace, lang) {
        const filePath = path.join(LOCALE_BASE_PATH, lang, `${namespace}.json`);
        try {
            if (fs.existsSync(filePath)) {
                return JSON.parse(fs.readFileSync(filePath, 'utf8'));
            }
            return {};
        } catch (err) {
            console.error(`❌ Error loading file ${filePath}:`, err.message);
            return {};
        }
    }

    saveLocaleFile(namespace, lang, data) {
        const dir = path.join(LOCALE_BASE_PATH, lang);
        const filePath = path.join(dir, `${namespace}.json`);
        try {
            fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        } catch (err) {
            console.error(`❌ Error saving file ${filePath}:`, err.message);
        }
    }

    async addTranslation({ key, text, namespace = 'default' }) {
        const sourceLang = i18n.language || 'en';

        const fallbackLangs = i18n.options?.fallbackLng || ['vi', 'en'];
        const detectedLangs = Array.isArray(i18n.languages) ? i18n.languages : [];
        const allLangs = [...new Set([...detectedLangs, ...fallbackLangs])];
        const targetLangs = allLangs.filter(lang => lang !== sourceLang);

        const sourceData = this.loadLocaleFile(namespace, sourceLang);
        this.setNestedValue(sourceData, key, text);
        this.saveLocaleFile(namespace, sourceLang, sourceData);

        for (const lang of targetLangs) {
            const translated = await this.translateText(text, sourceLang, lang);
            const targetData = this.loadLocaleFile(namespace, lang);
            this.setNestedValue(targetData, key, translated);
            this.saveLocaleFile(namespace, lang, targetData);
        }
    }

    setNestedValue(obj, pathStr, value) {
        const keys = pathStr.split('.');
        let current = obj;
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (i === keys.length - 1) {
                current[key] = value;
            } else {
                current[key] = current[key] || {};
                current = current[key];
            }
        }
    }
}

export default new TranslationService();
