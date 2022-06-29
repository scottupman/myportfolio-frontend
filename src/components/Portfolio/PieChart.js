import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);
const PieChart = (props) => {
    let datasets = [
        {
            data: props.pieData,
            backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
            hoverOffset: 4,
            borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)']
        }
    ]

    return (
        <div style={{height: '400px', width: '400px'}}>
            <Pie
                data={{ labels: props.labels, datasets: datasets }}
            />
        </div>
    )
}

export default PieChart