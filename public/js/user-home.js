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
    //let currentPrice = scraper.getData(url);
    //currentPriceElement.innerText = currentPrice;
    /*scraper.getData(url)
        .then((price) => {
            currentPriceElement.innerText = currentPrice;
        });*/
});


/*
// Draws price graphs for each item
let max_items = 3; // Max number of itmes able to track at once
window.onload = function() {
    for (let i = 0; i < max_items; i++) {
        let chart = document.querySelector('#chart' + i).getContext('2d');
        if (!chart) {
            break;
        }
        let lineChart = new Chart(chart, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Price',
                    data: [1, 5, 1, 2, 4, 7]
                }]
            },
            options: { }
        });
    }
}
*/
/*
<script>
        let max_items = 3; // Max number of itmes able to track at once
        window.onload = function() {
            for (let i = 0; i < max_items; i++) {
                let chart = document.querySelector('#chart' + i).getContext('2d');
                if (!chart) {
                    break;
                }
                let lineChart = new Chart(chart, {
                    type: 'line',
                    data: {
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                        datasets: [{
                            label: 'Price',
                            data: [1, 5, 1, 2, 4, 7]
                        }]
                    },
                    options: { }
                });
            }
        }
    </script>
*/

window.onload = function() {
    let chartNum = 0;
    let chart = document.querySelector('#chart' + chartNum);
    while (chart) {
        let times = chart.dataset.times;
        times = times.split(',');
        let fullTimes = times.map(time => {
            let ts = new Date(parseFloat(time));
            let year = ts.getFullYear().toString().substring(2);
            let month = ts.getMonth() + 1;
            let day = ts.getDate();
            let hour = ts.getHours();
            let mins = ts.getMinutes();
            mins = (mins < 10 ? '0' : '') + mins;
            return month + '/' + day + '/' + year + ' @ ' + hour + ':' + mins;
        });
        times = times.map(time => {
            let ts = new Date(parseFloat(time));
            let month = ts.getMonth() + 1;
            let day = ts.getDate();
            return month + '/' + day;
        });
    
        let prices = chart.dataset.prices;
        prices = prices.split(',');
        prices = prices.map(price => parseFloat(price));
    
    
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
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            /*    scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                        }
                    }]
                },                  */
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
                        title: function(tooltipItem) {
                            return fullTimes[times.indexOf(tooltipItem[0].xLabel)];
                        },
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

/*
title: function(tooltipItem, data) {
    return data['labels'][tooltipItem[0]['index']];
  },
  label: function(tooltipItem, data) {
    return data['datasets'][0]['data'][tooltipItem['index']];
  },
  afterLabel: function(tooltipItem, data) {
    var dataset = data['datasets'][0];
    var percent = Math.round((dataset['data'][tooltipItem['index']] / dataset["_meta"][0]['total']) * 100)
    return '(' + percent + '%)';
  }
  */