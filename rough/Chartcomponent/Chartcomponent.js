import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import randomColor from 'randomcolor';

const ChartComponent = ({ data }) => {
  const barChartData = Object.entries(data).map(([label, value]) => ({
    label,
    value,
  }));

  const pieChartData = Object.entries(data).map(([label, value], index) => ({
    label,
    value,
    fill: randomColor(), // Generate a random color for each data point
  }));

  return (
    <div>
      {/* <h3>{selectedColumn}</h3> */}
      <div className="chart">
        <div className="bar-chart">
          <BarChart width={400} height={300} data={barChartData}>
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </div>
        <div className="pie-chart">
          <PieChart width={400} height={300}>
            <Pie
              data={pieChartData}
              dataKey="value"
              cx={200}
              cy={150}
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;
