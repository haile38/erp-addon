import { useState, useRef } from "react";
import { getListMerchant } from "../../../api/task.api";

interface Merchant {
  id: string;
  businessName: string;
  customerCode: string;
}

export interface MerchantOption {
  label: string;
  value: string;
}

const DEFAULT_FILTER = {
  accountManager: null, from: null, isDemoAccount: null, license: null,
  page: 1, pageSize: 25, partnerCode: null, search: null,
  sortBy: "CreateAt", sortOrder: "desc", status: null, tabType: "All",
  to: null, workstationId: "1",
};

export const useMerchantSearch = () => {
  const [options, setOptions] = useState<MerchantOption[]>([]);
  const [loading, setLoading] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = (value: string) => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (!value.trim()) { setOptions([]); return; }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await getListMerchant({ ...DEFAULT_FILTER, search: value });
        const merchants: Merchant[] = response?.active?.data ?? [];
        setOptions(
          merchants.map((item) => ({
            label: `${item.businessName}${item.customerCode ? ` (${item.customerCode})` : ""}`,
            value: item.id,
          }))
        );
      } catch (err) {
        console.error("Cannot fetch merchant:", err);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const reset = () => setOptions([]);

  return { options, setOptions, loading, search, reset };
};
