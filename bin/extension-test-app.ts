#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ExtensionTestAppStack } from '../lib/extension-test-app-stack';

const app = new cdk.App();
new ExtensionTestAppStack(app, 'ExtensionTestAppStack', {
  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
  // env: { account: '910995322324', region: 'us-west-2' },
  env: { account: '727656907259', region: 'us-east-2' },
  
});
