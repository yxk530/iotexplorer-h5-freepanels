import React, { useState } from 'react';
import classNames from 'classnames';
import sdk from 'qcloud-iotexplorer-h5-panel-sdk';
import { BizSwitch } from '@components/business';
import { Detail } from './detail/detail';
import './home.less';
import { onControlDevice } from '@hooks/useDeviceData';
import {getThemeType} from "@libs/theme";

import SettingImage from '../icons/normal/dev-open.svg';
import SettingImageBlueWhite from '../icons/blue-white/dev-open.svg';
import SettingImageColorful from '../icons/colorful/dev-open.svg';

export function Home() {
  const themeType = getThemeType();
  const [enterFlag, setEnterFlag] = useState(false);
  const [enterFlagTwo, setEnterFlagTwo] = useState(false);
  const [enterFlagThree, setEnterFlagThree] = useState(false);
  const [enterFlagFour, setEnterFlagFour] = useState(false);
  const settingImageSrc = () => {
    switch (themeType) {
      case 'normal':
        return SettingImage;
      case 'blueWhite':
        return SettingImageBlueWhite;
      case 'dark':
        return SettingImageBlueWhite;
      case 'colorful':
        return SettingImageColorful;
      case 'morandi':
        return SettingImageBlueWhite;
      default:
        return SettingImage;
    }
  };
  const handleSetting = () => {
    sdk.goDeviceDetailPage({});
  };
  return (
    <article className={classNames('home')}>
      {/* 开关*/}
      <section className={classNames('dashboard')}>
        <div
          className={classNames('devSetting', 'dev-setting-open')}
          onClick={handleSetting}
        >
          <img src={settingImageSrc()} alt="" />
        </div>
        <div className="switch-top">
          <BizSwitch
            name="开关1"
            value={sdk.deviceData.switch_1 === 1}
            onInitChange={(value) => {
              setEnterFlag(value);
            }}
            onChange={(value) => {
              if (enterFlag) {
                onControlDevice('switch_1', value ? 1 : 0);
              }
            }}
          />
          <BizSwitch
            name="开关2"
            value={sdk.deviceData.switch_2 === 1}
            onInitChange={(value) => {
              setEnterFlagTwo(value);
            }}
            onChange={(value) => {
              if (enterFlagTwo) {
                onControlDevice('switch_2', value ? 1 : 0);
              }
            }}
          />
        </div>
        <div className="switch-bottom">
          <BizSwitch
            name="开关3"
            value={sdk.deviceData.switch_3 === 1}
            onInitChange={(value) => {
              setEnterFlagThree(value);
            }}
            onChange={(value) => {
              if (enterFlagThree) {
                onControlDevice('switch_3', value ? 1 : 0);
              }
            }}
          />
          <BizSwitch
            name="开关4"
            value={sdk.deviceData.switch_4 === 1}
            onInitChange={(value) => {
              setEnterFlagFour(value);
            }}
            onChange={(value) => {
              if (enterFlagFour) {
                onControlDevice('switch_4', value ? 1 : 0);
              }
            }}
          />
        </div>
      </section>
      {/* 详情区域*/}
      <Detail />
    </article>
  );
}
