import Peer, { MediaConnection } from 'peerjs';
import { connIdMap } from './use-peer';
import { useCallback, useEffect, useRef } from 'react';
import {
  addReport,
  diffReport,
  getEmptyReport,
  getNetworkReportContext,
  genRtcStatus,
} from '../utils/report';
import useGlobalStore from '@/context/global-context';
import { getNewRtcStatus } from '@/context/global-context/init-state';

export function usePeerStateReport(peer: Peer | null) {
  const reportContext = useRef(getEmptyReport());

  const reportStatus = useCallback(async (peer: Peer) => {
    const connectionIds = [...connIdMap]
      .map(([muid, connIds]) => [
        { muid: muid, streamId: connIds?.mediaStream, type: 'media' },
        { muid: muid, streamId: connIds?.screenStream, type: 'screen' },
      ])
      .flat(1)
      .filter((d) => d.streamId && d.muid);

    const reportsPromises = connectionIds.map(
      async ({ muid, streamId, type }) => {
        const connection = peer.getConnection(
          muid,
          streamId!
        ) as MediaConnection;
        if (!connection?.peerConnection) return Promise.resolve(false);
        const state = await connection.peerConnection?.getStats();

        const networkReportContext = getNetworkReportContext(
          state,
          type as 'media' | 'screen'
        );

        return {
          ...networkReportContext,
          lastGenerateTime: Date.now(),
        };
      }
    );
    const allReports = (await Promise.all(reportsPromises)).filter(
      Boolean
    ) as ReportContext[];

    const mediaReportLen = allReports.filter((r) => r.type === 'media').length;
    const screenReportLen = allReports.filter(
      (r) => r.type === 'screen'
    ).length;

    const combinedReport = allReports.reduce(addReport, getEmptyReport());
    const deltaReport = diffReport(combinedReport, reportContext.current);
    reportContext.current = combinedReport;

    const rtcStatus = genRtcStatus(
      deltaReport,
      mediaReportLen,
      screenReportLen
    );
    useGlobalStore.setState((v) => ({
      ...v,
      rtcStatus,
    }));
  }, []);

  useEffect(() => {
    if (!peer) return;
    const timer = setInterval(() => reportStatus(peer), 2000);
    return () => {
      clearInterval(timer);
    };
  }, [peer, reportStatus]);

  useEffect(() => {
    return () => {
      useGlobalStore.setState((v) => ({
        ...v,
        rtcStatus: getNewRtcStatus(),
      }));
    };
  }, [peer]);
}
