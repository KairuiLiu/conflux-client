import { useEffect } from 'react'
import { BackgroundConfig } from './helpers/backgroundHelper'
import { PostProcessingConfig } from './helpers/postProcessingHelper'
import { SegmentationConfig } from './helpers/segmentationHelper'
import { SourcePlayback } from './helpers/sourceHelper'
import useRenderingPipeline from './hooks/useRenderingPipeline'
import { TFLite } from './hooks/useTFLite'
import '/public/tflite/tflite.js'
import '/public/tflite-simd.js'

type OutputViewerProps = {
  backgroundConfig: BackgroundConfig
  segmentationConfig: SegmentationConfig
  postProcessingConfig: PostProcessingConfig
  tflite: TFLite
}

function useBgReplace(
  props: OutputViewerProps,
  sourcePlayback: SourcePlayback | undefined
): [React.RefObject<HTMLCanvasElement>, React.RefObject<HTMLImageElement>] {
  const { pipeline, backgroundImageRef, canvasRef } = useRenderingPipeline(
    sourcePlayback,
    props.backgroundConfig,
    props.segmentationConfig,
    props.tflite
  )

  useEffect(() => {
    if (pipeline) {
      pipeline.updatePostProcessingConfig(props.postProcessingConfig)
    }
  }, [pipeline, props.postProcessingConfig])

  return [canvasRef, backgroundImageRef]
}

export default useBgReplace
