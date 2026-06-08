import { useEffect, useState } from "react";
import { Select, Spin } from "antd";

import { getListMerchant } from "../../api/task.api";

interface Merchant {
  id: string;
  businessName: string;
  customerCode: string;
}

interface MerchantFilter {
  accountManager: string | null;
  from: string | null;
  isDemoAccount: boolean | null;
  license: string | null;

  page: number;
  pageSize: number;

  partnerCode: string | null;
  search: string | null;

  sortBy: string;
  sortOrder: string;

  status: string | null;
  tabType: string;

  to: string | null;

  workstationId: string;
}

interface SelectOption {
  label: string;
  value: string;
}

const defaultFilter: MerchantFilter = {
  accountManager: null,
  from: null,
  isDemoAccount: null,
  license: null,

  page: 1,
  pageSize: 25,

  partnerCode: null,
  search: null,

  sortBy: "CreateAt",
  sortOrder: "desc",

  status: null,
  tabType: "All",

  to: null,

  workstationId: "1",
};

const Tasks = () => {
  const [filter] = useState<MerchantFilter>(defaultFilter);

  const [loading, setLoading] = useState(false);

  const [options, setOptions] = useState<SelectOption[]>([]);

  const [selectedMerchant, setSelectedMerchant] = useState<string>();

  useEffect(() => {
    let cancelled = false;

    const fetchMerchants = async () => {
      try {
        setLoading(true);

        const response = await getListMerchant(filter);

        const merchants = response?.data ?? [];

        if (!cancelled) {
          setOptions(
            merchants.map((item: Merchant) => ({
              label: item.businessName,
              value: item.id,
            }))
          );
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchMerchants();

    return () => {
      cancelled = true;
    };
  }, [filter]);

  const handleMerchantChange = (value: string) => {
    setSelectedMerchant(value);

    console.log("Merchant ID:", value);
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Merchant</h2>

      <Spin spinning={loading}>
        <Select
          style={{ width: 600 }}
          placeholder="Select Merchant"
          options={options}
          value={selectedMerchant}
          onChange={handleMerchantChange}
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? "")
              .toString()
              .toLowerCase()
              .includes(input.toLowerCase())
          }
        />
      </Spin>
    </div>
  );
};

export default Tasks;