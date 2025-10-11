import type { DetailedRoute } from "./mock-data"

/**
 * Calculate the recommended BPM for each segment of a route based on target pace and elevation
 *
 * The algorithm uses the following principles:
 * 1. Base cadence for average recreational runners is around 170 steps per minute
 * 2. Uphill sections require higher cadence to maintain pace (approximately +4 spm per 1% grade)
 * 3. Downhill sections can use lower cadence (-2 spm per 1% grade, up to a point)
 * 4. Pace affects base cadence (faster pace = higher cadence)
 *
 * @param route The detailed route with segments
 * @param targetPaceMinPerKm Target pace in minutes per kilometer
 * @returns The route with recommended BPM for each segment
 */
export function calculateSegmentBpms(route: DetailedRoute, targetPaceMinPerKm?: number): DetailedRoute {
  // Use provided target pace or the route's default
  const pace = targetPaceMinPerKm || route.targetPaceValue

  // Base cadence for a 5:00 min/km pace
  const baseCadence = 170

  // Adjust base cadence based on target pace (approximately -5 spm per minute slower)
  const paceAdjustment = (5 - pace) * 5

  // Calculate BPM for each segment
  const updatedSegments = route.segments.map((segment) => {
    // Calculate elevation adjustment based on grade
    // Uphill: +4 spm per 1% grade
    // Downhill: -2 spm per 1% grade (but not below a certain threshold)
    const elevationAdjustment = segment.avgGrade > 0 ? segment.avgGrade * 4 : Math.max(segment.avgGrade * 2, -10) // Limit downhill adjustment

    // Calculate optimal cadence for this segment
    const optimalCadence = Math.round(baseCadence + paceAdjustment + elevationAdjustment)

    // Ensure BPM is within reasonable range (120-200)
    const recommendedBpm = Math.min(Math.max(optimalCadence, 120), 200)

    return {
      ...segment,
      recommendedBpm,
    }
  })

  return {
    ...route,
    segments: updatedSegments,
  }
}

/**
 * Calculate the estimated completion time for a route based on target pace and elevation
 *
 * @param route The detailed route
 * @param targetPaceMinPerKm Target pace in minutes per kilometer
 * @returns Estimated completion time in minutes
 */
export function calculateEstimatedTime(route: DetailedRoute, targetPaceMinPerKm?: number): number {
  // Use provided target pace or the route's default
  const basePace = targetPaceMinPerKm || route.targetPaceValue

  // Calculate time for each segment based on distance, pace, and grade
  let totalTimeMinutes = 0

  route.segments.forEach((segment) => {
    const distance = segment.endDistance - segment.startDistance

    // Adjust pace based on grade
    // Uphill: approximately 4% slower per 1% grade
    // Downhill: approximately 2% faster per 1% grade (up to a point)
    let paceAdjustment = 1 // Multiplier (1 = no change)

    if (segment.avgGrade > 0) {
      // Uphill adjustment (slower)
      paceAdjustment = 1 + segment.avgGrade * 0.04
    } else if (segment.avgGrade < 0) {
      // Downhill adjustment (faster, but with diminishing returns)
      // Limit the benefit to avoid unrealistic speeds on steep downhills
      const benefit = Math.min(Math.abs(segment.avgGrade) * 0.02, 0.1)
      paceAdjustment = 1 - benefit
    }

    // Calculate segment time
    const segmentPace = basePace * paceAdjustment
    const segmentTimeMinutes = distance * segmentPace

    totalTimeMinutes += segmentTimeMinutes
  })

  return Math.round(totalTimeMinutes)
}

/**
 * Generate a playlist structure based on route segments and BPM requirements
 *
 * @param route The detailed route with calculated BPMs
 * @returns Playlist segments with BPM ranges
 */
export function generatePlaylistStructure(route: DetailedRoute) {
  return route.segments.map((segment) => {
    // Create a BPM range centered around the recommended BPM
    // Typically +/- 5 BPM is still effective for cadence entrainment
    const minBpm = Math.max(segment.recommendedBpm! - 5, 120)
    const maxBpm = Math.min(segment.recommendedBpm! + 5, 200)

    // Calculate approximate duration based on distance and pace
    const distance = segment.endDistance - segment.startDistance
    const durationMinutes = Math.round(distance * route.targetPaceValue)

    return {
      name: segment.name,
      distanceRange: [segment.startDistance, segment.endDistance] as [number, number],
      bpmRange: [minBpm, maxBpm] as [number, number],
      duration: durationMinutes,
      grade: segment.avgGrade,
    }
  })
}
