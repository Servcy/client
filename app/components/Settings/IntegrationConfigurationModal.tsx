import { useEffect } from "react";
// Types
import { Integration } from "@/types/integration";
// Components
import { Modal } from "antd";
// Apis
import { fetchIntegrationEvents } from "@/apis/integration";

export default function IntegrationConfigurationModal({
  selectedIntegration,
  onClose,
}: {
  selectedIntegration: Integration;
  onClose: () => void;
}) {
  useEffect(() => {
    fetchIntegrationEvents(String(selectedIntegration.id)).then((res) => {
      console.log(res);
    });
  }, [selectedIntegration.id]);

  return (
    <Modal
      open={true}
      title={`${selectedIntegration.name} Configuration`}
      onCancel={onClose}
      footer={false}
      width="60vw"
      bodyStyle={{
        overflowY: "scroll",
        overflowX: "hidden",
      }}
    ></Modal>
  );
}
