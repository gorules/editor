import React, { useEffect, useRef, useState } from 'react';
import { Button, Divider, Dropdown, message, Modal, theme, Typography } from 'antd';
import { BulbOutlined, CheckOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { decisionTemplates } from '../assets/decision-templates';
import { displayError } from '../helpers/error-message.ts';
import { DecisionContent, DecisionEdge, DecisionNode } from '../helpers/graph.ts';
import { useSearchParams } from 'react-router-dom';
import { DecisionGraph, DecisionGraphRef, DecisionGraphType, GraphSimulator, Simulation } from '@gorules/jdm-editor';
import { PageHeader } from '../components/page-header.tsx';
import { DirectedGraph } from 'graphology';
import { hasCycle } from 'graphology-dag';
import { Stack } from '../components/stack.tsx';
import { match, P } from 'ts-pattern';

import classes from './decision-simple.module.css';
import axios from 'axios';
import { ThemePreference, useTheme } from '../context/theme.provider.tsx';

enum DocumentFileTypes {
  Decision = 'application/vnd.gorules.decision',
}

const supportFSApi = Object.hasOwn(window, 'showSaveFilePicker');

export const DecisionSimplePage: React.FC = () => {
  const { token } = theme.useToken();
  const fileInput = useRef<HTMLInputElement>(null);
  const graphRef = React.useRef<DecisionGraphRef>(null);
  const { themePreference, setThemePreference } = useTheme();

  const [searchParams] = useSearchParams();
  const [fileHandle, setFileHandle] = useState<FileSystemFileHandle>();
  const [graph, setGraph] = useState<DecisionGraphType>({ nodes: [], edges: [] });
  const [fileName, setFileName] = useState('Untitled Decision');
  const [graphTrace, setGraphTrace] = useState<Simulation>();

  useEffect(() => {
    const templateParam = searchParams.get('template');
    if (templateParam) {
      loadTemplateGraph(templateParam);
    }
  }, []);

  const loadTemplateGraph = (template: string) => {
    const templateGraph = match(template)
      .with(P.string, (template) => decisionTemplates?.[template])
      .otherwise(() => undefined);

    if (templateGraph) {
      setGraph(templateGraph);
    }
  };

  const openFile = async () => {
    if (!supportFSApi) {
      fileInput.current?.click?.();
      return;
    }

    try {
      const [handle] = await window.showOpenFilePicker({
        types: [{ accept: { 'application/json': ['.json'] } }],
      });

      setFileHandle(handle);

      const file = await handle.getFile();
      const content = await file.text();
      setFileName(file?.name);
      const parsed = JSON.parse(content);
      setGraph({
        nodes: parsed?.nodes || [],
        edges: parsed?.edges || [],
      });
    } catch (err) {
      displayError(err);
    }
  };

  const saveFileAs = async () => {
    if (!supportFSApi) {
      return await handleDownload();
    }

    let writable: FileSystemWritableFileStream | undefined = undefined;
    try {
      checkCyclic();
      const json = JSON.stringify({ contentType: DocumentFileTypes.Decision, ...graph }, null, 2);
      const newFileName = `${fileName.replaceAll('.json', '')}.json`;
      const handle = await window.showSaveFilePicker({
        types: [{ description: newFileName, accept: { 'application/json': ['.json'] } }],
      });

      writable = await handle.createWritable();
      await writable.write(json);
      setFileHandle(handle);
      const file = await handle.getFile();
      setFileName(file.name);
      message.success('File saved');
    } catch (e) {
      displayError(e);
    } finally {
      writable?.close?.();
    }
  };

  const saveFile = async () => {
    if (!supportFSApi) {
      message.error('Unsupported file system API');
      return;
    }

    if (fileHandle) {
      let writable: FileSystemWritableFileStream | undefined = undefined;
      try {
        writable = await fileHandle.createWritable();
        checkCyclic();

        const json = JSON.stringify({ contentType: DocumentFileTypes.Decision, ...graph }, null, 2);
        await writable.write(json);
        message.success('File saved');
      } catch (e) {
        displayError(e);
      } finally {
        writable?.close?.();
      }
    }
  };

  const handleNew = async () => {
    Modal.confirm({
      title: 'New decision',
      icon: false,
      content: <div>Are you sure you want to create new blank decision, your current work might be lost?</div>,
      onOk: async () => {
        setGraph({
          nodes: [],
          edges: [],
        });
      },
    });
  };

  const handleOpenMenu = async (e: { key: string }) => {
    switch (e.key) {
      case 'file-system':
        openFile();
        break;
      default: {
        if (Object.hasOwn(decisionTemplates, e.key)) {
          Modal.confirm({
            title: 'Open example',
            icon: false,
            content: <div>Are you sure you want to open example decision, your current work might be lost?</div>,
            onOk: async () => loadTemplateGraph(e.key),
          });
        }
        break;
      }
    }
  };

  const checkCyclic = (dc: DecisionContent | undefined = undefined) => {
    const decisionContent = match(dc)
      .with(P.nullish, () => graph)
      .otherwise((data) => data);

    const diGraph = new DirectedGraph();
    (decisionContent?.edges || []).forEach((edge) => {
      diGraph.mergeEdge(edge.sourceId, edge.targetId);
    });

    if (hasCycle(diGraph)) {
      throw new Error('Circular dependencies detected');
    }
  };

  const handleDownload = async () => {
    try {
      checkCyclic();
      // create file in browser
      const newFileName = `${fileName.replaceAll('.json', '')}.json`;
      const json = JSON.stringify({ contentType: DocumentFileTypes.Decision, ...graph }, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const href = URL.createObjectURL(blob);

      // create "a" HTLM element with href to file
      const link = window.document.createElement('a');
      link.href = href;
      link.download = newFileName;
      window.document.body.appendChild(link);
      link.click();

      // clean up "a" element & remove ObjectURL
      window.document.body.removeChild(link);
      URL.revokeObjectURL(href);
    } catch (e) {
      displayError(e);
    }
  };

  const handleUploadInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event?.target?.files as FileList;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e?.target?.result as string);
        if (parsed?.contentType !== DocumentFileTypes.Decision) {
          throw new Error('Invalid content type');
        }

        const nodes: DecisionNode[] = parsed.nodes || [];
        const nodeIds = nodes.map((node) => node.id);
        const edges: DecisionEdge[] = ((parsed.edges || []) as DecisionEdge[]).filter(
          (edge) => nodeIds.includes(edge?.targetId) && nodeIds.includes(edge?.sourceId),
        );

        checkCyclic({ edges, nodes });
        setGraph({ edges, nodes });
        setFileName(fileList?.[0]?.name);
      } catch (e) {
        displayError(e);
      }
    };

    reader.readAsText(Array.from(fileList)?.[0], 'UTF-8');
  };

  return (
    <>
      <input
        hidden
        accept="application/json"
        type="file"
        ref={fileInput}
        onChange={handleUploadInput}
        onClick={(event) => {
          if ('value' in event.target) {
            event.target.value = null;
          }
        }}
      />
      <div className={classes.page}>
        <PageHeader
          style={{
            padding: '8px',
            background: token.colorBgLayout,
            boxSizing: 'border-box',
            borderBottom: `1px solid ${token.colorBorder}`,
          }}
          title={
            <div className={classes.heading}>
              <Button
                type="text"
                target="_blank"
                href="https://gorules.io"
                icon={<img height={24} width={24} src={'/favicon.svg'} />}
              />
              <Divider type="vertical" style={{ margin: 0 }} />
              <div className={classes.headingContent}>
                <Typography.Title
                  level={4}
                  style={{ margin: 0, fontWeight: 400 }}
                  className={classes.headingTitle}
                  editable={{
                    text: fileName,
                    maxLength: 24,
                    autoSize: { maxRows: 1 },
                    onChange: (value) => setFileName(value.trim()),
                    triggerType: ['text'],
                  }}
                >
                  {fileName}
                </Typography.Title>
                <Stack horizontal verticalAlign="center" gap={8}>
                  <Button onClick={handleNew} type={'text'} size={'small'}>
                    New
                  </Button>
                  <Dropdown
                    menu={{
                      onClick: handleOpenMenu,
                      items: [
                        {
                          label: 'File system',
                          key: 'file-system',
                        },
                        {
                          type: 'divider',
                        },
                        {
                          label: 'Fintech: Company analysis',
                          key: 'company-analysis',
                        },
                        {
                          label: 'Fintech: AML',
                          key: 'aml',
                        },
                        {
                          label: 'Retail: Shipping fees',
                          key: 'shipping-fees',
                        },
                      ],
                    }}
                  >
                    <Button type={'text'} size={'small'}>
                      Open
                    </Button>
                  </Dropdown>
                  {supportFSApi && (
                    <Button onClick={saveFile} type={'text'} size={'small'}>
                      Save
                    </Button>
                  )}
                  <Button onClick={saveFileAs} type={'text'} size={'small'}>
                    Save as
                  </Button>
                </Stack>
              </div>
            </div>
          }
          ghost={false}
          extra={[
            <Dropdown
              overlayStyle={{ minWidth: 150 }}
              menu={{
                onClick: ({ key }) => setThemePreference(key as ThemePreference),
                items: [
                  {
                    label: 'Automatic',
                    key: ThemePreference.Automatic,
                    icon: (
                      <CheckOutlined
                        style={{ visibility: themePreference === ThemePreference.Automatic ? 'visible' : 'hidden' }}
                      />
                    ),
                  },
                  {
                    label: 'Dark',
                    key: ThemePreference.Dark,
                    icon: (
                      <CheckOutlined
                        style={{ visibility: themePreference === ThemePreference.Dark ? 'visible' : 'hidden' }}
                      />
                    ),
                  },
                  {
                    label: 'Light',
                    key: ThemePreference.Light,
                    icon: (
                      <CheckOutlined
                        style={{ visibility: themePreference === ThemePreference.Light ? 'visible' : 'hidden' }}
                      />
                    ),
                  },
                ],
              }}
            >
              <Button type="text" icon={<BulbOutlined />} />
            </Dropdown>,
          ]}
        />
        <div className={classes.contentWrapper}>
          <div className={classes.content}>
            <DecisionGraph
              ref={graphRef}
              value={graph}
              onChange={(value) => setGraph(value)}
              reactFlowProOptions={{ hideAttribution: true }}
              simulate={graphTrace}
              panels={[
                {
                  id: 'simulator',
                  title: 'Simulator',
                  icon: <PlayCircleOutlined />,
                  renderPanel: () => (
                    <GraphSimulator
                      onClear={() => setGraphTrace(undefined)}
                      onRun={async ({ graph, context }) => {
                        try {
                          const { data } = await axios.post('/api/simulate', {
                            context,
                            content: graph,
                          });

                          setGraphTrace({ result: { ...data, snapshot: graph } });
                        } catch (e) {
                          const errorMessage = match(e)
                            .with(
                              {
                                response: {
                                  data: {
                                    type: P.string,
                                    source: P.string,
                                  },
                                },
                              },
                              ({ response: { data: d } }) => `${d.type}: ${d.source}`,
                            )
                            .with({ response: { data: { source: P.string } } }, (d) => d.response.data.source)
                            .with({ response: { data: { message: P.string } } }, (d) => d.response.data.message)
                            .with({ message: P.string }, (d) => d.message)
                            .otherwise(() => 'Unknown error occurred');

                          message.error(errorMessage);
                          if (axios.isAxiosError(e)) {
                            console.log(e);
                            setGraphTrace({
                              result: {
                                result: null,
                                trace: e.response?.data?.trace,
                                snapshot: graph,
                                performance: '',
                              },
                              error: {
                                message: e.response?.data?.source,
                                data: e.response?.data,
                              },
                            });
                          }
                        }
                      }}
                    />
                  ),
                },
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
};
