import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
const LineChart = (props) => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            }
        }
    }
    const labels = props.labels

    const data = {
        labels,
        datasets: [
            {
                data: props.data,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)'
            }     
        ]
    }

    return <Line options={options} data = {data}></Line>

}

export default LineChart