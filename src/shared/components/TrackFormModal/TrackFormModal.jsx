import { useRef } from "react";
import { ResourceForm } from "@pages/Settings/components/ResourceForm/ResourceForm";
import { Modal } from "@/shared/components/Modal/Modal";
import { useResourceForm } from "@pages/Settings/components/ResourceForm/hooks/useResourceForm";

export const TrackFormModal = ({
  isOpened,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const { state, categories, methods } = useResourceForm({
    onSubmit: onSubmit,
  });

  const titleInputRef = useRef(null);
  const formRef = useRef(null);

  return (
    <Modal
      isOpened={isOpened}
      onClose={onClose}
      title="Configure New Track"
      size="md"
      initialFocusRef={titleInputRef}
      dataTestId="track-modal"
    >
      <div ref={formRef}>
        <ResourceForm
          ref={titleInputRef}
          title={state.title}
          category={state.category}
          categories={categories}
          generatedId={state.generatedId}
          onSubmit={methods.handleSubmit}
          isSubmitting={isLoading}
          onTitleChange={methods.setTitle}
          onCategoryChange={methods.setCategory}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-slate-500 
             bg-slate-800/40 hover:bg-slate-800 
             border border-slate-700/50 hover:border-slate-600
             rounded-lg transition-all duration-200
             disabled:opacity-30 disabled:cursor-not-allowed
             hover:text-slate-200 cursor-pointer"
          >
            Cancel
          </button>
        </ResourceForm>
      </div>
    </Modal>
  );
};
