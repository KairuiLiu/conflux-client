import FloatPanelLayout from '@/layout/float-panel-layout';
import SettingPanel from './setting-panel';
import { useNavigate } from 'react-router-dom';

export default function Setting() {
  const history = useNavigate();
  return (
    <FloatPanelLayout>
      <SettingPanel
        handleClose={() => {
          history(-1);
        }}
      />
    </FloatPanelLayout>
  );
}
