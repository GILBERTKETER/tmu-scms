import { Card } from "@arco-design/web-react";
import { IconCheckCircle, IconClockCircle } from "@arco-design/web-react/icon";
import { Grid } from "@arco-design/web-react";
const AttendanceCards: React.FC = () => {
  const Row = Grid.Row;
  const Col = Grid.Col;
  return (
    <Row gutter={24} style={{boxSizing:"border-box", overflow:"auto"}}>
      <Col xs={24} sm={24} md={24} lg={12} className="mb-10">
        <Card className="w-full p-4 shadow-md ">
          <IconCheckCircle className="mb-4 text-4xl text-green-500" />
          <h3 className="text-primary text-xl font-semibold">Total Attendance</h3>
          <p className="text-secondary text-3xl font-bold">85%</p>
        </Card>
      </Col>
      <Col xs={24} sm={24} md={24} lg={12}>
        <Card className="p-4 shadow-md">
          <IconClockCircle className="mb-4 text-4xl text-red-500" />
          <h3 className="text-primary text-xl font-semibold">Missed Classes</h3>
          <p className="text-secondary text-3xl font-bold">10</p>
        </Card>
      </Col>
    </Row>
  );
};

export default AttendanceCards;
