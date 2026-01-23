import * as scaleway from "@pulumiverse/scaleway";
import * as pulumi from "@pulumi/pulumi";
import * as random from "@pulumi/random";
import * as fs from "fs";
import * as path from "path";
import * as mime from "mime-types";

const config = new pulumi.Config();
const appName = config.require("name");
const fqdns = config.requireObject<string[]>("fqdns");

// Create a unique bucket name
const bucketSuffix = new random.RandomString("bucket-suffix", {
    length: 8,
    special: false,
    upper: false,
});

const bucketName = pulumi.interpolate`${appName}-site-${bucketSuffix.result}`;

// Create a Scaleway Object Storage bucket
const bucket = new scaleway.object.Bucket("site-bucket", {
    name: bucketName,
    forceDestroy: true,
});

// Set the bucket ACL
const bucketAcl = new scaleway.object.BucketAcl("site-bucket-acl", {
    bucket: bucket.name,
    acl: "public-read",
}, { dependsOn: [bucket] });

// Configure the bucket as a website
const bucketWebsite = new scaleway.object.BucketWebsiteConfiguration("site-website", {
    bucket: bucket.name,
    indexDocument: {
        suffix: "index.html",
    },
    errorDocument: {
        key: "404.html",
    },
}, { dependsOn: [bucketAcl] });

// Upload the files from the 'out' directory
const siteDir = path.join(__dirname, "..", "out");

const date = new Date().toISOString().replace(/[T:.Z]/g, '');

const addFolderContents = (siteDir: string, prefix?: string) => {
    if (!fs.existsSync(siteDir)) {
        return;
    }

    for (const item of fs.readdirSync(siteDir)) {
        const filePath = path.join(siteDir, item);
        const isDir = fs.lstatSync(filePath).isDirectory();

        if (isDir) {
            const newPrefix = prefix ? path.join(prefix, item) : item;
            addFolderContents(filePath, newPrefix);
            continue;
        }

        let itemPath = prefix ? path.join(prefix, item) : item;
        itemPath = itemPath.replace(/\\/g, "/"); // convert Windows paths to something S3 will recognize

        new scaleway.object.Item(itemPath, {
            bucket: bucket.id,
            key: itemPath,
            file: filePath,
            hash: pulumi.interpolate`${date}-${filePath}`,
            contentType: mime.lookup(filePath) || undefined,
            visibility: "public-read",
        }, { dependsOn: [bucket] });
    }
};

addFolderContents(siteDir);


// 4. Configure a custom subdomain with automatic Let's Encrypt certificate
const plan = new scaleway.EdgeServicesPlan("plan", {name: "starter"})

const pipeline = new scaleway.EdgeServicesPipeline("main", {
    name: "pipeline",
    description: "pipeline description",
}, { dependsOn: [plan] });

const backend = new scaleway.EdgeServicesBackendStage("backend", {
    pipelineId: pipeline.id,
    s3BackendConfig: {
        bucketName: bucket.name,
        bucketRegion: "fr-par",
        isWebsite: true,
    },

}, { dependsOn: [pipeline, bucket] });

const tls = new scaleway.EdgeServicesTlsStage("tls", {
    pipelineId: pipeline.id,
    managedCertificate: true,
    backendStageId: backend.id,
}, { dependsOn: [backend] });

const dns = new scaleway.EdgeServicesDnsStage("dns", {
    pipelineId: pipeline.id,
    tlsStageId: tls.id,
    fqdns,
}, { dependsOn: [tls, pipeline] });

const head = new scaleway.EdgeServicesHeadStage("head", {
    pipelineId: pipeline.id,
    headStageId: dns.id,
}, { dependsOn: [dns, pipeline] });


// Export the custom domain URL
export const websiteUrl = pulumi.interpolate`https://${dns.fqdns[0]}`;
