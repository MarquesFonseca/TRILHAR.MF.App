import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class LineColumnChartService {

    private isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) private platformId: any) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    async loadChart(): Promise<void> {
        if (this.isBrowser) {
            try {
                // Dynamically import ApexCharts
                const ApexCharts = (await import('apexcharts')).default;

                // Define chart options
                const options = {
                    series: [
                        {
                            name: "Website Blog",
                            type: "column",
                            data: [440, 505, 414, 671, 227, 413, 201, 352, 752]
                        },
                        {
                            name: "Social Media",
                            type: "line",
                            data: [23, 42, 35, 27, 43, 22, 17, 31, 22]
                        }
                    ],
                    chart: {
                        height: 350,
                        type: "line",
                        toolbar: {
                            show: true
                        }
                    },
                    stroke: {
                        width: [0, 4]
                    },
                    title: {
                        text: "Traffic Sources",
                        align: "left",
                        offsetX: -9,
                        style: {
                            fontWeight: '500',
                            fontSize: '15px',
                            color: '#475569'
                        }
                    },
                    dataLabels: {
                        enabled: true,
                        enabledOnSeries: [1],
                        style: {
                            fontSize: '12px'
                        }
                    },
                    labels: [
                        "01 Jan",
                        "02 Jan",
                        "03 Jan",
                        "04 Jan",
                        "05 Jan",
                        "06 Jan",
                        "07 Jan",
                        "08 Jan",
                        "09 Jan"
                    ],
                    xaxis: {
                        type: "datetime",
                        axisBorder: {
                            show: false,
                            color: '#e0e0e0'
                        },
                        axisTicks: {
                            show: true,
                            color: '#e0e0e0'
                        },
                        labels: {
                            show: true,
                            style: {
                                colors: "#919aa3",
                                fontSize: "14px"
                            }
                        }
                    },
                    grid: {
                        show: true,
                        strokeDashArray: 5,
                        borderColor: "#e0e0e0"
                    },
                    colors: [
                        "#0f79f3"
                    ],
                    legend: {
                        show: true,
                        offsetY: 10,
                        fontSize: '14px',
                        position: "bottom",
                        horizontalAlign: "center",
                        labels: {
                            colors: "#919aa3"
                        },
                        itemMargin: {
                            horizontal: 10,
                            vertical: 10
                        }
                    },
                    yaxis: [
                        {
                            title: {
                                text: "Website Blog",
                                style: {
                                    color: 'transparent'
                                }
                            },
                            labels: {
                                show: true,
                                style: {
                                    colors: "#919aa3",
                                    fontSize: "14px"
                                }
                            },
                            axisBorder: {
                                show: false
                            }
                        },
                        {
                            opposite: true,
                            title: {
                                text: "Social Media",
                                style: {
                                    color: 'transparent'
                                }
                            },
                            labels: {
                                show: true,
                                style: {
                                    colors: "#919aa3",
                                    fontSize: "14px"
                                }
                            },
                            axisBorder: {
                                show: false
                            }
                        }
                    ]
                };

                // Initialize and render the chart
                const chart = new ApexCharts(document.querySelector('#line_column_chart'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}