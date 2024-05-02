import { BackgroundConfig } from '@/hooks/use-background-replace/helpers/backgroundHelper';
import bg1 from '/background/1.jpg';
import bg2 from '/background/2.jpg';
import bg3 from '/background/3.jpg';
import bg4 from '/background/4.jpg';
import bg5 from '/background/5.jpg';
import bg6 from '/background/6.jpg';
import bg7 from '/background/7.jpg';
import bg8 from '/background/8.jpg';

export const videoBackgrounds = [bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8];

export const getVideoBackgroundConfig = (index: number):BackgroundConfig => {
  return index < 2
    ? {
        type: index === 0 ? 'none' : 'blur',
      }
    : {
        type: 'image',
        url: videoBackgrounds[index - 1],
      };
};
