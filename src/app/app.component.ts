import { Component, ElementRef, OnInit } from '@angular/core';
// Import AmCharts modules
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

interface RadarChartDataItem {
  category: string;
  value: string;
  full: number;
  color: am4core.Color;
  remainingValue?: number;
  columnSettings?: any;
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  private chart: am4charts.RadarChart;
  constructor(private element: ElementRef) {}

  ngOnInit(): void {
    this.createam4Chart('credit-chartdiv1', 1);
  }

  createam4Chart(ID: string, Value: number) {
    am4core.useTheme(am4themes_animated);
    // Create chart instance
    this.chart = am4core.create(ID, am4charts.RadarChart);

    // Add data
    this.chart.data = <RadarChartDataItem[]>[
      {
        category: 'Disbursement Pending',
        value: '20',
        full: 100,
        color: am4core.color('#FBAB5D'), // Set a custom color here
      },
      {
        category: 'Repayment Pending ',
        value: '30',
        full: 100,
        color: am4core.color('#32D99C'), // Specify the color here
      },
      {
        category: 'Delayed',
        value: '40',
        full: 100,
        color: am4core.color('#A52DF6'), // Specify the color here
      },
      {
        category: 'Settled',
        value: '50',
        full: 100,
        color: am4core.color('#E53BC2'), // Specify the color here
      },
      {
        category: 'Defaulted',
        value: '60',
        full: 100,
        color: am4core.color('#E64747'), // Specify the color here
      },
    ];

    // Make chart not full circle
    this.chart.startAngle = -90;
    this.chart.endAngle = 180;
    this.chart.innerRadius = am4core.percent(30);

    // Set number format
    this.chart.numberFormatter.numberFormat = "''";

    // Create axes
    const categoryAxis = this.chart.yAxes.push(
      new am4charts.CategoryAxis<any>()
    );
    categoryAxis.dataFields.category = 'category';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.grid.template.strokeOpacity = 0;
    categoryAxis.renderer.labels.template.disabled = true;
    categoryAxis.renderer.labels.template.horizontalCenter = 'right';
    categoryAxis.renderer.labels.template.fontWeight = 500;
    categoryAxis.renderer.minGridDistance = 10;
    // Create custom labels for categoryAxis
    this.chart.data.forEach((dataItem) => {
      const label = categoryAxis.axisRanges.create();
      label.category = dataItem.category;
      label.text = `${dataItem.category} : [bold]${dataItem.value}`;
      label.grid.location = 0.5; // Position the labels in the middle of the category
    });

    const valueAxis = this.chart.xAxes.push(new am4charts.ValueAxis<any>());
    valueAxis.renderer.grid.template.strokeOpacity = 0;
    valueAxis.min = 0;
    valueAxis.max = 100;
    valueAxis.strictMinMax = true;

    // Create series
    const series1 = this.chart.series.push(new am4charts.RadarColumnSeries());
    series1.dataFields.valueX = 'full';
    series1.dataFields.categoryY = 'category';
    series1.clustered = false;
    series1.columns.template.fill = new am4core.InterfaceColorSet().getFor(
      'alternativeBackground'
    );
    series1.columns.template.fillOpacity = 0.08;
    series1.columns.template.strokeWidth = 0;
    series1.columns.template.radarColumn.cornerRadius = 20;

    // Create labels for series1 data points
    // series1.columns.template.adapter.add("fill", function (fill, target) {
    //   const dataContext = <RadarChartDataItem>target.dataItem.dataContext;
    //   return dataContext.color;
    // });

    const series2 = this.chart.series.push(new am4charts.RadarColumnSeries());
    series2.dataFields.valueX = 'value';
    series2.dataFields.categoryY = 'category';
    series2.clustered = false;
    // Use custom colors from the "color" property
    series2.columns.template.adapter.add('fill', function (fill, target) {
      const dataContext = <RadarChartDataItem>target.dataItem.dataContext;
      return dataContext.color;
    });
    series2.columns.template.strokeWidth = 0;
    series2.columns.template.tooltipText = `{category}: [bold]{value}`;
    series2.columns.template.radarColumn.cornerRadius = 20;
  }

  ngOnDistroy() {
    this.chart.dispose();
  }
}
