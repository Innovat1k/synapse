import { LuTriangleAlert, LuTrash2 } from "react-icons/lu";
import { Modal } from "@shared/components/ui/Modal/Modal";
import ButtonSpinner from "@shared/components/ui/ButtonSpinner";

export const ConfirmDeleteTrack = ({
  isOpen,
  onClose,
  onConfirm,
  trackTitle = "this track",
  isLoading = false,
}) => {
  return (
    <Modal
      isOpened={isOpen}
      onClose={onClose}
      title="Delete Learning Track?"
      description="This action cannot be undone."
      icon={LuTriangleAlert}
      size="sm"
    >
      <div
        className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-4 mb-6"
        data-testid="action-description"
      >
        <p className="text-sm text-slate-400 leading-relaxed">
          Deleting{" "}
          <span className="text-rose-400 font-bold">"{trackTitle}"</span> will
          permanently disconnect all associated nodes. This action is
          <span className="text-rose-500 font-bold"> irreversible</span>.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-end items-center">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="w-full sm:w-auto order-2 sm:order-1 px-6 py-2.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-200 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          className="w-full sm:w-auto order-1 sm:order-2 min-w-40 flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg transition-all duration-200 shadow-lg shadow-rose-500/20 active:scale-95 cursor-pointer
    bg-rose-600 text-white hover:bg-rose-700
    disabled:bg-rose-600/50 disabled:text-white/70 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isLoading ? (
            <ButtonSpinner label="Deleting..." />
          ) : (
            <>
              <LuTrash2 size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">
                Permanently Delete
              </span>
            </>
          )}
        </button>
      </div>
    </Modal>
  );
};
