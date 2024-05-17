import React from 'react';
import { Stack } from './stack.tsx';
import { Button, Typography } from 'antd';
import { LeftOutlined } from '@ant-design/icons';

export type PageHeaderProps = {
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  onBack?: () => void;
  extra?: React.ReactNode;
  fullPage?: boolean;
  ghost?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
};

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subTitle, extra, onBack, children, style }) => {
  return (
    <Stack style={style}>
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Stack horizontal gap={12} verticalAlign="center">
          {onBack && <Button type="text" icon={<LeftOutlined />} onClick={onBack} />}
          {title}
          {subTitle && (
            <Typography.Text type="secondary" style={{ margin: 0 }}>
              {subTitle}
            </Typography.Text>
          )}
        </Stack>
        {extra && (
          <Stack width="auto" horizontal gap={12}>
            {extra}
          </Stack>
        )}
      </Stack>
      {children}
    </Stack>
  );
};
