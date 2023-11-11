import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import { readFileSync } from 'fs';

export class WebServerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // 
    const demoVPC = new ec2.Vpc(this, 'demoVPC', {
      vpcName: 'demoVPC',
      ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
      natGateways:0,
    
    });


    const demoSG =  new ec2.SecurityGroup(this, 'demoSG', {
      vpc:demoVPC,
      securityGroupName:'allow http traffic',
      allowAllOutbound:true,
    });

    demoSG.addIngressRule(ec2.Peer.anyIpv4(),ec2.Port.tcp(80),'allow http traffic')

    const demoEC2= new ec2.Instance(this, 'demoEC2', {
      vpc:demoVPC,
      vpcSubnets:{subnetType:ec2.SubnetType.PUBLIC},
      securityGroup:demoSG,
      instanceType:ec2.InstanceType.of(ec2.InstanceClass.T2,ec2.InstanceSize.MICRO),
      machineImage:ec2.MachineImage.latestAmazonLinux({
        generation:ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      keyName:'demoKeyPair',})
      const userData = readFileSync('./lib/userdata.sh', 'utf8');
      demoEC2.addUserData(userData)

  }
}
