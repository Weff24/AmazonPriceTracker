/*
Check if #add-item-button is clicked. If clicked, 
#add-item-url is opened and the background is blurred.
*/
let urlForm = document.querySelector('#add-item-url');
let bgBlur = document.querySelector('#bg-blur');
let urlFormOpen = document.querySelector('#add-item-button');
urlFormOpen.addEventListener('click', () => {
    urlForm.style.display = 'block';
    bgBlur.style.display = 'block';
});

/*
Check if #add-item-close is clicked. If clicked, 
#add-item-url is closed and the background blur is removed.
*/
let urlFormClose = document.querySelector('#add-item-close');
let urlFormElement = document.querySelector('#add-item-url-form');
urlFormClose.addEventListener('click', () => {
    urlFormElement.reset();
    urlForm.style.display = 'none';
    bgBlur.style.display = 'none';
});

/*
Check if #add-item-url-form is submitted. If submitted, 
#add-item-url is closed and the loading animation appears.
*/
let loadAnimation = document.querySelector('#load-animation');
urlFormElement.addEventListener('submit', () => {
    urlForm.style.display = 'none';
    loadAnimation.style.display = 'block';
});

// Create item price charts and add to website
window.onload = function() {
    let chartNum = 0;
    let chart = document.querySelector('#chart' + chartNum);
    while (chart) {
        // Reformat time data
        let times = chart.dataset.times;
        times = times.split(',');
        times = times.map(time => {
            let ts = new Date(parseFloat(time));
            let month = ts.getMonth() + 1;
            let day = ts.getDate();
            return month + '/' + day;
        });
    
        // Reformat price data
        let prices = chart.dataset.prices;
        prices = prices.split(',');
        prices = prices.map(price => parseFloat(price));
    
        // Add chart to website and set display options
        let priceChart = new Chart(chart, {
            type: 'line',
            data: {
                labels: times,
                datasets: [{
                    data: prices,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)'
                        ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)'
                    ],
                    borderWidth: 1,
                    lineTension: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    text: 'Price Over Time',
                    fontSize: 14
                },
                legend: {
                    display: false
                },
                tooltips: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return '$' + tooltipItem.yLabel;
                        }
                    }
                },
                scales: {
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Date',
                            fontSize: 12,
                            padding: 0
                        }
                    }],
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Price',
                            fontSize: 12,
                            padding: 5
                        }
                    }]
                }
            }
        });
        chartNum++;
        chart = document.querySelector('#chart' + chartNum);
    }
    chartNum = 0;
}
