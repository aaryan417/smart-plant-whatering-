// src/data/cropAgronomy.js
/**
 * Agronomic Knowledge Base for Central India / Madhya Pradesh
 * References: ICAR, Krishi Vigyan Kendra (KVK), RVSKVV (Gwalior), and JNKVV (Jabalpur)
 * 
 * Provides critical growth stages, water requirements, and soil factor adjustments.
 */

export const CROPS = [
  {
    id: 'wheat',
    nameEn: 'Wheat',
    nameHi: 'गेहूं',
    season: 'Rabi',
    totalDays: 120,
    baseIntervalDays: 20,
    criticalStages: [
      { id: 'cri', nameEn: 'Crown Root Initiation (CRI)', nameHi: 'शीर्ष जड़ जमाव (CRI)', dayMin: 20, dayMax: 25, importance: 'Most Critical', importanceHi: 'सर्वाधिक महत्वपूर्ण' },
      { id: 'tillering', nameEn: 'Tillering Stage', nameHi: 'कल्ले फूटने की अवस्था', dayMin: 40, dayMax: 45, importance: 'High', importanceHi: 'उच्च' },
      { id: 'jointing', nameEn: 'Late Jointing Stage', nameHi: 'गांठ बनने की अवस्था', dayMin: 60, dayMax: 65, importance: 'High', importanceHi: 'उच्च' },
      { id: 'flowering', nameEn: 'Flowering Stage', nameHi: 'फूल आने की अवस्था', dayMin: 80, dayMax: 85, importance: 'Critical', importanceHi: 'अति महत्वपूर्ण' },
      { id: 'milking', nameEn: 'Milking Stage', nameHi: 'दूधिया अवस्था', dayMin: 100, dayMax: 105, importance: 'Moderate', importanceHi: 'मध्यम' },
      { id: 'dough', nameEn: 'Dough / Grain Filling', nameHi: 'दाना पकने की अवस्था', dayMin: 115, dayMax: 120, importance: 'Moderate', importanceHi: 'मध्यम' },
    ],
    noteEn: 'CRI (20-25 days) is the most critical stage. Missing irrigation here causes severe yield loss.',
    noteHi: 'CRI अवस्था (20-25 दिन) सर्वाधिक महत्वपूर्ण है। इस समय सिंचाई छूटने पर पैदावार में भारी कमी आती है।',
  },
  {
    id: 'chickpea',
    nameEn: 'Chickpea (Chana)',
    nameHi: 'चना',
    season: 'Rabi',
    totalDays: 100,
    baseIntervalDays: 30,
    criticalStages: [
      { id: 'pre_sow', nameEn: 'Branching / Pre-flowering', nameHi: 'शाखाएं निकलने की अवस्था', dayMin: 35, dayMax: 45, importance: 'Critical', importanceHi: 'अति महत्वपूर्ण' },
      { id: 'pod_dev', nameEn: 'Pod Development', nameHi: 'घांटी / दाना भराव अवस्था', dayMin: 65, dayMax: 75, importance: 'Critical', importanceHi: 'अति महत्वपूर्ण' },
    ],
    noteEn: 'Never irrigate during full flowering as it causes flower drop. 1 to 2 light irrigations are sufficient in MP black soils.',
    noteHi: 'पूर्ण फूल आने पर कभी पानी न दें, इससे फूल झड़ जाते हैं। म.प्र. की काली मिट्टी में केवल 1-2 हल्की सिंचाई पर्याप्त होती है।',
  },
  {
    id: 'soybean',
    nameEn: 'Soybean',
    nameHi: 'सोयाबीन',
    season: 'Karif',
    totalDays: 95,
    baseIntervalDays: 20,
    criticalStages: [
      { id: 'vegetative', nameEn: 'Vegetative Growth', nameHi: 'वानस्पतिक वृद्धि', dayMin: 20, dayMax: 25, importance: 'Moderate', importanceHi: 'मध्यम' },
      { id: 'flowering', nameEn: 'Flowering Stage', nameHi: 'फूल आने की अवस्था', dayMin: 35, dayMax: 45, importance: 'Critical', importanceHi: 'अति महत्वपूर्ण' },
      { id: 'pod_filling', nameEn: 'Pod Filling Stage', nameHi: 'फली में दाना भराव', dayMin: 55, dayMax: 65, importance: 'Critical', importanceHi: 'अति महत्वपूर्ण' },
    ],
    noteEn: 'Primarily rainfed in MP. Protective irrigation required only if dry spell exceeds 15-20 days during flowering/pod formation.',
    noteHi: 'मुख्यतः वर्षा आधारित फसल है। फूल और फली बनते समय यदि 15-20 दिन सूखा रहे तभी जीवनरक्षक सिंचाई दें।',
  },
  {
    id: 'paddy',
    nameEn: 'Paddy (Rice)',
    nameHi: 'धान / चावल',
    season: 'Kharif',
    totalDays: 125,
    baseIntervalDays: 7,
    criticalStages: [
      { id: 'transplant', nameEn: 'Seedling / Tillering', nameHi: 'रोपाई व कल्ले फूटना', dayMin: 15, dayMax: 25, importance: 'High', importanceHi: 'उच्च' },
      { id: 'panicle', nameEn: 'Panicle Initiation', nameHi: 'बाली बनना (गभोट)', dayMin: 40, dayMax: 50, importance: 'Critical', importanceHi: 'अति महत्वपूर्ण' },
      { id: 'heading', nameEn: 'Flowering & Heading', nameHi: 'फूल व बालियां निकलना', dayMin: 65, dayMax: 75, importance: 'Critical', importanceHi: 'अति महत्वपूर्ण' },
      { id: 'grain_filling', nameEn: 'Grain Filling Stage', nameHi: 'दूधिया व दाना भराव', dayMin: 85, dayMax: 95, importance: 'High', importanceHi: 'उच्च' },
    ],
    noteEn: 'Requires consistent shallow water depth (2-5 cm) from tillering to flowering. Avoid standing water during maturity.',
    noteHi: 'कल्ले फूटने से बालियां आने तक 2-5 सेमी हल्का पानी बनाए रखें। फसल पकने के 10 दिन पहले पानी रोक दें।',
  },
  {
    id: 'maize',
    nameEn: 'Maize (Corn)',
    nameHi: 'मक्का',
    season: 'Kharif / Rabi',
    totalDays: 95,
    baseIntervalDays: 14,
    criticalStages: [
      { id: 'knee_high', nameEn: 'Knee-High Stage', nameHi: 'घुटने की ऊंचाई की अवस्था', dayMin: 20, dayMax: 25, importance: 'Moderate', importanceHi: 'मध्यम' },
      { id: 'tasseling', nameEn: 'Tasseling Stage (Male flower)', nameHi: 'नर फूल (मंजरी) निकलना', dayMin: 45, dayMax: 52, importance: 'Critical', importanceHi: 'अति महत्वपूर्ण' },
      { id: 'silking', nameEn: 'Silking Stage (Female cob)', nameHi: 'भुट्टे में बाल (सिल्क) निकलना', dayMin: 55, dayMax: 62, importance: 'Critical', importanceHi: 'अति महत्वपूर्ण' },
      { id: 'grain_filling', nameEn: 'Grain Filling', nameHi: 'दाना भराव अवस्था', dayMin: 70, dayMax: 80, importance: 'High', importanceHi: 'उच्च' },
    ],
    noteEn: 'Highly sensitive to both drought and waterlogging during tasseling and silking stages.',
    noteHi: 'मंजरी और सिल्क निकलते समय सूखा और जलभराव दोनों ही फसल को अत्यधिक नुकसान पहुंचाते हैं।',
  },
  {
    id: 'cotton',
    nameEn: 'Cotton',
    nameHi: 'कपास',
    season: 'Kharif',
    totalDays: 150,
    baseIntervalDays: 20,
    criticalStages: [
      { id: 'squaring', nameEn: 'Square Formation', nameHi: 'कली / डोडी बनने की अवस्था', dayMin: 40, dayMax: 50, importance: 'High', importanceHi: 'उच्च' },
      { id: 'flowering', nameEn: 'Peak Flowering', nameHi: 'फूल खिलने की अवस्था', dayMin: 70, dayMax: 80, importance: 'Critical', importanceHi: 'अति महत्वपूर्ण' },
      { id: 'boll_dev', nameEn: 'Boll Development', nameHi: 'टिंडे बनने की अवस्था', dayMin: 95, dayMax: 110, importance: 'Critical', importanceHi: 'अति महत्वपूर्ण' },
    ],
    noteEn: 'Avoid excessive moisture in early vegetative growth. Flowering and boll enlargement are key irrigation phases.',
    noteHi: 'शुरुआती वानस्पतिक अवस्था में अधिक पानी से बचें। फूल और टिंडे बनने के दौरान पानी की कमी न होने दें।',
  },
  {
    id: 'mustard',
    nameEn: 'Mustard',
    nameHi: 'सरसों',
    season: 'Rabi',
    totalDays: 110,
    baseIntervalDays: 30,
    criticalStages: [
      { id: 'rosette', nameEn: 'Branching / Rosette Stage', nameHi: 'शाखाएं निकलने की अवस्था', dayMin: 25, dayMax: 30, importance: 'Critical', importanceHi: 'अति महत्वपूर्ण' },
      { id: 'pod_fill', nameEn: 'Siliquae (Pod) Development', nameHi: 'फलियां (फली) बनने की अवस्था', dayMin: 50, dayMax: 60, importance: 'Critical', importanceHi: 'अति महत्वपूर्ण' },
    ],
    noteEn: 'Generally needs 2 irrigations: first at 25-30 days (branching) and second at 50-60 days (pod formation).',
    noteHi: 'सरसों में सामान्यतः 2 सिंचाई आवश्यक हैं: पहली 25-30 दिन (शाखाएं बनने पर) और दूसरी 50-60 दिन (फली बनते समय)।',
  },
  {
    id: 'vegetables',
    nameEn: 'Vegetables',
    nameHi: 'सब्जियां',
    season: 'Year-round',
    totalDays: 90,
    baseIntervalDays: 6,
    criticalStages: [
      { id: 'seedling', nameEn: 'Early Vegetative / Seedling', nameHi: 'पौध व प्रारंभिक वृद्धि', dayMin: 10, dayMax: 20, importance: 'High', importanceHi: 'उच्च' },
      { id: 'flowering', nameEn: 'Flowering Phase', nameHi: 'फूल आने का समय', dayMin: 30, dayMax: 45, importance: 'Critical', importanceHi: 'अति महत्वपूर्ण' },
      { id: 'fruiting', nameEn: 'Fruit Set & Picking', nameHi: 'फल विकास व तुड़ाई', dayMin: 55, dayMax: 80, importance: 'Critical', importanceHi: 'अति महत्वपूर्ण' },
    ],
    noteEn: 'Vegetable crops have shallow roots and require frequent, light watering without waterlogging.',
    noteHi: 'सब्जियों की जड़ें उथली होती हैं, अतः इन्हें थोड़े-थोड़े अंतराल पर हल्की सिंचाई की आवश्यकता होती है।',
  },
  {
    id: 'other',
    nameEn: 'Other Crop',
    nameHi: 'अन्य फसल',
    season: 'General',
    totalDays: 100,
    baseIntervalDays: 14,
    criticalStages: [
      { id: 'early', nameEn: 'Early Growth', nameHi: 'प्रारंभिक वृद्धि', dayMin: 20, dayMax: 30, importance: 'Moderate', importanceHi: 'मध्यम' },
      { id: 'mid', nameEn: 'Mid-Season Peak', nameHi: 'मध्य सीजन पीक', dayMin: 45, dayMax: 60, importance: 'High', importanceHi: 'उच्च' },
      { id: 'maturity', nameEn: 'Maturity / Grain Fill', nameHi: 'परिपक्वता अवस्था', dayMin: 75, dayMax: 90, importance: 'Moderate', importanceHi: 'मध्यम' },
    ],
    noteEn: 'Indicative schedule — verify with local Krishi Vigyan Kendra (KVK) agricultural advisory.',
    noteHi: 'प्रतीकात्मक कार्यक्रम — स्थानीय कृषि विज्ञान केंद्र (KVK) या कृषि विशेषज्ञ से सलाह अवश्य लें।',
  },
];

