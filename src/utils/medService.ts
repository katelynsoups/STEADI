interface DrugInfo {
  name: string;
  sideEffects: string[];
  hasFallRisk: boolean;
}

//keywords that indicate fall risk 
const FALL_RISK_KEYWORDS = [
  'dizziness',
  'dizzy',
  'sedation',
  'sedative',
  'drowsiness',
  'drowsy',
  'sleepiness',
  'somnolence',
  'hypotension',
  'low blood pressure',
  'orthostatic',
  'blurred vision',
  'blur',
  'confusion',
  'confused',
  'weakness',
  'weak',
  'lightheadedness',
  'lightheaded',
  'fatigue',
  'tired',
  'balance',
  'unsteady',
  'unsteadiness',
  'vertigo',
  'fainting',
  'syncope',
  'postural',
];

//api just passes one big block of text, if we want to extract the specific side effects that are realated to falls we will need to parse everything
function checkForFallRisk(sideEffects: string[]): boolean {
  return sideEffects.some(effect => {
    const lowerEffect = effect.toLowerCase();
    return FALL_RISK_KEYWORDS.some(keyword => lowerEffect.includes(keyword));
  });
}

export async function getDrugSideEffects(medicationName: string): Promise<DrugInfo | null> {
  try {
    console.log('Fetching side effects for:', medicationName);
    
    //using Open FDA public api to fetch drug information
    const response = await fetch(
      `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${medicationName}"+openfda.generic_name:"${medicationName}"&limit=1`
    );

    if (!response.ok) {
      console.log('FDA API returned status:', response.status);
      return null;
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
        const drug = data.results[0];
      

        //these things are so comprehensive probably every medication will be flagged
        const allSideEffects = [
        ...(drug.adverse_reactions || []), 
        ...(drug.warnings || [])
        ];

        // console.log("======SIDE EFFECTS======")
        // console.log(allSideEffects);

        // console.log("======WARNINGS======")
        // console.log(drug.warnings);

        const hasFallRisk = checkForFallRisk(allSideEffects);
      
        return {
            name: medicationName,
            sideEffects: allSideEffects,
            hasFallRisk: hasFallRisk,
        };
    }
    
    console.log('No results found for medication:', medicationName);
    return null;
  } catch (error) {
    console.log('Error fetching drug info:', error);
    return null;
  }
}