# Amazon Connect Instance Metrics Dashboard 

This is the companion repository for the blog post [Visualizing Amazon Connect instance metrics with Amazon CloudWatch](https://aws.amazon.com/blogs/contact-center/visualizing-amazon-connect-instance-metrics-with-amazon-cloudWatch).

## How to Deploy the Dashboard
This AWS CDK will create an Amazon CloudWatch Dashboard which displays Connect metrics in the form of graph widgets. To deploy the dashboard in your AWS account, do the following. Note: Please make sure you login into the correct AWS Account and Region that contains your Amazon Connect instance(s). 

1. Login into your AWS account and select the appropriate Region.
2. Open AWS CloudShell.
3. At the terminal prompt, clone this repo: git clone https://github.com/aws-samples/amazon-connect-instance-dashboard.git . Note: if you are not using CloudShell to deploy this solution, you will need to revise bin/amazon-connect-instance-level-dashboard.ts with the correct location of the parameters file. 
4. Using a standard text editor, create a text file named dashboardparameters.json. Copy this into the file:
```json
{
    "ConnectInstanceId": "placeholder-instance-id (36 characters)",
    "ConnnectInstanceName": "placeholder-name",
    "ConnectQueues": [
        "BasicQueue",
        "placeholder-queue-name1",
        "placeholder-queue-name2"
    ]
}
```
5. Replace the placeholder values with your Connect instance details. Make sure file contains valid JSON.  
6. Upload the dashboardparameters.json file to CloudShell using the Actions menu.
7. In the CloudShell terminal, enter: cd amazon-connect-instance-level-dashboard
8. Then enter the following commands:
```bash
npm install
cdk bootstrap
cdk deploy
```
9. After a few minutes the dashboard should be deployed. 
10. In the AWS Console, go to CloudWatch. On the left side, click Dashboards.
11. You should see the Dashboard listed in the middle. 


## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.