export const SOIL_TYPES = [
  {
    id: 'black',
    nameEn: 'Black Soil (काली मिट्टी)',
    labelEn: 'Black Soil',
    labelHi: 'काली मिट्टी',
    retention: 'High (उच्च)',
    multiplier: 1.25, // Deep vertisols retain moisture longer
    descEn: 'High water holding capacity typical in MP (Malwa, Nimar). Retains moisture longer.',
    descHi: 'मध्य प्रदेश (मालवा, निमाड़) की प्रमुख मिट्टी। अधिक समय तक नमी बनाए रखती है।',
  },
  {
    id: 'red',
    nameEn: 'Red Soil (लाल मिट्टी)',
    labelEn: 'Red Soil',
    labelHi: 'लाल मिट्टी',
    retention: 'Medium-Low (मध्यम-कम)',
    multiplier: 0.85,
    descEn: 'Porous texture with quick drainage. Requires slightly shorter irrigation intervals.',
    descHi: 'छिद्रयुक्त संरचना, पानी तेजी से रिसता है। थोड़े कम अंतराल पर पानी देना पड़ता है।',
  },
  {
    id: 'sandy',
    nameEn: 'Sandy Soil (रेतीली मिट्टी)',
    labelEn: 'Sandy Soil',
    labelHi: 'रेतीली मिट्टी',
    retention: 'Low (कम)',
    multiplier: 0.70,
    descEn: 'Low water retention, rapid drainage. Requires frequent, smaller irrigation doses.',
    descHi: 'नमी रोकने की क्षमता कम। बार-बार हल्की सिंचाई की आवश्यकता होती है।',
  },
  {
    id: 'clay',
    nameEn: 'Clay Soil (चिकनी मिट्टी)',
    labelEn: 'Clay Soil',
    labelHi: 'चिकनी मिट्टी',
    retention: 'Very High (अति उच्च)',
    multiplier: 1.15,
    descEn: 'Slow infiltration rate and high retention. Avoid over-irrigation to prevent aeration loss.',
    descHi: 'पानी धीरे सोखती है और लंबे समय तक गीली रहती है। जलभराव से बचें।',
  },
  {
    id: 'loamy',
    nameEn: 'Loamy Soil (दोमट मिट्टी)',
    labelEn: 'Loamy Soil',
    labelHi: 'दोमट मिट्टी',
    retention: 'Ideal Balanced (संतुलित)',
    multiplier: 1.0,
    descEn: 'Balanced aeration and moisture retention. Standard agronomic irrigation intervals apply.',
    descHi: 'हवा और नमी का उत्तम संतुलन। मानक कृषि सिंचाई अंतराल उपयुक्त रहते हैं।',
  },
  {
    id: 'alluvial',
    nameEn: 'Alluvial Soil (जलोढ़ मिट्टी)',
    labelEn: 'Alluvial Soil',
    labelHi: 'जलोढ़ मिट्टी',
    retention: 'Good (उत्तम)',
    multiplier: 1.0,
    descEn: 'Fertile river basin soils (Narmada / Chambal valleys). Excellent moisture balance.',
    descHi: 'नर्मदा व चंबल घाटी की उपजाऊ मिट्टी। उत्तम नमी संतुलन प्रदान करती है।',
  },
];

