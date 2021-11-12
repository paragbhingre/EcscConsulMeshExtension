import * as cdk from '@aws-cdk/core';
import {
  AssignPublicIpExtension,
  Container,
  Environment,
  HttpLoadBalancerExtension,
  Service,
  ServiceDescription
} from '../../consul-extension/lib1';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
// use local extension
import { ECSConsulMeshExtension, RetryJoin, CloudProviders } from '../../consul-extension/lib/consul-mesh-extension';
import { Port } from '@aws-cdk/aws-ec2';
// import { ECSConsulMeshExtension, RetryJoin } from '@aws-quickstart/ecs-consul-mesh-extension'
//import { connectToProps } from '../../consul-extension/lib1/service';

export class ExtensionTestAppStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // const vpc = ec2.Vpc.fromLookup(this, 'consulVPC', { vpcName: 'consulVPC', vpcId: "vpc-0509509583e2ef8cc" })
    const vpc = ec2.Vpc.fromLookup(this, 'consulVPC', { vpcId: "vpc-08cebc290317537ad" })

    const secret = secretsmanager.Secret.fromSecretAttributes(this, 'ImportedSecret', {
      secretArn: 'arn:aws:secretsmanager:us-east-2:727656907259:secret:i-07c446_consulAgentCaCert-NBIwAK',
    });

    const gossipSecret = secretsmanager.Secret.fromSecretAttributes(this, 'ImportedGossipSecret', {
      secretArn: 'arn:aws:secretsmanager:us-east-2:727656907259:secret:consulGossipEncryptionKey1-aaghKG',
    });

    const environment = new Environment(this, 'MyEnvironment', {
      vpc: vpc
    });

    // const consulSecurityGroup = ec2.SecurityGroup.fromLookup(this, 'consulSecurityGroup1', 'sg-00099d2c08eda9f2b')
    const consulSecurityGroup = ec2.SecurityGroup.fromLookup(this, 'consulSecurityGroup', 'sg-05f38e2fd1355b84d')

    const consulClientSercurityGroup = new ec2.SecurityGroup(this, 'consulClientSecurityGroup', {
      vpc: environment.vpc
    });

    consulClientSercurityGroup.addIngressRule(
      consulClientSercurityGroup,
      ec2.Port.tcp(8301),
      "allow all the clients in the mesh talk to each other"
    );
    consulClientSercurityGroup.addIngressRule(
      consulClientSercurityGroup,
      ec2.Port.udp(8301),
      "allow all the clients in the mesh talk to each other"
    )

    const nameDescription = new ServiceDescription();
    nameDescription.add(new Container({
      cpu: 512,
      memoryMiB: 2048,
      trafficPort: 3000,
      image: ecs.ContainerImage.fromRegistry('nathanpeck/name')
    }));

    nameDescription.add(new ECSConsulMeshExtension({
      // retryJoin: "provider=aws region=us-west-2 tag_key=Name tag_value=test-consul-server",
      // retryJoin: "provider=aws region=us-east-2 tag_key=Name tag_value=test-consul-server",
      retryJoin: new RetryJoin({ region: "us-east-2", tagName: "Name", tagValue: "test-consul-server" }),
      consulServerSercurityGroup: consulSecurityGroup,
      port: 3000,
      consulCACert: secret,
      consulClientSecurityGroup: consulClientSercurityGroup,
      tls: true,
      gossipEncryptKey: gossipSecret,
      // serviceDiscoveryName: "name"
    }));

    nameDescription.add(new AssignPublicIpExtension());
    const name = new Service(this, 'name', {
      environment: environment,
      serviceDescription: nameDescription,
    });

    const greetingDescription = new ServiceDescription();
    greetingDescription.add(new Container({
      cpu: 512,
      memoryMiB: 2048,
      trafficPort: 3000,
      image: ecs.ContainerImage.fromRegistry('nathanpeck/greeting')
    }));


    greetingDescription.add(new ECSConsulMeshExtension({
      // retryJoin: "provider=aws region=us-west-2 tag_key=Name tag_value=test-consul-server",
      //retryJoin: "provider=aws region=us-east-2 tag_key=Name tag_value=test-consul-server",
      retryJoin: new RetryJoin({ region: "us-east-2", tagName: "Name", tagValue: "test-consul-server" }),
      consulServerSercurityGroup: consulSecurityGroup,
      port: 3000,
      consulCACert: secret,
      consulClientSecurityGroup: consulClientSercurityGroup,
      tls: true,
      gossipEncryptKey: gossipSecret,
      // serviceDiscoveryName: "greeting",
    }));

    greetingDescription.add(new AssignPublicIpExtension());
    const greeting = new Service(this, 'greeting', {
      environment: environment,
      serviceDescription: greetingDescription,
    });




    // launch service into that cluster
    const greeterDescription = new ServiceDescription();
    greeterDescription.add(new Container({
      cpu: 512,
      memoryMiB: 2048,
      trafficPort: 3000,
      image: ecs.ContainerImage.fromRegistry('nathanpeck/greeter'),
      environment: {
        // GREETER_URL : "http://localhost:3003",
        //GREETING_URL: "http://localhost:3002",
        //NAME_URL: "http://localhost:3001" 
      },
    }));

    /* let upstreams : {
      destination_name: Service | string;
      local_bind_port: number;
    }[] = [];

    let upsteam1 = {
      destination_name: "ExtensionTestAppStacknametaskdefinition200282B6",
      local_bind_port: 3001
    }

    let upsteam2 = {
      destination_name: "ExtensionTestAppStackgreetingtaskdefinition700FCBFC",
      local_bind_port: 3002
    }
    
    upstreams.push(upsteam1);
    upstreams.push(upsteam2); */

    greeterDescription.add(new ECSConsulMeshExtension({
      // retryJoin: "provider=aws region=us-west-2 tag_key=Name tag_value=test-consul-server", // use interface, use ENUMs
      //retryJoin: "provider=aws region=us-west-2 tag_key=Name tag_value=test-consul-server",
      // retryJoin: "provider=aws region=us-east-2 tag_key=Name tag_value=test-consul-server",
      retryJoin: new RetryJoin({ region: "us-east-2", tagName: "Name", tagValue: "test-consul-server" }),
      consulServerSercurityGroup: consulSecurityGroup,
      port: 3000,
      consulCACert: secret,
      consulClientSecurityGroup: consulClientSercurityGroup,
      tls: true,
      gossipEncryptKey: gossipSecret,
      // serviceDiscoveryName: "greeter"
    }));

    greeterDescription.add(new AssignPublicIpExtension());
    greeterDescription.add(new HttpLoadBalancerExtension());
    const greeter = new Service(this, 'greeter', {
      environment: environment,
      serviceDescription: greeterDescription,
    });

    

    greeter.connectTo(name);
    greeter.connectTo(greeting);
  }
}
