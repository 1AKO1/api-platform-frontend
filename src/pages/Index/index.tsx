import { PageContainer } from '@ant-design/pro-components';
import React, {useEffect, useState} from 'react';
import {List, message, Skeleton} from "antd";
import {listMyinterfaceInfoByPageUsingPOST} from "@/services/api platform/interfaceInfoController";

const Index: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<API.InterfaceInfo[]>([]);
  const [total, setTotal] = useState<number>(0);

  const loadData = async (current: number = 1, pageSize: number = 5) => {
    setLoading(true);
    try {
      const res = await listMyinterfaceInfoByPageUsingPOST({
        current: current,
        pageSize: pageSize
      })
      setList(res?.data?.records?? []);
      setTotal(res?.data?.total?? 0);
    }catch (error:any){
      message.error("请求失败:" + error.message);
    }finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <PageContainer title="在线接口开放平台">
      <List
        className="api-list"
        loading={loading}
        itemLayout="horizontal"
        dataSource={list}

        renderItem={(item) => {
          const apiLink = `/interface_info/${item.id}`;
          return (
            <List.Item
              actions={[<a key={item.id} href={apiLink}>查看详情</a>]}
            >
              <List.Item.Meta
                title={<a key={item.id} href={apiLink}>{item.name}</a>}
                description={item.description}
              />
            </List.Item>
          )
      }}
        pagination = {{
          showTotal(total){
            return "总数：" + total;
          },
          pageSize:5,
          total,
          onChange(page, pageSize){
            loadData(page, pageSize)
          }}
        }
      />
    </PageContainer>
  );
};

export default Index;
