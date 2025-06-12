"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ai = void 0;
const genkit_1 = require("genkit");
const googleai_1 = require("@genkit-ai/googleai");
const fs = __importStar(require("fs"));
const _path = __importStar(require("path"));
// Function to get API key from local config
function getApiKeyFromLocalConfig() {
    // Resolve path relative to the 'dist' directory where this compiled file will run,
    // assuming config.local.json is intended to be in 'dist' as well for simplicity,
    // or adjust if it's meant to be in 'src' and copied to 'dist' during build.
    // For this setup, let's assume it's in the same directory as the running script (dist/genkit.js)
    // or one level up if it's in the project root of 'dist' (e.g., dist/config.local.json).
    // A more robust solution might involve finding project root or using process.cwd().
    // Let's try to resolve from project root where 'src' and 'dist' are, assuming it's in 'src'.
    // __dirname here will be <project_root>/ai-backend/dist
    const localConfigPath = _path.resolve(__dirname, '../src', 'config.local.json');
    if (fs.existsSync(localConfigPath)) {
        try {
            const configFile = fs.readFileSync(localConfigPath, 'utf-8');
            const config = JSON.parse(configFile);
            if (config && config.GOOGLE_API_KEY && typeof config.GOOGLE_API_KEY === 'string' && config.GOOGLE_API_KEY.trim() !== '') {
                console.warn("WARNING: Using API key from local config.local.json (expected in src/ directory). " +
                    "This is for local development convenience ONLY. Ensure this file is in your .gitignore.");
                return config.GOOGLE_API_KEY;
            }
            else {
                console.warn("WARNING: config.local.json found but GOOGLE_API_KEY is missing or empty.");
            }
        }
        catch (error) {
            console.error("Error reading or parsing config.local.json:", error);
        }
    }
    else {
        // This log might be too noisy if the file is intentionally not used.
        // console.log("No local API key config file (src/config.local.json) found. Relying on environment variables.");
    }
    return undefined;
}
const apiKeyFromLocalFile = getApiKeyFromLocalConfig();
// Initialize Google AI plugin based on whether a local key was found
const googleAiPlugin = apiKeyFromLocalFile
    ? (0, googleai_1.googleAI)({ apiKey: apiKeyFromLocalFile })
    : (0, googleai_1.googleAI)(); // Relies on GOOGLE_API_KEY or GEMINI_API_KEY env var if apiKeyFromLocalFile is undefined
exports.ai = (0, genkit_1.genkit)({
    plugins: [googleAiPlugin],
    model: 'googleai/gemini-2.0-flash', // Ensure this model is compatible with the key/API being used
});
