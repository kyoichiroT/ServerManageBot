import {
  EC2Client,
  StartInstancesCommand,
  StopInstancesCommand,
  DescribeInstancesCommand,
} from "@aws-sdk/client-ec2";

const client = new EC2Client({
  region: "ap-northeast-1",
});

const INSTANCE_ID = process.env.INSTANCE_ID!;

export async function startServer() {
  await client.send(
    new StartInstancesCommand({
      InstanceIds: [INSTANCE_ID],
    })
  );
}

export async function stopServer() {
  await client.send(
    new StopInstancesCommand({
      InstanceIds: [INSTANCE_ID],
    })
  );
}

export async function getStatus() {
  const res = await client.send(
    new DescribeInstancesCommand({ InstanceIds: [INSTANCE_ID] })
  );
  return res.Reservations?.[0]?.Instances?.[0]?.State?.Name;
}
