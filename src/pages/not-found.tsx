import React from 'react';
import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <Result
      style={{ paddingTop: '8%' }}
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Link to="/">
          <Button size="large" type="primary">
            Back
          </Button>
        </Link>
      }
    />
  );
};
