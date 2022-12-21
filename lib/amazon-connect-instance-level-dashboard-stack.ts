import { Stack, StackProps, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Dashboard, GraphWidget, TextWidget, Metric, GaugeWidget, LegendPosition } from 'aws-cdk-lib/aws-cloudwatch';
import { BuildConfig } from './build-config';

export class AmazonConnectInstanceLevelDashboardStack extends Stack {

  constructor(scope: Construct, id: string, props = {}, buildConfig: BuildConfig) {
    super(scope, id, props);

    const dashboard = new Dashboard(this, 'AmazonConnect-Dashboard',
      {
        dashboardName: 'Amazon-Connect-Instance-Dashboard-' + buildConfig.Parameters.ConnnectInstanceName,
      }
    );

    const QueueSize = new GraphWidget({
      height: 7,
      width: 9,
      title: 'Queue Size',
      leftYAxis: {
        showUnits: false
      },
    });

    const QueueWaitTimes = new GraphWidget({
      height: 7,
      width: 9,
      title: 'Queue Wait Times',
      leftYAxis: {
        showUnits: false
      },
    });

    const QueueCapacityErrors = new GraphWidget({
      height: 7,
      width: 9,
      title: 'Queue Capacity Exceeded',
      leftYAxis: {
        showUnits: false
      },
    });

    buildConfig.Parameters.ConnectQueues.forEach((q) => {
      const m = new Metric({
        namespace: 'AWS/Connect',
        metricName: 'QueueSize',
        statistic: 'max',
        period: Duration.seconds(900),
        label: q,
        dimensionsMap: {
          InstanceId: buildConfig.Parameters.ConnectInstanceId,
          MetricGroup: 'Queue',
          QueueName: q
        }
      });
      const m2 = new Metric({
        namespace: 'AWS/Connect',
        metricName: 'LongestQueueWaitTime',
        statistic: 'max',
        period: Duration.seconds(900),
        label: q,
        dimensionsMap: {
          InstanceId: buildConfig.Parameters.ConnectInstanceId,
          MetricGroup: 'Queue',
          QueueName: q
        }
      });
      const m3 = new Metric({
        namespace: 'AWS/Connect',
        metricName: 'QueueCapacityExceededError',
        statistic: 'max',
        period: Duration.seconds(900),
        label: q,
        dimensionsMap: {
          InstanceId: buildConfig.Parameters.ConnectInstanceId,
          MetricGroup: 'Queue',
          QueueName: q
        }
      });

      QueueSize.addLeftMetric(m);
      QueueWaitTimes.addLeftMetric(m2);
      QueueCapacityErrors.addLeftMetric(m3);
    });

    //Concurrent Calls guage
    const ccgauge = new GaugeWidget({
      title: 'Concurrent Calls % (Max)',
      leftYAxis: {
        min: 0,
        max: 100,
        showUnits: false,
        label: '%'
      },
      legendPosition: LegendPosition.HIDDEN,
      metrics: [
        new Metric({
          namespace: 'AWS/Connect',
          metricName: 'ConcurrentCallsPercentage',
          period: Duration.seconds(900),
          statistic: 'max',
          dimensionsMap: {
            InstanceId: buildConfig.Parameters.ConnectInstanceId,
            MetricGroup: 'VoiceCalls'
          }
        })
      ]
    });

    //Calls Execeeding Concurrancy Limit (Sum)
    const ccbgauge = new GaugeWidget({
      title: 'Calls Exceeding Concurancy Limit (Sum)',
      leftYAxis: {
        min: 0,
        max: 100,
        showUnits: false,
        label: ''
      },
      legendPosition: LegendPosition.HIDDEN,
      metrics: [
        new Metric({
          namespace: 'AWS/Connect',
          metricName: 'CallsBreachingConcurrencyQuota',
          period: Duration.seconds(900),
          statistic: 'sum',
          dimensionsMap: {
            InstanceId: buildConfig.Parameters.ConnectInstanceId,
            MetricGroup: 'VoiceCalls'
          }
        })
      ]
    });

       //Missed Calls (Sum)
       const missedgauge = new GaugeWidget({
        title: 'Missed Calls (Sum)',
        leftYAxis: {
          min: 0,
          max: 100,
          showUnits: false,
          label: ''
        },
        legendPosition: LegendPosition.HIDDEN,
        metrics: [
          new Metric({
            namespace: 'AWS/Connect',
            metricName: 'MissedCalls',
            period: Duration.seconds(900),
            statistic: 'sum',
            dimensionsMap: {
              InstanceId: buildConfig.Parameters.ConnectInstanceId,
              MetricGroup: 'VoiceCalls'
            }
          })
        ]
      });

    //first row
    dashboard.addWidgets(
      new TextWidget({
        height: 1,
        width: 23,
        markdown: "## Voice Metrics\n"
      })
    );

    //second row
    dashboard.addWidgets(
      new GraphWidget({
        height: 7,
        width: 9,
        title: 'Total Inbound + Outbound Calls (Sum)',
        legendPosition: LegendPosition.HIDDEN,
        leftYAxis: {
          showUnits: false
        },
        left: [
          new Metric({
            namespace: 'AWS/Connect',
            metricName: 'CallsPerInterval',
            statistic: 'sum',
            label: '',
            period: Duration.seconds(900),
            dimensionsMap: {
              InstanceId: buildConfig.Parameters.ConnectInstanceId,
              MetricGroup: 'VoiceCalls'
            }
          })
        ]
      }),
      QueueSize,
      ccgauge
      );

    //third row
    dashboard.addWidgets(
      new GraphWidget({
        height: 7,
        width: 9,
        title: 'Concurrent Calls (Max)',
        legendPosition: LegendPosition.HIDDEN,
        leftYAxis: {
          showUnits: false
        },
        left: [
          new Metric({
            namespace: 'AWS/Connect',
            metricName: 'ConcurrentCalls',
            statistic: 'max',
            label: '',
            period: Duration.seconds(900),
            dimensionsMap: {
              InstanceId: buildConfig.Parameters.ConnectInstanceId,
              MetricGroup: 'VoiceCalls'
            }
          })
        ]
      }),
      QueueWaitTimes,
      ccbgauge
    );

    //4th row
    dashboard.addWidgets(
      new GraphWidget({
        height: 7,
        width: 9,
        title: 'Throttled Calls (Sum)',
        legendPosition: LegendPosition.HIDDEN,
        leftYAxis: {
          showUnits: false
        },
        left: [
          new Metric({
            namespace: 'AWS/Connect',
            metricName: 'ThrottledCalls',
            statistic: 'sum',
            label: '',
            period: Duration.seconds(900),
            dimensionsMap: {
              InstanceId: buildConfig.Parameters.ConnectInstanceId,
              MetricGroup: 'VoiceCalls'
            }
          })
        ]
      }),
      QueueCapacityErrors,
      missedgauge
    );

    //5th row
    dashboard.addWidgets(
      new TextWidget({
        height: 1,
        width: 9,
        markdown: "## Chat Metrics\n"
      }),
      new TextWidget({
        height: 1,
        width: 9,
        markdown: "## Task Metrics\n"
      })
    );

    //6th row
    dashboard.addWidgets(
      new GraphWidget({
        height: 7,
        width: 9,
        title: 'Conncurrent Active Chats (Max)',
        legendPosition: LegendPosition.HIDDEN,
        leftYAxis: {
          showUnits: false
        },
        left: [
          new Metric({
            namespace: 'AWS/Connect',
            metricName: 'ConcurrentActiveChats',
            statistic: 'max',
            label: '',
            period: Duration.seconds(900),
            dimensionsMap: {
              InstanceId: buildConfig.Parameters.ConnectInstanceId,
              MetricGroup: 'Chats'
            }
          })
        ]
      }),
      new GraphWidget({
        height: 7,
        width: 9,
        title: 'Conncurrent Active Tasks (Max)',
        legendPosition: LegendPosition.HIDDEN,
        leftYAxis: {
          showUnits: false
        },
        left: [
          new Metric({
            namespace: 'AWS/Connect',
            metricName: 'ConcurrentTasks',
            statistic: 'max',
            label: '',
            period: Duration.seconds(900),
            dimensionsMap: {
              InstanceId: buildConfig.Parameters.ConnectInstanceId,
              MetricGroup: 'Tasks'
            }
          })
        ]
      })
    );
    // 7th row
    dashboard.addWidgets(
      new TextWidget({
        height: 4,
        width: 9,
        markdown: "## Amazon Connect Instance: " + buildConfig.Parameters.ConnnectInstanceName + " \n \n### Notes \nAmazon Connect CloudWatch metrics are defined**[here](https://docs.aws.amazon.com/connect/latest/adminguide/monitoring-cloudwatch.html)**.\n\nUsing the **Actions** menu, set the Period Overide to the desired Interval. More info[here](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/change_dashboard_refresh_interval.html).\n"
      })
    )
  } // constructor
} // class