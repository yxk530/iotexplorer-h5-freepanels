import React, { useEffect, useState } from 'react';
import { Icon } from '@custom/Icon';
import { TimePicker } from '@custom/TimePicker';
import { Cell } from '@custom/Cell';
import { Modal } from '@custom/Modal';
import { Btn as Button, BtnGroup } from '@custom/Btn';

const defaultIconName = {
  editor: 'editor',
  setting: 'setting',
  timing: 'timing',
  ['count-down']: 'count-down',
  mode: 'mode',
};

const onIconName = {
  editor: 'editor-on',
  setting: 'setting-on',
  timing: 'timing-on',
  ['count-down']: 'count-down-on',
  mode: 'mode-on',
};

export const Detail = ({
  currentItem,
  currentIndex,
  deviceData,
  doControlDeviceData,
  context: { switchNum },
  currentSwitch,
  history: { PATH, push },
  isModal,
  isPopUp,
  goMore
}) => {
  const SWITCH = { OPEN: 1, CLOSE: 0 };
  const [switchName, modeName, btnName, ] = currentItem;
  const getStatusData = status => currentSwitch.filter(([key]) => deviceData[key] !== status);
  const [isChecked, setChecked] = useState(false);
  const isAll = status => !getStatusData(status).length;
  const isAllOpen = isAll(SWITCH.OPEN);
  const isAllClose = isAll(SWITCH.CLOSE);
  const getSwitchData = (status) => {
    const res = {};
    currentSwitch.forEach(([key]) => (res[key] = status));
    return res;
  };
  // 倒计时
  const [visible, setVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentName, setCurrentName] = useState('');

  const [modeVisible, setModeVisible] = useState(false);
  const [radioData, setRadioData] = useState(0);
  const [iconName, setIconName] = useState(defaultIconName);

  useEffect(() => {
    setCurrentName(deviceData[btnName] || currentSwitch[currentIndex][1]);
    setRadioData(!deviceData[modeName]?.mode ? 0 : 1);

  }, [currentItem]);

  useEffect(() => {
    setIconName((!!deviceData[switchName] || !!deviceData['power_switch']) ? onIconName : defaultIconName);
  }, [deviceData[switchName]]);

  const isOneSwitch = switchNum === 1;

  const getCountdownTime = () => {
    if (isAllClose) return [];
    let res = [] as string[];
    currentSwitch.forEach(([key]) => {
      if (deviceData[key] === SWITCH.OPEN) {
        const countdownKey = key.replace('switch', 'count_down');
        const time = deviceData[countdownKey];
        if (time) {
          const hour = `${Math.floor(time / 3600)}`;
          const minute = `${Math.floor((time % 3600) / 60)}`;
          res = [hour, minute];
        }
      }
    });
    return res;
  };

  // 开启状态 并且存在倒计时记录
  const countdownTime = getCountdownTime();
  const onClick = () => doControlDeviceData(getSwitchData(SWITCH.OPEN));
  const offClick = () => doControlDeviceData(getSwitchData(SWITCH.CLOSE));

  const submitCountDown = ([hour, minute], isChecked) => {
    setVisible(false);
    setChecked(isChecked);
    const times = hour * 3600 + minute * 60;
    const openSwitch = getStatusData(SWITCH.CLOSE);
    if (!openSwitch.length) return;
    const countDownData = {};
    openSwitch.forEach(([key]) => {
      countDownData[key.replace('switch', 'count_down')] = times;
    });
    doControlDeviceData(countDownData);
  };

  const actions = [
    // isOneSwitch
    //   ? null
    //   : [
    //     isAllOpen ? '全开' : '全关',
    //     'on',
    //     () => ({}),
    //     isAllOpen,
    //     isChecked => (isChecked ? onClick() : offClick()),
    //   ],
    [
      '定时',
      'timing',
      push.bind(null, PATH.TIMER_LIST, { switchNum, isModule: true }),
    ],
    ['倒计时', 'count-down', setVisible.bind(null, true)],
    ['模式', 'mode', setModeVisible.bind(null, true)],
  ].filter(v => v);

  const onRadioClick = (value) => {
    setRadioData(value);
  };

  const modeList = [{
    label: '常规模式',
    value: 0,
  }, {
    label: '转无线开关',
    value: 1,
  }];
  return (
    <div className={`detail action action-${1} ${!deviceData[switchName] ? '' : 'on'}`}>
      <div className="operator">
        <div className="operator-btn editor" onClick={() => {
          if (!iconName.editor.includes('-on')) {
            return;
          }
          setModalVisible(true)
        }}>
          <Icon className="operator-icon" name={iconName.editor} size="large" />
          <div className="operator-label">修改名称</div>
        </div>
        <div className="operator-btn setting" onClick={() => {
          if (!iconName.setting.includes('-on')) {
            return;
          }
          goMore();
        }}>
          <Icon className="operator-icon" name={iconName.setting} size="large" />
          <div className="operator-label">设置</div>
        </div>
      </div>
      <div className="environment">
        {actions.map((item, index) => {
          const [title, name, onClick] = [...item];
          return (
            <div className="box" key={index} onClick={() => {
              if (!iconName[name].includes('-on')) {
                return;
              }
              onClick()
            }}>
              <div className="content">
                <div className="box-content">
                  <Icon name={iconName[name]} />
                  <Cell
                    title={title}
                    className="border"
                    onClick={() => {
                      if (!iconName[name].includes('-on')) {
                        return;
                      }
                      onClick()
                    }}
                  ></Cell>
                </div>
              </div>
            </div>
          );
        })}
        {/* <div className="switch-btn" onClick={() => {
          currentSwitch.forEach(item => {
            const [key] = [...item];
            !deviceData[key] ? onClick() : offClick();
          })
        }}>
          <Icon name="switch" />
        </div> */}
        {/* <Cell
          prefixIcon={<Icon name="mode"></Icon>}
          title={'模式选择'}
          subTitle={!deviceData?.mode_swtch1?.mode ? '常规' : '无线'}
          onClick={() => setModeVisible(true)}
          className="modeBtn"
        ></Cell> */}
      </div>
      <TimePicker
        className="switch-timer-cloud"
        showSemicolon={false}
        value={countdownTime}
        showUnit={true}
        mask={false}
        showTime={false}
        itemHeight={58}
        height={175}
        isModal={isModal}
        isPopUp={isPopUp}
        showTwoDigit={true}
        title={`倒计时${isChecked ? '开启' : '关闭'}`}
        switchIsOpen={countdownTime.length ? isChecked : false}
        onCancel={setVisible.bind(null, false)}
        onConfirm={submitCountDown}
        confirmText="确认"
        visible={visible}
      // visible={true}
      />
      <div className='custom-modal'>
        <Modal
          visible={modalVisible}
          title='修改名称'
        >
          <input
            value={currentName}
            autoFocus
            className='edit-name-modal'
            placeholder='请输入名称'
            onChange={(event) => {
              setCurrentName(event.currentTarget.value);
            }}
          />
          <div className='modal-footer'>
            <BtnGroup
              layout='flex'
            >
              <Button
                className="btn-cancel"
                onClick={() => {
                  setCurrentName(deviceData[btnName]);
                  setModalVisible(false);
                }}
              >
                取消
              </Button>
              <Button
                className="btn-save"
                onClick={() => {
                  currentName && doControlDeviceData(btnName, currentName);
                  setModalVisible(false);
                }}
              >
                确定
              </Button>

            </BtnGroup>
          </div>
        </Modal>
      </div>

      <div className='custom-modal'>
        <Modal
          visible={modeVisible}
          title='模式'
        >
          <div className="custom-radio">
            {modeList.map((item, index) => (
              <label
                className="radio-item"
                htmlFor={`label-${item.value}`}
                key={index}
                onClick={() => {
                  onRadioClick(item.value);
                }}>
                <input
                  className="radio-item-radio"
                  type="radio"
                  id={`label-${item.value}`}
                  name="mode"
                  checked={radioData === item.value}
                />
                <span className="radio-item-label">{item.label}</span>
              </label>
            ))}
          </div>

          <div className='modal-footer'>
            <BtnGroup
              layout='flex'
            >
              <Button
                className="btn-cancel"
                onClick={() => {
                  setRadioData(!deviceData[modeName]?.mode ? 0 : 1);
                  setModeVisible(false);
                }}
              >
                取消
              </Button>
              <Button
                className="btn-save"
                onClick={() => {
                  let obj = {};
                  obj[modeName] = {mode: radioData}
                  doControlDeviceData(obj);
                  setModeVisible(false);
                }}
              >
                确定
              </Button>

            </BtnGroup>
          </div>
        </Modal>
      </div>
    </div>
  );
};
