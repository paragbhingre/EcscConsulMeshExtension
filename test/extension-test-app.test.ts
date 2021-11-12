import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
//import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert-internal';
import * as cdk from '@aws-cdk/core';
import * as ExtensionTestApp from '../lib/extension-test-app-stack';
import { Environment, ServiceDescription, Container, Service } from '@aws-cdk-containers/ecs-service-extensions';
import * as ecs from '@aws-cdk/aws-ecs';
import { ConsulMeshExtension } from '../../consul-extension/lib/consul-mesh-extension';
import * as ec2 from '@aws-cdk/aws-ec2';

/*test('Test modifyServiceProps and preehook', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new ExtensionTestApp.ExtensionTestAppStack(app, 'MyTestStack');
  // THEN

  const environment = new Environment(stack, 'production');

  const consulSecurityGroup = new ec2.SecurityGroup(stack, 'consulServerSecurityGroup', {
    vpc: environment.vpc
  });

  const webFrontendDescription = new ServiceDescription();

  webFrontendDescription.add(new Container({
    cpu: 1024,
    memoryMiB: 2048,
    trafficPort: 3000,
    image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
  }));

  webFrontendDescription.add(new ConsulMeshExtension({
    retryJoin: "provider=aws region=us-west-2 tag_key=Name tag_value=test-consul-server",
    consulServerSercurityGroup: consulSecurityGroup,
  }));

  const webService = new Service(stack, 'web', {
    environment: environment,
    serviceDescription: webFrontendDescription,
  });

  expectCDK(stack).to(haveResource('AWS::ECS::TaskDefinition',{
            "ContainerDefinitions": [
              {
                "Cpu": 1024,
                "Essential": true,
                "Image": "nathanpeck/name",
                "LogConfiguration": {
                  "LogDriver": "awslogs",
                  "Options": {
                    "awslogs-group": {
                      "Ref": "LogGroupwebD4A04E20"
                    },
                    "awslogs-stream-prefix": "'web'App",
                    "awslogs-region": {
                      "Ref": "AWS::Region"
                    }
                  }
                },
                "Memory": 2048,
                "Name": "app",
                "PortMappings": [
                  {
                    "ContainerPort": 3000,
                    "Protocol": "tcp"
                  }
                ],
                "Ulimits": [
                  {
                    "HardLimit": 1024000,
                    "Name": "nofile",
                    "SoftLimit": 1024000
                  }
                ]
              }
            ],
            "Cpu": "1024",
            "Family": "MyTestStackwebtaskdefinition84B8422D",
            "Memory": "2048",
            "NetworkMode": "awsvpc",
            "RequiresCompatibilities": [
              "EC2",
              "FARGATE"
            ],
            "ExecutionRoleArn": {
              "Fn::GetAtt": [
                "webtaskdefinitionExecutionRole375AD3A2",
                "Arn"
              ]
            },
            "TaskRoleArn": {
              "Fn::GetAtt": [
                "webtaskdefinitionTaskRole205EE0BA",
                "Arn"
              ]
            }
  }));

  expectCDK(stack).to(haveResource('AWS::ECS::Service', {
    "Cluster": {
      "Ref": "productionenvironmentclusterC6599D2D"
    },
    "DeploymentConfiguration": {
      "MaximumPercent": 200,
      "MinimumHealthyPercent": 100
    },
    "DesiredCount": 2,
    "EnableECSManagedTags": false,
    "LaunchType": "FARGATE",
    "NetworkConfiguration": {
      "AwsvpcConfiguration": {
        "AssignPublicIp": "ENABLED",
        "SecurityGroups": [
          {
            "Fn::GetAtt": [
              "webserviceSecurityGroup91ABCA28",
              "GroupId"
            ]
          }
        ],
        "Subnets": [
          {
            "Ref": "productionenvironmentvpcPublicSubnet1Subnet8D92C089"
          },
          {
            "Ref": "productionenvironmentvpcPublicSubnet2Subnet298E6C31"
          }
        ]
      }
    },
    "TaskDefinition": {
      "Ref": "webtaskdefinition514ECFF0"
    }

  }));
});*/



/* test('Test addhook', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new ExtensionTestApp.ExtensionTestAppStack(app, 'MyTestStack');
  // THEN

  const environment = new Environment(stack, 'production');

  const consulSecurityGroup = new ec2.SecurityGroup(stack, 'consulServerSecurityGroup', {
    vpc: environment.vpc
  });

  const webFrontendDescription = new ServiceDescription();

  webFrontendDescription.add(new Container({
    cpu: 1024,
    memoryMiB: 2048,
    trafficPort: 3000,
    image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
  }));

  webFrontendDescription.add(new ConsulMeshExtension({
    retryJoin: "provider=aws region=us-west-2 tag_key=Name tag_value=test-consul-server",
    consulServerSercurityGroup: consulSecurityGroup,
    port: 8080
  }));

  const webService = new Service(stack, 'web', {
    environment: environment,
    serviceDescription: webFrontendDescription,
  });

  expectCDK(stack).to(haveResource('AWS::ECS::TaskDefinition',{
            "ContainerDefinitions": [
              {
                "Cpu": 1024,
                "Essential": true,
                "Image": "nathanpeck/name",
                "LogConfiguration": {
                  "LogDriver": "awslogs",
                  "Options": {
                    "awslogs-group": {
                      "Ref": "LogGroupwebD4A04E20"
                    },
                    "awslogs-stream-prefix": "'web'App",
                    "awslogs-region": {
                      "Ref": "AWS::Region"
                    }
                  }
                },
                "Memory": 2048,
                "Name": "app",
                "PortMappings": [
                  {
                    "ContainerPort": 3000,
                    "Protocol": "tcp"
                  }
                ],
                "Ulimits": [
                  {
                    "HardLimit": 1024000,
                    "Name": "nofile",
                    "SoftLimit": 1024000
                  }
                ]
              }
            ],
            "Cpu": "1024",
            "Family": "MyTestStackwebtaskdefinition84B8422D",
            "Memory": "2048",
            "NetworkMode": "awsvpc",
            "RequiresCompatibilities": [
              "EC2",
              "FARGATE"
            ],
            "ExecutionRoleArn": {
              "Fn::GetAtt": [
                "webtaskdefinitionExecutionRole375AD3A2",
                "Arn"
              ]
            },
            "TaskRoleArn": {
              "Fn::GetAtt": [
                "webtaskdefinitionTaskRole205EE0BA",
                "Arn"
              ]
            }
  }));

  expectCDK(stack).to(haveResource('AWS::ECS::Service', {
    "Cluster": {
      "Ref": "productionenvironmentclusterC6599D2D"
    },
    "DeploymentConfiguration": {
      "MaximumPercent": 200,
      "MinimumHealthyPercent": 100
    },
    "DesiredCount": 1,
    "EnableECSManagedTags": false,
    "LaunchType": "FARGATE",
    "NetworkConfiguration": {
      "AwsvpcConfiguration": {
        "AssignPublicIp": "DISABLED",
        "SecurityGroups": [
          {
            "Fn::GetAtt": [
              "webserviceSecurityGroup91ABCA28",
              "GroupId"
            ]
          }
        ],
        "Subnets": [
          {
            "Ref": "productionenvironmentvpcPrivateSubnet1Subnet53F632E6"
          },
          {
            "Ref": "productionenvironmentvpcPrivateSubnet2Subnet756FB93C"
          }
        ]
      }
    },
    "TaskDefinition": {
      "Ref": "webtaskdefinition514ECFF0"
    }

  }));
});
 */