export const IRRIGATION_METHODS = [
  {
    id: 'drip',
    labelEn: 'Drip Irrigation',
    labelHi: 'ड्रिप सिंचाई (टपक)',
    efficiency: '90-95%',
    intervalMultiplier: 0.7, // frequent micro-dosing
    descEn: 'Frequent, targeted root watering. Saves 40-50% water.',
    descHi: 'सीधे जड़ों में बूंद-बूंद पानी। 40-50% पानी की बचत।',
  },
  {
    id: 'sprinkler',
    labelEn: 'Sprinkler System',
    labelHi: 'स्प्रिंकलर (फव्वारा)',
    efficiency: '75-80%',
    intervalMultiplier: 0.9,
    descEn: 'Overhead uniform spray. Ideal for wheat, pulses, and undulating fields.',
    descHi: 'फव्वारे द्वारा समान वर्षा जैसी सिंचाई। गेहूं और चने के लिए उपयुक्त।',
  },
  {
    id: 'flood',
    labelEn: 'Flood / Traditional Furrow',
    labelHi: 'पारंपरिक / बहाव सिंचाई',
    efficiency: '50-60%',
    intervalMultiplier: 1.0,
    descEn: 'Standard furrow or basin watering. Requires deeper soil soaking.',
    descHi: 'पारंपरिक क्यारी व नाली विधि। अधिक पानी सोखने के लिए लंबा अंतराल।',
  },
];

