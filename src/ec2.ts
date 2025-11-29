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
  try {
    await client.send(
      new StartInstancesCommand({
        InstanceIds: [INSTANCE_ID],
      })
    );
  } catch (error) {
    console.error("Error starting server:", error);
    throw error;
  }
}

export async function stopServer() {
  try {
    await client.send(
      new StopInstancesCommand({
        InstanceIds: [INSTANCE_ID],
      })
    );
  } catch (error) {
    console.error("Error stopping server:", error);
    throw error;
  }
}

export async function getStatus() {
  try {
    const res = await client.send(
      new DescribeInstancesCommand({ InstanceIds: [INSTANCE_ID] })
    );
    return res.Reservations?.[0]?.Instances?.[0]?.State?.Name;
  } catch (error) {
    console.error("Error getting status:", error);
    throw error;
  }
}
