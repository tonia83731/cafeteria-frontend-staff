import { useState } from "react";
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";
import { clientFetch, serverFetch } from "@/lib/fetch";
import DashboardLayout from "@/components/layout/DashboardLayout";
import OrderTable, { OrderTableType } from "@/components/order-page/OrderTable";
const DashboardOrdersPage = ({ orders }: any) => {
  const [orderDatas, setOrderDatas] = useState(orders);
  const token = getCookie("adminToken");

  const handleStatusUpdated = async (orderId: number, status: number) => {
    if (status === 3) {
      toast.error("訂單已完成，無法更新!");
      return;
    }
    if (status === 4) {
      toast.error("訂單已取消，無法更新!");
      return;
    }

    try {
      const response = await clientFetch(
        `/admin/orders/${orderId}/updated-status`,
        {
          method: "PATCH",
          token,
          body: {
            status: status + 1,
          },
        }
      );

      if (response?.success) {
        const updated_orders = orderDatas.map((order: OrderTableType) => {
          return order.id === orderId
            ? { ...order, status: status + 1 }
            : order;
        });
        setOrderDatas(updated_orders);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatusCanceled = async (orderId: number, status: number) => {
    if (status >= 1) {
      toast.error("訂單處理中，已無法取消!");
      return;
    }
    if (status === 3) {
      toast.error("訂單已完成，已無法取消!");
      return;
    }

    try {
      const response = await clientFetch(
        `/admin/orders/${orderId}/updated-status`,
        {
          method: "PATCH",
          token,
          body: {
            status: 4,
          },
        }
      );

      if (response?.success) {
        const updated_orders = orderDatas.map((order: OrderTableType) => {
          return order.id === orderId ? { ...order, status: 4 } : order;
        });
        setOrderDatas(updated_orders);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <DashboardLayout>
      <h1 className="text-2xl md:text-4xl font-bold mb-4">訂單列表</h1>
      <OrderTable
        tableData={orderDatas}
        onStatusUpdated={handleStatusUpdated}
        onStatusCanceled={handleStatusCanceled}
      />
    </DashboardLayout>
  );
};

export default DashboardOrdersPage;
export async function getServerSideProps(context: any) {
  const orders = await serverFetch(context, `/api/admin/orders`, "GET");

  return {
    props: {
      orders: orders.data,
    },
  };
}
