import { getNewRtcStatus } from '@/context/global-context/init-state';

// operation

export const getEmptyReport = (): ReportContext => ({
  type: 'media',
  lastGenerateTime: 0,
  screenByteReceived: 0,
  screenByteSent: 0,
  mediaByteReceived: 0,
  mediaByteSent: 0,
  audioByteReceived: 0,
  audioByteSent: 0,
  packageReceived: 0,
  receivedPackageLost: 0,
  delay: 0,
  maxResolutionSend: '0x0',
  maxResolutionRecv: '0x0',
  screenResolutionSend: '0x0',
  screenResolutionRecv: '0x0',
  mediaSendFrameRate: 0,
  mediaRecvFrameRate: 0,
  screenSendFrameRate: 0,
  screenRecvFrameRate: 0,
});

export const addReport = (
  oldReport: ReportContext,
  newReport: ReportContext
): ReportContext => ({
  ...newReport,
  lastGenerateTime: Date.now(),
  screenByteReceived:
    newReport.screenByteReceived + oldReport.screenByteReceived,
  screenByteSent: newReport.screenByteSent + oldReport.screenByteSent,
  mediaByteReceived: newReport.mediaByteReceived + oldReport.mediaByteReceived,
  mediaByteSent: newReport.mediaByteSent + oldReport.mediaByteSent,
  audioByteReceived: newReport.audioByteReceived + oldReport.audioByteReceived,
  audioByteSent: newReport.audioByteSent + oldReport.audioByteSent,
  receivedPackageLost:
    newReport.receivedPackageLost + oldReport.receivedPackageLost,
  delay: newReport.delay + oldReport.delay,
  packageReceived: newReport.packageReceived + oldReport.packageReceived,
  maxResolutionSend: getMaxResolution(
    oldReport.maxResolutionSend,
    newReport.maxResolutionSend
  ),
  maxResolutionRecv: getMaxResolution(
    oldReport.maxResolutionRecv,
    newReport.maxResolutionRecv
  ),
  mediaRecvFrameRate:
    newReport.mediaRecvFrameRate + oldReport.mediaRecvFrameRate,
  mediaSendFrameRate:
    newReport.mediaSendFrameRate + oldReport.mediaSendFrameRate,
  screenRecvFrameRate:
    newReport.screenRecvFrameRate + oldReport.screenRecvFrameRate,
  screenSendFrameRate:
    newReport.screenSendFrameRate + oldReport.screenSendFrameRate,
});

export const diffReport = (
  newReport: ReportContext,
  oldReport: ReportContext
): ReportContext => ({
  ...newReport,
  lastGenerateTime: newReport.lastGenerateTime - oldReport.lastGenerateTime,
  screenByteReceived:
    newReport.screenByteReceived - oldReport.screenByteReceived,
  screenByteSent: newReport.screenByteSent - oldReport.screenByteSent,
  mediaByteReceived: newReport.mediaByteReceived - oldReport.mediaByteReceived,
  mediaByteSent: newReport.mediaByteSent - oldReport.mediaByteSent,
  audioByteReceived: newReport.audioByteReceived - oldReport.audioByteReceived,
  audioByteSent: newReport.audioByteSent - oldReport.audioByteSent,
  receivedPackageLost:
    newReport.receivedPackageLost - oldReport.receivedPackageLost,
  delay: newReport.delay - 0,
  packageReceived: newReport.packageReceived - oldReport.packageReceived,
});

// formate

const getMaxResolution = (oldRes: string, newRes: string) => {
  const [oldWidth, oldHeight] = oldRes.split('x').map(Number);
  const [newWidth, newHeight] = newRes.split('x').map(Number);
  return newWidth * newHeight > oldWidth * oldHeight ? newRes : oldRes;
};

function formateNetworkSpeedFbps(v: number) {
  if (Number.isNaN(v)) return '- bps';

  let speed = v;
  const suffixs = ['bps', 'kbps', 'Mbps', 'Gbps'];

  const suffix = suffixs.find((v) => {
    if (speed < 1000 || suffixs.at(-1) === v) return true;
    speed /= 1000;
  });

  return `${speed.toFixed(2)} ${suffix}`;
}

function formateRate(v: number) {
  if (Number.isNaN(v)) return '- %';
  return `${(v * 100).toFixed(2)} %`;
}

function formateFps(v: number) {
  if (Number.isNaN(v)) return '- fps';
  return `${v.toFixed(2)} fps`;
}

function formateRevolution(v: string) {
  const [width, height] = v.split('x').map(Number);
  if (!width || !height) return `-`;
  return v;
}

function formateTimeFms(v: number) {
  if (Number.isNaN(v)) return '- ms';

  let time = v;
  const suffixs = ['ms', 's'];

  const suffix = suffixs.find((v) => {
    if (time < 1000 || v === suffixs.at(-1)) return true;
    time /= 1000;
  });

  return `${time.toFixed(2)} ${suffix}`;
}

