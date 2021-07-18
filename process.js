let buyHistory = [];
let sellHistory = [];
let priceData = [];
let maxOrder = 5000; // USD
let minOrder = 10;
let minutes = 45;
let chart;

function show() {

    let result = getAllUrls(urls);
    result.then(function (val) {

        for (let i = 0; i < val[0].length; i++) {

            let currentDate = parseInt(moment.utc(val[0][i].executedAt).local().format('x'));
            let total = val[0][i].quantity * val[0][i].rate

            if (val[0][i].takerSide == 'BUY') {
                buyHistory.push({
                    'x': currentDate,
                    'y': parseFloat(val[0][i].rate),
                    'r': mapNum(total, minOrder, maxOrder, 2, 32),
                    'Total': total
                });
            } else {
                sellHistory.push({
                    'x': currentDate,
                    'y': parseFloat(val[0][i].rate),
                    'r': mapNum(total, minOrder, maxOrder, 2, 32),
                    'Total': total
                });
            }

        }

        let minuteRange = val[1].result.length - minutes;

        for (let i = minuteRange; i < val[1].result.length; i++) {

            priceData.push({
                'x': parseInt(moment.utc(val[1].result[i].T).local().format('x')),
                'y': val[1].result[i].C
            });

        }

        let x;

        if (buyHistory[0].x > sellHistory[0].x) {
            x = buyHistory[0].x;
        } else {
            x = sellHistory[0].x;
        }

        if (x > priceData[priceData.length - 1].x) {

            priceData.push({
                'x': x,
                'y': parseFloat(val[2].lastTradeRate)
            });

        }

        initializeChart();

    });
}

function initializeChart() {

    let data = {
        datasets: [
            {
                label: 'Buys',
                type: 'bubble',
                data: buyHistory,
                borderColor: 'green',
                backgroundColor: 'rgba(0, 255, 0, 0.3)'
            },
            {
                label: 'Sells',
                type: 'bubble',
                data: sellHistory,
                borderColor: 'red',
                backgroundColor: 'rgba(255, 0, 0, 0.3)'
            },
            {
                label: 'Price',
                type: 'line',
                data: priceData,
                borderColor: 'rgba(236, 239, 241, 0.4)',
                backgroundColor: 'rgba(236, 239, 241, 0.4)',
                fill: false, pointRadius: 2, pointHoverRadius: 4, lineWidth: 1, tension: 0.15
            },
        ]
    }

    const plugin = {
        id: 'custom_canvas_background_color',
        beforeDraw: (chart) => {
            const ctx = chart.canvas.getContext('2d');
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = 'rgb(23, 31, 46)';
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
        },
    };

    const config = {
        type: 'bubble',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: 'white',
                        size: 10,
                        boxWidth: 10
                    }
                },
                tooltip: {
                    callbacks: {

                        label: function (context) {

                            let index = context.dataIndex;

                            if (context.datasetIndex == 0) {
                                let price = context.dataset.data[index].y.toFixed(1);
                                let totalAmount = context.dataset.data[index].Total.toFixed(1);

                                return 'Buy Price: ' + price + ' USD - Amount: ' + totalAmount + ' USD';

                            }

                            if (context.datasetIndex == 1) {
                                let price = context.dataset.data[index].y.toFixed(1);
                                let totalAmount = context.dataset.data[index].Total.toFixed(1);

                                return 'Sell Price: ' + price + ' USD - Amount: ' + totalAmount + ' USD';

                            }

                            if (context.datasetIndex == 2) {
                                let close = context.dataset.data[index].y.toFixed(1);

                                return 'Last Price: ' + close + ' USD';

                            }
                        },

                        title: function (context) {

                            let index = context[0].dataIndex;
                            let currentTimeStamp = new Date(context[0].dataset.data[index].x);
                            let seconds = currentTimeStamp.getSeconds();
                            let minutes = currentTimeStamp.getMinutes();
                            let hour = currentTimeStamp.getHours();

                            if (seconds == 0) {
                                return hour + ':' + minutes;
                            } else {
                                return hour + ':' + minutes + ':' + seconds;
                            }
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'time',
                    unit: 'hour',
                    time: {
                        displayFormats: {
                            millisecond: 'HH:mm:ss',
                            second: 'HH:mm:ss',
                            minute: 'HH:mm:ss',
                            hour: 'HH:mm:ss',
                            day: 'HH:mm:ss',
                            week: 'HH:mm:ss',
                            month: 'HH:mm:ss',
                            quarter: 'HH:mm:ss',
                            year: 'HH:mm:ss',
                        }
                    },
                    ticks: {
                        color: 'white',
                        font: {
                            size: 10
                        }
                    },
                    grid: {
                        color: 'rgba(242, 242, 242, 0.04)'
                    }
                },
                y: {
                    ticks: {
                        color: 'white',
                        font: {
                            size: 10
                        },
                        callback: function (value, index, values) {
                            return value + ' USD';
                        }
                    },
                    grid: {
                        color: 'rgba(242, 242, 242, 0.04)'
                    }
                }
            },
            layout: {
                padding: 6
            }
        },
        plugins: [plugin],
    };

    chart = new Chart(
        document.getElementById('chart'),
        config
    );

}

function mapNum(num, in_min, in_max, out_min, out_max) {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

show();

