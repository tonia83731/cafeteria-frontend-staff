import { useState } from "react";
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";
import { clientFetch, serverFetch } from "@/lib/fetch";
import DashboardLayout from "@/components/layout/DashboardLayout";
import OrderTable from "@/components/order-page/OrderTable";
const DashboardOrdersPage = ({ orders }: any) => {
  console.log(orders);
  const [orderTable, setOrderTable] = useState(orders);
  const token = getCookie("adminToken");
  const status_data = [
    "pending",
    "preparing",
    "delivering",
    "picking up",
    "completed",
  ];

  const handleStatusUpdated = async (
    orderId: number,
    shippingId: number,
    status: string
  ) => {
    // console.log(orderId, shippingId, status);
    if (status === "completed") {
      toast.warning("訂單已完成，無法更新狀態");
      return;
    }
    if (status === "canceled") {
      toast.warning("訂單已取消，無法更新狀態");
      return;
    }

    const currIndex = status_data.indexOf(status);

    if (currIndex === -1) {
      toast.error("訂單無效，無法更新狀態");
      return;
    }

    let nextStatus: string;

    if (status === "preparing") {
      if (shippingId === 1) {
        nextStatus = "picking up";
      } else {
        nextStatus = "delivering";
      }
    } else if (status === "delivering") {
      nextStatus = status_data[currIndex + 2];
    } else {
      nextStatus = status_data[currIndex + 1];
    }

    try {
      const response = await clientFetch(`/admin/orders/${orderId}`, {
        method: "PUT",
        body: {
          status: nextStatus,
        },
        token,
      });

      if (response.success) {
        setOrderTable((prevOrders: any[]) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: nextStatus } : order
          )
        );
        toast.success("訂單已更新");
      } else {
        toast.error("訂單更新失敗，請在試一次!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatusCanceled = async (orderId: number, status: string) => {
    if (status !== "pending") {
      toast.warning("訂單已開始製作無法取消!");
      return;
    }

    try {
      const response = await clientFetch(`/admin/orders/${orderId}`, {
        method: "PUT",
        body: {
          status: "canceled",
        },
        token,
      });

      if (response.success) {
        setOrderTable((prevOrders: any[]) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: "canceled" } : order
          )
        );
        toast.success("訂單已取消");
      } else {
        toast.error("訂單取消失敗，請在試一次!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <DashboardLayout>
      <h1 className="text-2xl md:text-4xl font-bold mb-4">訂單列表</h1>
      <OrderTable
        tableData={orderTable}
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
