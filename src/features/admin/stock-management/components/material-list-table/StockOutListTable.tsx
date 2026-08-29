/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { DeleteModal, Table } from "@/components";
import { stockOutColumns } from "@/constants/tables/inventory-management-list";
import { IMaterialManagementProps } from "@/constants/tables/material-management-list";
import { MaterialHistoryTab } from "@/features/admin/inventory-management/inventory-management";
import { useDeleteInventoryMutation } from "@/services/apis/clients/community-client/query-hooks/useDeleteInventoryMutation";
import { useState } from "react";
import toast from "react-hot-toast";

export function StockOutListTable({
  data,
  onRefetch,
  paginationData,
  onPageChange,
}: {
  data: IMaterialManagementProps[];
  onRefetch: () => void;
  paginationData?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
}) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [materialToDelete, setMaterialToDelete] =
    useState<IMaterialManagementProps | null>(null);
  const [openTab, setOpenTab] = useState(false);
  const [id] = useState("");
  const { onDeleteMaterial, isPending } = useDeleteInventoryMutation({
    onSuccessCallback: (res) => {
      toast.success(res?.message || "Inventory  deleted successfully");
      onRefetch();
      setShowDeleteConfirmation(false);
      setMaterialToDelete(null);
    },
    onErrorCallback: (err) => {
      toast.error(err?.message || "Error deleting material");
      setShowDeleteConfirmation(false);
      setMaterialToDelete(null);
    },
  });

  const closeTab = () => setOpenTab(false);

  // Use the data passed as props
  const normalizedData = (data || [])
    .filter((item: any) => item.deleted !== true)
    .map((item: any) => ({
      ...item,
      name: item.inventory?.name ?? "N/A",
      purchasePrice: item.inventory?.purchase_price ?? "N/A",
      salesPrice: item.inventory?.sales_price ?? "N/A",
      totalQuantity: item.inventory?.quantity ?? "N/A",
      availableQuantity: (item.inventory?.quantity ?? 0) - (item.used ?? 0),
      stockLocation: item.inventory?.stockLocation ?? "N/A",
      vendorName: item.inventory?.vendorName ?? "N/A",
    }));
  // Create columns with interactive checkbox for 'active'

  if (normalizedData.length === 0)
    return <div className="text-center py-10  ">No inventory found.</div>;
  console.log("normalizedData", normalizedData);

  const datahistory = normalizedData.find((data) => data.id === id);
  return (
    <>
      <Table
        data={normalizedData}
        columns={stockOutColumns}
        paginationData={paginationData}
        onPageChange={onPageChange}
      />
      <DeleteModal
        isOpen={showDeleteConfirmation}
        onClose={() => {
          setShowDeleteConfirmation(false);
          setMaterialToDelete(null);
        }}
        onConfirm={() => {
          if (materialToDelete?.id) {
            onDeleteMaterial(materialToDelete.id);
          }
        }}
        title="Delete Inventory "
        message="Are you sure you want to delete this material"
        itemName={materialToDelete?.name || ""}
        isLoading={isPending}
      />
      {openTab && <MaterialHistoryTab data={datahistory} onClose={closeTab} />}
    </>
  );
}
