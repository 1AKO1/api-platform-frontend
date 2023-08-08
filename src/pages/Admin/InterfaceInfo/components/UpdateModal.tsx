import {
  ProColumns, ProFormInstance,
  ProTable
} from '@ant-design/pro-components';

import React, {useEffect, useRef} from 'react';
import {Modal} from "antd";

export type Props = {
  values: API.InterfaceInfo;
  columns: ProColumns<API.InterfaceInfo>[];
  onCancel: () => void;
  onSubmit: (value: API.InterfaceInfo) => Promise<void>;
  visible: boolean;
};

const UpdateModal: React.FC<Props> = (props) => {
  const { values, visible, columns, onCancel, onSubmit } = props;

  const formRef = useRef<ProFormInstance>();

  // 监听变量
  useEffect(() => {
    if(formRef){
      formRef.current?.setFieldsValue(values)
    }
    console.log(values)
  }, [values])

  return (
    <Modal visible={visible} footer={null} onCancel={() => onCancel?.()}>
      <ProTable
        type="form"
        columns={columns}
        formRef={formRef}
        onSubmit={async (value) => {
          console.log(formRef.current?.getFieldsValue())
          console.log(value)
          onSubmit?.(value)
        }
      }/>
    </Modal>

  );
};

export default UpdateModal;