/**
 * Calculate dynamic crop growth stage and intelligent irrigation schedule
 * incorporating real-time soil moisture and Open-Meteo rainfall forecast.
 */
export function calculateCropSchedule({
  cropId,
  soilId,
  sowingDate, // YYYY-MM-DD or null
  irrigationMethodId = 'flood',
  soilMoisture = 45,
  upcomingRainProb = 0,
  upcomingRainAmount = 0,
}) {
  const crop = CROPS.find((c) => c.id === cropId) || CROPS[0];
  const soil = SOIL_TYPES.find((s) => s.id === soilId) || SOIL_TYPES[0];
  const method = IRRIGATION_METHODS.find((m) => m.id === irrigationMethodId) || IRRIGATION_METHODS[2];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let daysSinceSowing = 0;
  let isEstimated = false;

  if (sowingDate) {
    const sDate = new Date(sowingDate);
    sDate.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - sDate.getTime();
    daysSinceSowing = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  } else {
    // If no sowing date provided, assume typical early-mid vegetative age (e.g. 25 days)
    daysSinceSowing = 25;
    isEstimated = true;
  }

  // Determine current growth stage
  let currentStage = crop.criticalStages[0];
  let nextStage = null;
  let stageIndex = 0;

  for (let i = 0; i < crop.criticalStages.length; i++) {
    const stage = crop.criticalStages[i];
    if (daysSinceSowing <= stage.dayMax) {
      currentStage = stage;
      stageIndex = i;
      nextStage = crop.criticalStages[i + 1] || null;
      break;
    }
  }

  // If crop is past all stages
  if (daysSinceSowing > crop.totalDays) {
    currentStage = {
      id: 'mature',
      nameEn: 'Maturity / Harvest Ready',
      nameHi: 'परिपक्वता / कटाई हेतु तैयार',
      dayMin: crop.totalDays,
      dayMax: crop.totalDays + 15,
      importance: 'No Irrigation Needed',
      importanceHi: 'सिंचाई की आवश्यकता नहीं',
    };
    nextStage = null;
  }

  // Base interval adjusted by soil water retention and irrigation method
  const adjustedIntervalDays = Math.max(
    3,
    Math.round(crop.baseIntervalDays * soil.multiplier * method.intervalMultiplier)
  );

  // Target next irrigation date calculation
  let targetStageDay = currentStage.dayMin;
  if (daysSinceSowing >= currentStage.dayMin) {
    if (nextStage) {
      targetStageDay = nextStage.dayMin;
    } else {
      targetStageDay = currentStage.dayMax;
    }
  }

  let daysUntilTarget = targetStageDay - daysSinceSowing;
  if (daysUntilTarget < 0) daysUntilTarget = 0;

  // Next expected date before weather adjustment
  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + daysUntilTarget);

  // Intelligent Weather & Soil Moisture Adjustments
  const hasSignificantRain = upcomingRainProb >= 70 && upcomingRainAmount >= 5.0;
  const isSoilSufficient = soilMoisture >= 60;
  const isSoilDry = soilMoisture < 30;

  let statusKey = 'upcoming'; // 'due_today' | 'due_soon' | 'delayed_rain' | 'delayed_moisture' | 'upcoming'
  let statusBadgeClass = 'bg-blue-100 text-blue-800 border-blue-200';
  let reasonEn = '';
  let reasonHi = '';

  if (hasSignificantRain) {
    statusKey = 'delayed_rain';
    statusBadgeClass = 'bg-amber-100 text-amber-800 border-amber-300';
    reasonEn = `Significant rain (${upcomingRainAmount} mm with ${upcomingRainProb}% chance) is forecast. Scheduled irrigation is delayed to conserve water and prevent waterlogging.`;
    reasonHi = `अच्छी बारिश (${upcomingRainAmount} मिमी, ${upcomingRainProb}% संभावना) का अनुमान है। पानी बचाने और जलभराव रोकने के लिए सिंचाई स्थगित की गई है।`;
    nextDate.setDate(nextDate.getDate() + 3); // postpone 3 days
  } else if (isSoilSufficient) {
    statusKey = 'delayed_moisture';
    statusBadgeClass = 'bg-blue-100 text-blue-800 border-blue-200';
    reasonEn = `Soil moisture is already high (${soilMoisture}%). Skipping immediate irrigation to promote deep root growth.`;
    reasonHi = `मिट्टी में पहले से पर्याप्त नमी (${soilMoisture}%) है। जड़ों के बेहतर विकास के लिए अभी सिंचाई की आवश्यकता नहीं है।`;
  } else if (isSoilDry) {
    if (daysUntilTarget <= 3 || daysSinceSowing >= currentStage.dayMin) {
      statusKey = 'due_today';
      statusBadgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300 ring-2 ring-emerald-400';
      reasonEn = `Soil is dry (${soilMoisture}%) and crop is in the critical ${currentStage.nameEn} stage. Irrigation is urgently recommended today.`;
      reasonHi = `मिट्टी सूखी (${soilMoisture}%) है और फसल ${currentStage.nameHi} में है। आज ही प्राथमिकता से सिंचाई करने की सलाह है।`;
    } else {
      statusKey = 'due_soon';
      statusBadgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-200';
      reasonEn = `Soil moisture is low (${soilMoisture}%). Prepare for irrigation within the next 2-3 days as the ${currentStage.nameEn} stage approaches.`;
      reasonHi = `मिट्टी में नमी कम (${soilMoisture}%) है। ${currentStage.nameHi} को देखते हुए आगामी 2-3 दिनों में सिंचाई की तैयारी करें।`;
    }
  } else {
    // Normal / moderate soil moisture
    if (daysUntilTarget <= 2) {
      statusKey = 'due_soon';
      statusBadgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-200';
      reasonEn = `Next critical stage (${currentStage.nameEn}) is due in ~${daysUntilTarget} days. Soil moisture is currently adequate (${soilMoisture}%).`;
      reasonHi = `अगली महत्वपूर्ण अवस्था (${currentStage.nameHi}) लगभग ${daysUntilTarget} दिन में है। वर्तमान नमी (${soilMoisture}%) सामान्य है।`;
    } else {
      statusKey = 'upcoming';
      statusBadgeClass = 'bg-slate-100 text-slate-800 border-slate-200';
      reasonEn = `Crop is advancing well in ${currentStage.nameEn}. Scheduled next irrigation in approx. ${daysUntilTarget} days based on ${soil.labelEn}.`;
      reasonHi = `फसल ${currentStage.nameHi} में सुचारू रूप से बढ़ रही है। ${soil.labelHi} के अनुसार लगभग ${daysUntilTarget} दिन में अगली सिंचाई अपेक्षित है।`;
    }
  }

  // Generate upcoming timeline stages
  const timeline = crop.criticalStages.map((stage) => {
    const stageTargetDate = new Date(today);
    const offsetFromNow = stage.dayMin - daysSinceSowing;
    stageTargetDate.setDate(today.getDate() + offsetFromNow);

    let stageStatus = 'upcoming';
    if (daysSinceSowing > stage.dayMax) {
      stageStatus = 'completed';
    } else if (daysSinceSowing >= stage.dayMin && daysSinceSowing <= stage.dayMax) {
      stageStatus = 'active';
    }

    return {
      id: stage.id,
      nameEn: stage.nameEn,
      nameHi: stage.nameHi,
      importanceEn: stage.importance,
      importanceHi: stage.importanceHi,
      dayMin: stage.dayMin,
      dayMax: stage.dayMax,
      expectedDate: stageTargetDate,
      stageStatus,
      offsetDays: offsetFromNow,
    };
  });

  return {
    crop,
    soil,
    method,
    daysSinceSowing,
    isEstimated,
    currentStage,
    nextStage,
    adjustedIntervalDays,
    nextDate,
    daysUntilNext: Math.max(0, Math.round((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))),
    statusKey,
    statusBadgeClass,
    reasonEn,
    reasonHi,
    timeline,
    cropNoteEn: crop.noteEn,
    cropNoteHi: crop.noteHi,
  };
}

