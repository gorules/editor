import { Button, message, notification, Space, Switch, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import ReactAce from 'react-ace';
import { Stack } from './stack.tsx';
import { DecisionContent } from '../helpers/graph.ts';
import json5 from 'json5';
import { match, P } from 'ts-pattern';
import { errorMessage } from '../helpers/error-message.ts';

export type SimulatorProps = {
  simulate: SimulateCallback;
  simulateData: unknown;
  resetSimulateData: () => void;
  onDismiss?: () => void;
  loading?: boolean;
  graph: DecisionContent;
};

export type SimulateCallback = (data: { context: unknown; graph: DecisionContent }) => Promise<void>;

export const Simulator: React.FC<SimulatorProps> = ({ graph, simulate, resetSimulateData, simulateData, loading }) => {
  const outputNode = graph.nodes.find((node) => node.type === 'outputNode');

  const [viewTrace, setViewTrace] = useState(false);
  const [requestValue, setRequestValue] = useState('');
  const [responseValue, setResponseValue] = useState('');

  const runSimulation = async () => {
    try {
      const context = match(requestValue)
        .with(P.string, (requestData) => {
          if (requestData.trim() === '') {
            return {};
          }

          return json5.parse(requestData);
        })
        .otherwise(() => ({}));

      await simulate({ context, graph });
    } catch (e) {
      notification.error({
        message: 'Simulation failed',
        description: errorMessage(e),
        placement: 'top',
      });
    }
  };

  useEffect(() => {
    const response = match(simulateData)
      .with({ result: P.any, trace: P.any }, (data) => ({ ...data }))
      .otherwise(() => null);

    if (!response) return;

    if (!viewTrace) {
      delete response.trace;
    }

    setResponseValue(json5.stringify(response, null, 2));
  }, [simulateData, viewTrace]);

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
      }}
    >
      <Stack horizontal gap={8} horizontalAlign="end" style={{ padding: 8 }}>
        <Button type={'default'} disabled={!simulateData} onClick={() => resetSimulateData?.()}>
          Clear
        </Button>
        <Button type={'primary'} loading={loading} disabled={!outputNode} onClick={runSimulation}>
          Simulate
        </Button>
      </Stack>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: 8,
        }}
      >
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <Typography.Text style={{ marginBottom: 4 }}>Request (JSON5)</Typography.Text>{' '}
          <Button
            type={'link'}
            onClick={() => {
              if (requestValue.trim().length === 0) return;
              try {
                setRequestValue(json5.stringify(json5.parse(requestValue), null, 2));
              } catch (e) {
                message.error('Unable to format request, invalid JSON format');
              }
            }}
          >
            Format
          </Button>
        </div>
        <div style={{ flex: 1 }}>
          <ReactAce
            value={requestValue}
            onChange={(e) => setRequestValue(e)}
            mode="json5"
            theme="chrome"
            width="100%"
            height="100%"
            tabSize={2}
            setOptions={{ useWorker: false }}
          />
        </div>
      </div>
      <div
        style={{
          flex: 1.5,
          display: 'flex',
          flexDirection: 'column',
          padding: 8,
        }}
      >
        <Stack horizontal gap={8} verticalAlign="center" horizontalAlign="space-between" style={{ marginBottom: 4 }}>
          <Typography.Text>Response</Typography.Text>
          <Space style={{ cursor: 'pointer', width: 'unset !important' }} onClick={() => setViewTrace(!viewTrace)}>
            <Typography.Text>Trace</Typography.Text>
            <Switch size="small" checked={viewTrace} />
          </Space>
        </Stack>
        <div style={{ flex: 1 }}>
          <ReactAce
            value={responseValue}
            onChange={(e) => setResponseValue(e)}
            readOnly
            mode="json5"
            theme="chrome"
            width="100%"
            height="100%"
            tabSize={2}
            setOptions={{ useWorker: false }}
          />
        </div>
      </div>
    </div>
  );
};
