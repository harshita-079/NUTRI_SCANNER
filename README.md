# 🥗 NutriScan

**AI-powered food label explainer** that uses OCR and Google Gemini to extract and analyze food-product information and generate structured, easy-to-understand insights.

## ✨ Features

* 📷 Upload food-product labels
* 🔍 OCR-based text extraction
* 🤖 AI-powered analysis using Google Gemini
* 🥗 Ingredient, additive & nutritional information
* 💾 MongoDB-based product storage
* ⚡ Reuse previously analyzed products to reduce unnecessary AI API calls

## 🛠️ Tech Stack

**Frontend:** React.js
**Backend:** Node.js, Express.js, REST APIs, Multer
**Database:** MongoDB
**AI:** Google Gemini API, OCR
**Tools:** Git, GitHub, Postman

## 🏗️ How It Works

```text
Food Label Image
       ↓
      OCR
       ↓
Text Extraction & Cleaning
       ↓
MongoDB Product Lookup
       ↓
Existing Result? ── Yes ──→ Reuse Result
       │
       No
       ↓
Google Gemini API
       ↓
Structured Product Insights
       ↓
     MongoDB
```

## 👩‍💻 My Contribution

This was a collaborative project. I contributed primarily to the **backend and AI pipeline**, including:

* Built the Multer + OCR workflow for food-label processing
* Integrated Google Gemini API for structured analysis
* Implemented database-first product lookup using MongoDB
* Stored and reused analyzed product results
* 

## ⚙️ Setup

```bash
git clone <YOUR_REPOSITORY_URL>
cd NutriScan
npm install
npm run dev
```

Create a `.env` file with the required environment variables:

```env
MONGODB_URI=your_mongodb_uri
GEMINI_API_KEY=your_gemini_api_key
```

> Never commit your `.env` file or API keys.

## 🔗 Links

**Live Demo:** <https://nutri-scanner-hyr8.vercel.app/>
