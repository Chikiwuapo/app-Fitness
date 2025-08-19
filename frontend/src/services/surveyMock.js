// Survey mock utilities for testing the survey flow without a real backend

export const YEAR_START = 1990
export const YEAR_END = 2023

export const HEIGHT_LIMITS = {
  min: 100, // cm
  max: 250, // cm
}

export const WEIGHT_LIMITS = {
  min: 30, // kg
  max: 200, // kg
}

export function getYearRange(start = YEAR_START, end = YEAR_END) {
  const years = []
  for (let y = end; y >= start; y--) years.push(y)
  return years
}

export function validateHeightCm(value) {
  const n = Number(value)
  return Number.isFinite(n) && n >= HEIGHT_LIMITS.min && n <= HEIGHT_LIMITS.max
}

export function validateWeightKg(value) {
  const n = Number(value)
  return Number.isFinite(n) && n >= WEIGHT_LIMITS.min && n <= WEIGHT_LIMITS.max
}

// Simulated API submit; returns a resolved promise after a short delay
export async function submitSurveyData(payload) {
  // Basic shape example: { ageYear, heightCm, weightKg, goal, activity }
  // In a real implementation, you'd POST to your API here
  console.log('[surveyMock] Submitting survey data...', payload)
  await new Promise((res) => setTimeout(res, 400))
  console.log('[surveyMock] Submission OK (mock)')
  return { ok: true, payload }
}
