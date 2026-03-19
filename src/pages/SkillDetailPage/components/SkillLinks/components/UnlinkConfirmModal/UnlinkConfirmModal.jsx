import { useRef } from "react";
import { LuZapOff } from "react-icons/lu";
import { Modal } from "@shared/components/Modal/Modal";
import ButtonSpinner from "@shared/components/ButtonSpinner";

export const UnlinkConfirmModal = ({
  isOpened,
  isLoading,
  onClose,
  onConfirm,
  link,
  skill,
}) => {
  const cancelButtonRef = useRef(null);

  const sourceName =
    link.source_skill_id === skill.skill_id ? skill.name : link.skill_name;

  const targetName =
    link.source_skill_id === skill.skill_id ? link.skill_name : skill.name;

  return (
    <Modal
      isOpened={isOpened}
      onClose={onClose}
      title="Sever Synapse?"
      size="sm"
      initialFocusRef={cancelButtonRef}
      dataTestId="unlink-modal"
    >
      <div className="flex flex-col items-center text-center gap-4 mb-6">
        <div className="p-3 bg-red-500/10 rounded-2xl ring-1 ring-red-500/20">
          <LuZapOff className="text-red-400" size={28} />
        </div>
        {/* <h3
          id="unlink-modal-title"
          className="text-slate-100 font-bold text-xl tracking-tight"
        >
          Sever Synapse?
        </h3> */}
      </div>

      <p
        className="text-slate-400 text-center text-sm mb-8 leading-relaxed"
        data-testid="action-description"
      >
        Ready to remove the link between{" "}
        <span className="text-slate-100 font-semibold">{sourceName}</span> and{" "}
        <span className="text-slate-100 font-semibold">{targetName}</span>? No
        stress — you can always restore it later.
      </p>

      <div className="flex gap-3 mt-2">
        <button
          ref={cancelButtonRef}
          onClick={onClose}
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700/50 text-slate-300 rounded-xl transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          type="button"
        >
          Keep Link
        </button>

        <button
          onClick={onConfirm}
          disabled={isLoading}
          aria-busy={isLoading}
          className={`flex-1 px-4 py-2.5 rounded-xl transition-all font-bold text-sm uppercase tracking-wider
            border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]
            ${
              !isLoading
                ? "bg-red-500/10 text-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:border-red-400 hover:text-white cursor-pointer active:scale-95"
                : ""
            }
            ${
              isLoading ? "bg-red-500/5 text-red-400/50 cursor-not-allowed" : ""
            }`}
        >
          <span className={isLoading ? "sr-only" : ""}>Sever!</span>

          {isLoading && (
            <ButtonSpinner
              label="Severing..."
              labelColor="text-red-400/80"
              color="text-red-400"
            />
          )}
        </button>
      </div>
    </Modal>
  );
};