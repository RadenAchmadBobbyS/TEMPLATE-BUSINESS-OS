import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Button,
} from '@react-email/components';
import * as React from 'react';

interface WorkspaceInvitationEmailProps {
  workspaceName: string;
  role: string;
  inviteUrl: string;
}

export const WorkspaceInvitationEmail = ({
  workspaceName = 'Workspace',
  role = 'MEMBER',
  inviteUrl = 'https://businessos.example.com/dashboard/invitations',
}: WorkspaceInvitationEmailProps) => {
  const previewText = `You have been invited to join ${workspaceName}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Join {workspaceName}</Heading>
          <Text style={text}>
            You have been invited to join the <strong>{workspaceName}</strong> workspace as a <strong>{role}</strong>.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={inviteUrl}>
              Review Invitation
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            If you were not expecting this invitation, you can ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default WorkspaceInvitationEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  borderRadius: '5px',
  boxShadow: '0 5px 10px rgba(20,50,70,.2)',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '40px',
  margin: '0 0 20px',
  textAlign: 'center' as const,
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 24px',
  padding: '0 24px',
};

const buttonContainer = {
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#000000',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 20px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  padding: '0 24px',
};
