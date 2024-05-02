import { PostProcessingConfig } from './postProcessingHelper'

export type RenderingPipeline = {
  render(): Promise<void>
  updatePostProcessingConfig(
    newPostProcessingConfig: PostProcessingConfig
  ): void
  // updateBackgroundImage(backgroundImage: HTMLImageElement): void
  cleanUp(): void
}
