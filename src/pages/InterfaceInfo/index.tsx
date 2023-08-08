import {
  getinterfaceInfoByIdUsingGET, invokeInterfaceInfoUsingPOST
} from "@/services/api platform/interfaceInfoController";
import { PageContainer } from '@ant-design/pro-components';
import {Button, Descriptions, Divider, Form, message, Spin} from "antd";
import Card from 'antd/es/card/Card';
import React,{ useEffect,useState } from 'react';
import { useParams } from "react-router";
import TextArea from "antd/es/input/TextArea";

const Index: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [invokeLoading, setInvokeLoading] = useState(true);
  const [data, setData] = useState<API.InterfaceInfo>();
  const [invokeRes, setInvokeRes] = useState<any>();
  const params = useParams();

  const loadData = async () => {
    setLoading(true);
    if (!params.id) {
      message.error('接口数据不存在');
    }
    try {
      const res = await getinterfaceInfoByIdUsingGET({
        id: Number(params.id),
      });
      setData(res.data);
    } catch (error: any) {
      message.error('请求失败:' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    if(!params.id){
      message.error("接口不存在");
      return;
    }
    console.log('Success:', values);

    try {
      setInvokeLoading(true);
      const res = await invokeInterfaceInfoUsingPOST({
        id: Number(params.id),
        ...values
      })
      setInvokeRes(res.data);
      message.success('请求成功');
    } catch (error: any) {
      message.error('请求失败:' + error.message);
    } finally {
      setInvokeLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <PageContainer title="查看接口文档">
      <Card>
        {data ? <Descriptions title={data.name} column={1} extra={<Button>调用</Button>}>
          <Descriptions.Item label="接口状态">{data.status == 0 ? "未上线" : data.status == 1 ? "已上线" : "状态异常"}</Descriptions.Item>
          <Descriptions.Item label="接口描述">{data.description}</Descriptions.Item>
          <Descriptions.Item label="请求地址">{data.url}</Descriptions.Item>
          <Descriptions.Item label="请求方法">{data.method}</Descriptions.Item>
          <Descriptions.Item label="请求参数">{data.requestParams}</Descriptions.Item>
          <Descriptions.Item label="请求头">{data.requestHeader}</Descriptions.Item>
          <Descriptions.Item label="响应头">{data.responseHeader}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{data.createTime}</Descriptions.Item>
          <Descriptions.Item label="更新时间">{data.updateTime}</Descriptions.Item>
        </Descriptions>: <>接口不存在</>}
      </Card>
      <Divider/>
      <Card>
        <Form
          name="invok"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item label="请求参数:" name="userRequestParams">
            <TextArea />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              调用
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Divider/>
      <Card title="返回结果" loading={invokeLoading}>
        {invokeRes}
      </Card>
    </PageContainer>
  );
};

export default Index;
