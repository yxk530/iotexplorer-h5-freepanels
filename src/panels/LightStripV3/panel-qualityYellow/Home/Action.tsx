import React, { useRef } from 'react';
import { Icon } from '@custom/Icon';
import { Cell } from '@custom/Cell';
import { CountDown } from '../../Common/CountDown';

const Action = (props) => {
  const {
    deviceData: { switch_led, count_down },
    history: { PATH, push },
    timer: { isExistTimer },
    doControlDeviceData,
  } = { ...props }
  const onSwitchChange = () => {
    doControlDeviceData({ switch_led: switch_led ? 0 : 1 });
  };

  const countRef = useRef(null);
  const isSwitchOff = switch_led !== 1;
  const actionCls = isSwitchOff ? 'action-off' : '';

  const actions = [
    // [
    //   '总控开关',
    //   isSwitchOff ? '关闭' : '开启',
    //   onSwitchChange,
    //   !!switch_led,
    //   'switch'
    // ],
    [
      '定时器',
      isSwitchOff ? 'timing' : 'timing-checked',
      !!count_down ? push.bind(null, PATH.TIMER_COUNTDOWNPAGE, { isModule: true }) : () => { countRef.current.onOpen() },
      isExistTimer,
      ''
    ],
  ];

  const getCountdownTime = (value) => {
    if (value) {
      const hour = `${Math.floor(value / 3600)}`;
      const minute = `${Math.floor((value % 3600) / 60)}`;
      const second = `${Math.floor((value % 3600) % 60)}`;
      return [hour, minute, second];
    }
    return ['00', '00', '00'];
  };
  const countdownTime = getCountdownTime(count_down).map((v: string) => (parseInt(v, 10) < 10 ? `0${parseInt(v, 10)}` : v));

  return (
    <>
      <div className={`action action-off ${count_down ? 'count-down': ''}`}>
        {count_down ? <div className="count-down-module">
          <div className="title">重置</div>
          <div className="time">
            <span className="num">{countdownTime[0]}</span>
            <span>时 </span>
            <span className="num">{countdownTime[1]}</span>
            <span>分 </span>
            <span className="num">{countdownTime[2]}</span>
            <span>秒 </span>
          </div>
          <div 
            className="rest-btn"
            onClick={() => {
              doControlDeviceData({ count_down: 0 });
            }}
            >重置</div>
        </div> : null}
        {actions.map(([label, name, onClick, isChecked, ele], index) => (
          <div
            key={name}
            className={`action-item  ${isChecked ? 'checked' : ''} action-item-${index + 1
              }`}
            onClick={onClick}
          >
            <div className={`action-ele action-ele-${index}`}>
              {/* <div>{label}</div> */}
              {/* <Icon name={name} /> */}
              <div>{`+${label}`}</div>
            </div>
          </div>
        ))}
      </div>
      <CountDown
        ref={countRef}
        {...props}
        isModal={true}
        isPopUp={false}
        isJumpRoute={false}
      />
    </>

  );
};

export default Action;
