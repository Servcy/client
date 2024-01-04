// Types
import { Integration } from "@/types/integration";
// Components
import { Modal } from "antd";

export default function IntegrationConfigurationModal({
  selectedIntegration,
  onClose,
}: {
  selectedIntegration: Integration;
  onClose: () => void;
}) {
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
