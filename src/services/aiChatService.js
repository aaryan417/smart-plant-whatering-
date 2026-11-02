// src/services/aiChatService.js
/**
 * Farmer AI Assistant Service
 * 
 * Provides a clean API interface for AI chat.
 * In production, this can connect to a secure backend endpoint (e.g., via VITE_AI_BACKEND_URL).
 * Currently operates in a clearly-labelled DEMO MODE using real-time farm context from
 * the dashboard (crop, soil, moisture, weather, recommendation).
 */

export const IS_DEMO_MODE = true;

/**
 * Common agronomic disclaimer for chemical/fertilizer/disease questions.
 */
export const SAFETY_DISCLAIMER = {
  en: "⚠️ Agronomic Safety Notice: This is an advisory simulation. Always consult your local Krishi Vigyan Kendra (KVK) or district agricultural extension officer before applying synthetic fertilizers, herbicides, or chemical pesticides. Dosages must strictly follow soil health card recommendations.",
  hi: "⚠️ कृषि सुरक्षा चेतावनी: यह एक सलाहकार सिमुलेशन है। रासायनिक कीटनाशक, खरपतवारनाशक या उर्वरक का छिड़काव करने से पहले अपने नजदीकी कृषि विज्ञान केंद्र (KVK) या कृषि विशेषज्ञ से सलाह अवश्य लें। दवा की मात्रा मृदा स्वास्थ्य कार्ड (Soil Health Card) के आधार पर ही तय करें।",
};

/**
 * Suggested prompt questions for quick-chips in English and Hindi.
 */
export const SUGGESTED_PROMPTS = [
  {
    id: 'when_water',
    textEn: 'When should I water my crop?',
    textHi: 'मुझे अपनी फसल को पानी कब देना चाहिए?',
  },
  {
    id: 'yellow_leaves',
    textEn: 'Why are my plant leaves turning yellow?',
    textHi: 'पौधों की पत्तियां पीली क्यों पड़ रही हैं?',
  },
  {
    id: 'soil_suitability',
    textEn: 'Which crop is suitable for my soil?',
    textHi: 'मेरी मिट्टी के लिए कौन सी फसल उपयुक्त है?',
  },
  {
    id: 'water_saving',
    textEn: 'How can I save irrigation water?',
    textHi: 'मैं सिंचाई का पानी कैसे बचा सकता हूँ?',
  },
  {
    id: 'heavy_rain',
    textEn: 'What should I do during heavy rainfall?',
    textHi: 'भारी बारिश के दौरान मुझे क्या करना चाहिए?',
  },
];

/**
 * Generate contextual agricultural response using live farm telemetry.
 */
