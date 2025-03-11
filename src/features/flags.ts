export enum FeatureFlag {
  TRANSCRIPTION = "transcriptions",
  IMG_GENERATION = "image-generation",
  ANALYSE_VIDEO = "video-analysis",
  TITLE_GENERATIONS = "title-generations",
  SCRIPT_GENERATION = "script-generation",
  AUDIENCE_ANALYSIS = "audience-analysis",
}

export const featureFlagEvents: Record<FeatureFlag, { event: string }> = {
  [FeatureFlag.TRANSCRIPTION]: {
    event: "transcribe",
  },
  [FeatureFlag.IMG_GENERATION]: {
    event: "generate-image",
  },
  [FeatureFlag.ANALYSE_VIDEO]: {
    event: "analyse-video",
  },
  [FeatureFlag.TITLE_GENERATIONS]: {
    event: "generate-title",
  },
  [FeatureFlag.AUDIENCE_ANALYSIS]: {
    event: "analyse-audience",
  },
  [FeatureFlag.SCRIPT_GENERATION]: {
    event: "",
  },
};