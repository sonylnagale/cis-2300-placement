import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as path from 'path';

export interface InfraStackProps extends cdk.StackProps {
  /** Subdomain to serve the site on, e.g. "2300.cis9655.com" */
  domainName?: string;
  /** Apex zone to look up in Route 53, e.g. "cis9655.com" */
  zoneName?: string;
}

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: InfraStackProps) {
    super(scope, id, props);

    const { domainName, zoneName } = props ?? {};
    const useCustomDomain = !!(domainName && zoneName);

    // ── Route 53 + ACM (only when a domain is configured) ───────────────────
    let zone: route53.IHostedZone | undefined;
    let certificate: acm.ICertificate | undefined;

    if (useCustomDomain) {
      zone = route53.HostedZone.fromLookup(this, 'Zone', { domainName: zoneName! });
      certificate = new acm.Certificate(this, 'SiteCert', {
        domainName: domainName!,
        validation: acm.CertificateValidation.fromDns(zone),
      });
    }

    const siteBucket = new s3.Bucket(this, 'SiteBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      versioned: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const distribution = new cloudfront.Distribution(this, 'SiteDistribution', {
      defaultRootObject: 'index.html',
      ...(useCustomDomain && {
        domainNames: [domainName!],
        certificate,
      }),
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(siteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        compress: true,
      },
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(5),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(5),
        },
      ],
    });

    const table = new dynamodb.Table(this, 'CIS2300Table', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const apiFn = new nodejs.NodejsFunction(this, 'CollectHandler', {
      runtime: lambda.Runtime.NODEJS_22_X,
      entry: path.join(__dirname, '..', 'lambda', 'collect.ts'),
      handler: 'handler',
      environment: {
        TABLE_NAME: table.tableName,
      },
      bundling: {
        target: 'node22',
      },
    });

    table.grantReadWriteData(apiFn);

    const corsOrigins = [
      `https://${distribution.distributionDomainName}`,
      'http://localhost:3000',
      ...(useCustomDomain ? [`https://${domainName}`] : []),
    ];

    const api = new apigwv2.HttpApi(this, 'HttpApi', {
      createDefaultStage: false,
      corsPreflight: {
        allowHeaders: ['content-type'],
        allowMethods: [
          apigwv2.CorsHttpMethod.POST,
          apigwv2.CorsHttpMethod.PATCH,
          apigwv2.CorsHttpMethod.OPTIONS,
        ],
        allowOrigins: corsOrigins,
      },
    });

    const lambdaIntegration = new integrations.HttpLambdaIntegration(
      'CollectIntegration',
      apiFn
    );

    api.addRoutes({
      path: '/collect',
      methods: [apigwv2.HttpMethod.POST],
      integration: lambdaIntegration,
    });

    api.addRoutes({
      path: '/collect/{id}',
      methods: [apigwv2.HttpMethod.PATCH],
      integration: lambdaIntegration,
    });

    const stage = new apigwv2.HttpStage(this, 'DefaultStage', {
      httpApi: api,
      autoDeploy: true,
      stageName: '$default',
      throttle: {
        // 25 steady-state requests/sec; bursts up to 75
        rateLimit: 25,
        burstLimit: 75,
      },
    });

    new s3deploy.BucketDeployment(this, 'DeployStaticSite', {
      sources: [s3deploy.Source.asset(path.join(__dirname, '..', '..', 'app', 'out'))],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ['/*'],
    });

    // ── Route 53 alias record ────────────────────────────────────────────────
    if (useCustomDomain && zone) {
      new route53.ARecord(this, 'SiteAliasRecord', {
        zone,
        recordName: domainName,
        target: route53.RecordTarget.fromAlias(
          new targets.CloudFrontTarget(distribution)
        ),
      });
    }

    new cdk.CfnOutput(this, 'SiteUrl', {
      value: useCustomDomain ? `https://${domainName}` : `https://${distribution.distributionDomainName}`,
    });

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: stage.url,
    });

    new cdk.CfnOutput(this, 'TableName', {
      value: table.tableName,
    });
  }
}