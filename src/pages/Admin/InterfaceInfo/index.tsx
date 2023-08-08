import { addRule, removeRule, rule, updateRule } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, Input, message } from 'antd';
import React, { useRef, useState } from 'react';
import type { FormValueType } from './components/UpdateForm';
import {
  addinterfaceInfoUsingPOST,
  deleteinterfaceInfoUsingPOST,
  listMyinterfaceInfoByPageUsingPOST,
  offlineInterfaceInfoUsingPOST,
  onlineInterfaceInfoUsingPOST,
  updateinterfaceInfoUsingPOST
} from "@/services/api platform/interfaceInfoController";
import {SortOrder} from "antd/lib/table/interface";
import CreateModal from "@/pages/Admin/InterfaceInfo/components/CreateModal";
import UpdateModal from "@/pages/Admin/InterfaceInfo/components/UpdateModal";

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.InterfaceInfo) => {
  const hide = message.loading('正在添加');
  try {
    await addinterfaceInfoUsingPOST({ ...fields });
    hide();
    message.success('创建成功');
    return true;
  } catch (error) {
    hide();
    message.error('创建失败，请重试');
    return false;
  }
};

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('Configuring');
  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();

    message.success('Configuration is successful');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};


const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.InterfaceInfo>();
  const [selectedRowsState, setSelectedRows] = useState<API.InterfaceInfo[]>([]);

  const handleUpdate = async (fields: API.InterfaceInfo) => {
    if(!currentRow){
      return;
    }
    const hide = message.loading('修改中');
    try {
      await updateinterfaceInfoUsingPOST({
        id: currentRow.id,
        ...fields
      });
      hide();
      message.success('更新接口信息成功');
      return true;
    } catch (error: any) {
      hide();
      message.error('更新接口信息失败' + error.message);
      return false;
    }
  };

  /**
   *  Delete node
   * @zh-CN 删除节点
   *
   * @param selectedRows
   */
  const handleRemove = async (record: API.InterfaceInfo) => {
    const hide = message.loading('正在删除');
    if (!record) return true;
    try {
      await deleteinterfaceInfoUsingPOST({
        id: record.id
      });
      hide();
      message.success('删除成功');
      actionRef.current?.reload() // actionRef可以获取组件的控制权
      return true;
    } catch (error: any) {
      hide();
      message.error('D删除失败,' + error.message);
      return false;
    }
  };

  /**
   *  onLine Interface
   * @zh-CN 上线接口
   *
   * @param selectedRows
   */
  const onLineInterface = async (record: API.IdRequest) => {
    const hide = message.loading('正在上线');
    if (!record) return true;
    try {
      hide();
      await onlineInterfaceInfoUsingPOST({
        id: record.id
      });
      message.success('上线成功');
      actionRef.current?.reload() // actionRef可以获取组件的控制权
      return true;
    } catch (error: any) {
      hide();
      message.error('上线失败,' + error.message);
      return false;
    }
  };

  /**
   *  offLine Interface
   * @zh-CN 下线接口
   *
   * @param selectedRows
   */
  const offLineInterface = async (record: API.IdRequest) => {
    const hide = message.loading('正在下线');
    if (!record) return true;
    try {
      hide();
      await offlineInterfaceInfoUsingPOST({
        id: record.id
      });
      message.success('下线成功');
      actionRef.current?.reload() // actionRef可以获取组件的控制权
      return true;
    } catch (error: any) {
      hide();
      message.error('上线失败,' + error.message);
      return false;
    }
  };

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<API.InterfaceInfo>[] = [
    {
      title: "id",
      dataIndex: 'id',
      valueType: 'index',
    },
    {
      title: "接口名称",
      dataIndex: 'name',
      valueType: 'text',
      formItemProps:{
        rules:[{
          required: true,
          message: "写写吧球球了"
        }
        ]
      }
    },
    {
      title: "接口描述",
      dataIndex: 'description',
      valueType: 'textarea',
    },
    {
      title: "请求方法",
      dataIndex: 'method',
      valueType: 'text',
    },
    {
      title: "接口地址",
      dataIndex: 'url',
      valueType: 'text',
    },
    {
      title: "请求参数",
      dataIndex: 'requestParams',
      valueType: 'jsonCode',
    },
    {
      title: "请求头",
      dataIndex: 'requestHeader',
      valueType: 'jsonCode',
    },
    {
      title: "响应头",
      dataIndex: 'responseHeader',
      valueType: 'jsonCode',
    },
    {
      title: "状态",
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '关闭',
          status: 'Default',
        },
        1: {
          text: '开启',
          status: 'Processing',
        },
        2: {
          text: '异常',
          status: 'Error',
        },
      }
    },
    {
      title: "创建时间",
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInForm: true
    },
    {
      title: "更新时间",
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInForm: true
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        record.status === 1?<Button
          type="text"
          danger
          key="offline"
          onClick={() => {
            offLineInterface(record);
            console.log("下线：")
            console.log(record)
          }}
        >
          <FormattedMessage id="pages.searchTable.config" defaultMessage="下线" />
        </Button> : null,
        record.status === 0?<Button
          type="text"
          key="online"
          onClick={() => {
            onLineInterface(record);
            console.log("上线：")
            console.log(record)
          }}
        >
          <FormattedMessage id="pages.searchTable.config" defaultMessage="发布" />
        </Button>: null,
        <a
          key="update"
          onClick={() => {
            handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          <FormattedMessage id="pages.searchTable.config" defaultMessage="修改" />
        </a>,
        <a
          key="delete"
          onClick={() => {
            handleRemove(record);
          }}
        >
          <FormattedMessage id="pages.searchTable.config" defaultMessage="删除" />
        </a>,
        // <a key="subscribeAlert" href="https://procomponents.ant.design/">
        //   <FormattedMessage
        //     id="pages.searchTable.subscribeAlert"
        //     defaultMessage="订阅警报"
        //   />
        // </a>,
      ],
    },
  ];

  // @ts-ignore
  return (
    <PageContainer>
      <ProTable<API.RuleListItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request = {async (params:{
          pageSize?: number;
          current?: number;
          keyword?: string;
        }, sort: Record<string, SortOrder>, filter: Record<string, (string | number)[] | null>) => {
          const res = await listMyinterfaceInfoByPageUsingPOST({
            ...params
          })
          if(res.data){
            return{
              data: res.data.records || [],
              success: true,
              total: res.data.total
            }
          }else {
            return{
              data: [],
              success: false,
              total: 0
            }
          }
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
              &nbsp;&nbsp;
              <span>
                <FormattedMessage
                  id="pages.searchTable.totalServiceCalls"
                  defaultMessage="Total number of service calls"
                />{' '}
                {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)}{' '}
                <FormattedMessage id="pages.searchTable.tenThousand" defaultMessage="万" />
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage
              id="pages.searchTable.batchDeletion"
              defaultMessage="Batch deletion"
            />
          </Button>
          <Button type="primary">
            <FormattedMessage
              id="pages.searchTable.batchApproval"
              defaultMessage="Batch approval"
            />
          </Button>
        </FooterToolbar>
      )}
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.searchTable.createForm.newRule',
          defaultMessage: 'New rule',
        })}
        width="400px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.RuleListItem);
          if (success) {
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.searchTable.ruleName"
                  defaultMessage="Rule name is required"
                />
              ),
            },
          ]}
          width="md"
          name="name"
        />
        <ProFormTextArea width="md" name="desc" />
      </ModalForm>
      <UpdateModal
        columns={columns}
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() =>  {
          handleUpdateModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        visible = {updateModalOpen}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>
      <CreateModal columns={columns} onCancel={()=>{handleModalOpen(false)}} onSubmit={(values)=>{handleAdd(values)}} visible={createModalOpen}/>
    </PageContainer>
  );
};

export default TableList;
