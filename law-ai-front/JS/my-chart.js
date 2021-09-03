
var ctx = document.getElementById('myChart');



var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [
                {
                label: "法院判決案件數",
                data: [165, 89, 65, 45, 26, 22, 11, 5],
                borderColor: '#2f439d',
                backgroundColor: '#2f439d66',
                // this dataset is drawn below
                order: 2
            }, 
            {
                label: "您的保險所能負擔之案件",
                data: [165, 89, 65, 45],
                backgroundColor: '#ffb900AA',
                // this dataset is drawn on top
                order: 1
        }],
        labels: ['$0', '$100000', '$200000', '$300000', '$400000', '$500000', '$600000', '$700000', '$800000', '$900000', '$1000000', ''],

    },
    scales: {
        y: { // defining min and max so hiding the dataset does not change scale range
        min: 0,
        max: 200
        }
    }
});