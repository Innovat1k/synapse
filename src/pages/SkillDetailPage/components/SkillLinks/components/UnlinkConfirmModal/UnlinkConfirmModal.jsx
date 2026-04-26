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
      <div className="p-6">
        {/* Icon & Status Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-6">
          <div className="p-4 bg-rose-500/10 rounded-xl border border-rose-500/20 shadow-lg shadow-rose-500/10">
            <LuZapOff className="text-rose-400" size={28} />
          </div>
        </div>

        {/* Description Content */}
        <p
          className="text-slate-400 text-center text-sm mb-8 leading-relaxed px-2"
          data-testid="action-description"
        >
          Ready to remove the link between{" "}
          <span className="text-slate-50 font-semibold">{sourceName}</span> and{" "}
          <span className="text-slate-50 font-semibold">{targetName}</span>? No
          stress — you can always restore it later.
        </p>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <button
            ref={cancelButtonRef}
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-lg transition-all duration-200 text-xs font-bold uppercase tracking-widest hover:bg-slate-800 hover:text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95"
            type="button"
          >
            Keep Link
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading}
            aria-busy={isLoading}
            className={`flex-1 px-4 py-2.5 rounded-lg transition-all duration-200 font-bold text-sm shadow-lg
              ${
                !isLoading
                  ? "bg-rose-600 text-white hover:bg-rose-700 shadow-rose-500/20 cursor-pointer active:scale-95"
                  : "bg-slate-800/50 text-slate-500 border border-slate-700/50 cursor-not-allowed"
              }`}
          >
            {isLoading ? (
              <ButtonSpinner
                label="Severing..."
                labelColor="text-slate-500"
                color="text-rose-500"
              />
            ) : (
              "Sever Synapse"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
