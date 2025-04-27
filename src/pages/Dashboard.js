import { Card, Row, Col, Progress, Button, Modal } from "antd";
import { useState } from "react";

const Dashboard = () => {
  const [isRankingModalOpen, setRankingModalOpen] = useState(false);
  const data = {
    yearly_target: 4200000,
    achieved_so_far: 674100,
    super_leaf_target: 20000,
    super_leaf_achieved: 15678,
  };
  
  return (
    <>
      <Row gutter={[16, 16]}>
        {/* Section 1: Yearly Target Summary */}
        <Col xs={24} md={8}>
          <Card title="Yearly Progress" bordered>
            <p><strong>Target of the Year:</strong> {data.yearly_target}</p>
            <p><strong>Achievement Until Now:</strong> {data.achieved_so_far}</p>
            <p><strong>Percentage:</strong></p>
            <Progress 
              percent={Math.round((data.achieved_so_far / data.yearly_target) * 100)} 
              strokeColor="#1890ff" 
            />
          </Card>
        </Col>

        {/* Section 2: Super Leaf Summary */}
        <Col xs={24} md={8}>
          <Card title="Super Leaf Summary" bordered>
            <p><strong>Super Leaf Target:</strong> {data.super_leaf_target}</p>
            <p><strong>Super Leaf Achieved:</strong> {data.super_leaf_achieved}</p>
            <p><strong>Super %:</strong></p>
            <Progress 
              percent={Math.round((data.super_leaf_achieved / data.super_leaf_target) * 100)} 
              strokeColor="gold" 
            />
          </Card>
        </Col>

        {/* Section 3: Rankings */}
        <Col xs={24} md={8}>
          <Card
            title="Rankings"
            bordered
            actions={[
              <Button type="primary" onClick={() => setRankingModalOpen(true)}>
                View Rankings
              </Button>,
            ]}
          >
            <p>Click the button below to view detailed rankings.</p>
          </Card>
        </Col>
      </Row>

      {/* Rankings Modal */}
      <Modal
        title="Officer Rankings"
        visible={isRankingModalOpen}
        onCancel={() => setRankingModalOpen(false)}
        footer={null}
        centered
        width="50%"
      >
        {/* Add your ranking component or table here */}
        <p>Ranking details will go here...</p>
      </Modal>
    </>
  );
};

export default Dashboard