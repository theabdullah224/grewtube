import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartComponentProps {
  positivechart: number;
  negativechart: number;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ positivechart, negativechart }) => {
  const labels = ['Positive', 'Negative'];
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Comments',
        data: [positivechart, negativechart],
        backgroundColor: ['rgba(75, 192, 192, 0.5)', 'rgba(255, 99, 132, 0.5)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      }
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: '',
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default ChartComponent;