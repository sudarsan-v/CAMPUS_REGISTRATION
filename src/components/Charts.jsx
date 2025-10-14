import React from 'react';

// Simple chart components for better visualization
export const BarChart = ({ data, title }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div style={{ padding: '20px' }}>
      <h4 style={{ marginBottom: '20px' }}>{title}</h4>
      <div style={{ display: 'flex', alignItems: 'end', gap: '10px', height: '200px' }}>
        {data.map((item, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <div
              style={{
                width: '100%',
                backgroundColor: item.color || '#4CAF50',
                height: `${(item.value / maxValue) * 160}px`,
                borderRadius: '4px 4px 0 0',
                minHeight: '20px',
                display: 'flex',
                alignItems: 'end',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '12px',
                paddingBottom: '5px'
              }}
            >
              {item.value}
            </div>
            <div style={{ marginTop: '8px', fontSize: '12px', textAlign: 'center', fontWeight: 'bold' }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PieChart = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div style={{ padding: '20px' }}>
      <h4 style={{ marginBottom: '20px' }}>{title}</h4>
      <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
        <div style={{ position: 'relative', width: '150px', height: '150px' }}>
          <svg width="150" height="150" style={{ transform: 'rotate(-90deg)' }}>
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const strokeDasharray = `${percentage * 2.51} 251.2`;
              const strokeDashoffset = index === 0 ? 0 : -251.2 * (data.slice(0, index).reduce((sum, prevItem) => sum + prevItem.value, 0) / total);
              
              return (
                <circle
                  key={index}
                  cx="75"
                  cy="75"
                  r="40"
                  fill="none"
                  stroke={item.color || '#4CAF50'}
                  strokeWidth="20"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                />
              );
            })}
          </svg>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{total}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Total</div>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          {data.map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{
                width: '16px',
                height: '16px',
                backgroundColor: item.color || '#4CAF50',
                borderRadius: '3px',
                marginRight: '10px'
              }}></div>
              <span style={{ fontSize: '14px' }}>{item.label}: {item.value} ({((item.value / total) * 100).toFixed(1)}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const LineChart = ({ data, title }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 300;
    const y = 150 - ((item.value - minValue) / (maxValue - minValue)) * 120;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div style={{ padding: '20px' }}>
      <h4 style={{ marginBottom: '20px' }}>{title}</h4>
      <div style={{ position: 'relative' }}>
        <svg width="300" height="150" style={{ border: '1px solid #eee' }}>
          <polyline
            points={points}
            fill="none"
            stroke="#4CAF50"
            strokeWidth="2"
          />
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 300;
            const y = 150 - ((item.value - minValue) / (maxValue - minValue)) * 120;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill="#4CAF50"
              />
            );
          })}
        </svg>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          {data.map((item, index) => (
            <div key={index} style={{ fontSize: '12px', textAlign: 'center' }}>
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
