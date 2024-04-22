import { getNewRtcStatus } from '@/context/global-context/init-state';

export const emptyReport: ReportContext = {
  lastGenerateTime: 0,
  byteReceived: 0,
  byteSent: 0,
  sentpackageLost: 0,
  receivedPackageLost: 0,
  delay: 0,
};

export const addReport = (
  oldReport: ReportContext,
  newReport: ReportContext
): ReportContext => ({
  lastGenerateTime: Date.now(),
  byteReceived: newReport.byteReceived + oldReport.byteReceived,
  byteSent: newReport.byteSent + oldReport.byteSent,
  sentpackageLost: newReport.sentpackageLost + oldReport.sentpackageLost,
  receivedPackageLost:
    newReport.receivedPackageLost + oldReport.receivedPackageLost,
  delay: newReport.delay + oldReport.delay,
});

export const diffReport = (
  newReport: ReportContext,
  oldReport: ReportContext
): ReportContext => ({
  lastGenerateTime: newReport.lastGenerateTime - oldReport.lastGenerateTime,
  byteReceived: newReport.byteReceived - oldReport.byteReceived,
  byteSent: newReport.byteSent - oldReport.byteSent,
  sentpackageLost: newReport.sentpackageLost - oldReport.sentpackageLost,
  receivedPackageLost:
    newReport.receivedPackageLost - oldReport.receivedPackageLost,
  delay: newReport.delay - 0,
});

function getNetworkSpeed(v: number) {
  let speed = v;
  const suffixs = ['bps', 'kbps', 'Mbps', 'Gbps'];

  const suffix = suffixs.find((v) => {
    if (speed < 1000 || suffixs.at(-1) === v) return true;
    speed /= 1000;
  });

  return `${speed.toFixed(2)} ${suffix}`;
}

function getRate(v: number) {
  return `${v.toFixed(2)} %`;
}

function getTime(v: number) {
  let time = v;
  const suffixs = ['ms', 's'];

  const suffix = suffixs.find((v) => {
    if (time < 1000 || v === suffixs.at(-1)) return true;
    time /= 1000;
  });

  return `${time.toFixed(2)} ${suffix}`;
}

export function getRtcStatus(
  deltaReport: ReportContext,
  connectLen: number
): MeetingRTCStatus[] {
  const [
    networkStatus,
    // audioStatus,
    // videoStatus,
    // screenStatus,
  ]: MeetingRTCStatus[] = getNewRtcStatus();
  const timePast = deltaReport.lastGenerateTime / 1000;
  if (timePast === 0) console.log(deltaReport, connectLen);

  networkStatus.Bandwidth = {
    upload: getNetworkSpeed(timePast ? deltaReport.byteSent / timePast : 0),
    download: getNetworkSpeed(
      timePast ? deltaReport.byteReceived / timePast : 0
    ),
  };
  networkStatus.PackageLost = {
    upload: getRate(deltaReport.sentpackageLost),
    download: getRate(deltaReport.receivedPackageLost),
  };
  networkStatus.Delay = {
    value: getTime(connectLen ? deltaReport.delay / connectLen : 0),
  };

  return [
    networkStatus,
    // audioStatus,
    // videoStatus,
    // screenStatus,
  ];
}

export function getNetworkReportContext(states: RTCStatsReport) {
  const networkReport = {
    byteReceived: 0,
    byteSent: 0,
    sentpackageLost: 0,
    receivedPackageLost: 0,
    delay: 0,
  };

  states.forEach((report) => {
    if (report.type === 'inbound-rtp') {
      networkReport.byteReceived += report.bytesReceived;
      networkReport.receivedPackageLost += report.packetsLost;
    } else if (report.type === 'outbound-rtp') {
      networkReport.byteSent += report.bytesSent;
      networkReport.sentpackageLost += report.packetsLost;
    } else if (report.type === 'candidate-pair') {
      networkReport.delay += report.currentRoundTripTime;
    }
  });

  return networkReport;
}