/**
 * Water Requirement Calculator and Water Saving Tracker
 * Computes water required per irrigation cycle based on field area (acre/hectare),
 * crop irrigation depth, and application efficiency of irrigation methods.
 * 
 * 1 hectare = 10,000 m², 1 acre = 4046.86 m²
 * 1 mm water depth over 1 m² = 1 Litre
 */
export function calculateWaterRequirement({
  cropId = 'wheat',
  area = 2,
  unit = 'acre', // 'acre' | 'hectare'
  irrigationMethodId = 'flood',
}) {
  const crop = CROPS.find((c) => c.id === cropId) || CROPS[0];
  
  // Standard agronomic irrigation depth in mm per cycle for Central India crops
  const defaultDepth = {
    wheat: 50,
    chickpea: 45,
    soybean: 50,
    paddy: 80,
    maize: 55,
    cotton: 60,
    mustard: 45,
    vegetables: 30,
    other: 50,
  };

  const depthMm = defaultDepth[crop.id] || 50;

  // Convert area to square meters
  const areaM2 = unit === 'hectare' ? area * 10000 : area * 4046.86;

  // Net Volume needed in Litres: Area(m²) * Depth(mm) (since 1 mm * 1 m² = 1 Litre)
  const netVolumeLitres = areaM2 * depthMm;

  // Application efficiencies:
  // Drip: ~92%, Sprinkler: ~78%, Flood / Traditional Furrow: ~55%
  const methodEfficiency = {
    drip: 0.92,
    sprinkler: 0.78,
    flood: 0.55,
  };

  const eff = methodEfficiency[irrigationMethodId] || 0.55;
  const floodEff = 0.55;

  const actualLitres = Math.round(netVolumeLitres / eff);
  const floodLitres = Math.round(netVolumeLitres / floodEff);

  // Water savings compared to traditional flood baseline
  const litresSaved = Math.max(0, floodLitres - actualLitres);
  const percentSaved = floodLitres > 0 ? Math.round((litresSaved / floodLitres) * 100) : 0;

  return {
    crop,
    depthMm,
    area: Number(area) || 1,
    unit,
    irrigationMethodId,
    netVolumeLitres: Math.round(netVolumeLitres),
    actualLitres,
    actualM3: parseFloat((actualLitres / 1000).toFixed(1)),
    actualKiloLitres: parseFloat((actualLitres / 1000).toFixed(1)),
    floodLitres,
    floodKiloLitres: parseFloat((floodLitres / 1000).toFixed(1)),
    litresSaved,
    kiloLitresSaved: parseFloat((litresSaved / 1000).toFixed(1)),
    percentSaved,
  };
}