export async function sendFarmerMessage({
  message,
  context,
  lang = 'en',
}) {
  // Simulate natural typing delay (400 - 800ms)
  await new Promise((resolve) => setTimeout(resolve, 600));

  const lowerMsg = (message || '').toLowerCase();
  const isHindi = lang === 'hi';

  const {
    cropNameEn = 'Wheat',
    cropNameHi = 'गेहूं',
    soilNameEn = 'Black Soil',
    soilNameHi = 'काली मिट्टी',
    soilMoisture = 45,
    upcomingRainProb = 0,
    upcomingRainAmount = 0,
    recommendationDecision = 'MONITOR',
    nextIrrigationDateStr = '',
    irrigationMethodEn = 'Flood',
    irrigationMethodHi = 'पारंपरिक बहाव',
    growthStageEn = 'Vegetative',
    growthStageHi = 'वानस्पतिक',
  } = context || {};

  // 1. Topic: When should I water my crop? / पानी कब दें
  if (
    lowerMsg.includes('when') ||
    lowerMsg.includes('water') ||
    lowerMsg.includes('irrigation') ||
    lowerMsg.includes('पानी') ||
    lowerMsg.includes('सिंचाई') ||
    lowerMsg.includes('कब दें')
  ) {
    if (isHindi) {
      return {
        reply: `किसान भाई, आपके खेत के लाइव आंकड़ों के आधार पर सलाह:\n\n• **फसल:** ${cropNameHi} (${growthStageHi} अवस्था)\n• **मिट्टी:** ${soilNameHi}\n• **मिट्टी की नमी:** ${soilMoisture}%\n• **मौसम:** अगले 24 घंटे में ${upcomingRainProb}% बारिश की संभावना (${upcomingRainAmount} मिमी)\n\n**वर्तमान सिंचाई निर्णय:** **${recommendationDecision}**।\n\n${
          soilMoisture < 30
            ? 'मिट्टी में नमी 30% से कम (सूखी) है। यदि जल्द बारिश का अनुमान नहीं है, तो तुरंत सिंचाई करें।'
            : soilMoisture >= 60
            ? 'मिट्टी में पर्याप्त नमी (>=60%) बनी हुई है। अभी सिंचाई टालें ताकि जड़ों में जलभराव न हो।'
            : `नमी संतुलित स्तर पर है। अगली संभावित सिंचाई ${nextIrrigationDateStr || 'कुछ दिनों में'} के आसपास निर्धारित है।`
        }\n\nमौसम और मिट्टी की स्थिति पर नज़र बनाए रखें।`,
        disclaimer: null,
      };
    } else {
      return {
        reply: `Farmer friend, here is personalized guidance based on your live field data:\n\n• **Crop:** ${cropNameEn} (${growthStageEn} stage)\n• **Soil:** ${soilNameEn}\n• **Current Soil Moisture:** ${soilMoisture}%\n• **Weather Forecast:** ${upcomingRainProb}% rain chance (${upcomingRainAmount} mm)\n\n**Current Recommendation:** **${recommendationDecision}**.\n\n${
          soilMoisture < 30
            ? 'Soil moisture is critically low (<30%). Immediate watering is advised unless significant rainfall arrives soon.'
            : soilMoisture >= 60
            ? 'Soil moisture is high (≥60%). Skip irrigation now to prevent waterlogging and root rot.'
            : `Soil moisture is in the optimal range. The next expected irrigation cycle is scheduled around ${nextIrrigationDateStr || 'in a few days'}.`
        }\n\nContinue monitoring live moisture readings.`,
        disclaimer: null,
      };
    }
  }

  // 2. Topic: Yellow Leaves / पत्तियां पीली पड़ना
  if (
    lowerMsg.includes('yellow') ||
    lowerMsg.includes('leaves') ||
    lowerMsg.includes('leaf') ||
    lowerMsg.includes('पीली') ||
    lowerMsg.includes('पत्ता') ||
    lowerMsg.includes('पत्तियां')
  ) {
    if (isHindi) {
      return {
        reply: `फसल की पत्तियां पीली पड़ने के प्रमुख वैज्ञानिक कारण:\n\n1. **जलभराव (Over-watering):** आपकी मिट्टी की वर्तमान नमी ${soilMoisture}% है। यदि नमी 60% से अधिक रहे तो जड़ों को ऑक्सीजन नहीं मिलती और निचली पत्तियां पीली हो जाती हैं।\n2. **नमी की कमी (Under-watering):** यदि नमी 30% से कम हो जाए तो पौधे सूखने लगते हैं।\n3. **नाइट्रोजन की कमी:** निचली पुरानी पत्तियां सिरे से पीली होने लगती हैं।\n4. **सूक्ष्म पोषक तत्वों (जिंक/आयरन) की कमी:** नई ऊपरी पत्तियों की शिराएं पीली पड़ती हैं।\n5. **कीट या फफूंद (Fungus/Pests):** माहू, सफेद मक्खी या जड़ गलन।`,
        disclaimer: SAFETY_DISCLAIMER.hi,
      };
    } else {
      return {
        reply: `Plant leaves turning yellow is typically caused by one of these agronomic factors:\n\n1. **Water Stress / Waterlogging:** Your current soil moisture is ${soilMoisture}%. If moisture exceeds 60% for prolonged periods, roots suffocate from lack of aeration, causing lower leaves to yellow.\n2. **Severe Drought:** If moisture drops below 30%, moisture stress causes wilting and chlorosis.\n3. **Nitrogen Deficiency:** General yellowing starting from tips of older, lower leaves.\n4. **Micronutrient Deficiency (Iron/Zinc):** Interveinal yellowing on young upper foliage.\n5. **Fungal or Sucking Pest Damage:** Aphids, whiteflies, or root collar rot.`,
        disclaimer: SAFETY_DISCLAIMER.en,
      };
    }
  }

  // 3. Topic: Suitable crops for soil / मिट्टी के लिए उपयुक्त फसल
  if (
    lowerMsg.includes('suitable') ||
    lowerMsg.includes('which crop') ||
    lowerMsg.includes('soil') ||
    lowerMsg.includes('उपयुक्त') ||
    lowerMsg.includes('कौन सी फसल') ||
    lowerMsg.includes('मिट्टी')
  ) {
    if (isHindi) {
      return {
        reply: `आपके द्वारा चुनी गई **${soilNameHi}** के लिए प्रमुख कृषि सिफारिशें (मध्य प्रदेश / मध्य भारत):\n\n• **काली मिट्टी (Black Soil):** उच्च नमी धारण क्षमता। सोयाबीन, गेहूं, चना (Chickpea), कपास (Cotton) और मक्का के लिए सर्वोत्तम।\n• **लाल व दोमट मिट्टी (Red & Loamy):** दलहन (अरहर, मूंग), मूंगफली, सरसों और सब्जियों के लिए उत्तम।\n• **रेतीली मिट्टी (Sandy Soil):** बाजरा, तरबूज, खरबूजा और ड्रिप सिंचाई से सब्जियां।\n• **जलोढ़ मिट्टी (Alluvial Soil):** धान, गेहूं, गन्ना और आलू के लिए अत्यधिक उपजाऊ।\n\nआपकी चुनी हुई फसल (${cropNameHi}) इस मिट्टी के अनुकूल है।`,
        disclaimer: null,
      };
    } else {
      return {
        reply: `Crop suitability recommendations for **${soilNameEn}** in Central India (MP):\n\n• **Black Soil (Vertisols):** High water retention. Ideal for Soybean, Wheat, Chickpea (Chana), Cotton, and Maize.\n• **Red & Loamy Soils:** Excellent drainage. Ideal for Pulses (Pigeonpea, Greengram), Mustard, and Vegetables.\n• **Sandy Soils:** Low retention. Best for Millets, Cucurbits, and Drip-fertigated vegetable crops.\n• **Alluvial Soils:** Fertile river plains. Best for Paddy, Wheat, Sugarcane, and Potato.\n\nYour selected crop (${cropNameEn}) matches well with this soil category.`,
        disclaimer: null,
      };
    }
  }

  // 4. Topic: How to save water / पानी कैसे बचाएं
  if (
    lowerMsg.includes('save') ||
    lowerMsg.includes('drip') ||
    lowerMsg.includes('sprinkler') ||
    lowerMsg.includes('बचत') ||
    lowerMsg.includes('बचाएं') ||
    lowerMsg.includes('पानी बचाएं')
  ) {
    if (isHindi) {
      return {
        reply: `सिंचाई जल संरक्षण के 5 प्रभावी तरीके:\n\n1. **सूक्ष्म सिंचाई अपनाएं:** पारंपरिक बहाव (Flood) के स्थान पर ड्रिप (40-50% बचत) या स्प्रिंकलर (25-30% बचत) का उपयोग करें। आपका वर्तमान तरीका: **${irrigationMethodHi}** है।\n2. **मौसम आधारित सिंचाई:** हमारे डैशबोर्ड पर बारिश पूर्वानुमान देखकर गैर-जरूरी सिंचाई रोकें।\n3. **मृदा नमी परीक्षण:** मिट्टी में 30% से 60% नमी होने पर बिना वजह पानी न दें।\n4. **समय का चुनाव:** सुबह जल्दी या शाम के समय सिंचाई करें ताकि वाष्पीकरण (Evaporation) कम से कम हो।\n5. **मल्चिंग (Mulching):** फसल अवशेष या प्लास्टिक मल्च से क्यारियों को ढकें।`,
        disclaimer: null,
      };
    } else {
      return {
        reply: `5 practical ways to maximize irrigation water productivity on your farm:\n\n1. **Adopt Micro-Irrigation:** Moving from Traditional Flood to Drip saves 40-50% water; Sprinklers save 25-30%. Your current method is **${irrigationMethodEn}**.\n2. **Weather-Aware Irrigation:** Always cross-check the 7-day forecast on our dashboard before switching on tubewells.\n3. **Moisture-Driven Scheduling:** Keep soil moisture between 30% and 60% rather than irrigating on fixed calendar days.\n4. **Early Morning / Late Evening Watering:** Prevents evaporation losses during hot afternoons.\n5. **Crop Residue Mulching:** Keeps soil cool and retains capillary moisture.`,
        disclaimer: null,
      };
    }
  }

  // 5. Topic: Heavy rainfall actions / भारी बारिश में क्या करें
  if (
    lowerMsg.includes('heavy rain') ||
    lowerMsg.includes('rain') ||
    lowerMsg.includes('flood') ||
    lowerMsg.includes('बारिश') ||
    lowerMsg.includes('बरसात') ||
    lowerMsg.includes('जलभराव')
  ) {
    if (isHindi) {
      return {
        reply: `भारी बारिश के दौरान फसल सुरक्षा के लिए आवश्यक कदम:\n\n1. **जल निकासी नाली बनाएं:** खेत के निचले कोनों पर नाली (Drainage channel) साफ रखें ताकि पानी न ठहरे। सोयाबीन, मक्का और चना 24-48 घंटे जलभराव में नष्ट हो सकते हैं।\n2. **मोटर/पंप बंद रखें:** आगामी 24 घंटे में वर्षा की संभावना ${upcomingRainProb}% है, अतः सभी सिंचाई मोटर तुरंत बंद रखें।\n3. **उर्वरक छिड़काव न करें:** भारी बारिश में यूरिया या डीएपी न डालें, अन्यथा पोषक तत्व बह जाएंगे।\n4. **कीटनाशक छिड़काव स्थगित रखें:** बारिश में छिड़काव धुल जाता है। मौसम साफ होने की प्रतीक्षा करें।`,
        disclaimer: null,
      };
    } else {
      return {
        reply: `Key crop management practices during heavy rainfall:\n\n1. **Clear Field Drainage:** Ensure farm ditches and drainage trenches are open. Soybean, Maize, and Chickpea cannot tolerate water stagnation beyond 24-48 hours.\n2. **Halt Tubewell Operations:** With ${upcomingRainProb}% rain expected, all irrigation pumps should remain turned off.\n3. **Do Not Apply Fertilizers:** Applying urea or DAP before rain causes nutrient leaching and economic loss.\n4. **Delay Spraying Operations:** Postpone fungicide or pesticide spraying until rainfall subsides and leaves dry out.`,
        disclaimer: null,
      };
    }
  }

  // General Agronomic Response with Safety Notice
  if (isHindi) {
    return {
      reply: `नमस्ते किसान भाई! आपके खेत की स्थिति:\n• फसल: **${cropNameHi}** | मिट्टी: **${soilNameHi}**\n• मिट्टी नमी: **${soilMoisture}%** | स्थिति: **${recommendationDecision}**\n\nआप मुझसे सिंचाई समय, मौसम प्रभाव, पत्तियों का पीलापन, खाद-पानी प्रबंधन या पानी बचाने के तरीकों के बारे में पूछ सकते हैं।`,
      disclaimer: SAFETY_DISCLAIMER.hi,
    };
  } else {
    return {
      reply: `Hello farmer! Here is your active farm summary:\n• Crop: **${cropNameEn}** | Soil: **${soilNameEn}**\n• Moisture: **${soilMoisture}%** | Status: **${recommendationDecision}**\n\nFeel free to ask about irrigation timing, weather adjustments, leaf yellowing, or water conservation techniques.`,
      disclaimer: SAFETY_DISCLAIMER.en,
    };
  }
}
