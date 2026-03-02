import { LuTriangleAlert, LuTrash2 } from "react-icons/lu";
import { Modal } from "@shared/components/Modal/Modal";
import ButtonSpinner from "@shared/components/ButtonSpinner";

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
      <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4 mb-6">
        <p
          className="text-sm text-slate-400 leading-relaxed"
          data-testid="action-description"
        >
          Deleting{" "}
          <span className="text-red-400 font-bold">"{trackTitle}"</span> will
          permanently disconnect all associated nodes. This action is
          <span className="text-red-500 font-bold"> irreversible</span>.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-end items-center">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="w-full sm:w-auto order-2 sm:order-1 px-5 py-2.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200 rounded-lg transition-all disabled:opacity-30 cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          className="w-full sm:w-auto order-1 sm:order-2 min-w-40 flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg transition-all shadow-lg active:scale-95 cursor-pointer
    bg-red-500 text-slate-950 shadow-red-500/20 hover:bg-red-400
    disabled:bg-red-500/50 disabled:text-slate-950/70 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isLoading ? (
            <ButtonSpinner
              label="Deleting..."
              labelColor="text-slate-950"
              color="border-slate-950"
            />
          ) : (
            <>
              <LuTrash2 size={16} />
              <span className="text-xs font-black uppercase tracking-wider">
                Permanently Delete
              </span>
            </>
          )}
        </button>
      </div>
    </Modal>
  );
};
