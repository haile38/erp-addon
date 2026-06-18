import { Select, Spin } from "antd";
import { ShopOutlined } from "@ant-design/icons";
import type { MerchantOption } from "../hooks/useMerchantSearch";

interface MerchantSelectProps {
  value: string | undefined;
  options: MerchantOption[];
  loading: boolean;
  onChange: (val: string) => void;
  onSearch: (val: string) => void;
}

const MerchantSelect: React.FC<MerchantSelectProps> = ({ value, options, loading, onChange, onSearch }) => (
  <div style={{ marginBottom: 20 }}>
    <div className="section-title">
      <ShopOutlined style={{ color: "#6366f1" }} /> Select Merchant
    </div>
    <Spin spinning={loading}>
      <Select
        style={{ width: "100%" }}
        placeholder="Enter Name or Phone Number of salon"
        showSearch allowClear
        value={value}
        options={options}
        onChange={onChange}
        onSearch={onSearch}
        filterOption={false}
        showArrow={false}
        notFoundContent={loading ? <Spin size="small" /> : "Can not find merchant"}
      />
    </Spin>
  </div>
);

export default MerchantSelect;