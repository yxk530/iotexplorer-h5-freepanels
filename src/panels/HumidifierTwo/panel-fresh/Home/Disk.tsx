/*
 * @Description: 加湿器-表盘
 */
import React, { useEffect } from 'react';
import classNames from 'classnames';

export interface DashboardProps {
  status: boolean;// 启用/停用
  width?: number;
  height?: number;
  startAngle?: number;// 起始角度。采用角度制
  endAngle?: number;// 终止角度
  step?: number;// 间隔角度
  lines?: Array<LineProps>;
  minValue?: number;
  maxValue?: number;
  value?: number;
  scaleLineColor?: string;
  progressColor?: string;
}

// 刻度线属性
export interface LineProps {
  angle: number;
  className: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity?: number;
}

export function Disk(props: DashboardProps) {
  const {
    status = true,
    width = 300,
    height = 300,
    startAngle = 130, // 开始角度
    endAngle = 410, // 终止角度
    step = 4, // 间隔角度
    lines = [],
    minValue = 0,
    maxValue = 100,
    value = 0,
  } = props;
  // 开屏动画定时器
  let interval: NodeJS.Timer;

  useEffect(() => {
    const tickAnimation = () => {
      if (value > 0) {
        const r1 = (width / 2);
        const indicator = document.getElementById('indicator') as HTMLUnknownElement;
        let startIndex = 0;
        interval = setInterval(() => {
          startIndex += 2;
          const percent = startIndex / (maxValue - minValue);
          const angle = 280 * percent + 130;
          const x: number = r1 + (r1 - 13) * Math.cos((angle * Math.PI) / 180);
          const y: number = r1 + (r1 - 13) * Math.sin((angle * Math.PI) / 180);
          indicator.setAttribute('cx', x.toString());
          indicator.setAttribute('cy', y.toString());

          if (startIndex >= value) {
            clearInterval(interval);
          }
        }, 60);
      }
    };
    tickAnimation();
  }, []);

  // 当前角度
  const currentAngle = (() => {
    // 进度
    const progress = value / (maxValue - minValue);
    const range = endAngle - startAngle;
    let angle = range * progress + startAngle;
    if (angle < startAngle) {
      angle = startAngle;
    }
    if (angle > endAngle) {
      angle = endAngle;
    }
    return angle;
  })();

  const lineArray = () => {
    // 半径
    const r1 = width / 2;
    // 半径2
    const r2 = r1 - 9;

    // 遍历角度，算出每条刻度线的起始坐标和终止坐标。
    for (let i = startAngle; i <= endAngle; i += step) {
      const x = r1 + (r1 - 20) * Math.cos((i * Math.PI) / 180);
      const y = r1 + (r1 - 20) * Math.sin((i * Math.PI) / 180);

      const x2 = r1 + (r2 - 20) * Math.cos((i * Math.PI) / 180);
      const y2 = r1 + (r2 - 20) * Math.sin((i * Math.PI) / 180);

      lines.push({
        angle: i,
        className: i <= currentAngle ? 'line activeLine' : 'line defaultLine',
        x1: x,
        y1: y,
        x2,
        y2,
        opacity: status ? 1 : 0.5,
      });
    }

    return lines;
  };

  // 绘制刻度线
  const renderLine = (item: LineProps) => (
    <line
      key={item.angle}
      className={item.className}
      x1={item.x1}
      y1={item.y1}
      x2={item.x2}
      y2={item.y2}
      style={{ stroke: 'rgba(102, 85, 248, 0.5)', strokeWidth: 2 }}
      strokeLinecap="round"
    ></line>
  );

  // 绘制指示标
  const renderIndicator: any = () => {
    // 半径
    const r1 = (width / 2);

    // 0 刻度线跟svg外层距离
    const x = r1 + (r1 - 52) * Math.cos((currentAngle * Math.PI) / 180);
    const y = r1 + (r1 - 52) * Math.sin((currentAngle * Math.PI) / 180);

    return <g id='indicator' filter="url(#filter0)">
      <circle
        cx={x}
        cy={y}
        r={12}
        strokeWidth={8}
        fill="#6655F8"
        stroke="white"
      />
    </g>;
  };

  const getViewbox = () => [0, 0, width, height].join(' ');

  return (
    <div className={classNames(
      'humidifier-disk-wrap',
      status ? 'status-active' : 'status-disable',
    )}>
      <svg
        className="humidifier-disk"
        xmlns="http://www.w3.org/2000/svg"
        viewBox={getViewbox()}
      >
        <defs>
          <radialGradient id="paint0" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(150 150) rotate(90) scale(159.889)">
            <stop stopColor="#6655F8" stopOpacity="0.253906"/>
            <stop offset="1" stopColor="#F7F4FD" stopOpacity="0.148465"/>
          </radialGradient>
          <filter id="filter0" x="36" y="38" width="228" height="228" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feMorphology radius="2" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_104_86"/>
            <feOffset dy="2"/>
            <feGaussianBlur stdDeviation="3"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0.869126 0 0 0 0 0.853887 0 0 0 0 1 0 0 0 1 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_104_86"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_104_86" result="shape"/>
          </filter>
        </defs>
        <circle cx="150" cy="150" r="150" fill="url(#paint0)"/>
        <g filter="url(#filter0)">
          <circle cx="150" cy="150" r="106" fill="white"/>
        </g>

        {renderIndicator()}

        <g id="lineList">{lineArray().map(renderLine)}</g>
      </svg>
      <div className="disk-circle-content">
        {status
          ? <>
            <div className="title">湿度设置</div>
            <div className="num">{value}<span>%</span></div>
            <div className="desc">当前水位 | 1 level</div>
          </>
          : <div className="close">已关机</div>
        }
      </div>
    </div>
  );
}
