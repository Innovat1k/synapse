import { Modal } from "@shared/components/ui/Modal/Modal";
import { LuBrainCircuit } from "react-icons/lu";

export const GraphModal = ({ isOpened, onClose, skillName, children }) => {
  return (
    <Modal
      isOpened={isOpened}
      onClose={onClose}
      title="Knowledge Graph"
      description={`Connections around ${skillName}`}
      icon={LuBrainCircuit}
      size="full"
      showDescriptionInFull
      dataTestId="graph-modal"
    >
      <div className="w-full h-full overflow-hidden">{children}</div>
    </Modal>
  );
};