// export

export function genRtcStatus(
  deltaReport: ReportContext,
  mediaReportLen: number,
  screenReportLen: number
): MeetingRTCStatus[] {
  const [
    networkStatus,
    audioStatus,
    videoStatus,
    screenStatus,
  ]: MeetingRTCStatus[] = getNewRtcStatus();
  const timePast = deltaReport.lastGenerateTime / 1000;

  audioStatus.Bitrate = {
    upload: formateNetworkSpeedFbps(deltaReport.audioByteSent / timePast),
    download: formateNetworkSpeedFbps(deltaReport.audioByteReceived / timePast),
  };

  screenStatus.Bitrate = {
    upload: formateNetworkSpeedFbps(deltaReport.screenByteSent / timePast),
    download: formateNetworkSpeedFbps(
      deltaReport.screenByteReceived / timePast
    ),
  };

  videoStatus.Bitrate = {
    upload: formateNetworkSpeedFbps(deltaReport.mediaByteSent / timePast),
    download: formateNetworkSpeedFbps(deltaReport.mediaByteReceived / timePast),
  };

  networkStatus.Bandwidth = {
    upload: formateNetworkSpeedFbps(
      (8 *
        (deltaReport.screenByteSent +
          deltaReport.mediaByteSent +
          deltaReport.audioByteSent)) /
        timePast
    ),
    download: formateNetworkSpeedFbps(
      (8 *
        (deltaReport.screenByteReceived +
          deltaReport.mediaByteReceived +
          deltaReport.audioByteReceived)) /
        timePast
    ),
  };
  networkStatus.PackageLost = {
    value: formateRate(
      deltaReport.receivedPackageLost /
        (deltaReport.packageReceived + deltaReport.receivedPackageLost)
    ),
  };

  networkStatus.Delay = {
    value: formateTimeFms(
      (1000 * deltaReport.delay) / (mediaReportLen + screenReportLen)
    ),
  };

  videoStatus.Resolution = {
    upload: formateRevolution(deltaReport.maxResolutionSend),
    download: formateRevolution(deltaReport.maxResolutionRecv),
  };

  videoStatus.Framerate = {
    upload: formateFps(deltaReport.mediaSendFrameRate / mediaReportLen),
    download: formateFps(deltaReport.mediaRecvFrameRate / mediaReportLen),
  };

  screenStatus.Resolution = {
    upload: formateRevolution(deltaReport.screenResolutionSend),
    download: formateRevolution(deltaReport.screenResolutionRecv),
  };

  screenStatus.Framerate = {
    upload: formateFps(deltaReport.screenSendFrameRate / screenReportLen),
    download: formateFps(deltaReport.screenRecvFrameRate / screenReportLen),
  };

  return [networkStatus, audioStatus, videoStatus, screenStatus];
}

// work with rtc stats

export function getNetworkReportContext(
  states: RTCStatsReport,
  type: 'media' | 'screen'
) {
  const repo = getEmptyReport();
  repo.type = type;

  states.forEach((report) => {
    if (report.type === 'inbound-rtp') {
      repo.receivedPackageLost += report.packetsLost;
      repo.packageReceived += report.packetsReceived;
      if (report.mediaType === 'video') {
        if (type === 'media') {
          repo.maxResolutionRecv = getMaxResolution(
            repo.maxResolutionRecv,
            `${report.frameWidth}x${report.frameHeight}`
          );
          repo.mediaRecvFrameRate += report.framesPerSecond;
          repo.mediaByteReceived += report.bytesReceived;
        }
        if (type === 'screen') {
          repo.screenResolutionRecv = `${report.frameWidth}x${report.frameHeight}`;
          repo.screenRecvFrameRate += report.framesPerSecond;
          repo.screenByteReceived += report.bytesReceived;
        }
      }
      if (report.mediaType === 'audio') {
        repo.audioByteReceived += report.bytesReceived;
      }
    } else if (report.type === 'outbound-rtp') {
      if (report.mediaType === 'video') {
        if (type === 'media') {
          repo.maxResolutionSend = getMaxResolution(
            repo.maxResolutionSend,
            `${report.frameWidth}x${report.frameHeight}`
          );
          repo.mediaSendFrameRate += report.framesPerSecond;
          repo.mediaByteSent += report.bytesSent;
        }
        if (type === 'screen') {
          repo.screenResolutionSend = `${report.frameWidth || 0}x${report.frameHeight || 0}`;
          repo.screenSendFrameRate += report.framesPerSecond;
          repo.screenByteSent += report.bytesSent;
        }
      }
      if (report.mediaType === 'audio') {
        repo.audioByteSent += report.bytesSent;
      }
    } else if (report.type === 'candidate-pair') {
      repo.delay += report.currentRoundTripTime;
    }
  });

  return repo;
}
