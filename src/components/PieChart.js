import { Pie } from "react-chartjs-2";
import { Chart, ArcElement } from 'chart.js'
Chart.register(ArcElement);
const PieChart = (props) => {
    let datasets = [
        {
            data: props.pieData,
            backgroundColor: ["#003f5c", "#58508d", "#bc5090"],
            hoverOffset: 4
        }
    ]

    return (
        <div style={{height: '200px', width: '200px'}}>
            <Pie
                data={{ labels: props.labels, datasets: datasets }}
                options={{
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: {legend: {position: 'top'}}
                }}
            />
        </div>
    )
}

export default PieChart