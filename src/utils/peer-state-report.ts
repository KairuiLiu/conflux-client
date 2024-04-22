import Peer, { MediaConnection } from 'peerjs';
import { connIdMap } from './use-peer';
import { useEffect, useState } from 'react';
import {
  addReport,
  diffReport,
  emptyReport,
  getNetworkReportContext,
  getRtcStatus,
} from './report';
import useGlobalStore from '@/context/global-context';
import { getNewRtcStatus } from '@/context/global-context/init-state';

export function usePeerStateReport(peer: Peer | null) {
  const [reportContext, setReportContext] =
    useState<ReportContext>(emptyReport);

  async function reportStatus(peer: Peer) {
    const connectionIds = [...connIdMap]
      .map(([muid, connIds]) => [
        { muid: muid, streamId: connIds?.mediaStream },
        { muid: muid, streamId: connIds?.screenStream },
      ])
      .flat(1)
      .filter((d) => d.streamId && d.muid);

    const reportsPromises = connectionIds.map(async ({ muid, streamId }) => {
      const connection = peer.getConnection(muid, streamId!) as MediaConnection;
      if (connection.peerConnection === null) return Promise.resolve(false);
      const state = await connection.peerConnection?.getStats();

      const networkReportContext = getNetworkReportContext(state);

      return {
        lastGenerateTime: Date.now(),
        ...networkReportContext,
      };
    });
    const allReports = (await Promise.all(reportsPromises)).filter(
      Boolean
    ) as ReportContext[];

    const combinedReport = allReports.reduce(addReport, emptyReport);
    const deltaReport = diffReport(combinedReport, reportContext);
    setReportContext(combinedReport);

    const rtcStatus = getRtcStatus(deltaReport, allReports.length);
    useGlobalStore.setState((v) => ({
      ...v,
      rtcStatus,
    }));
  }

  useEffect(() => {
    if (!peer) return;
    const timer = setInterval(() => reportStatus(peer), 2000);
    return () => {
      clearInterval(timer);
      useGlobalStore.setState((v) => ({
        ...v,
        rtcStatus: getNewRtcStatus(),
      }));
    };
  }, [peer, reportContext]);
}
