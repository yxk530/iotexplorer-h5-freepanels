import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '@custom/Icon';
import { TimePicker } from '@custom/TimePicker';
import { Cell } from '@custom/Cell';
import { Modal } from '@custom/Modal';
import { Btn as Button, BtnGroup } from '@custom/Btn';
import { Dropdown } from '@custom/DropDown';
import { DropdownRef } from 'antd-mobile/es/components/dropdown';

export const Detail = ({
  deviceData,
  doControlDeviceData,
  context: { switchNum },
  currentSwitch,
  currentMode,
  history: { PATH, push },
  timerHeight,
  isModal,
  isPopUp,
}) => {
  const ALL_COUNT = [
    ['count_down1', deviceData.name_button1 || '开关一'],
    ['count_down2', deviceData.name_button2 || '开关二'],
    ['count_down3', deviceData.name_button3 || '开关三'],
    ['count_down4', deviceData.name_button4 || '开关四'],
    ['count_down5', deviceData.name_button5 || '开关五'],
  ];
  const SWITCH = { OPEN: 1, CLOSE: 0 };
  const getStatusData = status => currentSwitch.filter(([key]) => deviceData[key] !== status);
  const [isChecked] = useState(false);
  const [checkedSwitch, setCheckedSwitch] = useState(ALL_COUNT[0][0]);
  const isAll = status => !getStatusData(status).length;
  const isAllOpen = isAll(SWITCH.OPEN);

  const [modalVisible, setModalVisible] = useState(false);

  const getSwitchData = (status) => {
    const res = {};
    currentSwitch.forEach(([key]) => (res[key] = status));
    return res;
  };

  interface DataProps {
    label: string;
    code?: string;
    value: number;
  }

  const initData = currentMode.map(([value, code, text]) => ({
    label: deviceData[code] || text,
    code: value,
    value: deviceData[value]?.mode ? 1 : 0,
  }));

  const [modeVisible, setModeVisible] = useState(false);
  const [currentName, setCurrentName] = useState(ALL_COUNT[0][1]);

  const [selected, setSelected] = useState(0);
  const [modeCache, setModeCache] = useState([]);

  // 倒计时
  const [visible, setVisible] = useState(false);

  const isOneSwitch = switchNum === 1;

  const getCountdownTime = () => {
    let res = [] as string[];
    const time = deviceData[checkedSwitch];
    if (time) {
      const hour = `${Math.floor(time / 3600)}`;
      const minute = `${Math.floor((time % 3600) / 60)}`;
      res = [hour, minute];
    }
    return res;
  };


  // 开启状态 并且存在倒计时记录
  const countdownTime = getCountdownTime();
  const onClick = () => doControlDeviceData(getSwitchData(SWITCH.OPEN));
  const offClick = () => doControlDeviceData(getSwitchData(SWITCH.CLOSE));

  const submitCountDown = ([hour, minute]) => {
    setVisible(false);
    const times = hour * 3600 + minute * 60;
    doControlDeviceData({ [checkedSwitch]: times });
  };

  const actions = [
    isOneSwitch
      ? null
      : [
        isAllOpen ? '全开' : '全关',
        'on',
        () => ({}),
        isAllOpen,
        isChecked => (isChecked ? onClick() : offClick()),
      ],
    [
      '转无线开关', '模式', () => {
        setModeVisible(true);
      },
    ],
    [
      '定时',
      'timing',
      push.bind(null, PATH.TIMER_LIST, { switchNum, isModule: true }),
    ],
    ['倒计时', 'count-down', setVisible.bind(null, true)],
  ].filter(v => v);

  const onRadioClick = (value) => {
    const data: DataProps[] = [...modeCache];
    data[selected].value = value;
    setModeCache(data);
  };

  const modeList = [{
    label: '常规模式',
    value: 0,
  }, {
    label: '转无线开关',
    value: 1,
  }];


  const options = currentMode.map(([value, code, text]) => ({ text: deviceData[code] || text, value }));
  const [selectNameSwitch, setSelectNameSwitch] = useState(0);

  const dropdownRef = useRef<DropdownRef>(null);
  const dropdownRefName = useRef<DropdownRef>(null);

  useEffect(() => {
    setModeCache(initData);
  }, [currentMode]);


  const counts = ALL_COUNT.slice(0, switchNum);

  const CustomNode = () => <div className="custom-switch">
    {
      counts.map(([name, label]) => <div key={name} className={checkedSwitch === name ? 'checked' : ''} onClick={setCheckedSwitch.bind(null, name)}>{label}</div>)
    }
  </div>;

  const saveName = () => {
    setModalVisible(false);
    const key = `name_button${selectNameSwitch + 1}`;
    const name = currentName || ALL_COUNT[selectNameSwitch]?.[1];
    doControlDeviceData({ [key]: name });
  };

  return (
    <div className={`detail  action action-${switchNum}`}>
      <div className="operator">
        <div className="operator-btn editor" onClick={() => setModalVisible(true)}>
          <Icon className="operator-icon" name="editor" size="normal" />
        </div>
        <div className="operator-btn setting"></div>
      </div>

      <div className="environment">
        {actions.map(([title, name, onClick, isChecked, onChange], index) => (
          <div className="box" key={index}>
            <div className="content">
              <div className="box-content">
                {/^[\u4e00-\u9fa5]+$/.test(name) ? <div className="title">{name}</div> : <Icon name={name} />}
                {/* <div className="link">
                  <div className="link-title">{title}</div>
                </div> */}
                <Cell
                  title={title}
                  onClick={onClick}
                  ele={onChange ? 'switch' : ''}
                  eleValue={isChecked}
                  onChange={onChange}
                  isLink={!onChange}
                  className="border"
                ></Cell>
              </div>
            </div>
          </div>
        ))}

        <TimePicker
          className="switch-timer-cloud"
          showSemicolon={false}
          value={countdownTime}
          showUnit={true}
          isModal={isModal}
          mask={false}
          showTime={false}
          itemHeight={58}
          isPopUp={isPopUp}
          height={timerHeight ? timerHeight : 175}
          showTwoDigit={true}
          title={`倒计时${isChecked ? '开启' : '关闭'}`}
          switchIsOpen={countdownTime.length ? isChecked : false}
          onCancel={setVisible.bind(null, false)}
          onConfirm={submitCountDown}
          confirmText="确认"
          visible={visible}
          customNode={<CustomNode />}
        // visible={true}
        />
      </div>

      <div className='custom-modal'>
        <Modal
          visible={modalVisible}
          className="edit-name-modal"
          title={<div className="cus-module-title">
            <span>修改名称</span>
            <div className="selector">
              <Dropdown className="custom-dropdown" ref={dropdownRefName}>
                <Dropdown.Item key='selector' title={options[selectNameSwitch]?.text} className="dropdown-items">
                  {
                    options.map((item, index) => <div className="item" key={item.text} onClick={() => {
                      setSelectNameSwitch(index);
                      setCurrentName(ALL_COUNT[index]?.[1]);
                      dropdownRefName.current?.close();
                    }}>
                      <div className="dw-check-item">
                        <span>{item.text}</span>
                        {
                          selectNameSwitch === index
                            ? <span><Icon className="operator-icon" name="drop-checked" size="small" /></span>
                            : null
                        }
                      </div>
                    </div>)
                  }
                </Dropdown.Item>
              </Dropdown>
            </div>
          </div>}
        >

          <input
            value={currentName}
            autoFocus
            className='edit-name-modal-input'
            placeholder='请输入名称'
            maxLength={16}
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
                  setModalVisible(false);
                  setCurrentName(ALL_COUNT[selectNameSwitch]?.[1]);
                }}
              >
                取消
              </Button>
              <Button
                className="btn-save"
                onClick={saveName}
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
        // title='模式'
        >
          <div className="modal-title">
            <div className="title">模式</div>
            <div className="selector">
              <Dropdown className="custom-dropdown" ref={dropdownRef}>
                <Dropdown.Item key='selector' title={modeCache[selected]?.label} className="dropdown-items">
                  {options.map((item, index) => <div className="item" key={index} onClick={() => {
                    setSelected(index);
                    dropdownRef.current?.close();
                  }}>{item.text}</div>)}
                </Dropdown.Item>
              </Dropdown>
            </div>
          </div>
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
                  checked={modeCache[selected]?.value === item.value}
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
                  setSelected(0);
                  setModeCache(initData);
                  setModeVisible(false);
                }}
              >
                取消
              </Button>
              <Button
                className="btn-save"
                onClick={() => {
                  const obj = {};
                  modeCache.forEach((item) => {
                    obj[item.code] = { mode: item.value };
                  });
                  doControlDeviceData(obj);
                  setSelected(0);
                  setModeVisible(false);
                }}
              >
                确定
              </Button>

            </BtnGroup>
          </div>

        </Modal>
      </div>
    </div >
  );
};
