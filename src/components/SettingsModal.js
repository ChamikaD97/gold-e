import React from "react";
import { Modal, Form, Input, Switch, Button } from "antd";

/**
 * SettingsModal
 * @param {boolean} open - Whether the modal is visible
 * @param {Function} onClose - Function to close the modal
 */
const SettingsModal = ({ open, onClose }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    console.log("✅ Settings Saved:", values);
    // TODO: Save settings to backend or localStorage if needed
    onClose();
  };

  return (
    <Modal
      title="Settings"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          username: "linuka",
          email: "linuka@greenhouse.lk",
          notifications: true,
        }}
      >
        <Form.Item label="Username" name="username">
          <Input placeholder="Enter your username" />
        </Form.Item>

        <Form.Item label="Email" name="email">
          <Input type="email" placeholder="Enter your email" />
        </Form.Item>

        <Form.Item label="Enable Notifications" name="notifications" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Save Settings
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SettingsModal;
