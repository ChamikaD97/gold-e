import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  InputNumber,
  Steps,
  Button,
  Result
} from "antd";

const { Step } = Steps;
const { Option } = Select;

const EmployeeStepperModal = ({ open, onCancel, onSubmit, form }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const next = () => {
    form.validateFields().then(() => setCurrentStep((prev) => prev + 1));
  };

  const prev = () => setCurrentStep((prev) => prev - 1);

  const steps = [
    {
      title: "Basic Info",
      content: (
        <>
          <Form.Item name="name" label="Full Name" rules={[{ required: true }]}> <Input /> </Form.Item>
          <Form.Item name="nic" label="NIC" rules={[{ required: true }]}> <Input /> </Form.Item>
          <Form.Item name="contact" label="Contact"> <Input /> </Form.Item>
          <Form.Item name="emergency_contact" label="Emergency Contact"> <Input /> </Form.Item>
          <Form.Item name="dob" label="Date of Birth"> <DatePicker style={{ width: "100%" }} /> </Form.Item>
          <Form.Item name="address" label="Address"> <Input.TextArea rows={2} /> </Form.Item>
        </>
      )
    },
    {
      title: "Work Info",
      content: (
        <>
          <Form.Item name="joined_date" label="Joined Date"> <DatePicker style={{ width: "100%" }} /> </Form.Item>
          <Form.Item name="staff" label="Staff Type" rules={[{ required: true }]}> <Select placeholder="Select"> <Option value="Office Staff">Office Staff</Option> <Option value="Factory Staff">Factory Staff</Option> </Select> </Form.Item>
          <Form.Item name="section" label="Section"> <Input /> </Form.Item>
          <Form.Item name="job_title" label="Job Title"> <Input /> </Form.Item>
          <Form.Item name="shift" label="Shift"> <Input /> </Form.Item>
          <Form.Item name="leaves" label="Leaves"> <InputNumber style={{ width: "100%" }} min={0} /> </Form.Item>
        </>
      )
    },
    {
      title: "Salary Info",
      content: (
        <>
          <Form.Item name="salary" label="Salary"> <InputNumber style={{ width: "100%" }} /> </Form.Item>
          <Form.Item name="salary_method" label="Salary Method" rules={[{ required: true }]}> <Select placeholder="Select"> <Option value="Cash">Cash</Option> <Option value="Bank">Bank</Option> </Select> </Form.Item>
        </>
      )
    },
    {
      title: "Other Info",
      content: (
        <>
          <Form.Item name="image" label="Image URL"> <Input /> </Form.Item>
          <Form.Item name="location" label="Location"> <Input /> </Form.Item>
          <Form.Item name="description" label="Description"> <Input.TextArea rows={3} /> </Form.Item>
          <Form.Item name="jb" label="JB"> <Input /> </Form.Item>
        </>
      )
    }
  ];

  return (
    <Modal
      title="Add New Employee"
      open={open}
      footer={null}
      onCancel={() => {
        setCurrentStep(0);
        setSubmitted(false);
        form.resetFields();
        onCancel();
      }}
      destroyOnClose
    >
      <Steps current={currentStep} size="small" style={{ marginBottom: 24 }}>
        {steps.map((step) => (
          <Step key={step.title} title={step.title} />
        ))}
      </Steps>

      {submitted ? (
        <Result
          status="success"
          title="Employee Added Successfully!"
          subTitle="You can now close the modal or add another employee."
          extra={[
            <Button type="primary" key="addNew" onClick={() => { setSubmitted(false); form.resetFields(); setCurrentStep(0); }}>Add Another</Button>,
            <Button key="close" onClick={onCancel}>Close</Button>
          ]}
        />
      ) : (
        <Form layout="vertical" form={form}>
          {steps[currentStep].content}

          <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between" }}>
            {currentStep > 0 && (
              <Button onClick={prev}>Previous</Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button type="primary" onClick={next}>Next</Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button
                type="primary"
                loading={submitting}
                onClick={() => {
                  form.validateFields().then((values) => {
                    setSubmitting(true);
                    setTimeout(() => {
                      setSubmitting(false);
                      setSubmitted(true);
                      onSubmit(values);
                    }, 1500);
                  });
                }}
              >
                Submit
              </Button>
            )}
          </div>
        </Form>
      )}
    </Modal>
  );
};

export default EmployeeStepperModal;
