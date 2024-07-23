import React, { useEffect, useRef, useState } from 'react';
import { Button, Divider, Dropdown, Input, message, Modal, theme, Typography } from 'antd';
import { BulbOutlined, CheckOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { displayError } from '../helpers/error-message.ts';
import { DecisionContent, DecisionEdge, DecisionNode } from '../helpers/graph.ts';
import { useSearchParams } from 'react-router-dom';
import { DecisionGraph, DecisionGraphRef, GraphSimulator, Simulation } from '@gorules/jdm-editor';
import { PageHeader } from '../components/page-header.tsx';
import { DirectedGraph } from 'graphology';
import { hasCycle } from 'graphology-dag';
import { Stack } from '../components/stack.tsx';
import { match, P } from 'ts-pattern';
import { Form, FormProps, Col, Row } from "antd";

import classes from './decision-simple.module.css';
import axios from 'axios';
import { ThemePreference, useTheme } from '../context/theme.provider.tsx';

enum DocumentFileTypes {
  Decision = 'application/vnd.gorules.decision',
}

type FieldType = {
  filename: string;
}

export const DecisionSimplePage: React.FC = () => {
  const { token } = theme.useToken();
  const fileInput = useRef<HTMLInputElement>(null);
  const graphRef = React.useRef<DecisionGraphRef>(null);
  const { themePreference, setThemePreference } = useTheme();
  const [decisionTemplates, setDecisionTemplates] = useState<Record<string, DecisionContent>>({});

  const [searchParams] = useSearchParams();
  const [graph, setGraph] = useState<DecisionContent>({ nodes: [], edges: [] });
  const [fileName, setFileName] = useState('Untitled Decision');
  const [graphTrace, setGraphTrace] = useState<Simulation>();
  const [unsaved, setUnsaved] = useState<boolean>(false);
  const [first, setFirst] = useState<boolean>(true);

  const updateGraph = async (con: DecisionContent) => {
    if (!first) {
      setUnsaved(true);
    }

    setFirst(false);
    setGraph(con);
  };

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/list'); 
        const data = await response.json();

        if (!response.ok) {
          message.error(`Cannot load rules: ${response.statusText}`);
          return;
        }
        setDecisionTemplates(data);
      } catch (err) {
        displayError(err)
      }
    };

    fetchTemplates();
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
      setFirst(true);
      setGraph(templateGraph);
      setFileName(template);
      setUnsaved(false);
    }
  };

  const openFile = async () => {
    try {
      const [handle] = await window.showOpenFilePicker({
        types: [{ accept: { 'application/json': ['.json'] } }],
      });

      const file = await handle.getFile();
      const content = await file.text();
      setFileName(file?.name.replace(/\.[^/.]+$/, ""));
      const parsed = JSON.parse(content);
      setGraph({
        nodes: parsed?.nodes || [],
        edges: parsed?.edges || [],
      });
    } catch (err) {
      displayError(err);
    }
  };

  const deleteFile = async () => {
    if (fileName) {
      const ok = async () => {
        try {
          const response = await fetch(`/api/delete/${fileName}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });
        
          if (!response.ok) {
            message.error(`Cannot delete file ${fileName}: ${response.statusText}`);
            return
          }
  
          message.success(`File deleted: ${fileName}`);
          setFileName('Untitled Decision');
          setFirst(true);
          delete decisionTemplates[fileName];
          setDecisionTemplates(decisionTemplates);
          setGraph({
            nodes: [],
            edges: [],
          });
        } catch (err) {
          displayError(err);
        }
      };
  
      Modal.confirm({
        title: 'Delete file',
        icon: false,
        content: <div>Are you sure you want to delete <b>{fileName}</b>, this operation cannot be reversed.</div>,
        onOk: ok,
      });
    }
  };

  const saveFileAs = async () => {
    let modal: any;
    const onFinish: FormProps<FieldType>['onFinish'] = (values: FieldType) => {
      setFileName(values.filename);
      saveFile(undefined, values.filename);
      modal.destroy();
      return true;
    };
    const onClick: FormProps<FieldType>['onClick'] = () => {
      modal.destroy();
      return true;
    };

    modal = Modal.info({
      title: 'Save file as...',
      icon: false,
      footer: [],
      content: (
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off">
          <Form.Item
            name="filename"
            label="File name"
            initialValue={fileName}
            rules={[
              {
                required: true,
                message: 'Please input the file name!',
              },
            ]}>
            <Input />
          </Form.Item>
          <Row gutter={8} justify="end">
            <Col>
              <Button onClick={onClick} type="default" htmlType="button">
                Cancel
              </Button>
            </Col>
            <Col>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Col>
          </Row>
        </Form>),
    });
  };

  const saveFile = async (_: any, fname?: string) => {
    if (fname) {
      setFileName(fname);
    } else {
      fname = fileName;
    }

    if (fname) {
      const saveTemplate = async () => {
        const url = `/api/save/${fname}`; // Adjust the API endpoint if necessary
      
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(graph),
          });
        
          if (!response.ok) {
            message.error(`Cannot save file ${fname}: ${response.statusText}`);
            return
          }

          message.success(`File saved: ${fname}`);
          decisionTemplates[fname] = graph;
          setDecisionTemplates(decisionTemplates);
          setUnsaved(false);
        } catch (err) {
          displayError(err);
        }
      };
  
      await saveTemplate();
    } else {
      saveFileAs()
    }
  };

  const handleNew = async () => {
    const ok = async () => {
      setFileName('Untitled Decision');
      setFirst(true);
      setGraph({
        nodes: [],
        edges: [],
      });
    };

    if (unsaved) {
      Modal.confirm({
        title: 'New decision',
        icon: false,
        content: <div>Are you sure you want to create new blank decision, your current work might be lost?</div>,
        onOk: ok,
      });
    } else {
      await ok();
    }
  };

  const handleOpenMenu = async (e: { key: string }) => {
    switch (e.key) {
      case 'file-system':
        openFile();
        break;
      default: {
        if (Object.hasOwn(decisionTemplates, e.key)) {
          const ok = async () => loadTemplateGraph(e.key);

          if (unsaved) {
            Modal.confirm({
              title: 'Opening: ' + e.key,
              icon: false,
              content: <div>Are you sure you want to open <b>{e.key}</b>, your current work might be lost?</div>,
              onOk: ok,
            });
          } else {
            await ok();
          }
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
        setFirst(true);
        setUnsaved(false);
        setGraph({ edges, nodes });
        setFileName(fileList?.[0]?.name.replace(/\.[^/.]+$/, ""));
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
                        ...Object.keys(decisionTemplates).sort((a: string, b: string): number => {
                          return a.toLocaleLowerCase() > b.toLocaleLowerCase() ? 1 : -1;
                        }).map(d => {
                          return {
                            label: d,
                            key: d,
                          };
                        })
                      ],
                    }}
                  >
                    <Button type={'text'} size={'small'}>
                      Open
                    </Button>
                  </Dropdown>
                  <Button onClick={saveFile} type={'text'} size={'small'}>
                    Save
                  </Button>
                  <Button onClick={saveFileAs} type={'text'} size={'small'}>
                    Save as
                  </Button>
                  <Button onClick={deleteFile} type={'text'} size={'small'}>
                    Delete
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
              onChange={(value) => updateGraph(value)}
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

                          setGraphTrace({ result: data });
                        } catch (e) {
                          if (axios.isAxiosError(e)) {
                            setGraphTrace({
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
