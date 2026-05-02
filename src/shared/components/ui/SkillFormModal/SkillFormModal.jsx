import { useSkillForm } from "./hooks/useSkillForm";
import { useTracks } from "@pages/Settings/app/tracks/hooks/useTracks";
import { Modal } from "../Modal/Modal";
import { TrackFormModal } from "../TrackFormModal";
import SkillFormContent from "./components/SkillFormContent";
import SkillDeleteContent from "./components/SkillDeleteContent";

const SkillFormModal = ({
  isOpened,
  initialData,
  isSubmitting,
  mode,
  onClose,
  onDelete,
  onSubmit,
}) => {
  const {
    skillFormData,
    newTag,
    tracks,
    initialTrackId,
    hasAssociatedData,
    isLoadingTracks,
    methods,
  } = useSkillForm({
    initialData,
    mode,
    onClose,
    onSubmit,
    isOpened,
  });

  const { status, createForm, actions } = useTracks();

  const modalTitle =
    mode === "create"
      ? "Add New Skill"
      : mode === "edit"
        ? "Edit Skill"
        : "Confirm Deletion";
  const modalSize = mode === "delete" ? "md" : "xl";

  return (
    <>
      {/* Generic Modal wrapper – handles overlay, focus trap, keyboard dismiss */}
      <Modal
        isOpened={isOpened}
        onClose={onClose}
        title={modalTitle}
        size={modalSize}
        initialFocusRef={methods.skillNameRef}
        dataTestId="skill-modal"
      >
        {/* Conditional content based on mode */}
        {mode === "delete" ? (
          <SkillDeleteContent
            initialData={initialData}
            isSubmitting={isSubmitting}
            onDelete={onDelete}
            onClose={onClose}
          />
        ) : (
          <SkillFormContent
            skillFormData={skillFormData}
            newTag={newTag}
            tracks={tracks}
            isLoadingTracks={isLoadingTracks}
            hasAssociatedData={hasAssociatedData}
            initialTrackId={initialTrackId}
            mode={mode}
            isSubmitting={isSubmitting}
            methods={methods}
            createForm={createForm}
            onClose={onClose}
          />
        )}
      </Modal>
 
      {/* Nested TrackFormModal – stays outside the generic Modal */}
      {createForm.isOpen && (
        <TrackFormModal
          isOpened={true}
          key="track"
          mode="create"
          onSubmit={actions.create}
          onClose={createForm.close}
          isLoading={status.isCreating}
        />
      )}
    </>
  );
};

export default SkillFormModal;
