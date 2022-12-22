#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AmazonConnectInstanceLevelDashboardStack } from '../lib/amazon-connect-instance-level-dashboard-stack';
import { BuildConfig } from "../lib/build-config";

//adjust dashboardparameters.json file path as needed
import param from '/home/cloudshell-user/dashboardparameters.json'

const app = new cdk.App();

/* function ensureString(object: { [name: string]: any }, propName: string): string {
  if (!object[propName] || object[propName].trim().length === 0)
    throw new Error(propName + " does not exist or is empty");

  return object[propName];
}
 */
function getConfig() {

  let buildConfig: BuildConfig = {
    Parameters: {
      ConnectInstanceId: param.ConnectInstanceId,
      ConnnectInstanceName: param.ConnnectInstanceName,
      ConnectQueues: param.ConnectQueues
    }
  };

  return buildConfig;
}
async function Main() {

  let buildConfig: BuildConfig = getConfig();
  new AmazonConnectInstanceLevelDashboardStack(app, 'AmazonConnectInstanceDashboardStack' + param.ConnnectInstanceName, {
    env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  }, buildConfig);

}

Main();