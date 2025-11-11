import { Card, Row, Col, Typography, Tag, Button } from "antd";
import styles from "../AccountSettings.module.scss";

const { Title, Text } = Typography;

const CouponsTab = ({ coupons, onCopyCode }) => {
  const activeCoupons = coupons.filter((c) => c.status === "active").length;

  return (
    <Card className={styles.mainCard} title="My Coupons">
      <div style={{ marginBottom: 16 }}>
        <Text type="secondary">
          You have {activeCoupons} active coupons
        </Text>
      </div>

      <Row gutter={[16, 16]}>
        {coupons.map((coupon) => (
          <Col xs={24} key={coupon.id}>
            <Card
              className={`${styles.couponCard} ${
                coupon.status === "expired" ? styles.expiredCoupon : ""
              }`}
              styles={{
                body: { padding: 20 },
              }}
            >
              <Row align="middle" gutter={16}>
                <Col xs={24} sm={6}>
                  <div className={styles.couponDiscount}>
                    <div className={styles.discountAmount}>
                      {coupon.discount}
                    </div>
                    <div className={styles.discountLabel}>OFF</div>
                  </div>
                </Col>

                <Col xs={24} sm={12}>
                  <div className={styles.couponInfo}>
                    <Title level={5} style={{ margin: 0, marginBottom: 4 }}>
                      {coupon.title}
                    </Title>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Min order: {coupon.minOrder}
                    </Text>
                    <div style={{ marginTop: 8 }}>
                      <Tag
                        color={coupon.status === "active" ? "green" : "red"}
                      >
                        {coupon.status === "active" ? "Active" : "Expired"}
                      </Tag>
                      <Tag
                        color={
                          coupon.type === "shipping"
                            ? "blue"
                            : coupon.type === "percentage"
                            ? "orange"
                            : "purple"
                        }
                      >
                        {coupon.type === "shipping"
                          ? "Free Ship"
                          : coupon.type === "percentage"
                          ? "Percentage"
                          : "Fixed Amount"}
                      </Tag>
                    </div>
                  </div>
                </Col>

                <Col xs={24} sm={6} style={{ textAlign: "right" }}>
                  <div className={styles.couponCode}>
                    <Text strong style={{ fontSize: 14 }}>
                      {coupon.code}
                    </Text>
                  </div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Expires: {coupon.expiry}
                  </Text>
                  {coupon.status === "active" && (
                    <Button
                      type="primary"
                      size="small"
                      style={{ marginTop: 8, width: "100%" }}
                      onClick={() => onCopyCode(coupon.code)}
                    >
                      Copy Code
                    </Button>
                  )}
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default CouponsTab;